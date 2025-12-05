import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import { initUI } from "../../ui.js";
import {
  classifyBp,
  computePulsePressure,
  computeMAP,
} from "../../app.js";

let dom;
let document;

function setupDomAndUI() {
  dom = new JSDOM(`
    <!doctype html>
    <html>
    <body>
      <form id="bp-form">
        <input id="sys" />
        <small id="sys-error" class="error"></small>

        <input id="dia" />
        <small id="dia-error" class="error"></small>

        <button type="submit" disabled>Calculate</button>
      </form>

      <section id="result"></section>
    </body>
    </html>
  `);

  document = dom.window.document;
  initUI(document); // inject UI behaviour
}

describe("UI DOM behaviour", () => {
  beforeEach(() => {
    setupDomAndUI();
  });

  it("shows error for invalid systolic input and keeps button disabled", () => {
    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const button = document.querySelector("button[type=submit]");
    const sysError = document.getElementById("sys-error");

    sys.value = "10"; // too low
    dia.value = "80";

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    expect(sysError.textContent).toContain("Systolic must be between 70 and 190.");
    expect(button.disabled).toBe(true);
  });

  it("shows error for invalid diastolic input and keeps button disabled", () => {
    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const button = document.querySelector("button[type=submit]");
    const diaError = document.getElementById("dia-error");

    sys.value = "120";
    dia.value = "5"; // too low

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    expect(diaError.textContent).toContain("Diastolic must be between 40 and 100.");
    expect(button.disabled).toBe(true);
  });

  it("enables button when both inputs are valid and clears errors", () => {
    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const button = document.querySelector("button[type=submit]");
    const sysError = document.getElementById("sys-error");
    const diaError = document.getElementById("dia-error");

    sys.value = "120";
    dia.value = "80";

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    expect(sysError.textContent).toBe("");
    expect(diaError.textContent).toBe("");
    expect(button.disabled).toBe(false);
  });

  it("submits form with valid inputs and shows category + MAP", () => {
    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const form = document.getElementById("bp-form");
    const result = document.getElementById("result");

    sys.value = "120";
    dia.value = "80";

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    form.dispatchEvent(new dom.window.Event("submit"));

    expect(result.textContent).toContain("Category: Elevated");
    expect(result.textContent).toContain("MAP: 93.3 mmHg");
  });

  it("does NOT disable the button when both inputs are valid (no false-positive disable)", () => {
    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const button = document.querySelector("button[type=submit]");

    sys.value = "110";
    dia.value = "70";

    sys.dispatchEvent(new dom.window.Event("input", { bubbles: true }));
    dia.dispatchEvent(new dom.window.Event("input", { bubbles: true }));

    expect(button.disabled).toBe(false);
  });
});
