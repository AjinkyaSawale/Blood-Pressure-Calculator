import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Visit the app
    await page.goto("http://127.0.0.1:5500/index.html");

    // Fill valid MAP-checking values
    await page.fill("#sys", "120");
    await page.fill("#dia", "80");

    // Submit
    await page.click("button[type=submit]");
    await page.waitForTimeout(200);

    const result = await page.$eval("#result", el => el.innerText);

    // --- Existing checks ---
    if (!result.includes("Category")) {
      throw new Error("Category missing in UI.");
    }
    if (!result.includes("MAP")) {
      throw new Error("MAP value missing in UI.");
    }

    // --- NEW TEST: MAP formatting (one decimal, mmHg present) ---
    const mapRegex = /MAP:\s*\d{2,3}\.\d\s*mmHg/;  
    if (!mapRegex.test(result)) {
      throw new Error(
        `MAP formatting incorrect. Got: "${result}" but expected like "MAP: 93.3 mmHg".`
      );
    }

    console.log("E2E tests passed: Category + MAP + MAP formatting");
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
