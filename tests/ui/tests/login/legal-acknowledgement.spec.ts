// tests/ui/tests/login/Legal-acknowledgement.non-authenticated.spec.ts

import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { LegalNoticeModal } from '@components/LegalNoticeModal';
import { HomePage } from '@pages/HomePage';
import { Header } from '@components/Header';
import { verifyNewPage } from '@utils/verifyNewPage';
import { PortfolioList } from '@components/PortfolioList';
import { testConfig } from 'testConfig';

const test = baseTest.extend<{
  loginPage: LoginPage;
  legalNoticeModal: LegalNoticeModal;
  homePage: HomePage;
  header: Header;
  portfolioList: PortfolioList;
}>({
  loginPage: async ({ page, context }, use) => {
    await context.clearCookies();
    await use(new LoginPage(page));
  },
  legalNoticeModal: async ({ page }, use) => {
    await page.evaluate(() => localStorage.clear());
    await use(new LegalNoticeModal(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
});

test.describe('Legal Acknowledgement(Consent popup)', () => {
  test.beforeEach(async ({ loginPage }) => {
    await test.step(`Navigate to the Application`, async () => {
      await loginPage.navigateByURL();
    });

    await test.step(`Login to the application`, async () => {
      await loginPage.loginToApplication(
        testConfig.dev.username,
        testConfig.dev.password,
      );
    });
  });

  test(`Should have the correct elements`, async ({
    legalNoticeModal,
    portfolioList,
    header,
  }) => {
    await test.step('On the popup', async () => {
      await legalNoticeModal.validateControls();
    });

    await test.step('On the page background', async () => {
      await expect(header.Logo).toBeAttached();
      await expect(header.Title).toBeAttached();
      await expect(header.WelcomeBack).not.toBeAttached();
      await expect(header.KnowledgeBaseBttn).not.toBeAttached();
      await expect(portfolioList.YourPortfolios).not.toBeAttached();
    });
  });

  test(`Should open a 'Jupiter Privacy Policy' link in a new tab`, async ({
    legalNoticeModal,
    context,
  }) => {
    const action = legalNoticeModal.JupiterPrivacyPolicy.click();
    const redirectUrl = legalNoticeModal.JupiterPrivacyPolicyUrl;
    await verifyNewPage(context, () => action, redirectUrl);
  });

  test(`Should be able to DECLINE the Legal Acknowledgement`, async ({
    page,
    legalNoticeModal,
    loginPage,
  }) => {
    await test.step('Clear local storage', async () => {
      await page.evaluate(() => localStorage.clear());
    });

    await test.step('Log Out', async () => {
      await legalNoticeModal.declineAgreementPolicy();
    });

    await test.step(`Verify User go back to Login page`, async () => {
      await expect(loginPage.SignInText).toBeVisible();
      await expect(loginPage.EmailAddressInput).toBeVisible();
      await expect(loginPage.ContinueBttn).toBeVisible();
    });
  });

  test(`Should be able to Accept the Legal Acknowledgement`, async ({
    legalNoticeModal,
    header,
  }) => {
    await test.step('Confirm', async () => {
      await legalNoticeModal.confirmAgreementPolicy();
    });

    await test.step(`Verify User is logged in and navigated to the Homepage`, async () => {
      await header.validateHeaderControls();
    });
  });
});
