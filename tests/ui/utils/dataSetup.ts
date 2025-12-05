// tests/ui/tests/dataSetup.ts
import { expect, extendedTest } from '@utils/authFixture';
import { HomePage } from '@pages/HomePage';
import { LoginPage } from '@pages/LoginPage';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioList } from '@components/PortfolioList';
import { Header } from '@components/Header';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { PortfolioConfig } from '@lib/portfolio_configs.constants';

export const SETUP_TIMEOUT = 800000;

export const testDataSetup = extendedTest.extend<{
  homePage: HomePage;
  loginPage: LoginPage;
  header: Header;
  createPortfolioPage: CreatePortfolioPage;
  portfolioList: PortfolioList;
  portfolioItem: PortfolioItem;
  portfolioInformation: PortfolioInformation;
}>({
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
  createPortfolioPage: async ({ page }, use) => {
    await use(new CreatePortfolioPage(page));
  },
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
  portfolioItem: async ({ page }, use) => {
    await use(new PortfolioItem(page));
  },
  portfolioInformation: async ({ page }, use) => {
    await use(new PortfolioInformation(page));
  },
});

testDataSetup.setTimeout(SETUP_TIMEOUT)
testDataSetup.beforeEach('Navigate to Homepage', async ({ homePage }) => {
  await homePage.navigateByURL();
});

export async function setupPortfolio(
  config: PortfolioConfig,
  createPortfolioPage: CreatePortfolioPage,
  portfolioItem: PortfolioItem,
  portfolioList: PortfolioList,
  portfolioInformation: PortfolioInformation,
) {
  const {
    fileName,
    dataSetVersion,
    portfolioName,
    categoryName,
    createMethod,
    description,
  } = config;






  // Search for the portfolio by name
  await portfolioList.searchByWithRetry(portfolioName);

  try {
    const isPortfolioVisible = await portfolioItem.PortfolioName.isVisible();
    const isResultSetLoading =
      await portfolioItem.CreationDateLoadingText.isVisible();

    if (isPortfolioVisible && !isResultSetLoading) {
      await expect(portfolioItem.PortfolioName).toBeVisible();


    } else if (isPortfolioVisible && isResultSetLoading) {
      await portfolioInformation.waitForResultSet();
    } else if (!isPortfolioVisible) {



      // Create portfolio using the specified method
      const createMethodFn = createPortfolioPage[createMethod] as Function;
      await createMethodFn.call(
        createPortfolioPage,
        fileName,
        dataSetVersion,
        categoryName,
        portfolioName,
      );

      await portfolioList.searchBy(portfolioName);
      await portfolioItem.PortfolioName.click();
      await portfolioInformation.waitForResultSet();
    }
  } catch (error) {

    throw error;
  }
}