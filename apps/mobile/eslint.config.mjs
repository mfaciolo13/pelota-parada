import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import expo from "eslint-config-expo/flat.js";
import tseslint from "typescript-eslint";

export default defineConfig([
  js.configs.recommended,
  tseslint.configs.recommended,
  expo,
  { ignores: ["dist/*", ".expo/*", "expo-env.d.ts", "eslint.config.mjs"] },
]);
