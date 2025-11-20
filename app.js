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

  if (
    Number.isNaN(s) ||
    Number.isNaN(d) ||
    s < 70 ||
    s > 190 ||
    d < 40 ||
    d > 100 ||
    s <= d
  ) {
    throw new RangeError("Invalid blood pressure input.");
  }

  if (s >= 140 || d >= 90) {
    return BpCategory.High;
  }

  if (s >= 120 || d >= 80) {
    return BpCategory.Elevated;
  }

  if (s >= 90 && s <= 119 && d >= 60 && d <= 79) {
    return BpCategory.Ideal;
  }

  return BpCategory.Low;
}

// ---- Pulse pressure calculation ----
export function computePulsePressure(systolic, diastolic) {
  const value = Number(systolic) - Number(diastolic);
  return {
    value,
    isWide: value > 60,
  };
}



