// tests/ui/tests/Header.authenticated.spec.ts

// import { test as baseTest, expect } from '@playwright/test';
import { extendedTest, expect } from '@utils/authFixture';
import { HomePage } from '@pages/HomePage';
import { Header } from '@components/Header';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';
import { getImageFilenames, __dirname } from '@utils/imageUtils';
import path from 'path';
import { MenuDropDown } from '@components/HeaderMenuDropDown';

const test = extendedTest.extend<{
  homepage: HomePage;
  header: Header;
  menuDropDown: MenuDropDown;
}>({
  homepage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
  menuDropDown: async ({ page }, use) => {
    await use(new MenuDropDown(page));
  },
});

test.describe('Header', () => {
  test.beforeEach(async ({ homepage, page }) => {
    await test.step(`Navigate to the homepage`, async () => {
      // // Define the SVG locator
      // const svgLocator = page.getByTestId('progressIcon');
      // // Wait for the SVG to disappear
      // await svgLocator.waitFor({ state: 'hidden' });
      await homepage.navigateByURL();
      await page.waitForLoadState('load');
    });
  });

  test('Should have logo IMG', async ({ header }) => {
    await expect(header.Logo).toBeVisible({ timeout: 20000 });
  });

  test('Jupiter Logo: On click - redirect to the Homepage', async ({
    header,
  }) => {
    const envUrl = testConfig[ENV].appUrl;
    await header.clickOnTheLogo();
    expect(header.page.url()).toMatch(envUrl);
  });

  test('Should have correct "Title"', async ({ header, page }) => {
    await page.waitForLoadState('load');
    await expect(header.Title).toBeVisible({ timeout: 20000 });
    await expect(header.Title).toHaveText(header.TitleText);
  });

  test('"Knowledge Base" bttn: Should have correct name', async ({
    header,
  }) => {
    await expect(header.KnowledgeBaseBttn).toBeVisible({
      timeout: 20000,
    });
    await expect(header.KnowledgeBaseBttn).toHaveText(
      header.KnowledgeBaseBttnName,
    );
  });

  // TODO: Doesn't work after some changes on the UI. Need fix.
  test.skip('"Knowledge Base" bttn: Should have correct URL and open in a new page', async ({
    header,
  }) => {
    // Get the parent element of the button
    const parentElement = header.KnowledgeBaseBttn.locator('xpath=..');
    await expect(parentElement).toHaveAttribute(
      'href',
      /https:\/\/jupiterintel\.document360\.io\/.*/,
    );
    await expect(parentElement).toHaveAttribute('target', '_blank');
  });

  test('User icon: Should be visible', async ({ header }) => {
    await expect(header.UserIcon).toBeVisible({ timeout: 20000 });
  });

  test('Welcome back: Should have correct text & username', async ({
    header,
  }) => {
    await expect(header.WelcomeBack).toBeVisible({ timeout: 20000 });
    const text = header.WelcomeBackText;
    await expect(header.WelcomeBack).toHaveText(text);
  });

  test('Company Name: Should have correct text', async ({ header }) => {
    await expect(header.CompanyName).toBeVisible({ timeout: 20000 });
    const text = header.CompanyNameText;
    await expect(header.CompanyName).toHaveText(text);
  });

  test('Drop-Down menu: Should be visible', async ({ header }) => {
    await expect(header.DropDownBttn).toBeVisible({ timeout: 20000 });
  });

  test('Drop-Down menu: Should open on click', async ({
    header,
    menuDropDown,
  }) => {
    await expect(header.DropDownBttn).toBeVisible({ timeout: 20000 });
    await header.clickOnDropDown();
    await menuDropDown.validateDropDownControls();
  });
});
