import { defineConfig, devices } from '@playwright/test';

/**
 * Playwright configuration for Montana Hardcore Inventory E2E testing
 * Cross-browser testing with mobile emulation and Vite integration
 */
export default defineConfig({
  // Test directory
  testDir: './tests',

  // Run tests in files in parallel
  fullyParallel: true,

  // Fail the build on CI if you accidentally left test.only in the source code
  forbidOnly: !!process.env.CI,

  // Retry on CI only
  retries: process.env.CI ? 2 : 0,

  // Opt out of parallel tests on CI
  workers: process.env.CI ? 1 : undefined,

  // Reporter to use
  reporter: [
    ['html'],
    ['json', { outputFile: 'test-results/results.json' }],
    process.env.CI ? ['github'] : ['list'],
  ],

  // Global test timeout
  timeout: 30 * 1000,

  // Expect timeout for assertions
  expect: {
    timeout: 5 * 1000,
  },

  // Shared settings for all tests
  use: {
    // Base URL for tests
    baseURL: 'http://localhost:3000',

    // Take screenshot on failure
    screenshot: 'only-on-failure',

    // Disable video recording to avoid ffmpeg dependency
    video: 'off',

    // Disable trace recording to avoid ffmpeg dependency
    trace: 'off',

    // Ignore HTTPS errors
    ignoreHTTPSErrors: true,

    // Permissions for localStorage access
    permissions: ['storage-access'],

    // Storage state for clean test isolation
    storageState: { cookies: [], origins: [] },
  },

  // Configure projects for Chromium only for simplified testing
  projects: [
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        // Use system Google Chrome browser
        executablePath: '/usr/bin/google-chrome',
        launchOptions: {
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        },
      },
    },
  ],

  // Local dev server setup for Vite integration
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:3000',
    reuseExistingServer: true, // Always reuse existing server for development
    timeout: 120 * 1000,
  },
});
