import js from "@eslint/js";
import globals from "globals";
import tseslint from "typescript-eslint";
import { defineConfig } from "eslint/config";
import functional from "eslint-plugin-functional";

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
    plugins: { js, functional },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked,
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
  {
    files: [
      "src/scripts/ts/rss-modules.ts"
    ],
    plugins: { functional },
    extends: [
      functional.configs.recommended,
      functional.configs.stylistic
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
]);
