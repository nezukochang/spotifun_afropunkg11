module.exports = {
  root: true,
  extends: '@react-native',
  rules: {
    '@typescript-eslint/no-unused-vars': 'warn',
    'react-hooks/exhaustive-deps': 'warn',
    'react-native/no-inline-styles': 'off',
    'react/no-unstable-nested-components': 'off',
    '@typescript-eslint/no-shadow': 'off',
  },
  overrides: [
    {
      files: ['jest.setup.js', '__tests__/**/*.tsx'],
      env: {
        jest: true,
      },
    },
  ],
};
