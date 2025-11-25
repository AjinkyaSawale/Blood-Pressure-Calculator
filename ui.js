
import { classifyBp, computePulsePressure, computeMAP } from "./app.js";

const form = document.getElementById("bp-form");
const sysInput = document.getElementById("sys");
const diaInput = document.getElementById("dia");
const resultEl = document.getElementById("result");

if (form && sysInput && diaInput && resultEl) {
  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const s = Number(sysInput.value);
    const d = Number(diaInput.value);

    try {
      const category = classifyBp(s, d);
      const pulse = computePulsePressure(s, d);
      const map = computeMAP(s, d);

      //  MATCH E2E EXPECTATION EXACTLY → one decimal MAP
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

