import { FlatCompat } from '@eslint/eslintrc';
import js from '@eslint/js';
import tsParser from '@typescript-eslint/parser';
import globals from 'globals';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
  allConfig: js.configs.all
});

// Read the Prettier configuration from the JSON file
const prettierConfig = JSON.parse(
  fs.readFileSync(new URL('./.prettierrc.json', import.meta.url), 'utf-8')
);

export default [
  {
    ignores: [
      '**/*.md',
      '**/tmp/**/*',
      '**/*.html',
      '**/*.py',
      '**/*.txt',
      '**/app/**/*',
      '**/dist/**/*',
      '!**/.*.\\{js,cjs,mjs}'
    ]
  },
  ...compat.extends(
    'eslint:recommended',
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended'
  ),
  {
    linterOptions: {
      reportUnusedDisableDirectives: true
    },

    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.amd,
        ...globals.node,
        $: 'readonly',
        jQuery: 'readonly',
        adsbygoogle: 'writable'
      },

      parser: tsParser,
      ecmaVersion: 2020,
      sourceType: 'module'
    },

    rules: {
      'prettier/prettier': ['error', prettierConfig],

      '@typescript-eslint/explicit-function-return-type': 'off',
      'no-unused-vars': 'off',

      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
          caughtErrorsIgnorePattern: '^_'
        }
      ],

      '@typescript-eslint/no-explicit-any': 'off',

      '@typescript-eslint/no-this-alias': [
        'error',
        {
          allowDestructuring: false,
          allowedNames: ['self']
        }
      ],

      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off'
    }
  },
  {
    files: ['**/*.js', '**/*.cjs'],

    rules: {
      '@typescript-eslint/no-var-requires': 'off',
      '@typescript-eslint/no-require-imports': 'off'
    }
  }
];
