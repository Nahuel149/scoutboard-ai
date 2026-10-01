import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [...nextVitals, ...nextTypescript, { ignores: [".portfolio-site/**", "test-results/**", "playwright-report/**"] }];

export default eslintConfig;
