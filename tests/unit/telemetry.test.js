// tests/unit/telemetry.test.js
import { describe, it, expect, beforeEach } from "vitest";
import { recordEvent, readTelemetryEvents } from "../../telemetry.js";

describe("Telemetry tracking", () => {
  beforeEach(() => {
    // Lightweight fake window + localStorage for tests
    global.window = {
      localStorage: {
        _store: {},
        getItem(key) {
          return this._store[key] ?? null;
        },
        setItem(key, value) {
          this._store[key] = value;
        },
        removeItem(key) {
          delete this._store[key];
        },
        clear() {
          this._store = {};
        },
      },
    };
  });

  it("stores bp_calculated events in localStorage", () => {
    const evt = recordEvent("bp_calculated", {
      systolic: 120,
      diastolic: 80,
      category: "Elevated",
    });

    const stored = readTelemetryEvents();

    expect(evt.name).toBe("bp_calculated");
    expect(evt.payload.category).toBe("Elevated");
    expect(stored.length).toBe(1);
    expect(stored[0].name).toBe("bp_calculated");
    expect(stored[0].payload.systolic).toBe(120);
  });

  it("never throws even if localStorage is unavailable", () => {
    // Simulate an environment with no localStorage
    global.window = {};

    expect(() =>
      recordEvent("bp_calculated", { systolic: 140, diastolic: 90 }),
    ).not.toThrow();
  });
});
