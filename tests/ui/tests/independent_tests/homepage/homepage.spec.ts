// tests/ui/tests/HomePage.authenticated.spec.ts
// import { test as baseTest } from '@playwright/test';
import { extendedTest } from '@utils/authFixture';
import { HomePage } from '@pages/HomePage';
import { PortfolioList } from '@components/PortfolioList';
import { PortfolioDetails } from '@components/PortfolioDetails';

const test = extendedTest.extend<{
  homepage: HomePage;
  portfolioList: PortfolioList;
  portfolioDetails: PortfolioDetails;
}>({
  homepage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
  portfolioDetails: async ({ page }, use) => {
    await use(new PortfolioDetails(page));
  },
});

test.describe('Homepage', () => {
  test.beforeEach(async ({ homepage }) => {
    await test.step(`Navigate to the homepage`, async () => {
      await homepage.navigateByURL();
    });
  });

  test('Validate Body', async ({ portfolioList, portfolioDetails }) => {
    await portfolioList.validateControls();
    await portfolioDetails.validateControls();
  });
});
