module.exports = {
  env: {
    browser: true,
    es2021: true,
  },
  extends: 'airbnb-base',
  overrides: [
    {
      env: {
        node: true,
      },
      files: [
        '.eslintrc.{js,cjs}',
      ],
      parserOptions: {
        sourceType: 'script',
      },
    },
  ],
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  rules: {
    'max-len': 'off',
    'import/prefer-default-export': 'off',
    'object-curly-newline': 'off',
    'consistent-return': 'off',
    'newline-per-chained-call': 'off',
    'no-plusplus': 'off',
  },
};
