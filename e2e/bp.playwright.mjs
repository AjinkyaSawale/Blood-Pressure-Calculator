import { test, expect } from '@playwright/test';

test.describe('Blood Pressure Calculator - E2E', () => {
  test('calculates high blood pressure scenario', async ({ page }) => {
    await page.goto('/');

    await page.fill('#sys', '140');
    await page.fill('#dia', '80');
    await page.click('button[type="submit"]');

    await expect(page.locator('#result')).toHaveText(/Category: High/);
  });

  test('calculates ideal blood pressure scenario', async ({ page }) => {
    await page.goto('/');

    await page.fill('#sys', '100');
    await page.fill('#dia', '65');
    await page.click('button[type="submit"]');

    await expect(page.locator('#result')).toHaveText(/Category: Ideal/);
  });
});
