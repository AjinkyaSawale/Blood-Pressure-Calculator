// ---- Blood pressure categories ----
export const BpCategory = Object.freeze({
  Low: "Low",
  Ideal: "Ideal",
  Elevated: "Elevated",
  High: "High",
});

// ---- Core classification logic ----
export function classifyBp(systolic, diastolic) {
  const s = Number(systolic);
  const d = Number(diastolic);

  // Basic validation based on assignment ranges
  if (
    Number.isNaN(s) ||
    Number.isNaN(d) ||
    s < 70 ||
    s > 190 ||
    d < 40 ||
    d > 100 ||
    s <= d // systolic must be strictly greater than diastolic
  ) {
    throw new RangeError("Invalid blood pressure input.");
  }

  // High BP
  if (s >= 140 || d >= 90) {
    return BpCategory.High;
  }

  // Elevated (formerly PreHigh)
  if (s >= 120 || d >= 80) {
    return BpCategory.Elevated;
  }

  // Ideal range
  if (s >= 90 && s <= 119 && d >= 60 && d <= 79) {
    return BpCategory.Ideal;
  }

  // Anything valid but below ideal
  return BpCategory.Low;
}

// ---- New feature: pulse pressure calculation ----
export function computePulsePressure(systolic, diastolic) {
  const s = Number(systolic);
  const d = Number(diastolic);
  const value = s - d;

  return {
    value,
    isWide: value > 60,
  };
}

// ---- New feature: Mean Arterial Pressure (MAP) ----
export function calculateMAP(s, d) {
  if (typeof s !== "number" || typeof d !== "number") {
    throw new Error("Invalid MAP input.");
  }
  return Math.round((s + 2 * d) / 3);
}

// ---- UI wiring (browser only) ----
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
        const map = calculateMAP(s, d);

        resultEl.innerHTML = `
          <p><strong>Category:</strong> ${category}</p>
          <p><strong>Pulse Pressure:</strong> ${pulse.value} mmHg ${pulse.isWide ? "(Wide)" : ""}</p>
          <p><strong>MAP:</strong> ${map} mmHg</p>
        `;
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : "Invalid blood pressure input.";
        resultEl.textContent = message;
      }
    });
  }
}



