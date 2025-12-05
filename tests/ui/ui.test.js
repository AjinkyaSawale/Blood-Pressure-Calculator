// tests/ui/ui.test.js
import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { initUI } from "../../ui.js";

// Helper to build a DOM that matches index.html and wire UI behaviour
function setupDomAndUI() {
  const html = `
    <!doctype html>
    <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>Blood Pressure Category Calculator</title>
    </head>
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

  const dom = new JSDOM(html, { url: "http://localhost/" });
  const { document } = dom.window;

  // Initialise your real UI wiring on this fake DOM
  initUI(document);

  return { dom, document };
}

describe("UI DOM behaviour", () => {
  it("shows error for invalid systolic input and keeps button disabled", () => {
    const { dom, document } = setupDomAndUI();

    const sys = document.getElementById("sys");
    const sysError = document.getElementById("sys-error");
    const button = document.querySelector("button[type=submit]");

    // Invalid systolic (too low)
    sys.value = "60";
    sys.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    expect(sysError.textContent).toContain("Systolic");
    expect(button.disabled).toBe(true);
  });

  it("shows error for invalid diastolic input and keeps button disabled", () => {
    const { dom, document } = setupDomAndUI();

    const dia = document.getElementById("dia");
    const diaError = document.getElementById("dia-error");
    const button = document.querySelector("button[type=submit]");

    // Invalid diastolic (too low)
    dia.value = "30";
    dia.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    // Match the real UI message from ui.js
    expect(diaError.textContent).toContain(
      "Diastolic must be between 40 and 100."
    );
    expect(button.disabled).toBe(true);
  });

  it("enables button when both inputs are valid and clears errors", () => {
    const { dom, document } = setupDomAndUI();

    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const sysError = document.getElementById("sys-error");
    const diaError = document.getElementById("dia-error");
    const button = document.querySelector("button[type=submit]");

    // First make them invalid so errors appear
    sys.value = "60";
    dia.value = "30";
    sys.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    dia.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    // Now fix to valid values
    sys.value = "120";
    dia.value = "80";
    sys.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    dia.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    expect(sysError.textContent).toBe("");
    expect(diaError.textContent).toBe("");
    expect(button.disabled).toBe(false);
  });

  it("submits form with valid inputs and shows category + MAP", () => {
    const { dom, document } = setupDomAndUI();

    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const button = document.querySelector("button[type=submit]");
    const result = document.getElementById("result");
    const form = document.getElementById("bp-form");

    // Valid elevated BP (120/80)
    sys.value = "120";
    dia.value = "80";
    sys.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    dia.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    expect(button.disabled).toBe(false);

    // Submit the form
    form.dispatchEvent(new dom.window.Event("submit", { bubbles: true }));

    expect(result.textContent).toContain("Category: Elevated");
    expect(result.textContent).toContain("MAP:");
  });

  it("does NOT disable the button when both inputs are valid (no false-positive disable)", () => {
    const { dom, document } = setupDomAndUI();

    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const button = document.querySelector("button[type=submit]");

    // Directly set valid values
    sys.value = "115";
    dia.value = "75";

    sys.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    dia.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    // Button should remain enabled when both numbers are valid
    expect(button.disabled).toBe(false);
  });
});
