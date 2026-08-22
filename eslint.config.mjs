import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      // This rule rejects common, intentional synchronization/fetch effects.
      // Keep exhaustive dependency checking enabled instead.
      "react-hooks/set-state-in-effect": "off",
      // Several authenticated/blob image sources do not have stable dimensions
      // or hosts that can safely pass through the Next image optimizer.
      "@next/next/no-img-element": "off",
    },
  },
]);

export default eslintConfig;
