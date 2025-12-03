// tests/unit/bp.test.js
import { describe, it, expect } from "vitest";
import {
  classifyBp,
  computePulsePressure,
  computeMAP,
  BpCategory,
} from "../../app.js";

//
// 1. BLOOD PRESSURE CLASSIFICATION
//
describe("Blood pressure classification", () => {
  it("classifies high blood pressure correctly", () => {
    expect(classifyBp(150, 95)).toBe(BpCategory.High);
  });

  it("classifies other categories correctly", () => {
    // Low
    expect(classifyBp(85, 55)).toBe(BpCategory.Low);
    // Ideal
    expect(classifyBp(115, 75)).toBe(BpCategory.Ideal);
    // Elevated
    expect(classifyBp(125, 82)).toBe(BpCategory.Elevated);
  });

  it("throws on invalid inputs", () => {
    expect(() => classifyBp("abc", 70)).toThrow();
    expect(() => classifyBp(120, null)).toThrow();
    expect(() => classifyBp(60, 50)).toThrow(); // below allowed range
    expect(() => classifyBp(120, 120)).toThrow(); // systolic must be > diastolic
  });

  it("classifies boundary values correctly", () => {
    // Ideal boundaries
    expect(classifyBp(90, 60)).toBe(BpCategory.Ideal);
    expect(classifyBp(119, 79)).toBe(BpCategory.Ideal);

    // Elevated boundary
    expect(classifyBp(120, 80)).toBe(BpCategory.Elevated);

    // High boundaries (inclusive)
    expect(classifyBp(140, 90)).toBe(BpCategory.High);
  });

  it("classifies low blood pressure correctly", () => {
    expect(classifyBp(85, 55)).toBe(BpCategory.Low);
  });

  it("treats 140/90 inclusive thresholds as high blood pressure", () => {
    expect(classifyBp(140, 90)).toBe(BpCategory.High);
  });
});

//
// 2. PULSE PRESSURE
//
describe("Pulse pressure feature", () => {
  it("computes pulse pressure and wide flag", () => {
    const pp = computePulsePressure(140, 70); // 70mmHg
    expect(pp.value).toBe(70);
    expect(pp.isWide).toBe(true);
  });

  it("handles pulse pressure edge cases correctly", () => {
    // Exactly 60 → NOT wide
    const pp60 = computePulsePressure(120, 60);
    expect(pp60.value).toBe(60);
    expect(pp60.isWide).toBe(false);

    // Just below 60 → NOT wide
    const pp59 = computePulsePressure(119, 60);
    expect(pp59.value).toBe(59);
    expect(pp59.isWide).toBe(false);
  });
});

//
// 3. MEAN ARTERIAL PRESSURE (MAP)
//
describe("Mean Arterial Pressure (MAP)", () => {
  it("calculates MAP correctly using MAP = (SBP + 2*DBP) / 3", () => {
    const result = computeMAP(120, 80); // (120 + 160) / 3 ≈ 93.33
    expect(result).toBeCloseTo(93.33, 2);
  });

  it("throws an error for invalid MAP inputs", () => {
    expect(() => computeMAP("abc", 80)).toThrow();
    expect(() => computeMAP(120, undefined)).toThrow();
    expect(() => computeMAP(70, 75)).toThrow(); // SBP must be > DBP and within range
  });

  it("rounds MAP correctly to two decimals", () => {
    const result = computeMAP(120, 80);
    expect(Number(result.toFixed(2))).toBeCloseTo(93.33, 2);
  });
});
