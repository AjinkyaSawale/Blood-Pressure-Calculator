// --- Category enum ---
export const BpCategory = {
  Low: "Low",
  Ideal: "Ideal",
  PreHigh: "PreHigh",
  High: "High",
};

// --- Classification logic ---
// High:    systolic >= 140 OR diastolic >= 90
// PreHigh: systolic >= 120 OR diastolic >= 80 (and not High)
// Ideal:   systolic 90–119 AND diastolic 60–79
// Low:     otherwise, within allowed range
export function classifyBp(systolic, diastolic) {
  if (
    systolic < 70 ||
    systolic > 190 ||
    diastolic < 40 ||
    diastolic > 100 ||
    systolic <= diastolic
  ) {
    throw new RangeError("Invalid blood pressure input.");
  }

  if (systolic >= 140 || diastolic >= 90) return BpCategory.High;
  if (systolic >= 120 || diastolic >= 80) return BpCategory.PreHigh;
  if (
    systolic >= 90 &&
    systolic <= 119 &&
    diastolic >= 60 &&
    diastolic <= 79
  ) {
    return BpCategory.Ideal;
  }
  return BpCategory.Low;
}

// --- New feature: Pulse Pressure + "Wide" flag ---
export function computePulsePressure(systolic, diastolic) {
  const value = systolic - diastolic;
  return { value, isWide: value > 60 };
}

// --- UI wiring (only in browser with DOM) ---
if (typeof document !== "undefined") {
  const form = document.getElementById("bp-form");
  const sysInput = document.getElementById("sys");
  const diaInput = document.getElementById("dia");
  const resultBox = document.getElementById("result");

  if (form && sysInput && diaInput && resultBox) {
    form.addEventListener("submit", (event) => {
      event.preventDefault();

      const systolic = Number(sysInput.value);
      const diastolic = Number(diaInput.value);

      try {
        const category = classifyBp(systolic, diastolic);
        const pp = computePulsePressure(systolic, diastolic);

        resultBox.textContent = `Category: ${category} | Pulse Pressure: ${pp.value} mmHg ${
          pp.isWide ? "(Wide)" : ""
        }`;
      } catch (err) {
        resultBox.textContent = err.message;
        console.error(err);
      }
    });
  }
}


