import { chromium } from "playwright";

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    await page.goto("http://127.0.0.1:5500/index.html");

    // Enter invalid values
    await page.fill("#sys", "50");  // below allowed
    await page.fill("#dia", "20");  // below allowed
    await page.click("button[type=submit]");

    await page.waitForTimeout(200);

    const text = await page.$eval("#result", el => el.innerText);

    if (!text.toLowerCase().includes("invalid")) {
      throw new Error("UI did NOT show error message on invalid input.");
    }

    console.log("E2E Error UI test passed");
  } catch (err) {
    console.error("E2E Error UI test failed ");
    console.error(err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

run();
