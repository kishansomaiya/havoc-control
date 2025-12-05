import { extendedTest, expect } from '@utils/authFixture';
import { PortfolioList } from '@components/PortfolioList';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioItemMenuDropDown } from '@components/PortfolioItemMenuDropDown';
import { HomePage } from '@pages/HomePage';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const test = extendedTest.extend<{
  portfolioList: PortfolioList;
  createPortfolioPage: CreatePortfolioPage;
  portfolioItem: PortfolioItem;
  portfolioItemMenuDropDown: PortfolioItemMenuDropDown;
  homepage: HomePage;
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
  homepage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

test.describe('Verify portfolio item Menu Drop-Down list', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.0.0'].portfolioName;

  test.beforeEach(async ({ homepage }) => {
    await homepage.navigateByURL();
  });

  test('Verify portfolio item Menu Drop-Down list', async ({
    portfolioList,
    portfolioItem,
    portfolioItemMenuDropDown,
  }) => {
    test.setTimeout(120000);
    const qtyText = 'Showing 1 Results';

    await portfolioList.searchBy(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.clickOnMenu();
    await portfolioItemMenuDropDown.validateControls();
  });
});
