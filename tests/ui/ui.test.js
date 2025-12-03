// tests/ui/ui.test.js
import { describe, it, expect } from "vitest";
import { JSDOM } from "jsdom";
import { initUI } from "../../ui.js";

// Minimal copy of your current index.html structure (without script tags)
const INDEX_HTML = `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>Blood Pressure Category Calculator</title>
  <link rel="stylesheet" href="styles.css" />
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

    <p class="hint">
      * Lower limits are inclusive. For example, systolic ≥ 140 or diastolic ≥ 90
      means <strong>High blood pressure</strong>.
    </p>
  </main>
</body>
</html>
`;

// Helper to spin up DOM + wire UI for each test
function setupDomAndUI() {
  const dom = new JSDOM(INDEX_HTML, { url: "http://localhost" });
  const { document, Event } = dom.window;

  // Expose to ui.js if it ever touches global document/window
  global.document = document;
  global.window = dom.window;

  // Initialise your real UI wiring
  initUI(document);

  const form = document.getElementById("bp-form");
  const sys = document.getElementById("sys");
  const dia = document.getElementById("dia");
  const sysError = document.getElementById("sys-error");
  const diaError = document.getElementById("dia-error");
  const button = form.querySelector("button[type=submit]");
  const result = document.getElementById("result");

  return {
    dom,
    document,
    Event,
    form,
    sys,
    dia,
    sysError,
    diaError,
    button,
    result,
  };
}

describe("UI DOM behaviour", () => {
  it("shows error for invalid systolic input and keeps button disabled", () => {
    const { dom, sys, sysError, button } = setupDomAndUI();

    // Make systolic invalid (too low)
    sys.value = "60";
    sys.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    expect(sysError.textContent).toContain("Systolic");
    expect(button.disabled).toBe(true);
  });

  it("shows error for invalid diastolic input and keeps button disabled", () => {
    const { dom, dia, diaError, button } = setupDomAndUI();

    // Make diastolic invalid (too low)
    dia.value = "30";
    dia.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    // Match your UI message pattern (we know it says this from earlier runs)
    expect(diaError.textContent).toContain("Diastolic must be between 40 and 100.");
    expect(button.disabled).toBe(true);
  });

  it("enables button when both inputs are valid and clears errors", () => {
    const { dom, sys, dia, sysError, diaError, button } = setupDomAndUI();

    // First put invalid values to trigger errors
    sys.value = "60";
    sys.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    dia.value = "30";
    dia.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    // Now fix them to valid values
    sys.value = "120";
    sys.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    dia.value = "80";
    dia.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    expect(sysError.textContent).toBe("");
    expect(diaError.textContent).toBe("");
    expect(button.disabled).toBe(false);
  });

  it("shows result with Category + MAP when form is submitted with valid values", () => {
    const { dom, form, sys, dia, result } = setupDomAndUI();

    sys.value = "120";
    dia.value = "80";

    // Submit the form
    form.dispatchEvent(
      new dom.window.Event("submit", { bubbles: true, cancelable: true }),
    );

    const text = result.textContent || "";

    expect(text).toContain("Category: Elevated");
    expect(text).toContain("Pulse Pressure:");
    expect(text).toContain("MAP:");
  });
});
