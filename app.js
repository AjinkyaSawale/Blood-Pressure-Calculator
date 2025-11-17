// app.js

export const BpCategory = {
  Low: 'Low',
  Ideal: 'Ideal',
  Elevated: 'Elevated',   // updated name
  High: 'High',
};

// Pure classification function
export function classifyBp(systolic, diastolic) {
  if (typeof systolic !== "number" || typeof diastolic !== "number")
    throw new Error("Invalid input");

  if (systolic < 90 || diastolic < 60) return BpCategory.Low;
  if (systolic < 120 && diastolic < 80) return BpCategory.Ideal;
  if (systolic >= 140 || diastolic >= 90) return BpCategory.High;

  // UPDATED: PreHigh → Elevated
  return BpCategory.Elevated;
}

// Pulse pressure logic
export function computePulsePressure(systolic, diastolic) {
  const value = systolic - diastolic;
  return {
    value,
    isWide: value > 60
  };
}

// UI Logic
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("bp-form");
  const output = document.getElementById("result");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const sys = Number(document.getElementById("systolic").value);
    const dia = Number(document.getElementById("diastolic").value);

    try {
      const category = classifyBp(sys, dia);
      const pp = computePulsePressure(sys, dia);

      output.textContent =
        `Category: ${category} | Pulse Pressure: ${pp.value} mmHg ${pp.isWide ? "(Wide)" : ""}`;

    } catch (error) {
      output.textContent = "Error: Invalid input";
    }
  });
});



