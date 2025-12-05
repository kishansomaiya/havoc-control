// tests/ui/playwright.config.ts
import { defineConfig, devices } from '@playwright/test';
import { testConfig } from './testConfig';
import { AUTH_FILE_PATH } from '@lib/constants';
import dotenv from 'dotenv';
import { combinedProjects } from './configs/playwrightProjects';

// Load environment variables from .env file
dotenv.config();

// Determine which environment to load
export const ENV = process.env.UI_TEST_ENV || 'local';
if (!ENV || ![`local`, `dev`, `stg`, 'prod'].includes(ENV)) {
  console.error(
    `Please provide a correct environment value like "npx cross-env ENV=dev|stg"`,
  );
  process.exit();
}
process.env.API_URL = testConfig[ENV].apiUrl;

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './tests',
  outputDir: './test-results',
  testMatch: '**/*.spec.ts',
  retries: 3,
  expect: { timeout: 30000 },
  //sets timeout for each test case
  timeout: 120 * 1000,
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  // Concise 'list' for CI, default 'html' when running locally
  reporter: [
    process.env.CI ? ['line'] : ['list'],
    ['html', { outputFolder: 'playwright-report', open: 'never' }],
  ],
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    // testIdAttribute: 'data-pw',
    /* Emulates consistent viewport for each page. Defaults to an 1280x720 viewport. */
    viewport: { width: 1280, height: 800 },
    /* Base URL to use in actions like `await page.goto('/')`. */
    baseURL: testConfig[ENV].appUrl,
    // baseURL: "http://localhost:3000",

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    // Setup project
    {
      name: 'auth_setup',
      testMatch: '**/setup/auth.setup.ts',
    },
    ...combinedProjects,
    {
      name: 'individual_test',
      use: {
        storageState: AUTH_FILE_PATH,
        ...devices['Desktop Chrome'],
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
      },
      testMatch: '**/independent_tests/**/*.spec.ts',
      dependencies: ['auth_setup'],
    },
    {
      name: 'login_test',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
      },
      testMatch: '**/login/**/*.spec.ts',
    },
    {
      name: 'no_csrd_user',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
      },
      testMatch: '**/*.no_csrd.spec.ts',
    },
    {
      name: 'role_management_test',
      use: {
        ...devices['Desktop Chrome'],
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure',
      },
      fullyParallel: false,
      testMatch: '**/role-management/**/*.spec.ts',
    },
  ],
});
