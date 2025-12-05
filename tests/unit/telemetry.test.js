// tests/unit/telemetry.test.js
import { describe, it, expect, vi } from "vitest";
import {
  recordEvent,
  readTelemetryEvents,
  TELEMETRY_STORAGE_KEY,
} from "../../telemetry.js";

describe("Telemetry tracking", () => {
  it("stores bp_calculated events in localStorage", () => {
    // Fake in-memory storage
    const store = {};
    const fakeStorage = {
      getItem: vi.fn((key) => (key in store ? store[key] : null)),
      setItem: vi.fn((key, value) => {
        store[key] = value;
      }),
    };

    // Use the override so we don't depend on real window.localStorage
    recordEvent(
      "bp_calculated",
      { systolic: 120, diastolic: 80, category: "Elevated" },
      fakeStorage,
    );

    const events = readTelemetryEvents(fakeStorage);

    // Basic assertions
    expect(fakeStorage.setItem).toHaveBeenCalledTimes(1);
    expect(events.length).toBe(1);

    const evt = events[0];
    expect(evt.name).toBe("bp_calculated");
    expect(evt.payload.category).toBe("Elevated");
    expect(evt.payload.systolic).toBe(120);
    expect(evt.payload.diastolic).toBe(80);
    expect(typeof evt.timestamp).toBe("string");

    // Optional: check the raw stored value is JSON array
    const raw = store[TELEMETRY_STORAGE_KEY];
    const parsed = JSON.parse(raw);
    expect(Array.isArray(parsed)).toBe(true);
  });

  it("never throws even if localStorage is unavailable", () => {
    // Simulate environment with no window / no localStorage
    const previousWindow = globalThis.window;
    // @ts-ignore - we deliberately overwrite for the test
    delete globalThis.window;

    expect(() => {
      recordEvent("bp_calculated", { systolic: 140, diastolic: 90 });
    }).not.toThrow();

    // Restore window to avoid side effects
    if (previousWindow) {
      globalThis.window = previousWindow;
    }
  });
});
