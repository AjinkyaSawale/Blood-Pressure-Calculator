import { classifyBp, computePulsePressure } from "./app.js";

if (typeof document !== "undefined") {
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

        resultEl.textContent =
          `Category: ${category} | Pulse pressure: ${pulse.value} mmHg` +
          (pulse.isWide ? " (Wide)" : "");
      } catch (err) {
        const message =
          err instanceof Error ? err.message : "Invalid blood pressure input.";
        resultEl.textContent = message;
      }
    });
  }
}
