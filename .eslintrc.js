module.exports = {
  env: {
    node: true,
    es6: true,
    jest: true,
  },
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
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
    'comma-dangle': ['error', 'always-multiline'],
    'consistent-return': 'off',
    'dot-location': ['error', 'property'],
    'import/no-extraneous-dependencies': 'off',
    'import/prefer-default-export': 'off',
    'linebreak-style': ['error', 'unix'],
    'no-console': 'warn',
    'no-param-reassign': 'off',
    'no-restricted-syntax': 'off',
    'no-return-await': 'error',
    'no-use-before-define': 'off',
    'no-useless-call': 'off',
    curly: ['error', 'multi-line'],
    eqeqeq: ['error', 'always', { null: 'ignore' }],
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
