import { chromium } from "playwright";
import { spawn } from "child_process";

async function run() {
  // --- Start local server (http-server) ---
  const server = spawn("npx", ["http-server", ".", "-p", "5500"], {
    stdio: "inherit",
    shell: true,
  });

  // Wait for server startup
  await new Promise((resolve) => setTimeout(resolve, 1000));

  const browser = await chromium.launch();
  const page = await browser.newPage();

  try {
    // Open the app
    await page.goto("http://127.0.0.1:5500/index.html");

    // --- Scenario 1: Normal MAP + Category check ---
    await page.fill("#sys", "120");
    await page.fill("#dia", "80");
    await page.click("button[type=submit]");
    await page.waitForTimeout(200);

    const resultText = await page.$eval("#result", (el) => el.innerText);

    if (!resultText.includes("Category")) {
      throw new Error('Expected "Category" in UI result.');
    }

    if (!resultText.includes("MAP")) {
      throw new Error("MAP value not displayed in UI.");
    }

    // --- Scenario 2: Invalid input → expect UI error ---
    await page.fill("#sys", "80");
    await page.fill("#dia", "80");
    await page.click("button[type=submit]");
    await page.waitForTimeout(200);

    const errorText = await page.$eval("#result", (el) => el.innerText);
    if (!errorText.includes("Invalid blood pressure input")) {
      throw new Error(
        `Expected invalid input error message, got: "${errorText}"`
      );
    }

    console.log(
      "E2E tests passed: Category + MAP + error validation"
    );
  } catch (err) {
    console.error("E2E tests failed");
    console.error(err);
    process.exit(1);
  } finally {
    await browser.close();
    server.kill();
  }
}

run();
