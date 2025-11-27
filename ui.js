
import { classifyBp, computePulsePressure, computeMAP } from "./app.js";

const form = document.getElementById("bp-form");
const sysInput = document.getElementById("sys");
const diaInput = document.getElementById("dia");
const resultEl = document.getElementById("result");
const sysError = document.getElementById("sys-error");
const diaError = document.getElementById("dia-error");
const submitButton = form?.querySelector("button[type='submit']");

/**
 * Validate a numeric field in the given range.
 */
function validateNumberField(inputEl, errorEl, min, max, label) {
  if (!inputEl || !errorEl) return false;

  const raw = inputEl.value.trim();
  if (!raw) {
    // No value yet – clear error, but treat as not valid for enabling button
    errorEl.textContent = "";
    return false;
  }

  const value = Number(raw);
  if (Number.isNaN(value)) {
    errorEl.textContent = `${label} must be a number.`;
    return false;
  }

  if (value < min || value > max) {
    errorEl.textContent = `${label} must be between ${min} and ${max}.`;
    return false;
  }

  errorEl.textContent = "";
  return true;
}

/**
 * Extra rule: systolic must be strictly higher than diastolic.
 */
function validateRelation() {
  if (!sysInput || !diaInput || !diaError) return false;

  const s = Number(sysInput.value);
  const d = Number(diaInput.value);

  if (!sysInput.value || !diaInput.value) {
    // Don’t show relation error until both have values
    if (diaError.textContent === "Systolic must be higher than diastolic.") {
      diaError.textContent = "";
    }
    return false;
  }

  if (s <= d) {
    diaError.textContent = "Systolic must be higher than diastolic.";
    return false;
  }

  // Clear only our specific relation error
  if (diaError.textContent === "Systolic must be higher than diastolic.") {
    diaError.textContent = "";
  }
  return true;
}

/**
 * Validate everything and toggle the button.
 */
function validateFormAndToggleButton() {
  if (!submitButton) return;

  const sysOk = validateNumberField(sysInput, sysError, 70, 190, "Systolic");
  const diaOk = validateNumberField(diaInput, diaError, 40, 100, "Diastolic");

  // Relation only makes sense if both fields are individually valid
  const relationOk = sysOk && diaOk ? validateRelation() : false;

  const allValid = sysOk && diaOk && relationOk;
  submitButton.disabled = !allValid;

  return allValid;
}

// Wire up live validation
if (sysInput) {
  sysInput.addEventListener("input", () => {
    validateFormAndToggleButton();
  });
}

if (diaInput) {
  diaInput.addEventListener("input", () => {
    validateFormAndToggleButton();
  });
}

// Submit handler – uses existing core logic and expected output format
if (form && resultEl) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    // If something became invalid just before submit, don't proceed
    if (!validateFormAndToggleButton()) {
      return;
    }

    const s = Number(sysInput.value);
    const d = Number(diaInput.value);

    try {
      const category = classifyBp(s, d);
      const pulse = computePulsePressure(s, d);
      const map = computeMAP(s, d);

      // MUST match the format your existing E2E expects:
      // Category: Elevated
      // Pulse Pressure: 40 mmHg
      // MAP: 93.3 mmHg
      resultEl.textContent =
        `Category: ${category}\n` +
        `Pulse Pressure: ${pulse.value} mmHg${pulse.isWide ? " (Wide)" : ""}\n` +
        `MAP: ${map.toFixed(1)} mmHg`;
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Invalid blood pressure input.";
      resultEl.textContent = message;
      
    }
  });
}
