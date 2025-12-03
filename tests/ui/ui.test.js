// tests/ui/ui.test.js
import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { initUI } from "../../ui.js";

// Helper: create a fresh DOM + wire UI for each test
function setupDomAndUI() {
  const html = `
    <!doctype html>
    <html lang="en">
    <head><title>BP Calculator Test</title></head>
    <body>
      <main class="card">
        <h1>Blood Pressure Category Calculator</h1>

        <form id="bp-form">
          <div class="field">
            <label for="sys">Systolic (70–190 mmHg)</label>
            <input
              id="sys"
              name="sys"
              type="number"
              min="70"
              max="190"
              required
            />
            <small
              id="sys-error"
              class="error"
              aria-live="polite"
            ></small>
          </div>

          <div class="field">
            <label for="dia">Diastolic (40–100 mmHg)</label>
            <input
              id="dia"
              name="dia"
              type="number"
              min="40"
              max="100"
              required
            />
            <small
              id="dia-error"
              class="error"
              aria-live="polite"
            ></small>
          </div>

          <button type="submit" disabled>Calculate</button>
        </form>

        <section id="result" aria-live="polite"></section>
      </main>
    </body>
    </html>
  `;

  const dom = new JSDOM(html, { url: "http://localhost" });
  const document = dom.window.document;

  // Wire up UI against this DOM
  initUI(document);

  const form = document.getElementById("bp-form");
  const sys = document.getElementById("sys");
  const dia = document.getElementById("dia");
  const sysError = document.getElementById("sys-error");
  const diaError = document.getElementById("dia-error");
  const button = form.querySelector("button[type=submit]");
  const result = document.getElementById("result");

  return { dom, document, form, sys, dia, sysError, diaError, button, result };
}

describe("UI DOM behaviour", () => {
  it("shows error for invalid systolic input and keeps button disabled", () => {
    const { dom, sys, sysError, button } = setupDomAndUI();

    sys.value = "250"; // too high
    sys.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    expect(sysError.textContent).toContain(
      "Systolic must be between 70 and 190."
    );
    expect(button.disabled).toBe(true);
  });

  it("shows error for invalid diastolic input and keeps button disabled", () => {
    const { dom, dia, diaError, button } = setupDomAndUI();

    dia.value = "30"; // too low
    dia.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    expect(diaError.textContent).toContain(
      "Diastolic must be between 40 and 100."
    );
    expect(button.disabled).toBe(true);
  });

  it("enables button when both inputs are valid and clears errors", () => {
    const { dom, sys, dia, sysError, diaError, button } = setupDomAndUI();

    sys.value = "120";
    dia.value = "80";

    sys.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    dia.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    expect(sysError.textContent).toBe("");
    expect(diaError.textContent).toBe("");
    expect(button.disabled).toBe(false);
  });

  it("submits form with valid inputs and shows category + MAP", () => {
    const { dom, form, sys, dia, result } = setupDomAndUI();

    sys.value = "120";
    dia.value = "80";

    sys.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    dia.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    form.dispatchEvent(
      new dom.window.Event("submit", { bubbles: true, cancelable: true })
    );

    const text = result.textContent;

    expect(text).toContain("Category: Elevated");
    expect(text).toContain("MAP:");
  });
});
