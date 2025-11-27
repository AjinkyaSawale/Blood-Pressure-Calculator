import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Open the app
    await page.goto("http://127.0.0.1:5500/index.html");

    // --- Scenario 1: Valid Elevated BP + MAP formatting ---
    await page.fill("#sys", "120");
    await page.fill("#dia", "80");
    await page.click("button[type=submit]");
    await page.waitForTimeout(200);

    const resultText = await page.textContent("#result");

    if (!resultText.includes("Category: Elevated")) {
      throw new Error(
        `Expected Elevated category, got: "${resultText}"`
      );
    }

    if (!resultText.includes("Pulse Pressure: 40 mmHg")) {
      throw new Error(
        `Expected pulse pressure 40 mmHg, got: "${resultText}"`
      );
    }

    if (!resultText.includes("MAP: 93.3 mmHg")) {
      throw new Error(
        `MAP formatting incorrect. Got: "${resultText}" but expected like "MAP: 93.3 mmHg".`
      );
    }

    // --- Scenario 2: Inline error for invalid systolic ---
    // Below minimum (70) – should trigger validation error on Systolic.
    await page.fill("#sys", "50");
    await page.fill("#dia", "80");
    await page.waitForTimeout(150);

    const sysErrorText = await page.textContent("#sys-error");

    if (
      !sysErrorText ||
      !sysErrorText.toLowerCase().includes("between 70 and 190")
    ) {
      throw new Error(
        `Expected systolic validation error, got: "${sysErrorText}"`
      );
    }

    console.log(
      "E2E tests passed: Category + MAP formatting + inline systolic validation"
    );
  } catch (err) {
    console.error("E2E tests failed");
    console.error(err);
    process.exit(1);
  } finally {
    await page.close();
    await browser.close();
  }
}

run();
