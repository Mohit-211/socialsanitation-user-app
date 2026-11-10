const reactNativeConfig = require('@react-native/eslint-config/flat');

module.exports = [
  // Native projects and build output are not linted.
  { ignores: ['android/', 'ios/', 'coverage/'] },
  ...reactNativeConfig,
  {
    // React Native's config runs two Flow rules on .js files, and the Flow plugin it ships
    // does not work with ESLint 9. This project has no Flow code; its .js files are tool configs.
    files: ['**/*.js'],
    rules: {
      'ft-flow/define-flow-type': 'off',
      'ft-flow/use-flow-type': 'off',
    },
  },
];
