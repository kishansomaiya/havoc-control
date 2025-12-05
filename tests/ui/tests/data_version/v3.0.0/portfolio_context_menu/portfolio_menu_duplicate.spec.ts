import { extendedTest, expect } from '@utils/authFixture';
import { HomePage } from '@pages/HomePage';
import { PortfolioList } from '@components/PortfolioList';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { EditPortfolioPage } from '@pages/EditPortfolioPage';
import { EditSettings } from '@components/EditSettings';
import { ImportDataTab } from '@components/ImportData';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioItemMenuDropDown } from '@components/PortfolioItemMenuDropDown';
import { Page } from '@playwright/test';
import path from 'path';
import { parseCsvFile } from '@utils/parseCsvFile';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const test = extendedTest.extend<{
  page: Page;
  homepage: HomePage;
  portfolioList: PortfolioList;
  createPortfolioPage: CreatePortfolioPage;
  editPortfolioPage: EditPortfolioPage;
  importDataTab: ImportDataTab;
  editSettingsTab: EditSettings;
  portfolioItem: PortfolioItem;
  portfolioItemMenuDropDown: PortfolioItemMenuDropDown;
}>({
  homepage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
  createPortfolioPage: async ({ page }, use) => {
    await use(new CreatePortfolioPage(page));
  },
  editPortfolioPage: async ({ page }, use) => {
    await use(new EditPortfolioPage(page));
  },
  importDataTab: async ({ page }, use) => {
    await use(new ImportDataTab(page));
  },
  editSettingsTab: async ({ page }, use) => {
    await use(new EditSettings(page));
  },
  portfolioItem: async ({ page }, use) => {
    await use(new PortfolioItem(page));
  },
  portfolioItemMenuDropDown: async ({ page }, use) => {
    await use(new PortfolioItemMenuDropDown(page));
  },
});

test.describe('Portfolio context menu - Duplicate', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.0.0'].portfolioName;
  const dataSetVersion = PORTFOLIO_CONFIGS['v3.0.0'].dataSetVersion;

  test.beforeEach(async ({ homepage }) => {
    await homepage.navigateByURL();
  });

  test('Verify portfolio duplicate option', async ({
    portfolioList,
    portfolioItem,
    portfolioItemMenuDropDown,
    editPortfolioPage,
    editSettingsTab,
    page,
  }) => {
    test.setTimeout(200000);

    const qtyText = 'Showing 1 Results';
    const fileName = 'CSV_3_cities.csv';

    const filePath = path.resolve(`./fixtures/${fileName}`);
    const locationsData = await parseCsvFile(filePath);
    const locationsQty = locationsData.length;


    const now = new Date();
    const formattedDateTime = now.getTime();

    const updatedPortfolioName = `Automation-${formattedDateTime}`;
    const updatedCategoryName = `Cat-Automation-${formattedDateTime}`;
    const updatedDataVersion = '3.0.0';

    await portfolioList.searchBy(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.clickOnMenu();
    const envUrl = testConfig[ENV].appUrl;
    await portfolioItemMenuDropDown.clickOnDuplicate();

    await editPortfolioPage.validateDuplicateControls();
    await expect(editPortfolioPage.Title).toContainText(
      'Duplicate ' + portfolioName,
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
    await editPortfolioPage.validateEnabledAnalysisTypes();
    await expect(editSettingsTab.PerilAndScoresRadioButton).toBeChecked();

    // Update data for the Duplicated Portfolio
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

    await editSettingsTab.setDataVersion('3.0.0');
    await expect(
      editSettingsTab.DataVersionDropDownField.locator('input'),
    ).toHaveValue(updatedDataVersion);

    await expect(editPortfolioPage.CreateDuplicateButton).toBeVisible();
    await editPortfolioPage.CreateDuplicateButton.click();
    await editSettingsTab.CreatingProgressText.waitFor({
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

    await portfolioItem.deletePortfolio(updatedPortfolioName);
  });
});
