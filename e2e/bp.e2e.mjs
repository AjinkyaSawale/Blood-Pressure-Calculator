import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Serve the local app
    await page.goto("http://127.0.0.1:5500/index.html");

    // Fill values
    await page.fill("#sys", "120");
    await page.fill("#dia", "80");

    // Click calculate
    await page.click("button[type=submit]");

    // Wait a moment for DOM update
    await page.waitForTimeout(200);

    // Read result text
    const resultText = await page.$eval("#result", el => el.innerText);

    if (!resultText.includes("Category")) {
      throw new Error("Category missing from UI.");
    }

    // NEW: ensure MAP appears
    const html = await page.content();
    if (!html.includes("MAP")) {
      throw new Error("MAP value not displayed in UI.");
    }

    console.log("E2E tests passed: Category + MAP validation");
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
