import { chromium } from 'playwright';
import assert from 'node:assert';

async function run() {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  // 🔹 Adjust this if you serve the app on a different port / path
  // For example: http://127.0.0.1:5500/index.html
  await page.goto('http://127.0.0.1:5500/index.html');

  // High BP scenario
  await page.fill('#sys', '140');
  await page.fill('#dia', '80');
  await page.click('button[type="submit"]');

  const highText = await page.textContent('#result');
  assert.match(highText, /Category:\s*High/i);

  // Ideal BP scenario
  await page.fill('#sys', '100');
  await page.fill('#dia', '65');
  await page.click('button[type="submit"]');

  const idealText = await page.textContent('#result');
  assert.match(idealText, /Category:\s*Ideal/i);

  console.log('✅ E2E tests passed: High + Ideal scenarios');

  await browser.close();
}

// Run and handle errors clearly (so CI can fail properly)
run().catch((err) => {
  console.error('❌ E2E tests failed');
  console.error(err);
  process.exit(1);
});
