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

test.describe('Portfolio context menu - Download', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.0.0'].portfolioName;

  test.beforeEach(async ({ homepage }) => {
    await homepage.navigateByURL();
  });

  test('Verify portfolio download option', async ({
    portfolioList,
    portfolioItem,
    portfolioItemMenuDropDown,
  }) => {
    test.setTimeout(200000);

    const qtyText = 'Showing 1 Results';
    const fileName = 'CSV_3_cities.csv';

    await portfolioList.searchBy(portfolioName);

    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.clickOnMenu();
    await portfolioItemMenuDropDown.verifyDownloadedPortfolio(
      portfolioName,
      fileName,
    );
  });
});
