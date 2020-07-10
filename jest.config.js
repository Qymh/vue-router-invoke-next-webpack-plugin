module.exports = {
  preset: 'ts-jest',
  moduleFileExtensions: ['js', 'ts'],
  testMatch: ['**/tests/**/*.spec.ts'],
  collectCoverageFrom: ['src/**/*.ts'],
  coverageDirectory: 'coverage',
  collectCoverage: true,
  testEnvironment: 'node',
  globals: {
    __TEST__: true
  }
};
