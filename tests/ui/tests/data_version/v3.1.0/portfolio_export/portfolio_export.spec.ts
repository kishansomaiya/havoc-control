import { extendedTest, expect } from '@utils/authFixture';
import { HomePage } from '@pages/HomePage';
import { PortfolioList } from '@components/PortfolioList';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { PortfolioSlrModal } from '@components/PortfolioSlrModal';
import { ExportPortfolioMenuDropDown } from '@components/ExportPortfolioMenuDropDown';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const test = extendedTest.extend<{
  homepage: HomePage;
  portfolioList: PortfolioList;
  createPortfolioPage: CreatePortfolioPage;
  portfolioInformation: PortfolioInformation;
  portfolioItem: PortfolioItem;
  portfolioSlrModal: PortfolioSlrModal;
  exportPortfolioMenuDropDown: ExportPortfolioMenuDropDown;
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
  portfolioInformation: async ({ page }, use) => {
    await use(new PortfolioInformation(page));
  },
  portfolioItem: async ({ page }, use) => {
    await use(new PortfolioItem(page));
  },
  portfolioSlrModal: async ({ page }, use) => {
    await use(new PortfolioSlrModal(page));
  },
  exportPortfolioMenuDropDown: async ({ page }, use) => {
    await use(new ExportPortfolioMenuDropDown(page));
  },
});

test.describe('Export Portfolio', () => {
  const qtyText = 'Showing 1 Results';
  const portfolioName = PORTFOLIO_CONFIGS['v3.1.0'].portfolioName;

  test.beforeEach(
    'Navigate to Homepage',
    async ({ homePage, portfolioInformation }) => {
      await homePage.navigateByURL();
      await portfolioInformation.waitForResultSet();
    },
  );

  test('Export: Standard - Perils', async ({
    portfolioList,
    portfolioItem,
    portfolioInformation,
    exportPortfolioMenuDropDown,
  }) => {
    await portfolioList.searchBy(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.PortfolioName.click();
    await portfolioInformation.clickOnExportMenu();
    await exportPortfolioMenuDropDown.verifyDownloadedStandardPerils(
      portfolioName,
    );
  });
  test('Export: Standard - Scores', async ({
    portfolioList,
    portfolioItem,
    portfolioInformation,
    exportPortfolioMenuDropDown,
  }) => {
    await portfolioList.searchBy(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.PortfolioName.click();
    await portfolioInformation.clickOnExportMenu();
    await exportPortfolioMenuDropDown.verifyDownloadedStandardScores(
      portfolioName,
    );
  });
  test('Export: Standard - Portfolio Metrics', async ({
    portfolioList,
    portfolioItem,
    portfolioInformation,
    exportPortfolioMenuDropDown,
  }) => {
    await portfolioList.searchBy(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.PortfolioName.click();
    await portfolioInformation.clickOnExportMenu();
    await exportPortfolioMenuDropDown.verifyDownloadedStandardPortfolioMetrics(
      portfolioName,
    );
  });
  test('Export: Enhanced - Perils', async ({
    portfolioList,
    portfolioItem,
    portfolioInformation,
    exportPortfolioMenuDropDown,
  }) => {
    await portfolioList.searchBy(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.PortfolioName.click();
    await portfolioInformation.clickOnExportMenu();
    await exportPortfolioMenuDropDown.verifyDownloadedEnhancedPerils(
      portfolioName,
    );
  });
  test('Export: Enhanced - Scores', async ({
    portfolioList,
    portfolioItem,
    portfolioInformation,
    exportPortfolioMenuDropDown,
  }) => {
    await portfolioList.searchBy(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.PortfolioName.click();
    await portfolioInformation.clickOnExportMenu();
    await exportPortfolioMenuDropDown.verifyDownloadedEnhancedScores(
      portfolioName,
    );
  });
});
