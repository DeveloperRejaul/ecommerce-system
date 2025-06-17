/* eslint-disable import/no-extraneous-dependencies */
/* eslint-disable no-underscore-dangle */
import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';
import pluginReact from 'eslint-plugin-react';

import { FlatCompat } from '@eslint/eslintrc';
import path from 'path';
import { fileURLToPath } from 'url';

// mimic CommonJS variables -- not needed if using CommonJS
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,ts,jsx,tsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,
  ...compat.extends('airbnb', 'airbnb/hooks'),
  ...compat.plugins('eslint-plugin-react-compiler'),
  {
    rules: {
      'import/no-unresolved': 'off',
      'import/extensions': 'off',
      'react/jsx-filename-extension': 'off',
      'react/react-in-jsx-scope': 'off',
      'no-param-reassign': 'off',
      'react-compiler/react-compiler': 'error',
      'object-curly-newline': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/click-events-have-key-events': 'off',
      'react/jsx-props-no-spreading': 'off',
      'max-len': 'off',
      'consistent-return': 'off',
      'array-callback-return': 'off',
      // for build
      '@typescript-eslint/no-unused-vars': 'off',
      'no-unused-vars': 'off',
      'no-nested-ternary': 'off',
      'prefer-destructuring': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'react/require-default-props': 'off',
      'import/no-extraneous-dependencies': 'off',
    },
  },
];
