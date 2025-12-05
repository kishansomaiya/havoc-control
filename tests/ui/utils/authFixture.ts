import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';
import { Header } from '@components/Header';
import { AUTH_FILE_PATH } from '@lib/constants';

// Extend Playwright base test to include the loginPage, homePage, and header fixtures
const extendedTest = baseTest.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
  header: Header;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
});

// Function to re-login user in case of token expiration
async function reLogin({ page, loginPage, header }) {
  try {


    // Clear cookies and storage
    await page.context().clearCookies();

    // Navigate to Application
    await loginPage.navigateByURL();

    // Login to application
    await loginPage.loginToApplication();

    // Set local storage items
    await page.evaluate(() => {
      localStorage.setItem('legalAcknowledged', 'ACCEPTED');
      localStorage.setItem('noAnalysisData', 'HIDDEN');
    });

    // Verify User is logged in and admin menu is visible
    await page.waitForLoadState('load'); // Wait for the page to be fully loaded
    await expect(header.WelcomeBack).toBeVisible();

    // Save the authentication state to a file
    await page.context().storageState({ path: AUTH_FILE_PATH });
  } catch (error) {

  }
}

// Custom fixture to handle token expiration across all tests
extendedTest.beforeEach(async ({ page, loginPage, header }) => {
  // Intercept API responses to detect 401 Unauthorized (token expiration)
  page.on('response', async (response) => {
    if (response.status() === 401) {
      // If token is expired, trigger the re-login process
      await reLogin({ page, loginPage, header });
    }
  });
});

export { extendedTest, expect };
