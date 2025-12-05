import { extendedTest, expect } from '@utils/authFixture';
import { HomePage } from '@pages/HomePage';
import { PortfolioList } from '@components/PortfolioList';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const test = extendedTest.extend<{
  homepage: HomePage;
  portfolioList: PortfolioList;
  createPortfolioPage: CreatePortfolioPage;
  portfolioItem: PortfolioItem;
  portfolioInformation: PortfolioInformation;
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
  portfolioItem: async ({ page }, use) => {
    await use(new PortfolioItem(page));
  },
  portfolioInformation: async ({ page }, use) => {
    await use(new PortfolioInformation(page));
  },
});

test.describe('Portfolio List', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.0.0'].portfolioName;

  test.beforeEach(
    'Navigate to Homepage',
    async ({ homePage, portfolioInformation }) => {
      await homePage.navigateByURL();
      await portfolioInformation.waitForResultSet();
    },
  );

  test('Validate controls', async ({ portfolioList }) => {
    await portfolioList.validateControls();
    await portfolioList.validateSearchControls();
  });
  test('Verify Search by Portfolio Name', async ({
    portfolioList,
    portfolioItem,
  }) => {
    const qtyText = 'Showing 1 Results';
    await portfolioList.searchBy(portfolioName);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await expect(portfolioItem.PortfolioName).toHaveText(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
  });

  test('Verify Search by Category Name', async ({
    portfolioList,
    portfolioItem,
  }) => {
    const qtyText = 'Showing 1 Results';
    const categoryName = `Cat-${portfolioName}`;
    await portfolioList.searchBy(categoryName);
    await expect(portfolioItem.CategoryName).toBeVisible();
    await expect(portfolioItem.CategoryName).toHaveText(categoryName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
  });

  test('Verify Search - No results', async ({
    portfolioList,
    portfolioItem,
  }) => {
    const qtyText = 'Showing 0 Results';
    const searchText = 'dhdvvagskjjlyqiwu';
    await portfolioList.searchBy(searchText);
    await expect(portfolioItem.PortfolioItemInfo).not.toBeVisible();
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
  });

  test('Verify Search clear icon works', async ({
    portfolioList,
    portfolioItem,
  }) => {
    const qtyText = 'Showing 0 Results';
    const searchText = 'dsyunmlkfniygwuiiu374fsdf';
    await portfolioList.searchBy(searchText);
    await expect(portfolioItem.PortfolioItemInfo).not.toBeVisible();
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await portfolioList.SearchClearIcon.click();
    await expect(portfolioList.SearchInput).not.toHaveValue(searchText);
    await expect(portfolioList.PortfolioListResultsQty).not.toHaveText(qtyText); // some data should exists for this check
    await expect(portfolioItem.PortfolioItemInfo.nth(0)).toBeVisible(); // some data should exists for this check
  });
});
