import { describe, it, expect } from 'vitest';
import { classifyBp, computePulsePressure, BpCategory } from '../../app.js';

describe('Blood pressure classification', () => {
  it('classifies high blood pressure correctly', () => {
    expect(classifyBp(140, 80)).toBe(BpCategory.High);
    expect(classifyBp(130, 90)).toBe(BpCategory.High);
  });

  it('classifies other categories correctly', () => {
    expect(classifyBp(125, 78)).toBe(BpCategory.PreHigh);
    expect(classifyBp(100, 65)).toBe(BpCategory.Ideal);
    expect(classifyBp(85, 55)).toBe(BpCategory.Low);
  });

  it('throws on invalid inputs', () => {
    expect(() => classifyBp(60, 40)).toThrow();
    expect(() => classifyBp(200, 80)).toThrow();
    expect(() => classifyBp(120, 120)).toThrow();
  });
    it('classifies boundary values correctly', () => {
    // High boundaries
    expect(classifyBp(140, 80)).toBe(BpCategory.High);   // systolic = 140
    expect(classifyBp(130, 90)).toBe(BpCategory.High);   // diastolic = 90

    // PreHigh boundaries
    expect(classifyBp(120, 79)).toBe(BpCategory.PreHigh); // systolic = 120
    expect(classifyBp(119, 80)).toBe(BpCategory.PreHigh); // diastolic = 80

    // Ideal boundary
    expect(classifyBp(119, 79)).toBe(BpCategory.Ideal);   // upper edge of ideal
  });

});

describe('Pulse pressure feature', () => {
  it('computes pulse pressure and wide flag', () => {
    const pp = computePulsePressure(150, 80);
    expect(pp.value).toBe(70);
    expect(pp.isWide).toBe(true);

    const pp2 = computePulsePressure(120, 90);
    expect(pp2.value).toBe(30);
    expect(pp2.isWide).toBe(false);
  });
});

