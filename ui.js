// ui.js — handles browser UI only
import { classifyBp, computePulsePressure, computeMAP } from "./app.js";

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bp-form");
  const sysInput = document.getElementById("sys");
  const diaInput = document.getElementById("dia");
  const resultEl = document.getElementById("result");

  if (!form || !sysInput || !diaInput || !resultEl) return;

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const s = Number(sysInput.value);
    const d = Number(diaInput.value);

    try {
      const category = classifyBp(s, d);
      const pulse = computePulsePressure(s, d);
      const map = computeMAP(s, d);

      resultEl.innerHTML = `
        <strong>Category:</strong> ${category}<br>
        <strong>Pulse Pressure:</strong> ${pulse.value} mmHg ${pulse.isWide ? "(Wide)" : ""}<br>
        <strong>MAP:</strong> ${map.toFixed(2)} mmHg
      `;
    } catch (err) {
      resultEl.textContent = err.message || "Invalid input.";
    }
  });
});
