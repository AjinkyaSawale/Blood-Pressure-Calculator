// tests/security/package.test.js
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, it, expect } from "vitest";

function loadPackageJson() {
  const pkgPath = resolve("package.json");
  const raw = readFileSync(pkgPath, "utf8");
  return JSON.parse(raw);
}

describe("Security scan configuration", () => {
  it("defines an npm script to run security audit (npm audit)", () => {
    const pkg = loadPackageJson();

    expect(pkg.scripts).toBeDefined();
    // We only assert that an 'audit' script exists – CI can call `npm run audit`
    expect(Object.keys(pkg.scripts)).toContain("audit");
    expect(typeof pkg.scripts.audit).toBe("string");
    expect(pkg.scripts.audit.length).toBeGreaterThan(0);
  });

  it("does not use dangerous --force in the audit script", () => {
    const pkg = loadPackageJson();
    const auditScript = pkg.scripts?.audit ?? "";

    // We want audit to fail on issues, not blindly auto-fix with --force
    expect(auditScript).not.toMatch(/--force/);
  });
});

