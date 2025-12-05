// tests/ui/tests/singleLocationPage_Hazard.auth.result_set.spec.ts

// import { test as baseTest, expect } from '@playwright/test';
import { extendedTest, expect } from '@utils/authFixture';
import { Map } from '@components/Map';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { PortfolioList } from '@components/PortfolioList';
import { PortfolioSlrModal } from '@components/PortfolioSlrModal';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { waitForContentLoaded } from '@utils/helpers';
import { PortfolioLocationsPage } from '@pages/PortfolioLocationsPage';
import { SingleLocationHazardPage } from '@pages/SingleLocationHazardPage';
import { SingleLocationHeader } from '@components/SingleLocationHeader';
import { HomePage } from '@pages/HomePage';
import * as path from 'path';
import { parseCsvFile } from '@utils/parseCsvFile';
import { ENV } from 'playwright.config';
import { testConfig } from 'testConfig';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const TIMEOUT = 120000;

const test = extendedTest.extend<{
  createPortfolioPage: CreatePortfolioPage;
  portfolioList: PortfolioList;
  portfolioItem: PortfolioItem;
  portfolioInformation: PortfolioInformation;
  portfolioHeader: PortfolioHeader;
  portfolioSlrModal: PortfolioSlrModal;
  portfolioLocationsPage: PortfolioLocationsPage;
  singleLocationHazardPage: SingleLocationHazardPage;
  singleLocationHeader: SingleLocationHeader;
  map: Map;
  homePage: HomePage;
}>({
  createPortfolioPage: async ({ page }, use) => {
    await use(new CreatePortfolioPage(page));
  },
  portfolioItem: async ({ page }, use) => {
    await use(new PortfolioItem(page));
  },
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
  portfolioInformation: async ({ page }, use) => {
    await use(new PortfolioInformation(page));
  },
  portfolioLocationsPage: async ({ page }, use) => {
    await use(new PortfolioLocationsPage(page));
  },
  singleLocationHazardPage: async ({ page }, use) => {
    await use(new SingleLocationHazardPage(page));
  },
  portfolioHeader: async ({ page }, use) => {
    await use(new PortfolioHeader(page));
  },
  singleLocationHeader: async ({ page }, use) => {
    await use(new SingleLocationHeader(page));
  },
  map: async ({ page }, use) => {
    await use(new Map(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  portfolioSlrModal: async ({ page }, use) => {
    await use(new PortfolioSlrModal(page));
  },
});

test.describe('Single Location Page: HAZARD', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;
  let portfolioId: string;
  let locationID: string;
  let locationNAME: string;
  let lat: string;
  let lon: string;
  let fileData: any[] = [];

  test.beforeEach(
    'Go to Single Location > Hazard page',
    async ({
      portfolioHeader,
      portfolioItem,
      portfolioList,
      portfolioInformation,
      portfolioLocationsPage,
      page,
      homePage,
    }) => {
      test.setTimeout(TIMEOUT); // Extend the test timeout

      const envUrl = testConfig[ENV].appUrl;
      const fileName = 'CSV_3_cities.csv';
      const filePath = path.resolve(`./fixtures/${fileName}`);
      fileData = await parseCsvFile(filePath);

      await homePage.navigateByURL();
      await portfolioList.searchBy(portfolioName);
      await portfolioItem.PortfolioName.click();
      await portfolioInformation.waitForResultSet();
      await portfolioInformation.clickOnLaunchButton();
      await expect(portfolioHeader.LocationsTab).toBeVisible();
      await portfolioHeader.LocationsTab.click();
      await waitForContentLoaded(page);
      await expect(portfolioLocationsPage.PortfolioLocationsBody).toBeVisible();

      // Find the first non-empty location directly within the test
      const location = fileData.find(
        (loc) => loc.locationName && loc.locationName.trim() !== '',
      );
      // Check if a valid location is found
      if (!location) {
        throw new Error('No valid location names found in the dataset.');
      }
      // Extract the locationName and locationId from the location
      const { locationId } = location;
      locationID = location.locationId;
      locationNAME = location.locationName;
      lat = location.latitude;
      lon = location.longitude;

      await portfolioLocationsPage.findAndProceedToLocationById(
        locationID,
        locationNAME,
      );

      // Get the current URL (without query parameters)
      const currentUrl = page.url();
      const url = new URL(currentUrl);
      const pathname = url.pathname; // Extract the path part only, no query parameters

      // Extract the portfolioId and locationId from the pathname
      const pathParts = pathname.split('/');

      // Ensure that the pathParts array has enough elements
      if (pathParts.length < 5) {
        // Check for valid path length
        throw new Error(
          'Unexpected URL structure, unable to extract portfolioId or locationId',
        );
      }
      portfolioId = pathParts[2]; // Extract from 3rd part of path
      if (!envUrl) {
        throw new Error('envUrl is not defined');
      }
      expect(pathname).toBe(
        `/portfolios/${portfolioId}/locations/${locationId}/`,
      );
      await waitForContentLoaded(page);
    },
  );

  // Test: Validate main controls
  test('Validate main controls', async ({
    singleLocationHeader,
    singleLocationHazardPage,
    page,
  }) => {
    test.setTimeout(TIMEOUT);
    const coordinates = `${lat}, ${lon}`;

    await waitForContentLoaded(page);
    await singleLocationHeader.validateControls();
    await expect(singleLocationHeader.LocationIdName).toContainText(locationID);
    await expect(singleLocationHeader.LocationIdName).toContainText(
      locationNAME,
    );
    await expect(singleLocationHeader.Coordinates).toContainText(coordinates);
    await singleLocationHazardPage.validateControls();
  });

  // Test: Validate breadcrumbs
  test('Validate breadcrumbs', async ({ page, singleLocationHeader }) => {
    await waitForContentLoaded(page);
    await singleLocationHeader.validateBreadcrumbs(portfolioId, portfolioName);
  });

  // Test: Validate Single Location Report
  test('Validate Single Location Report', async ({
    singleLocationHeader,
    portfolioSlrModal,
  }) => {
    test.setTimeout(TIMEOUT);
    await singleLocationHeader.clickOnReportButton();
    await portfolioSlrModal.verifySingleLocationDefaultState();
    await portfolioSlrModal.validateSingleReportElementsText();

    const expectedText1 = 'CLIMATE HAZARD SUMMARY BY PERIL';
    const expectedText2 = 'SSP5-8.5';
    await portfolioSlrModal.selectSsp585();
    await portfolioSlrModal.selectChangeReport();
    await portfolioSlrModal.selectBasic();
    await expect(portfolioSlrModal.DownloadButton).toBeEnabled();
    await portfolioSlrModal.downloadAndVerifySlr(
      locationID,
      expectedText1,
      expectedText2,
    );
  });

  // Test: Validate default tab state (Overview, Hazard, Locations...)
  test('Validate default tab state', async ({ singleLocationHeader }) => {
    await singleLocationHeader.validateDefaultTabsState('Hazard');
  });

  // Test: Validate Score Switcher tab list (Flood, Wind...)
  test('Validate Score Switcher tab list (Flood, Wind...)', async ({
    singleLocationHazardPage,
  }) => {
    await singleLocationHazardPage.validateScoreSwitcherTablist();
  });

  // Test: Validate Scenario Dropdown
  test('Validate Scenario Dropdown', async ({ singleLocationHazardPage }) => {
    await singleLocationHazardPage.validateScenarioDropdown();
  });

  // Test: Validate Year Dropdown
  test('Validate Year Dropdown', async ({ singleLocationHazardPage }) => {
    await singleLocationHazardPage.validateYearDropdown();
  });

  // Test: Verify Chart
  test('Verify Chart', async ({ singleLocationHazardPage }) => {
    await singleLocationHazardPage.verifyChart();
  });

  // Test: Verify Chart legend
  test('Verify Chart legend', async ({ singleLocationHazardPage }) => {
    await singleLocationHazardPage.verifyChartLegend();
  });

  // Test: Validate Metrics Table
  test('Validate Metrics Table', async ({ singleLocationHazardPage }) => {
    const yearTo = '2100';
    await singleLocationHazardPage.setYear(yearTo);
    await singleLocationHazardPage.validateMetricsTable(yearTo);
  });

  // Test: Validate Metrics Table options
  test('Validate Metrics Table options', async ({
    singleLocationHazardPage,
  }) => {
    // "Flood"
    await test.step('For "Flood"', async () => {
      const tab = 'Flood';
      await singleLocationHazardPage.validateMetricOptions(tab);
    });

    // "Wind"
    await test.step('For "Wind"', async () => {
      const tab = 'Wind';
      await singleLocationHazardPage.validateMetricOptions(tab);
    });

    // "Wildfire"
    await test.step('For "Wildfire"', async () => {
      const tab = 'Wildfire';
      await singleLocationHazardPage.validateMetricOptions(tab);
    });

    // "Heat"
    await test.step('For "Heat"', async () => {
      const tab = 'Heat';
      await singleLocationHazardPage.validateMetricOptions(tab);
    });

    // "Precip"
    await test.step('For "Precip"', async () => {
      const tab = 'Precip';
      await singleLocationHazardPage.validateMetricOptions(tab);
    });

    // "Cold"
    await test.step('For "Cold"', async () => {
      const tab = 'Cold';
      await singleLocationHazardPage.validateMetricOptions(tab);
    });

    // "Drought"
    await test.step('For "Drought"', async () => {
      const tab = 'Drought';
      await singleLocationHazardPage.validateMetricOptions(tab);
    });

    // "Hail"
    await test.step('For "Hail"', async () => {
      const tab = 'Hail';
      await singleLocationHazardPage.validateMetricOptions(tab);
    });
  });
});
