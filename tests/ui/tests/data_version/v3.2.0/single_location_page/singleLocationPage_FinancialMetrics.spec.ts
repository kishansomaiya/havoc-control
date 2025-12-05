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
import { SingleLocationFinancialMetricsPage } from '@pages/SingleLocationFinancialMetricsPage';
import { SingleLocationHeader } from '@components/SingleLocationHeader';
import { MetricsTable } from '@components/MetricsTable';
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
  singleLocationFinancialMetricsPage: SingleLocationFinancialMetricsPage;
  singleLocationHeader: SingleLocationHeader;
  map: Map;
  homePage: HomePage;
  metricsTable: MetricsTable;
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
  singleLocationFinancialMetricsPage: async ({ page }, use) => {
    await use(new SingleLocationFinancialMetricsPage(page));
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
  metricsTable: async ({ page }, use) => {
    await use(new MetricsTable(page));
  },
});

test.describe('Single Location: FINANCIAL METRICS', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;
  let portfolioId: string;
  let locationID: string;
  let locationNAME: string;
  let lat: string;
  let lon: string;
  let fileData: any[] = [];
  let apiYears: number[] = [];
  let apiCurrency: string;
  let responseData: any[] = [];
  let hasNonNullValueEiNetIncome = false;
  let hasNonNullValueEiNetOwnershipCost = false;

  test.beforeEach(
    'Go to Single Location: "Financial Metrics" page',
    async ({
      portfolioHeader,
      portfolioItem,
      portfolioList,
      portfolioInformation,
      portfolioLocationsPage,
      singleLocationHeader,
      singleLocationFinancialMetricsPage,
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

      // Go to Financial Metrics tab
      await singleLocationHeader.FinancialMetricsTab.click();

      // Set up a listener to capture the request and response
      page.on('requestfinished', async (request) => {
        if (
          request.url().includes('/result_sets/') &&
          request.method() === 'POST'
        ) {
          const response = await request.response();
          const responseBody = await response?.json();

          // Extract data from the API response
          responseData = responseBody.data;
          apiYears = responseBody.options.perils_options.years;
          apiCurrency = responseBody.options.defaults.value_currency_code;
        }
      });

      // Wait for the request to be processed
      await page.waitForResponse(
        (response) =>
          response.url().includes('/result_sets/') && response.status() === 200 && response.request().method() === 'POST',
      );
      await waitForContentLoaded(page);
      await expect(singleLocationFinancialMetricsPage.Body).toBeVisible();
    },
  );

  // Test: Validate main controls
  test('Validate main controls', async ({
    singleLocationHeader,
    singleLocationFinancialMetricsPage,
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
    await singleLocationFinancialMetricsPage.validateControls();
  });

  // Test: Validate breadcrumbs
  test('Validate breadcrumbs', async ({ page, singleLocationHeader }) => {
    await waitForContentLoaded(page);
    await singleLocationHeader.validateBreadcrumbs(portfolioId, portfolioName);
  });

  // Test: Validate default tab state (Overview, Hazard, Locations...)
  test('Validate default tab state', async ({ page, singleLocationHeader }) => {
    await waitForContentLoaded(page);
    await singleLocationHeader.validateDefaultTabsState('Financial Metrics');
  });

  // Test: Validate "View by" dropdown
  test('Validate "View by" dropdown', async ({
    singleLocationFinancialMetricsPage,
  }) => {
    await expect(singleLocationFinancialMetricsPage.ViewByLabel).toContainText(
      'View by',
    );
    await singleLocationFinancialMetricsPage.validateViewByDropdown();
  });

  // Test: Validate Scenario Dropdown
  test('Validate Scenario Dropdown', async ({
    singleLocationFinancialMetricsPage,
  }) => {
    await singleLocationFinancialMetricsPage.validateScenarioDropdown();
  });

  // Test: Validate Year Dropdown
  test('Validate Year Dropdown', async ({
    singleLocationFinancialMetricsPage,
  }) => {
    await singleLocationFinancialMetricsPage.validateYearDropdown();
  });

  // Test: Verify Graph
  test('Verify Graph', async ({ singleLocationFinancialMetricsPage }) => {
    const viewByOptions = {
      transmissionChannel: 'Transmission Channel',
      operationalRisk: 'Operational Risk',
      technicalPremium: 'Technical Premium',
      marketRisk: 'Market Risk',
    };

    // Iterate over each entry in the data array
    for (const dataEntry of responseData) {
      const year = dataEntry.year; // For reference, you can log or check the year
      const eiOwnershipCost = dataEntry.EI_ownershipCost;
      const eiNetIncome = dataEntry.EI_netIncome;

      // Log or perform actions depending on whether these values are null or not
      if (eiOwnershipCost === null) {

      } else {
        hasNonNullValueEiNetOwnershipCost = true; // Track if any value is not null
      }

      if (eiNetIncome === null) {

      } else {
        hasNonNullValueEiNetIncome = true; // Track if any value is not null
      }
    }

    // Transmission Channel
    await test.step('For "Transmission Channel"', async () => {
      await singleLocationFinancialMetricsPage.verifyGraph(
        viewByOptions.transmissionChannel,
        apiCurrency,
      );
    });
    // Operational Risk
    await test.step('For "Operational Risk"', async () => {
      await singleLocationFinancialMetricsPage.verifyGraph(
        viewByOptions.operationalRisk,
        apiCurrency,
        hasNonNullValueEiNetIncome,
        hasNonNullValueEiNetOwnershipCost,
      );
    });
    // Technical Premium
    await test.step('For "Technical Premium"', async () => {
      await singleLocationFinancialMetricsPage.verifyGraph(
        viewByOptions.technicalPremium,
        apiCurrency,
      );
    });
    // Market Risk
    await test.step('For "Market Risk"', async () => {
      await singleLocationFinancialMetricsPage.verifyGraph(
        viewByOptions.marketRisk,
        apiCurrency,
      );
    });
  });

  // Test: Validate Metrics
  test('Validate Metrics', async ({ metricsTable }) => {
    await test.step('Verify "Impact on Net Operating Income" metrics', async () => {
      const ImpactOnNetOperatingIncome = `Impact on Net Operating Income(${apiCurrency})`;
      const ImpactOnNetOperatingIncomeTooltip =
        'Total annual decrease in the expected net operating income of the investment asset due to climate risk';
      // Remove 1995 from the API years, since it should not be present in the chart
      const expectedYears = apiYears.filter((year) => year !== 1995);
      const randomIndex = Math.floor(Math.random() * expectedYears.length);
      const randomYear = expectedYears[randomIndex];
      await metricsTable.verifyMetricsTableVisibility(
        ImpactOnNetOperatingIncome,
        ImpactOnNetOperatingIncomeTooltip,
        `${randomYear}`,
      );
    });

    await test.step('Verify "Technical Premium" metrics', async () => {
      const technicalPremium = `Technical Premium(${apiCurrency})`;
      const technicalPremiumTooltip =
        'Annual increase in the technical premium expense (cost of insurance) due to climate risk';
      // Remove 1995 from the API years, since it should not be present in the chart
      const expectedYears = apiYears.filter((year) => year !== 1995);
      const randomIndex = Math.floor(Math.random() * expectedYears.length);
      const randomYear = expectedYears[randomIndex];
      await metricsTable.verifyMetricsTableVisibility(
        technicalPremium,
        technicalPremiumTooltip,
        `${randomYear}`,
      );
    });

    await test.step('Verify "Benchmark Asset Value" metrics', async () => {
      const benchmarkAssetValue = `Benchmark Asset Value(${apiCurrency})`;
      const benchmarkAssetValueTooltip =
        'Non-climate risk-adjusted forecasted value of the asset';
      // Remove 1995 from the API years, since it should not be present in the chart
      const expectedYears = apiYears.filter((year) => year !== 1995);
      const randomIndex = Math.floor(Math.random() * expectedYears.length);
      const randomYear = expectedYears[randomIndex];
      await metricsTable.verifyMetricsTableVisibility(
        benchmarkAssetValue,
        benchmarkAssetValueTooltip,
        `${randomYear}`,
      );
    });

    await test.step('Verify "Climate-Adjusted Asset Value" metrics', async () => {
      const climateAdjustedAssetValue = `Climate-Adjusted Asset Value(${apiCurrency})`;
      const climateAdjustedAssetValueTooltip =
        'Climate risk-adjusted value of the asset';
      // Remove 1995 from the API years, since it should not be present in the chart
      const expectedYears = apiYears.filter((year) => year !== 1995);
      const randomIndex = Math.floor(Math.random() * expectedYears.length);
      const randomYear = expectedYears[randomIndex];
      await metricsTable.verifyMetricsTableVisibility(
        climateAdjustedAssetValue,
        climateAdjustedAssetValueTooltip,
        `${randomYear}`,
      );
    });

    await test.step('Verify "Total Climate Risk Adjustment" metrics', async () => {
      const totalClimateRiskAdjustment = `Total Climate Risk Adjustment(${apiCurrency})`;
      const totalClimateRiskAdjustmentTooltip =
        'Total climate risk adjustment to the value of the asset';
      // Remove 1995 from the API years, since it should not be present in the chart
      const expectedYears = apiYears.filter((year) => year !== 1995);
      const randomIndex = Math.floor(Math.random() * expectedYears.length);
      const randomYear = expectedYears[randomIndex];
      await metricsTable.verifyMetricsTableVisibility(
        totalClimateRiskAdjustment,
        totalClimateRiskAdjustmentTooltip,
        `${randomYear}`,
      );
    });
  });

  test('should listen for the API request and compare years with chart', async ({
    singleLocationFinancialMetricsPage,
  }) => {
    // Using the predefined locator for the graph chart
    const graphChart = singleLocationFinancialMetricsPage.GraphChart;
    const xAxisGraphLabel = graphChart.locator('.MuiChartsAxis-tickLabel');

    // Get the count of tick labels
    const tickLabelCount = await xAxisGraphLabel.count();

    // Collect the years from the tick labels using textContent
    const chartYears: number[] = [];
    for (let i = 0; i < tickLabelCount; i++) {
      const yearText = await xAxisGraphLabel.nth(i).textContent(); // Use textContent for SVG compatibility
      const year = parseInt(yearText || '', 10); // Handle potential null values

      // Ensure only valid years between 2020 and 2100 are collected
      if (!isNaN(year) && year >= 2020 && year <= 2100) {
        chartYears.push(year);
      }
    }

    // Remove 1995 from the API years, since it should not be present in the chart
    const expectedYears = apiYears.filter((year) => year !== 1995);

    // Check that 1995 is not in the chart years
    expect(chartYears).not.toContain(1995);

    // Check that the chart years match the expected years (without 1995)
    expect(chartYears).toEqual(expectedYears);
  });
});
