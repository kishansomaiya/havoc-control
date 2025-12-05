import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';
import { Header } from '@components/Header';
import { verifyNewPage } from '@utils/verifyNewPage';

const test = baseTest.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
  header: Header;
}>({
  loginPage: async ({ page, context }, use) => {
    await context.clearCookies();
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
});

test.describe('Playwright - Knowledge base', () => {
  test.beforeEach(async ({ loginPage }) => {
    await test.step('Navigate to the Application', async () => {
      await loginPage.navigateByURL();
    });
  });

  test('Verify knowledge base link functions with no auth issues', async ({
    header,
    context,
  }) => {
    await test.step('Wait for Knowledge Base button to be visible and enabled', async () => {
      await expect(header.KnowledgeBaseBttn).toBeVisible();
      await expect(header.KnowledgeBaseBttn).toBeEnabled();
    });

    await test.step('Click Knowledge Base and verify new tab opens with correct URL', async () => {
      const action = header.KnowledgeBaseBttn.click();
      const expectedUrlPart = 'https://jupiterintel.document360.io/';
      await verifyNewPage(context, () => action, expectedUrlPart);
    });

    await test.step('Verify if the logged in user is same as the one in new tab URL', async () => {
      const userNameText = await header.WelcomeBack.textContent();
      const email = userNameText?.split(',')[1]?.trim();
      const [newPage] = context
        .pages()
        .filter((p) => p.url().includes('document360.io'));
      await newPage.click('.profile-btn');
      await newPage.waitForSelector(
        '.nav-bar-profile .profile-details .profile-content .text-body-secondary',
      );
      const kbEmail = await newPage.textContent(
        '.nav-bar-profile .profile-details .profile-content .text-body-secondary',
      );
      expect(email).toBe(kbEmail?.trim());
    });
  });
});
