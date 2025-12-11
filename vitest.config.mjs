import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",

    // Only run YOUR tests — not node_modules
    include: [
      "tests/unit/**/*.test.js",
      "tests/ui/**/*.test.js",
      "tests/security/**/*.test.js",
    ],

    // Important fix to stop running autocannon tests
    exclude: [
      "node_modules/**",
      "dist/**",
      "coverage/**",
      "e2e/**",
    ],
  },
});
