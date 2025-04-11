import { dirname } from 'path';
import { fileURLToPath } from 'url';
import { FlatCompat } from '@eslint/eslintrc';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      'no-console': 'warn', // console.log() 사용 시 경고
      'no-unused-vars': 'error', // 사용하지 않는 변수는 에러
      eqeqeq: ['error', 'always'], // === 사용 강제
    },
  },
  ...compat.extends('eslint-config-prettier'),
];

export default eslintConfig;
