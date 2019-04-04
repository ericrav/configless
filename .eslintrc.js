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
    '@typescript-eslint/no-use-before-define': ['error', { functions: false, classes: false }],
    'consistent-return': 'off',
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'linebreak-style': ['error', 'unix'],
    'no-console': 'off',
    'no-param-reassign': 'off',
    'no-restricted-syntax': 'off',
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
