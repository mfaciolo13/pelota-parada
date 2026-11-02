import js from "@eslint/js";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

export default defineConfig([
  { ignores: ["**/dist/**", "**/node_modules/**", "**/.expo/**", "**/expo-env.d.ts"] },
  js.configs.recommended,
  tseslint.configs.recommended,
]);
