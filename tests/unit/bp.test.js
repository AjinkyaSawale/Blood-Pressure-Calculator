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
    // Ideal boundaries
    expect(classifyBp(90, 60)).toBe(BpCategory.Ideal);
    expect(classifyBp(119, 79)).toBe(BpCategory.Ideal);

    // Elevated boundary
    expect(classifyBp(120, 80)).toBe(BpCategory.Elevated);
  });

  it("classifies low blood pressure correctly", () => {
    expect(classifyBp(85, 55)).toBe(BpCategory.Low);
  });

  it("rejects additional invalid ranges", () => {
    // systolic out of range
    expect(() => classifyBp(69, 60)).toThrow();
    expect(() => classifyBp(191, 80)).toThrow();

    // diastolic out of range
    expect(() => classifyBp(100, 39)).toThrow();
    expect(() => classifyBp(120, 101)).toThrow();

    // systolic not strictly greater than diastolic
    expect(() => classifyBp(90, 90)).toThrow();
    expect(() => classifyBp(85, 86)).toThrow();
  });
});

describe("Pulse pressure feature", () => {
  it("computes pulse pressure and wide flag", () => {
    const pp = computePulsePressure(140, 70); // 70mmHg
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
    const result = computeMAP(120, 80); // (120 + 2*80)/3 = 280/3 ≈ 93.33
    expect(result).toBeCloseTo(93.33, 2);
  });
});

