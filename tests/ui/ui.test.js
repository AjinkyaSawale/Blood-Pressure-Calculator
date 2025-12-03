import { describe, it, expect, beforeEach } from "vitest";
import { classifyBp, computeMAP, computePulsePressure } from "../../app.js";
import fs from "fs";
import path from "path";
import { JSDOM } from "jsdom";

describe("UI DOM behaviour", () => {
  let dom;
  let document;
  let window;

  beforeEach(() => {
    const html = fs.readFileSync(
      path.resolve(__dirname, "../../index.html"),
      "utf8"
    );

    dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable" });
    document = dom.window.document;
    window = dom.window;

    // Inject JS logic manually
    window.classifyBp = classifyBp;
    window.computeMAP = computeMAP;
    window.computePulsePressure = computePulsePressure;

    // Fake result element
    const script = document.createElement("script");
    script.textContent = `
      document.getElementById("bp-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const s = Number(document.getElementById("sys").value);
        const d = Number(document.getElementById("dia").value);
        const cat = classifyBp(s, d);
        const map = computeMAP(s, d).toFixed(1);
        document.getElementById("result").textContent = "Category: " + cat + " | MAP: " + map;
      });
    `;
    document.body.appendChild(script);
  });

  it("updates result text after user submits values", () => {
    const sys = document.getElementById("sys");
    const dia = document.getElementById("dia");
    const form = document.getElementById("bp-form");
    const result = document.getElementById("result");

    sys.value = "120";
    dia.value = "80";

    form.dispatchEvent(new dom.window.Event("submit"));

    expect(result.textContent).toContain("Category: Elevated");
    expect(result.textContent).toContain("MAP: 93.3");
  });
});
