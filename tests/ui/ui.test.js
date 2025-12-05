// tests/ui/ui.test.js
import { readFileSync } from "fs";
import { JSDOM } from "jsdom";
import { describe, it, expect, beforeEach } from "vitest";
import { initUI } from "../../ui.js";

// Load the HTML exactly as the browser does
const html = readFileSync("index.html", "utf8");

function setupDomAndUI() {
  const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
  const document = dom.window.document;

  // Initialise our UI wiring manually
  initUI(document);

  return { dom, document };
}

describe("UI DOM behaviour", () => {
  let dom, document;

  beforeEach(() => {
    const setup = setupDomAndUI();
    dom = setup.dom;
    document = setup.document;
  });

  it("shows error for invalid systolic input and keeps button disabled", () => {
    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const button = document.querySelector("button[type=submit]");
    const sysError = document.getElementById("sys-error");

    sys.value = "20"; // invalid
    sys.dispatchEvent(new dom.window.Event("input"));

    expect(sysError.textContent).toContain("Systolic must be");
    expect(button.disabled).toBe(true);
  });

  it("shows error for invalid diastolic input and keeps button disabled", () => {
    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const button = document.querySelector("button[type=submit]");
    const diaError = document.getElementById("dia-error");

    dia.value = "10"; // invalid
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
    const button = document.querySelector("button[type=submit]");
    const form = document.getElementById("bp-form");
    const result = document.getElementById("result");

    sys.value = "120";
    dia.value = "80";

    sys.dispatchEvent(new dom.window.Event("input"));
    dia.dispatchEvent(new dom.window.Event("input"));

    // Form submit
    form.dispatchEvent(new dom.window.Event("submit"));

    expect(result.textContent).toContain("Category: Elevated");
    expect(result.textContent).toContain("MAP: 93.3 mmHg");
  });

  it("does NOT disable the button when both inputs are valid (no false-positive disable)", () => {
    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const button = document.querySelector("button[type=submit]");

    const win = dom.window;

    sys.value = "130";
    dia.value = "85";

    sys.dispatchEvent(new win.Event("input"));
    dia.dispatchEvent(new win.Event("input"));

    expect(button.disabled).toBe(false);
  });
});
