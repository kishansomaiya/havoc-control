import { extendedTest, expect } from '@utils/authFixture';
import { PortfolioList } from '@components/PortfolioList';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioItemMenuDropDown } from '@components/PortfolioItemMenuDropDown';
import { EditPortfolioPage } from '@pages/EditPortfolioPage';
import { EditSettings } from '@components/EditSettings';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';
import { parseCsvFile } from '@utils/parseCsvFile';
import path from 'path';
import { HomePage } from '@pages/HomePage';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const test = extendedTest.extend<{
  portfolioList: PortfolioList;
  createPortfolioPage: CreatePortfolioPage;
  portfolioItem: PortfolioItem;
  portfolioItemMenuDropDown: PortfolioItemMenuDropDown;
  editPortfolioPage: EditPortfolioPage;
  homepage: HomePage;
  editSettingsTab: EditSettings;
}>({
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
  createPortfolioPage: async ({ page }, use) => {
    await use(new CreatePortfolioPage(page));
  },
  portfolioItem: async ({ page }, use) => {
    await use(new PortfolioItem(page));
  },
  portfolioItemMenuDropDown: async ({ page }, use) => {
    await use(new PortfolioItemMenuDropDown(page));
  },
  editPortfolioPage: async ({ page }, use) => {
    await use(new EditPortfolioPage(page));
  },
  homepage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  editSettingsTab: async ({ page }, use) => {
    await use(new EditSettings(page));
  },
});

test.describe('Portfolio context menu - Edit', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.0.0'].portfolioName;
  const dataSetVersion = PORTFOLIO_CONFIGS['v3.0.0'].dataSetVersion;

  test.beforeEach(async ({ homepage }) => {
    await homepage.navigateByURL();
  });

  test('Verify portfolio edit option', async ({
    portfolioList,
    portfolioItem,
    portfolioItemMenuDropDown,
    editPortfolioPage,

    editSettingsTab,
    page,
  }) => {
    test.setTimeout(200000);

    const fileName = 'CSV_3_cities.csv';
    const qtyText = 'Showing 1 Results';

    const filePath = path.resolve(`./fixtures/${fileName}`);
    const locationsData = await parseCsvFile(filePath);
    const locationsQty = locationsData.length;


    const now = new Date();
    const formattedDateTime = now.getTime();

    const updatedPortfolioName = `Automation-${formattedDateTime}`;
    const updatedCategoryName = `Automation-${formattedDateTime}`;
    // const updatedDataVersion = '3.0.0'; // TODO: Uncomment when the "Change Analysis Type" checkbox is enabled

    await portfolioList.searchBy(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.clickOnMenu();

    const envUrl = testConfig[ENV].appUrl;
    await portfolioItemMenuDropDown.clickOnEditSettings();
    await editPortfolioPage.validateControls();
    await expect(editPortfolioPage.Title).toContainText(
      'Edit ' + portfolioName,
    );
    await expect(editPortfolioPage.LocationsQty).toContainText(
      `${locationsQty} locations`,
    );
    await expect(editSettingsTab.PortfolioNameInputField).toHaveValue(
      portfolioName,
    );

    await expect(
      editSettingsTab.DataVersionDropDownField.locator('input'),
    ).toHaveValue(dataSetVersion);

    await editSettingsTab.PortfolioNameInputField.clear();
    await editSettingsTab.PortfolioNameInputField.fill(updatedPortfolioName);
    await expect(editSettingsTab.PortfolioNameInputField).toHaveValue(
      updatedPortfolioName,
    );

    await editSettingsTab.CategoryInputField.clear();
    await editSettingsTab.CategoryInputField.fill(updatedCategoryName);
    await editSettingsTab.page
      .getByRole('option', { name: `Add "${updatedCategoryName}"` })
      .isVisible();
    await editSettingsTab.page
      .getByRole('option', { name: `Add "${updatedCategoryName}"` })
      .click();
    await expect(editSettingsTab.CategoryInputField).toHaveValue(
      updatedCategoryName,
    );

    await expect(editPortfolioPage.SaveButton).toBeVisible();
    await editPortfolioPage.SaveButton.click();
    await editPortfolioPage.SavingProgressText.waitFor({
      state: 'hidden',
    });
    expect(page.url()).toMatch(envUrl);
    await portfolioList.searchBy(updatedPortfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await expect(portfolioItem.PortfolioName).toHaveText(updatedPortfolioName);

    await portfolioList.searchBy(updatedCategoryName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.CategoryName).toBeVisible();
    await expect(portfolioItem.CategoryName).toHaveText(updatedCategoryName);
  });
});
