const js = require('@eslint/js');
const react = require('eslint-plugin-react');
const babelParser = require('@babel/eslint-parser');

module.exports = [
  {
    // Root config object, specifying plugins and rules
    plugins: {
      react, // Use the plugin object
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    languageOptions: {
      parser: babelParser, // Use the parser here
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    rules: {
      'react/prop-types': 'off',
      'semi': ['error', 'always'],
    },
  },
  {
    // Include your recommended config directly in the flat config array
    plugins: {
      'eslint:recommended': js,
      'plugin:react/recommended': react,
    },
  }
];
