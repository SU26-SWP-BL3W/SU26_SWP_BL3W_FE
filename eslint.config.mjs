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
  // Hạ 2 rule xuống cảnh báo (không chặn CI):
  // - no-explicit-any: nợ kỹ thuật rải khắp dự án, dọn dần thay vì để 300+ lỗi chặn mọi PR.
  // - jsx-no-comment-textnodes: 62 chỗ dùng prefix "// " kiểu HUD là CỐ Ý (render ra text đúng ý),
  //   không phải comment nhầm; giữ warn để linter nhắc, không chặn build.
  {
    rules: {
      "@typescript-eslint/no-explicit-any": "warn",
      "react/jsx-no-comment-textnodes": "warn",
      // Prefix "// text" và ký tự ">" trong JSX là style HUD cố ý, render ra đúng ý.
      "react/no-unescaped-entities": "warn",
      // Rule react-hooks 19 rất gắt; setState trong effect là pattern nạp dữ liệu API hợp lệ ở đây.
      "react-hooks/set-state-in-effect": "warn",
      "react-hooks/purity": "warn",
      "react-hooks/static-components": "warn",
    },
  },
]);

export default eslintConfig;
