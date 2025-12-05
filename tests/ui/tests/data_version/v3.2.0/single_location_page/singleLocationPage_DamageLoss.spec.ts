// tests/ui/tests/singleLocationPage_DamageLoss.auth.result_set.spec.ts

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
import { SingleLocationDamadeLossPage } from '@pages/SingleLocationDamadeLossPage';
import { SingleLocationHeader } from '@components/SingleLocationHeader';
import { MetricsTable } from '@components/MetricsTable';
import { HomePage } from '@pages/HomePage';
import * as path from 'path';
import { parseCsvFile } from '@utils/parseCsvFile';
import { ENV } from 'playwright.config';
import { testConfig } from 'testConfig';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const TIMEOUT = 300000;

const test = extendedTest.extend<{
  createPortfolioPage: CreatePortfolioPage;
  portfolioList: PortfolioList;
  portfolioItem: PortfolioItem;
  portfolioInformation: PortfolioInformation;
  portfolioHeader: PortfolioHeader;
  portfolioSlrModal: PortfolioSlrModal;
  portfolioLocationsPage: PortfolioLocationsPage;
  singleLocationDamadeLossPage: SingleLocationDamadeLossPage;
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
  singleLocationDamadeLossPage: async ({ page }, use) => {
    await use(new SingleLocationDamadeLossPage(page));
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

test.describe('Single Location: DAMAGE & LOSS', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;
  let portfolioId: string;
  let locationID: string;
  let locationNAME: string;
  let lat: string;
  let lon: string;
  let fileData: any[] = [];
  let apiYears: number[] = [];
  let apiCurrency: string;

  test.beforeEach(
    'Go to Single Location: "Damage & Loss" page',
    async ({
      portfolioHeader,
      portfolioItem,
      portfolioList,
      portfolioInformation,
      portfolioLocationsPage,
      singleLocationHeader,
      singleLocationDamadeLossPage,
      page,
      homePage,
    }) => {
      test.setTimeout(TIMEOUT);

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

      // Go to Damage & Loss tab
      await singleLocationHeader.DamageLossTab.click();

      // Set up a listener to capture the request and response
      page.on('requestfinished', async (request) => {
        if (
          request.url().includes('/result_sets/') &&
          request.method() === 'POST'
        ) {
          const response = await request.response();
          const responseBody = await response?.json();

          // Extract data from the API response
          apiYears = responseBody.options.perils_options.years;
          apiCurrency = responseBody.options.defaults.value_currency_code;
        }
      });

      // Wait for the request to be processed
      await page.waitForResponse(
        (response) =>
          response.url().includes('/result_sets/') && response.status() === 200,
      );
      await waitForContentLoaded(page);
      await expect(singleLocationDamadeLossPage.Body).toBeVisible();
    },
  );

  // Test: Validate main controls
  test('Validate main controls', async ({
    singleLocationHeader,
    singleLocationDamadeLossPage,
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
    await singleLocationDamadeLossPage.validateControls();
  });

  // Test: Validate breadcrumbs
  test('Validate breadcrumbs', async ({ page, singleLocationHeader }) => {
    await waitForContentLoaded(page);
    await singleLocationHeader.validateBreadcrumbs(portfolioId, portfolioName);
  });

  // Test: Validate default tab state (Overview, Hazard, Locations...)
  test('Validate default tab state', async ({ singleLocationHeader }) => {
    await singleLocationHeader.validateDefaultTabsState('Damage & Loss');
  });

  // Test: Validate Damage/Loss Type Dropdown
  test('Validate Damage/Loss Type Dropdown', async ({
    singleLocationDamadeLossPage,
  }) => {
    await singleLocationDamadeLossPage.DamageButton.click();
    await expect(
      singleLocationDamadeLossPage.DamageLossTypeLabel,
    ).toContainText('Damage Type');

    await singleLocationDamadeLossPage.LossButton.click();
    await expect(
      singleLocationDamadeLossPage.DamageLossTypeLabel,
    ).toContainText('Loss Type');

    await singleLocationDamadeLossPage.validateDamageLossTypeDropdown();
  });

  // Test: Validate Scenario Dropdown
  test('Validate Scenario Dropdown', async ({
    singleLocationDamadeLossPage,
  }) => {
    await singleLocationDamadeLossPage.validateScenarioDropdown();
  });

  // Test: Validate Year Dropdown
  test('Validate Year Dropdown', async ({ singleLocationDamadeLossPage }) => {
    await singleLocationDamadeLossPage.validateYearDropdown();
  });

  // Test: Verify Graph
  test('Verify Graph', async ({ singleLocationDamadeLossPage }) => {
    await singleLocationDamadeLossPage.verifyGraph();
  });

  // Test: Verify "CHRONIC" button state
  test('Verify "CHRONIC" button state', async ({
    singleLocationDamadeLossPage,
  }) => {
    await singleLocationDamadeLossPage.verifyChronicButtonState();
  });

  // Test: Validate Metrics
  test('Validate Metrics', async ({
    singleLocationDamadeLossPage,
    metricsTable,
  }) => {
    // Damage Section
    await test.step('Click Damage Button', async () => {
      await singleLocationDamadeLossPage.DamageButton.click();
    });

    await test.step('Verify Flood Damage Metrics for 2040', async () => {
      const floodDamage = 'Flood Damage(%)';
      const floodDamageTooltip =
        'Percent damage in a single year due to flooding';

      await metricsTable.verifyMetricsTableVisibility(
        floodDamage,
        floodDamageTooltip,
        '2040',
      );
    });

    await test.step('Verify Wind Damage Metrics for 2025', async () => {
      const windDamage = 'Wind Damage(%)';
      const windDamageTooltip = 'Percent damage in a single year due to wind';

      await metricsTable.verifyMetricsTableVisibility(
        windDamage,
        windDamageTooltip,
        '2025',
      );
    });

    await test.step('Verify Wildfire Damage Metrics for 2100', async () => {
      const wildfireDamage = 'Wildfire Damage(%)';
      const wildfireDamageTooltip =
        'Percent damage in a single year due to wildfire';
      await metricsTable.verifyMetricsTableVisibility(
        wildfireDamage,
        wildfireDamageTooltip,
        '2100',
      );
    });

    await test.step('Verify Heat Cooling Damage Metrics for 2075', async () => {
      const heatCoolingDamage = 'Heat - Cooling Damage(kWh)';
      const heatCoolingDamageTooltip =
        'Electricity consumed (in kWh) for cooling purposes';
      await metricsTable.verifyMetricsTableVisibility(
        heatCoolingDamage,
        heatCoolingDamageTooltip,
        '2075',
      );
    });

    await test.step('Verify Heat Productivity Damage Metrics for 2095', async () => {
      const heatProductivityDamage = 'Heat - Productivity Damage(%)';
      const heatProductivityDamageTooltip =
        'The average proportion of annual work hours lost due to heat';
      await metricsTable.verifyMetricsTableVisibility(
        heatProductivityDamage,
        heatProductivityDamageTooltip,
        '2095',
      );
    });

    await test.step('Verify Drought Damage Metrics for 2060', async () => {
      const droughtDamage = `Drought Damage(${apiCurrency})`;
      const droughtDamageTooltip = 'Shadow price of water';
      await metricsTable.verifyMetricsTableVisibility(
        droughtDamage,
        droughtDamageTooltip,
        '2060',
      );
    });

    // Loss Section
    await test.step('Click Loss Button', async () => {
      await singleLocationDamadeLossPage.LossButton.click();
    });

    await test.step('Verify Flood Loss Metrics for 2035', async () => {
      const floodLoss = `Flood Loss(${apiCurrency})`;
      const floodLossTooltip = 'Average loss in a single year due to flooding';
      await metricsTable.verifyMetricsTableVisibility(
        floodLoss,
        floodLossTooltip,
        '2035',
      );
    });

    await test.step('Verify Wind Loss Metrics for 2050', async () => {
      const windLoss = `Wind Loss(${apiCurrency})`;
      const windLossTooltip = 'Average loss in a single year due to wind';
      await metricsTable.verifyMetricsTableVisibility(
        windLoss,
        windLossTooltip,
        '2050',
      );
    });

    await test.step('Verify Wildfire Loss Metrics for 2090', async () => {
      const wildfireLoss = `Wildfire Loss(${apiCurrency})`;
      const wildfireLossTooltip =
        'Average loss in a single year due to wildfire';
      await metricsTable.verifyMetricsTableVisibility(
        wildfireLoss,
        wildfireLossTooltip,
        '2090',
      );
    });

    await test.step('Verify Heat Cooling Loss Metrics for 2085', async () => {
      const heatCoolingLoss = `Heat - Cooling Loss(${apiCurrency})`;
      const heatCoolingLossTooltip =
        'Cost (in monetary value) of electricity used for space cooling purposes';
      await metricsTable.verifyMetricsTableVisibility(
        heatCoolingLoss,
        heatCoolingLossTooltip,
        '2085',
      );
    });

    await test.step('Verify Heat Productivity Loss Metrics for 2070', async () => {
      const heatProductivityLoss = `Heat - Productivity Loss(${apiCurrency})`;
      const heatProductivityLossTooltip =
        'The average annual loss due to impacts of heat on worker productivity';
      await metricsTable.verifyMetricsTableVisibility(
        heatProductivityLoss,
        heatProductivityLossTooltip,
        '2070',
      );
    });

    await test.step('Verify Drought Loss Metrics for 2030', async () => {
      const droughtLoss = `Drought Loss(${apiCurrency})`;
      const droughtLossTooltip =
        'Annual cost of water consumption, in monetary units, accounting for the societal value of water';
      await metricsTable.verifyMetricsTableVisibility(
        droughtLoss,
        droughtLossTooltip,
        '2030',
      );
    });
  });

  test('should listen for the API request and compare years with chart', async ({
    singleLocationDamadeLossPage,
  }) => {
    // Using the predefined locator for the graph chart
    const graphChart = singleLocationDamadeLossPage.GraphChart;
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
