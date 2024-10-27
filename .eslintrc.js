module.exports = {
  env: {
    node: true,
    es2021: true,
  },
  parser: '@babel/eslint-parser',
  extends: ['airbnb-base', 'plugin:prettier/recommended'],
  parserOptions: {
    requireConfigFile: false,
    ecmaVersion: 2021, // or 'latest' to use the latest ECMAScript version
    sourceType: 'module',
    ecmaFeatures: {
      impliedStrict: true,
    },
  },
  rules: {
    // Customize your ESLint rules here
    'no-console': 'off', // Allow console.log statements
    'prettier/prettier': 'error',
    // Adjust import rules for ES modules
    'import/extensions': [
      'error',
      'ignorePackages',
      {
        js: 'always',
        mjs: 'always',
      },
    ],
  },
  settings: {
    'import/resolver': {
      node: {
        extensions: ['.js', '.mjs'],
      },
    },
  },
};
