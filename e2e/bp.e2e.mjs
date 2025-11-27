import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // ---- Scenario 1: Elevated BP + MAP formatting ----
    await page.goto("http://127.0.0.1:5500/index.html");

    // Fill Elevated values (120 / 80)
    await page.fill("#sys", "120");
    await page.fill("#dia", "80");

    await page.click("button[type=submit]");
    await page.waitForTimeout(200);

    const elevatedText = await page.$eval("#result", (el) => el.innerText);

    if (!elevatedText.includes("Category: Elevated")) {
      throw new Error(
        `Expected 'Category: Elevated' but got:\n"${elevatedText}"`
      );
    }

    if (!elevatedText.includes("MAP: 93.3 mmHg")) {
      throw new Error(
        `MAP formatting incorrect. Got: "${elevatedText}" but expected like "MAP: 93.3 mmHg".`
      );
    }

    // ---- Scenario 2: Low BP flow ----
    // Clear the inputs
    await page.fill("#sys", "");
    await page.fill("#dia", "");

    // Low BP example (85 / 55)
    await page.fill("#sys", "85");
    await page.fill("#dia", "55");

    await page.click("button[type=submit]");
    await page.waitForTimeout(200);

    const lowText = await page.$eval("#result", (el) => el.innerText);

    if (!lowText.includes("Category: Low")) {
      throw new Error(
        `Expected 'Category: Low' but got:\n"${lowText}"`
      );
    }

    console.log("E2E tests passed: Elevated + MAP + Low BP flows");
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

