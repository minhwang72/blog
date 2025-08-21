import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      "no-unused-vars": "warn", // 사용되지 않는 변수 경고
      "@typescript-eslint/no-explicit-any": "warn", // any 타입 사용 시 경고  
      "react-hooks/exhaustive-deps": "warn", // useEffect 의존성 배열 검사
      "react/no-unescaped-entities": "off" // JSX에서 따옴표 등 허용
    },
  },
];

export default eslintConfig;
