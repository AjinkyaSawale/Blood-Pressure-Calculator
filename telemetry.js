// telemetry.js

// Single key for all stored telemetry events
export const TELEMETRY_STORAGE_KEY = "bp_telemetry_events";

/**
 * Safely read events from localStorage (or a provided storage object).
 * Returns an array of events, never throws.
 */
export function readTelemetryEvents(storageOverride) {
  const storage =
    storageOverride ??
    (typeof window !== "undefined" && window.localStorage
      ? window.localStorage
      : null);

  if (!storage) return [];

  try {
    const raw = storage.getItem(TELEMETRY_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

/**
 * Record a telemetry event.
 * - name: string like "bp_calculated"
 * - payload: any JSON-serialisable object
 * - storageOverride: optional fake storage (used by tests)
 */
export function recordEvent(name, payload = {}, storageOverride) {
  const event = {
    name,
    payload,
    timestamp: new Date().toISOString(),
  };

  // Helpful console log (you already see this in test output)
  // eslint-disable-next-line no-console
  console.log("[telemetry]", event);

  const storage =
    storageOverride ??
    (typeof window !== "undefined" && window.localStorage
      ? window.localStorage
      : null);

  if (!storage) return;

  try {
    const existing = readTelemetryEvents(storage);
    existing.push(event);
    storage.setItem(TELEMETRY_STORAGE_KEY, JSON.stringify(existing));
  } catch {
    // swallow errors to avoid breaking the app
  }
}
