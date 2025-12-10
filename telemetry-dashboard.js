// telemetry-dashboard.js
import { readTelemetryEvents } from "./telemetry.js";

/**
 * Render the telemetry dashboard into the given document.
 * Default is the real browser document, but tests can inject JSDOM.
 */
export function renderTelemetryDashboard(doc = document) {
  const summaryEl = doc.getElementById("telemetry-summary");
  const tableBody = doc.getElementById("telemetry-table-body");
  const rawEl = doc.getElementById("telemetry-raw");

  if (!summaryEl || !tableBody || !rawEl) {
    return; // Safety guard if DOM is incomplete
  }

  const events = readTelemetryEvents();

  // No data yet
  if (!events || events.length === 0) {
    summaryEl.textContent = "No telemetry events recorded yet.";
    tableBody.innerHTML = "";
    rawEl.textContent = "[]";
    return;
  }

  // --- Summary line ---
  const total = events.length;

  const byType = events.reduce((acc, evt) => {
    const key = evt.name || "unknown";
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const last = events[events.length - 1];
  const lastTime = last.timestamp
    ? new Date(last.timestamp).toLocaleString()
    : "unknown";

  const typeSummary = Object.entries(byType)
    .map(([name, count]) => `${name}: ${count}`)
    .join(" · ");

  summaryEl.textContent =
    `Total events: ${total} | ${typeSummary} | Last event: ${lastTime}`;

  // --- Table of recent events (newest first) ---
  tableBody.innerHTML = "";

  events
    .slice()
    .reverse()
    .forEach((evt) => {
      const tr = doc.createElement("tr");

      const tsCell = doc.createElement("td");
      const nameCell = doc.createElement("td");
      const categoryCell = doc.createElement("td");
      const sysCell = doc.createElement("td");
      const diaCell = doc.createElement("td");

      tsCell.textContent = evt.timestamp
        ? new Date(evt.timestamp).toLocaleString()
        : "-";

      nameCell.textContent = evt.name || "-";

      const payload = evt.payload || {};
      categoryCell.textContent = payload.category ?? "-";
      sysCell.textContent =
        payload.systolic !== undefined ? String(payload.systolic) : "-";
      diaCell.textContent =
        payload.diastolic !== undefined ? String(payload.diastolic) : "-";

      tr.append(tsCell, nameCell, categoryCell, sysCell, diaCell);
      tableBody.appendChild(tr);
    });

  // --- Raw JSON block (nice for CA evidence) ---
  rawEl.textContent = JSON.stringify(events, null, 2);
}

// Auto-run in a real browser
if (typeof document !== "undefined") {
  renderTelemetryDashboard(document);
}
