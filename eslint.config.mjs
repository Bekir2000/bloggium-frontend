import { FlatCompat } from "@eslint/eslintrc";
import { dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
  {
    // 1. Files to completely ignore
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "src/api/generated/**", // Ignores the auto-generated code
    ],
    // 2. Rules to relax (Turn errors into warnings or off)
    rules: {
      "@typescript-eslint/no-explicit-any": "off", // Allows 'any' type
      "@typescript-eslint/no-unused-vars": "warn", // Warns (doesn't fail) on unused vars
      "@typescript-eslint/ban-ts-comment": "off", // Allows @ts-ignore
      "react/no-unescaped-entities": "off", // Allows "Don't" without escaping
      "@next/next/no-img-element": "off", // Allows normal <img> tags
    },
  },
];

export default eslintConfig;
