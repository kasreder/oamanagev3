import path from 'node:path';
import { fileURLToPath } from 'node:url';

import js from '@eslint/js';
import globals from 'globals';
import typescriptParser from '@typescript-eslint/parser';
import typescriptPlugin from '@typescript-eslint/eslint-plugin';
import prettierPlugin from 'eslint-plugin-prettier';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const typeScriptRecommendedRules = {
  ...typescriptPlugin.configs.recommended.rules,
  ...typescriptPlugin.configs['recommended-requiring-type-checking'].rules,
};

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: typescriptParser,
      parserOptions: {
        project: path.resolve(__dirname, './tsconfig.json'),
        tsconfigRootDir: __dirname,
        sourceType: 'module',
      },
      globals: {
        ...globals.node,
        ...globals.es2021,
        ...globals.jest,
      },
    },
    plugins: {
      '@typescript-eslint': typescriptPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...typeScriptRecommendedRules,
      '@typescript-eslint/no-misused-promises': [
        'error',
        {
          checksVoidReturn: {
            attributes: false,
          },
        },
      ],
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/no-floating-promises': 'error',
      'prettier/prettier': 'error',
    },
  },
];
