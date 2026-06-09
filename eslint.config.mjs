import { dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { FlatCompat } from "@eslint/eslintrc";
import eslintConfigPrettier from "eslint-config-prettier";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  // Disable ESLint rules that conflict with Prettier (must come last).
  eslintConfigPrettier,
  {
    ignores: ["node_modules/**", ".next/**", "out/**", "archive/**"],
  },
];

export default eslintConfig;
