export default {
  testEnvironment: 'jsdom',
  testMatch: ['<rootDir>/__tests__/**/*.test.js'],
  setupFiles: ['<rootDir>/__tests__/setup.js'],
  transform: {
    '^.+\\.js$': ['babel-jest', {
      babelrc: false,
      configFile: false,
      presets: [['@babel/preset-env', { targets: { node: 'current' } }]]
    }]
  }
};
