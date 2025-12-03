import { readFileSync } from "fs";
import { resolve } from "path";

describe("Lint-like rules", () => {
  it("UI should not use innerHTML anywhere", () => {
    const uiPath = resolve("ui.js");
    const contents = readFileSync(uiPath, "utf8");

    expect(contents.includes("innerHTML")).toBe(false);
  });

  it("App logic should not contain console.log", () => {
    const appPath = resolve("app.js");
    const contents = readFileSync(appPath, "utf8");

    expect(contents.includes("console.log")).toBe(false);
  });
});
