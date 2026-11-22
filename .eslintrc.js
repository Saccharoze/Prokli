module.exports = {
  root: true,
  extends: 'expo',
  ignorePatterns: ['node_modules/', '.expo/', 'dist/'],
  overrides: [{ files: ['*.config.js', '.eslintrc.js'], env: { node: true } }],
};
