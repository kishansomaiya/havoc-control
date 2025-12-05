import { extendedTest, expect } from '@utils/authFixture';
import { HomePage } from '@pages/HomePage';
import { PortfolioList } from '@components/PortfolioList';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { PortfolioSlrModal } from '@components/PortfolioSlrModal';
import { ExportPortfolioMenuDropDown } from '@components/ExportPortfolioMenuDropDown';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

// Get the __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

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

test.describe('Single-Location report export', () => {
  const qtyText = 'Showing 1 Results';
  const portfolioName = PORTFOLIO_CONFIGS['v3.1.0'].portfolioName;

  test.beforeEach(
    'Navigate to Homepage',
    async ({ homePage, portfolioInformation }) => {
      await homePage.navigateByURL();
      await portfolioInformation.waitForResultSet();
    },
  );

  test('Validate controls & default state', async ({
    portfolioList,
    portfolioItem,
    portfolioInformation,
    exportPortfolioMenuDropDown,
    portfolioSlrModal,
  }) => {
    await portfolioList.searchBy(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.PortfolioName.click();
    await portfolioInformation.clickOnExportMenu();
    await exportPortfolioMenuDropDown.clickOnSlrMenuItem();
    await portfolioSlrModal.verifyDefaultState();
    await portfolioSlrModal.validateSlrElementsText();
  });

  test('Clicking on "Cancel" closes the modal', async ({
    portfolioList,
    portfolioItem,
    portfolioInformation,
    exportPortfolioMenuDropDown,
    portfolioSlrModal,
  }) => {
    test.setTimeout(800000); // Extend the test timeout to 10 minutes since we need to wait until the result sets are completed

    await portfolioList.searchBy(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.PortfolioName.click();
    await portfolioInformation.clickOnExportMenu();
    await exportPortfolioMenuDropDown.clickOnSlrMenuItem();
    await portfolioSlrModal.clickOnCancel();
  });

  test('Download for: Specific location, "SSP5-8.5", "Change", "Basic" & validate file content', async ({
    portfolioList,
    portfolioItem,
    portfolioInformation,
    exportPortfolioMenuDropDown,
    portfolioSlrModal,
  }) => {
    const locationId = '1804630021';
    const expectedText1 = 'CLIMATE HAZARD SUMMARY BY PERIL';
    const expectedText2 = 'SSP5-8.5';

    await portfolioList.searchBy(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.PortfolioName.click();
    await portfolioInformation.clickOnExportMenu();
    await exportPortfolioMenuDropDown.clickOnSlrMenuItem();
    await portfolioSlrModal.SpecifyLocationRadioButton.click();
    await portfolioSlrModal.LocationIdInput.fill(locationId);
    await expect(portfolioSlrModal.LocationIdInput).toHaveValue(locationId);
    await portfolioSlrModal.selectSsp585();
    await portfolioSlrModal.selectChangeReport();
    await portfolioSlrModal.selectBasic();
    await expect(portfolioSlrModal.DownloadButton).toBeEnabled();
    await portfolioSlrModal.downloadAndVerifySlr(
      locationId,
      expectedText1,
      expectedText2,
    );
  });

  test('Specific location: "SSP2-4.5", "Explosure Report", "Standard" & validate file content', async ({
    portfolioList,
    portfolioItem,
    portfolioInformation,
    exportPortfolioMenuDropDown,
    portfolioSlrModal,
  }) => {
    const locationId = '1840020490';
    const expectedText1 = 'Score Rating Legend';
    const expectedText2 = 'SSP2-4.5';

    await portfolioList.searchBy(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.PortfolioName.click();
    await portfolioInformation.clickOnExportMenu();
    await exportPortfolioMenuDropDown.clickOnSlrMenuItem();
    await portfolioSlrModal.SpecifyLocationRadioButton.click();
    await portfolioSlrModal.LocationIdInput.fill(locationId);
    await expect(portfolioSlrModal.LocationIdInput).toHaveValue(locationId);
    await portfolioSlrModal.selectSsp245();
    await portfolioSlrModal.selectExplosureReport();
    await portfolioSlrModal.selectStandard();
    await expect(portfolioSlrModal.DownloadButton).toBeEnabled();
    await portfolioSlrModal.downloadAndVerifySlr(
      locationId,
      expectedText1,
      expectedText2,
    );
  });

  test('All locations: "SSP2-4.5", "Explosure Report", "Standard" & validate file content', async ({
    portfolioList,
    portfolioItem,
    portfolioInformation,
    exportPortfolioMenuDropDown,
    portfolioSlrModal,
  }) => {
    const numOfDownloads = 3; // since in the test file we have 3 locations

    await portfolioList.searchBy(portfolioName);
    await expect(portfolioList.PortfolioListResultsQty).toHaveText(qtyText);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.PortfolioName.click();
    await portfolioInformation.clickOnExportMenu();
    await exportPortfolioMenuDropDown.clickOnSlrMenuItem();
    await portfolioSlrModal.selectAllLocations();
    await expect(portfolioSlrModal.DownloadButton).toBeEnabled();
    await portfolioSlrModal.verifyMultipleDownloads(numOfDownloads);
  });
});
