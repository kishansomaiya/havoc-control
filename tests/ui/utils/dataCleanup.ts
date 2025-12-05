// tests/ui/tests/dataCleanup.ts
import { extendedTest } from '@utils/authFixture';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioConfig } from '@lib/portfolio_configs.constants';

export const testDataCleanup = extendedTest.extend<{
  portfolioItem: PortfolioItem;
}>({
  portfolioItem: async ({ page }, use) => {
    await use(new PortfolioItem(page));
  },
});

testDataCleanup.beforeEach('Navigate to Homepage', async ({ homePage }) => {
  await homePage.navigateByURL();
});

export const deleteCreatedPortfolio = async (
  config: PortfolioConfig,
  portfolioItem: PortfolioItem,
) => {
  const { portfolioName } = config;
  await portfolioItem.deletePortfolio(portfolioName);

};
