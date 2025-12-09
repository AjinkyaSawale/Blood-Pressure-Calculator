import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto("http://127.0.0.1:5500/index.html");

    // Low BP: 85/55 → Category: Low
    await page.fill("#sys", "85");
    await page.fill("#dia", "55");
    await page.click("button[type=submit]");
    await page.waitForTimeout(200);

    const text = await page.$eval("#result", el => el.innerText);

    if (!text.includes("Low")) {
      throw new Error(`Expected Low BP, got: ${text}`);
    }

    console.log("Low BP E2E test passed ✔");
  } catch (err) {
    console.error("Low BP E2E test failed");
    console.error(err);
    process.exit(1);
  } finally {
    await page.close();
    await browser.close();
  }
}

run();
