import js from "@eslint/js";
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
    ],
    plugins: { js, functional },
    extends: [
      js.configs.recommended,
      tseslint.configs.recommendedTypeChecked,
      tseslint.configs.strictTypeChecked,
      tseslint.configs.stylisticTypeChecked
    ],
    languageOptions: {
      parserOptions: {
        projectService: true
      },
    },
    rules: {
      "indent": ["warn", "tab"]
    }
  },
  {
    files: [
      "src/scripts/ts/*.ts"
    ],
    ignores: [
      "src/scripts/ts/index.ts"
    ],
    plugins: { functional },
    extends: [
      functional.configs.recommended,
      functional.configs.stylistic,
      functional.configs.externalVanillaRecommended,
      functional.configs.externalTypeScriptRecommended
    ],
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
]);
