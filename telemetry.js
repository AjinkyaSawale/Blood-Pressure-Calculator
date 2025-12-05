// telemetry.js

// In-memory buffer (useful for debugging or tests)
export const telemetryBuffer = [];

// Generic telemetry helper
export function recordEvent(type, payload = {}) {
  const event = {
    type,
    payload,
    timestamp: new Date().toISOString(),
  };

  telemetryBuffer.push(event);

  // Expose on window for simple “continuous monitoring”
  if (typeof window !== "undefined") {
    window.__telemetryEvents = window.__telemetryEvents || [];
    window.__telemetryEvents.push(event);
  }

  // Optional console hook so you can see events in DevTools
  if (typeof console !== "undefined" && console.debug) {
    console.debug("[telemetry]", event);
  }
}
