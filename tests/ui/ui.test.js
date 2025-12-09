// tests/ui/ui.test.js
import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import { initUI } from "../../ui.js";
import { recordEvent } from "../../telemetry.js";

//  jsdom with REAL URL (fixes localStorage SecurityError)
let dom;
let doc;

function loadHTML() {
  const html = `
    <!doctype html>
    <html>
      <body>
        <form id="bp-form">
          <input id="sys" />
          <small id="sys-error"></small>

          <input id="dia" />
          <small id="dia-error"></small>

          <button type="submit">Calculate</button>
        </form>

        <section id="result"></section>
      </body>
    </html>
  `;

  dom = new JSDOM(html, { url: "http://localhost/" });
  doc = dom.window.document;

  // attach localStorage to global for telemetry
  global.localStorage = dom.window.localStorage;

  initUI(doc);
}

beforeEach(() => {
  loadHTML();
});

describe("UI DOM behaviour", () => {
  it("shows error for invalid systolic input and keeps button disabled", () => {
    const sys = doc.getElementById("sys");
    const dia = doc.getElementById("dia");
    const sysError = doc.getElementById("sys-error");
    const button = doc.querySelector("button");

    sys.value = "10";       // invalid
    dia.value = "80";       // valid

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    expect(sysError.textContent).toContain("Systolic must be between 70 and 190.");
    expect(button.disabled).toBe(true);
  });

  it("shows error for invalid diastolic input and keeps button disabled", () => {
    const sys = doc.getElementById("sys");
    const dia = doc.getElementById("dia");
    const diaError = doc.getElementById("dia-error");
    const button = doc.querySelector("button");

    sys.value = "120";     // valid
    dia.value = "10";      // invalid

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    expect(diaError.textContent).toContain("Diastolic must be between 40 and 100.");
    expect(button.disabled).toBe(true);
  });

  it("enables button when both inputs are valid and clears errors", () => {
    const sys = doc.getElementById("sys");
    const dia = doc.getElementById("dia");
    const sysError = doc.getElementById("sys-error");
    const diaError = doc.getElementById("dia-error");
    const button = doc.querySelector("button");

    sys.value = "120";
    dia.value = "80";

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    expect(sysError.textContent).toBe("");
    expect(diaError.textContent).toBe("");
    expect(button.disabled).toBe(false);
  });

  it("submits form with valid inputs and shows category + MAP", () => {
    const sys = doc.getElementById("sys");
    const dia = doc.getElementById("dia");
    const form = doc.getElementById("bp-form");
    const result = doc.getElementById("result");

    sys.value = "120";
    dia.value = "80";

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));
    form.dispatchEvent(new dom.window.Event("submit"));

    expect(result.textContent).toContain("Category: Elevated");
    expect(result.textContent).toContain("MAP: 93.3 mmHg");
  });

  it("does NOT disable button when inputs remain valid (no false disables)", () => {
    const sys = doc.getElementById("sys");
    const dia = doc.getElementById("dia");
    const button = doc.querySelector("button");

    sys.value = "130";
    dia.value = "85";

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    expect(button.disabled).toBe(false);
  });
});
