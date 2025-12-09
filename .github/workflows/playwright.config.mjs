// playwright.config.mjs
import { defineConfig } from '@playwright/test';

export default defineConfig({
  // Folder where your Playwright specs live
  testDir: './e2e',

  // Run tests in parallel
  fullyParallel: true,

  // Use a simple base URL; page.goto('/') will hit this
  use: {
    baseURL: 'http://127.0.0.1:5500',
    headless: true,
  },

  // Start a local http-server before running the tests
  webServer: {
    command: 'npx http-server . -p 5500',
    url: 'http://127.0.0.1:5500/index.html',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },

  reporter: [
    ['list'],
    ['html', { outputFolder: 'test-results/e2e-report' }],
  ],
});


