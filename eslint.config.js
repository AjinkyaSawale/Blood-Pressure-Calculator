// eslint.config.js
import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Default config for browser app code (app.js, etc.)
  {
    ...js.configs.recommended,
    files: ["*.js"],
    ignores: ["node_modules/**", "coverage/**", "test-results/**"],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      sourceType: "module",
      globals: {
        // Browser globals like window, document
        ...globals.browser,
      },
    },
  },

  // Vitest unit tests (tests/unit)
  {
    ...js.configs.recommended,
    files: ["tests/unit/**/*.{js,mjs,cjs}"],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      sourceType: "module",
      globals: {
        // Node-style globals + Vitest (describe, it, expect, etc.)
        ...globals.node,
        ...globals.vitest,
      },
    },
  },

  // Node-based scripts: E2E tests + workflow helpers
  {
    ...js.configs.recommended,
    files: [
      "e2e/**/*.{js,mjs,cjs}",
      ".github/workflows/**/*.{js,mjs,cjs}",
    ],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      sourceType: "module",
      globals: {
        // Node environment: process, __dirname, etc.
        ...globals.node,
      },
    },
  },
]);

