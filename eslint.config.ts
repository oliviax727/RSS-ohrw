import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "*.ts",
      "*.js",
      "src/scripts/dist/*",
      "src/scripts/app/*",
      "src/scripts/lib/*",
    ],
  },
  {
    files: [
      "src/scripts/ts/*.ts",
      "src/scripts/types/*.d.ts",
      "src/scripts/entry.js",
    ],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: globals.browser,
    },
  },
  tseslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
]);
