import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from 'typescript-eslint';


export default [
  {
    files: ['**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: globals.browser,
    },
    rules: {
      'no-console': 'warn',
      'eqeqeq': 'error',
      'curly': 'error',
      'quotes': ['error', 'single'],
      'semi': ['error', 'always'],
    },
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
];

