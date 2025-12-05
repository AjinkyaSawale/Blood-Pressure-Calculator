import { expect } from "vitest";
import { execSync } from "node:child_process";

describe("Security: dependency vulnerabilities", () => {
  it("should not have critical vulnerabilities", () => {
    const output = execSync("npm audit --json").toString();
    const audit = JSON.parse(output);

    const critical = audit.metadata.vulnerabilities.critical;

    expect(critical).toBe(0);
  });
});
