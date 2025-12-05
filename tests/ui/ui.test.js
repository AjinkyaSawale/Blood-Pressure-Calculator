import { describe, it, expect, beforeEach } from "vitest";
import { JSDOM } from "jsdom";
import { initUI } from "../../ui.js";
import {
  classifyBp,
  computePulsePressure,
  computeMAP,
} from "../../app.js";

// Helper to create fresh DOM + UI each test
function setupDomAndUI() {
  const html = `
    <form id="bp-form">
      <input id="sys" />
      <small id="sys-error"></small>

      <input id="dia" />
      <small id="dia-error"></small>

      <button type="submit" disabled>Calculate</button>
    </form>

    <section id="result"></section>
  `;

  const dom = new JSDOM(html);
  const document = dom.window.document;

  initUI(document);

  return { dom, document };
}

describe("UI DOM behaviour", () => {

  it("shows error for invalid systolic input and keeps button disabled", () => {
    const { document, dom } = setupDomAndUI();

    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const sysError = document.getElementById("sys-error");
    const button = document.querySelector("button");

    sys.value = "20"; // invalid (<70)
    dia.value = "80"; // valid

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    expect(sysError.textContent).toContain("Systolic must be between 70 and 190.");
    expect(button.disabled).toBe(true);
  });

  it("shows error for invalid diastolic input and keeps button disabled", () => {
    const { document, dom } = setupDomAndUI();

    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const diaError = document.getElementById("dia-error");
    const button = document.querySelector("button");

    sys.value = "120"; // valid
    dia.value = "20";  // invalid (<40)

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    expect(diaError.textContent).toContain("Diastolic must be between 40 and 100.");
    expect(button.disabled).toBe(true);
  });

  it("enables button when both inputs are valid and clears errors", () => {
    const { document, dom } = setupDomAndUI();

    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const sysError = document.getElementById("sys-error");
    const diaError = document.getElementById("dia-error");
    const button = document.querySelector("button");

    sys.value = "120";
    dia.value = "80";

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    expect(sysError.textContent).toBe("");
    expect(diaError.textContent).toBe("");
    expect(button.disabled).toBe(false);
  });

  it("submits form with valid inputs and shows category + MAP", () => {
    const { document, dom } = setupDomAndUI();

    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const form = document.getElementById("bp-form");
    const button = document.querySelector("button");
    const result = document.getElementById("result");

    sys.value = "140";
    dia.value = "90";

    // activate button
    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    expect(button.disabled).toBe(false);

    // submit
    form.dispatchEvent(new dom.window.Event("submit"));

    expect(result.textContent).toContain("High");
    expect(result.textContent).toContain("MAP:");
  });

  it("does NOT disable the button when both inputs are valid (no false-positive disable)", () => {
    const { document, dom } = setupDomAndUI();

    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const button = document.querySelector("button");

    sys.value = "119";
    dia.value = "79";

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    // Button should remain enabled
    expect(button.disabled).toBe(false);
  });

});
