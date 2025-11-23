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
    expect(() => classifyBp(80, 90)).toThrow(); // systolic must be > diastolic
  });

  it("classifies boundary values correctly", () => {
    expect(classifyBp(90, 60)).toBe(BpCategory.Ideal);
    expect(classifyBp(119, 79)).toBe(BpCategory.Ideal);
    expect(classifyBp(120, 80)).toBe(BpCategory.Elevated);
  });

  it("classifies low blood pressure correctly", () => {
    expect(classifyBp(85, 55)).toBe(BpCategory.Low);
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
    const result = computeMAP(120, 80); // ~93.33
    expect(result).toBeCloseTo(93.33, 2);
  });

  it("computes MAP correctly when systolic equals diastolic", () => {
    const result = computeMAP(100, 100); // MAP = 100
    expect(result).toBeCloseTo(100, 2);
  });
    it("handles different MAP ranges (higher pressure gives higher MAP)", () => {
    const mapNormal = computeMAP(120, 80);  // ~93.33
    const mapHigh   = computeMAP(160, 100); // ~120
    expect(mapHigh).toBeGreaterThan(mapNormal);
  });
    it("handles a lower MAP boundary case", () => {
    // Example: 90/60 → MAP = (90 + 2*60) / 3 = 70
    const result = computeMAP(90, 60);
    expect(result).toBeCloseTo(70, 2);
  });
});
