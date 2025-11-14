import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Main config for all JS files (app, etc.)
  {
    ...js.configs.recommended,
    files: ["**/*.{js,mjs,cjs}"],
    ignores: ["node_modules/**", "coverage/**"],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      sourceType: "module",
      globals: {
        // Browser globals like window, document, etc.
        ...globals.browser,
      },
    },
  },

  // Extra config for tests (Vitest)
  {
    files: ["tests/**/*.{js,mjs,cjs}"],
    languageOptions: {
      ...js.configs.recommended.languageOptions,
      sourceType: "module",
      globals: {
        // Node-style globals + Vitest globals (describe, it, expect, etc.)
        ...globals.node,
        ...globals.vitest,
      },
    },
  },
]);
