// tests/ui/tests/auth.setup.ts
import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { AUTH_FILE_PATH } from '@lib/constants';
import { HomePage } from '@pages/HomePage';
import { Header } from '@components/Header';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioList } from '@components/PortfolioList';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';

const auth_setup = baseTest.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
  header: Header;
  createPortfolioPage: CreatePortfolioPage;
  portfolioList: PortfolioList;
  portfolioItem: PortfolioItem;
  portfolioInformation: PortfolioInformation;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
  createPortfolioPage: async ({ page }, use) => {
    await use(new CreatePortfolioPage(page));
  },
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
  portfolioItem: async ({ page }, use) => {
    await use(new PortfolioItem(page));
  },
  portfolioInformation: async ({ page }, use) => {
    await use(new PortfolioInformation(page));
  },
});

auth_setup('authenticate', async ({ page, loginPage, header }) => {
  await auth_setup.step(`Navigate to Application`, async () => {
    await loginPage.navigateByURL();
  });

  await auth_setup.step(`Login to application`, async () => {
    await loginPage.loginToApplication();
  });

  await auth_setup.step('Accept Legal Acknowledgement', async () => {
    // Add the local storage item here
    await page.evaluate(() => {
      localStorage.setItem('legalAcknowledged', 'ACCEPTED');
    });
  });

  // Accept the "No Analysis Data" modal to make the pop-up to not appear anymore // TODO: Clear "Local Storage" in the test when need to test this modal
  await auth_setup.step('Accept "No Analysis Data"', async () => {
    await page.evaluate(() => {
      localStorage.setItem('noAnalysisData', 'HIDDEN');
    });
  });

  await auth_setup.step(
    `Verify User is logged in and admin menu is visible`,
    async () => {
      await page.waitForLoadState('load'); // Waits for the page to be fully loaded
      await expect(header.WelcomeBack).toBeVisible();
    },
  );

  // Save the authentication state to a file
  await page.context().storageState({
    path: AUTH_FILE_PATH,
  });
});
