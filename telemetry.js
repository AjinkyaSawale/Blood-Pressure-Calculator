// telemetry.js

const STORAGE_KEY = "bp_telemetry_events";

// Safely obtain a usable localStorage implementation.
// Returns null if not available or if access throws (e.g. opaque origin).
function getSafeStorage() {
  try {
    // Prefer globalThis.localStorage (works in jsdom + browser)
    const storage = globalThis.localStorage;
    if (!storage) return null;

    const probeKey = "__telemetry_probe__";
    storage.setItem(probeKey, "1");
    storage.removeItem(probeKey);
    return storage;
  } catch {
    return null;
  }
}

// Read all stored telemetry events from localStorage.
export function readTelemetryEvents() {
  const storage = getSafeStorage();
  if (!storage) return [];

  try {
    const raw = storage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

// Clear stored telemetry events (used in tests).
export function clearTelemetryEvents() {
  const storage = getSafeStorage();
  if (!storage) return;

  try {
    storage.removeItem(STORAGE_KEY);
  } catch {
    // swallow error – telemetry must never break the app
  }
}

// Main API: record a telemetry event.
// name: string (e.g. "bp_calculated")
// payload: arbitrary object with event details.
export function recordEvent(name, payload = {}) {
  const evt = {
    name,
    payload,
    timestamp: new Date().toISOString(),
  };

  // Console log for debugging (dev-only style)
  // eslint-disable-next-line no-console
  console.log("[telemetry]", evt);

  const storage = getSafeStorage();
  if (!storage) {
    // In environments without localStorage (or opaque origins),
    // we still log but silently skip persistence.
    return;
  }

  try {
    const all = readTelemetryEvents();
    all.push(evt);
    storage.setItem(STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Swallow – telemetry must never break the main flow
  }
}
