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
      // SSR 마운트 가드(setMounted)와 localStorage 초기 로드는 useEffect에서
      // setState가 불가피한 정당한 패턴이라 이 규칙은 끔.
      "react-hooks/set-state-in-effect": "off",
    },
  },
]);

export default eslintConfig;
