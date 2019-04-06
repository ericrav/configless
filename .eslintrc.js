module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'airbnb-base', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    sourceType: 'module',
    project: './tsconfig.json',
    tsconfigRootDir: './',
  },
  plugins: ['@typescript-eslint', 'import'],
  rules: {
    '@typescript-eslint/ban-types': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/indent': ['error', 2],
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false }],
    'class-methods-use-this': 'off',
    'consistent-return': 'off',
    'dot-notation': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/no-unresolved': ['error', { ignore: ['^serverless'] }],
    'import/prefer-default-export': 'off',
    'linebreak-style': ['error', 'unix'],
    'no-param-reassign': 'off',
    'no-plusplus': ['error', { "allowForLoopAfterthoughts": true }],
    'no-restricted-syntax': 'off',
    'no-underscore-dangle': 'off',
    'no-use-before-define': 'off',
    quotes: ['error', 'single'],
    semi: ['error', 'always'],
  },
  settings: {
    'import/parsers': {
      '@typescript-eslint/parser': ['.ts', '.tsx'],
    },
    'import/resolver': {
      typescript: {}, // default to use .tsconfig
    },
  },
};
