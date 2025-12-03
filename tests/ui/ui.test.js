import { describe, it, expect, beforeEach, vi } from "vitest";

const htmlTemplate = `
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
`;

beforeEach(async () => {
  // Reset module cache so ui.js re-attaches listeners each test
  vi.resetModules();

  // Reset DOM
  document.body.innerHTML = htmlTemplate;

  // Load the UI wiring (this should attach event listeners)
  await import("../../ui.js");
});

describe("UI DOM behaviour", () => {
  it("keeps the Calculate button disabled by default", () => {
    const button = document.querySelector('button[type="submit"]');
    expect(button).not.toBeNull();
    expect(button.disabled).toBe(true);
  });

  it("enables the button when both inputs are within valid range", () => {
    const form = document.getElementById("bp-form");
    const sysInput = document.getElementById("sys");
    const diaInput = document.getElementById("dia");
    const button = form.querySelector('button[type="submit"]');

    sysInput.value = "120";
    diaInput.value = "80";

    // Simulate user typing
    sysInput.dispatchEvent(new Event("input", { bubbles: true }));
    diaInput.dispatchEvent(new Event("input", { bubbles: true }));

    expect(button.disabled).toBe(false);
  });

  it("shows systolic error and keeps button disabled for invalid systolic", () => {
    const form = document.getElementById("bp-form");
    const sysInput = document.getElementById("sys");
    const diaInput = document.getElementById("dia");
    const button = form.querySelector('button[type="submit"]');
    const sysError = document.getElementById("sys-error");

    // Clearly invalid systolic
    sysInput.value = "50";
    diaInput.value = "80";

    // Simulate the user typing
    sysInput.dispatchEvent(new Event("input", { bubbles: true }));
    diaInput.dispatchEvent(new Event("input", { bubbles: true }));

    // Some error text should be present (we don't care about exact wording)
    expect(sysError.textContent.trim().length).toBeGreaterThan(0);

    // And the button should stay disabled
    expect(button.disabled).toBe(true);
  });
});
