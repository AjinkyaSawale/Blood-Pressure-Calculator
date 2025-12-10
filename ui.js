// ui.js
import { classifyBp, computePulsePressure, computeMAP } from "./app.js";
import { recordEvent } from "./telemetry.js";

// Allow injecting a custom document (for tests)
// but default to the browser's document.
export function initUI(doc = document) {
  const form = doc.getElementById("bp-form");
  if (!form) return; // Safety guard for tests with partial DOM

  const sys = doc.getElementById("sys");
  const dia = doc.getElementById("dia");
  const sysError = doc.getElementById("sys-error");
  const diaError = doc.getElementById("dia-error");
  const button = form.querySelector("button[type=submit]");
  const result = doc.getElementById("result");

  const validate = () => {
    const s = Number(sys.value);
    const d = Number(dia.value);

    let hasError = false;

    // reset errors every time
    sysError.textContent = "";
    diaError.textContent = "";

    if (!sys.value || Number.isNaN(s) || s < 70 || s > 190) {
      sysError.textContent = "Systolic must be between 70 and 190.";
      hasError = true;
    }

    if (!dia.value || Number.isNaN(d) || d < 40 || d > 100) {
      diaError.textContent = "Diastolic must be between 40 and 100.";
      hasError = true;
    }

    button.disabled = hasError;
    return !hasError;
  };

  // Live validation
  sys.addEventListener("input", validate);
  dia.addEventListener("input", validate);

  // Submit: only if valid
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) return;

    const s = Number(sys.value);
    const d = Number(dia.value);

    try {
      const category = classifyBp(s, d);
      const pulse = computePulsePressure(s, d);
      const map = computeMAP(s, d);
      const mapRounded = Number(map.toFixed(1));

      result.textContent =
        `Category: ${category}\n` +
        `Pulse Pressure: ${pulse.value} mmHg${pulse.isWide ? " (Wide)" : ""}\n` +
        `MAP: ${mapRounded.toFixed(1)} mmHg`;

      // Telemetry event for CA: tracks each successful calculation
      recordEvent("bp_calculated", {
        systolic: s,
        diastolic: d,
        category,
        pulsePressure: pulse.value,
        widePulse: pulse.isWide,
        map: mapRounded,
      });
    } catch (err) {
      result.textContent =
        err instanceof Error ? err.message : "Invalid blood pressure input.";
      // keep UI stable, no re-throw
    }
  });

  // initial state
  button.disabled = true;
  sysError.textContent = "";
  diaError.textContent = "";
}

// Auto-wire only in a real browser (not needed for tests)
if (typeof document !== "undefined") {
  initUI(document);
}
