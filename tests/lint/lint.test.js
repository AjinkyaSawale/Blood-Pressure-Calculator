// tests/lint/lint.test.js
import { describe, it, expect } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

describe("Lint-like rules", () => {
  it("ui.js should not use innerHTML", () => {
    const uiPath = resolve("ui.js");
    const src = readFileSync(uiPath, "utf8");

    // We want to avoid dangerously setting HTML
    expect(src).not.toMatch(/innerHTML/);
  });

  it("app.js should not use console.log", () => {
    const appPath = resolve("app.js");
    const src = readFileSync(appPath, "utf8");

    // Keep core logic free of noisy console.log debugging
    expect(src).not.toMatch(/console\.log/);
  });
});

