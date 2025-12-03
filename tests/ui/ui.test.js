// tests/ui/ui.test.js
import { describe, it, expect, beforeEach, vi } from "vitest";

function setupDom() {
  document.body.innerHTML = `
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
}

async function loadUi() {
  // Ensure fresh module load each test so event listeners attach to new DOM
  vi.resetModules();
  await import("../../ui.js");
}

describe("UI DOM behaviour", () => {
  beforeEach(async () => {
    setupDom();
    await loadUi();
  });

  it("starts with disabled button and empty result", () => {
    const button = document.querySelector("button[type=submit]");
    const result = document.getElementById("result");
    const sysError = document.getElementById("sys-error");
    const diaError = document.getElementById("dia-error");

    expect(button.disabled).toBe(true);
    expect(result.textContent).toBe("");
    expect(sysError.textContent).toBe("");
    expect(diaError.textContent).toBe("");
  });

  it("enables button when both inputs are valid and clears errors", () => {
    const sysInput = document.getElementById("sys");
    const diaInput = document.getElementById("dia");
    const button = document.querySelector("button[type=submit]");
    const sysError = document.getElementById("sys-error");
    const diaError = document.getElementById("dia-error");

    // Fill valid values
    sysInput.value = "120";
    diaInput.value = "80";

    sysInput.dispatchEvent(new Event("input", { bubbles: true }));
    diaInput.dispatchEvent(new Event("input", { bubbles: true }));

    expect(button.disabled).toBe(false);
    expect(sysError.textContent).toBe("");
    expect(diaError.textContent).toBe("");
  });

  it("shows error for invalid systolic input and keeps button disabled", () => {
    const sysInput = document.getElementById("sys");
    const diaInput = document.getElementById("dia");
    const button = document.querySelector("button[type=submit]");
    const sysError = document.getElementById("sys-error");

    // Valid diastolic so only systolic is the problem
    diaInput.value = "80";
    diaInput.dispatchEvent(new Event("input", { bubbles: true }));

    // Invalid systolic (too low)
    sysInput.value = "50";
    sysInput.dispatchEvent(new Event("input", { bubbles: true }));

    expect(button.disabled).toBe(true);
    expect(sysError.textContent).toContain("Invalid");
  });

  // NEW TEST: cover diastolic validation branch
  it("shows error for invalid diastolic input and keeps button disabled", () => {
    const sysInput = document.getElementById("sys");
    const diaInput = document.getElementById("dia");
    const button = document.querySelector("button[type=submit]");
    const diaError = document.getElementById("dia-error");

    // Valid systolic so only diastolic is the problem
    sysInput.value = "120";
    sysInput.dispatchEvent(new Event("input", { bubbles: true }));

    // Invalid diastolic (too high)
    diaInput.value = "150";
    diaInput.dispatchEvent(new Event("input", { bubbles: true }));

    expect(button.disabled).toBe(true);
    expect(diaError.textContent).toContain("Invalid");
  });
});
