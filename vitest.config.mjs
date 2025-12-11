// vitest.config.mjs
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "jsdom",
    exclude: ["e2e/**"],
    coverage: {
      reporter: ["text", "lcov"], // still feeds Sonar + console
    },
    reporters: [
      "default",
      [
        "junit",
        {
          outputFile: "test-results/vitest-junit.xml", // <--- JUnit file
        },
      ],
    ],
  },
});
