// tests/unit/telemetry.test.js
import { describe, it, expect, beforeEach } from "vitest";
import {
  recordEvent,
  readTelemetryEvents,
  clearTelemetryEvents,
} from "../../telemetry.js";

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  getItem(key) {
    return Object.prototype.hasOwnProperty.call(this.store, key)
      ? this.store[key]
      : null;
  }

  setItem(key, value) {
    this.store[key] = String(value);
  }

  removeItem(key) {
    delete this.store[key];
  }

  clear() {
    this.store = {};
  }
}

describe("Telemetry tracking", () => {
  beforeEach(() => {
    // Fresh mock for each test so we fully control the state
    const mock = new LocalStorageMock();

    // Attach to globalThis so telemetry.js (which uses globalThis.localStorage)
    // always sees this mock instead of jsdom's opaque-origin storage.
    globalThis.localStorage = mock;

    clearTelemetryEvents();
  });

  it("stores bp_calculated events in localStorage", () => {
    recordEvent("bp_calculated", {
      systolic: 120,
      diastolic: 80,
      category: "Elevated",
    });

    const stored = readTelemetryEvents();

    // Basic shape checks
    expect(Array.isArray(stored)).toBe(true);
    expect(stored.length).toBe(1);

    const evt = stored[0];
    expect(evt).toBeDefined();
    expect(evt.name).toBe("bp_calculated");
    expect(evt.payload).toBeTruthy();
    expect(evt.payload.systolic).toBe(120);
    expect(evt.payload.diastolic).toBe(80);
    expect(evt.payload.category).toBe("Elevated");
    expect(typeof evt.timestamp).toBe("string");
  });

  it("never throws even if localStorage is unavailable", () => {
    // Simulate an environment with no localStorage (e.g. some Node contexts)
    delete globalThis.localStorage;

    expect(() =>
      recordEvent("bp_calculated", { systolic: 140, diastolic: 90 })
    ).not.toThrow();
  });
});
