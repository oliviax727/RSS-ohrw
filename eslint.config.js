import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";

export default defineConfig([
  {
    ignores: [
      "bundle.js",
      "index.js",
      "src/scripts/dist/*",
      "src/scripts/app/*",
    ],
  },
  {
    files: [
      "src/scripts/ts/*.{js,mjs,cjs,ts,mts,cts}",
      "src/scripts/entry.js"
    ],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  tseslint.configs.strict,
  tseslint.configs.stylistic,
]);
