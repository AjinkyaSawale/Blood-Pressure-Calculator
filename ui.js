// ui.js
import { classifyBp, computePulsePressure, computeMAP } from "./app.js";
import { recordEvent } from "./telemetry.js";

// ... initUI etc. above ...

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    if (!validate()) return;

    const s = Number(sys.value);
    const d = Number(dia.value);

    try {
      const category = classifyBp(s, d);
      const pulse = computePulsePressure(s, d);
      const map = computeMAP(s, d);

      const payload = {
        systolic: s,
        diastolic: d,
        category,
        pulsePressure: pulse.value,
        widePulse: pulse.isWide,
        map,
      };

      // Existing local telemetry
      recordEvent("bp_calculated", payload);

      // NEW: send to Azure App Insights if available
      if (typeof window !== "undefined" && window.appInsights) {
        try {
          window.appInsights("trackEvent", {
            name: "bp_calculated",
            properties: payload,
          });
        } catch (err) {
          // Do not break UI if AI fails
          // Optional: console.warn("[ai] failed to track bp_calculated", err);
        }
      }

      result.textContent =
        `Category: ${category}\n` +
        `Pulse Pressure: ${pulse.value} mmHg${pulse.isWide ? " (Wide)" : ""}\n` +
        `MAP: ${map.toFixed(1)} mmHg`;
    } catch (err) {
      result.textContent =
        err instanceof Error ? err.message : "Invalid blood pressure input.";
    }
  });
