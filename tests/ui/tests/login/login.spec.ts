// tests/ui/tests/login/Login.non-authenticated.spec.ts
import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { LegalNoticeModal } from '@components/LegalNoticeModal';
import { HomePage } from '@pages/HomePage';
import { Header } from '@components/Header';
import { MenuDropDown } from '@components/HeaderMenuDropDown';
import { testConfig } from 'testConfig';

const test = baseTest.extend<{
  loginPage: LoginPage;
  legalNoticeModal: LegalNoticeModal;
  homePage: HomePage;
  header: Header;
  menuDropDown: MenuDropDown;
}>({
  loginPage: async ({ page, context }, use) => {
    await context.clearCookies();
    await use(new LoginPage(page));
  },
  legalNoticeModal: async ({ page }, use) => {
    await use(new LegalNoticeModal(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
  menuDropDown: async ({ page }, use) => {
    await use(new MenuDropDown(page));
  },
});

test(`Verify User Login and Logout`, async ({
  page,
  loginPage,
  legalNoticeModal,
  header,
  menuDropDown,
}) => {
  await test.step(`Navigate to the Application`, async () => {
    await loginPage.navigateByURL();
  });

  await test.step(`Login to the application`, async () => {
    await loginPage.loginToApplication(
      testConfig.dev.username,
      testConfig.dev.password,
    );
  });

  await test.step('Clear local storage', async () => {
    await page.evaluate(() => localStorage.clear());
  });

  await test.step('Accept Legal Acknowledgement', async () => {
    await legalNoticeModal.confirmAgreementPolicy();
  });

  await test.step(`Verify User is logged in and navigated to page`, async () => {
    await header.validateHeaderControls();
  });

  await test.step(`Verify User Logout`, async () => {
    await header.clickOnDropDown();
    await menuDropDown.clickOnLogOut();
    await expect(header.Header).not.toBeVisible();
  });
});
