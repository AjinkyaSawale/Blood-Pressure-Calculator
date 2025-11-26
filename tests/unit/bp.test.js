import { describe, it, expect } from "vitest";
import {
  classifyBp,
  computePulsePressure,
  computeMAP,
  BpCategory,
} from "../../app.js";

describe("Blood pressure classification", () => {
  it("classifies high blood pressure correctly", () => {
    expect(classifyBp(150, 95)).toBe(BpCategory.High);
  });

  it("classifies other categories correctly", () => {
    expect(classifyBp(85, 55)).toBe(BpCategory.Low);
    expect(classifyBp(115, 75)).toBe(BpCategory.Ideal);
    expect(classifyBp(125, 82)).toBe(BpCategory.Elevated);
  });

  it("throws on invalid inputs", () => {
    expect(() => classifyBp("abc", 70)).toThrow();
    expect(() => classifyBp(120, null)).toThrow();
  });

  it("classifies boundary values correctly", () => {
    expect(classifyBp(90, 60)).toBe(BpCategory.Ideal);
    expect(classifyBp(119, 79)).toBe(BpCategory.Ideal);
    expect(classifyBp(120, 80)).toBe(BpCategory.Elevated);
  });

  it("classifies low blood pressure correctly", () => {
    expect(classifyBp(85, 55)).toBe(BpCategory.Low);
  });

    it("treats 140/90 inclusive thresholds as high blood pressure", () => {
    // systolic exactly at 140 should be High
    expect(classifyBp(140, 80)).toBe(BpCategory.High);

    // diastolic exactly at 90 should be High
    expect(classifyBp(130, 90)).toBe(BpCategory.High);

    // both at the inclusive high thresholds
    expect(classifyBp(140, 90)).toBe(BpCategory.High);
  });
});

describe("Pulse pressure feature", () => {
  it("computes pulse pressure and wide flag", () => {
    const pp = computePulsePressure(140, 70);
    expect(pp.value).toBe(70);
    expect(pp.isWide).toBe(true);
  });

  it("handles pulse pressure edge cases correctly", () => {
    const pp60 = computePulsePressure(120, 60);
    expect(pp60.value).toBe(60);
    expect(pp60.isWide).toBe(false);

    const pp59 = computePulsePressure(119, 60);
    expect(pp59.value).toBe(59);
    expect(pp59.isWide).toBe(false);
  });
});

describe("Mean Arterial Pressure (MAP)", () => {
  it("calculates MAP correctly using MAP = (SBP + 2*DBP) / 3", () => {
    const result = computeMAP(120, 80);
    expect(result).toBeCloseTo(93.33, 2);
  });

  // NEW small test: invalid input handling
  it("throws an error for invalid MAP inputs", () => {
    expect(() => computeMAP("abc", 80)).toThrow();
    expect(() => computeMAP(120, undefined)).toThrow();
    expect(() => computeMAP(70, 75)).toThrow(); // SBP must be > DBP
  });
  it("rounds MAP correctly to two decimals", () => {
  const result = computeMAP(123, 78); // (123 + 156) / 3 = 279/3 = 93 
  expect(result).toBeCloseTo(93.0, 2);
});
});
