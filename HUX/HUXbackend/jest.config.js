module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/tests/**/*.test.ts'],
  setupFilesAfterEnv: ['./tests/jest.setup.ts'],
  globalSetup: './tests/jest.globalSetup.ts',
  globalTeardown: './tests/jest.globalTeardown.ts',
}; 