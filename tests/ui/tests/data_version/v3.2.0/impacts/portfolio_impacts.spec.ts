// tests/ui/tests/portfolio_Impacts.auth.result_set.spec.ts

import { extendedTest, expect } from '@utils/authFixture';
import { Map } from '@components/Map';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { PortfolioList } from '@components/PortfolioList';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { MetricsTable } from '@components/MetricsTable';
import { waitForContentLoaded } from '@utils/helpers';
import { PortfolioImpactsPage } from '@pages/PortfolioImpactsPage';
import { HomePage } from '@pages/HomePage';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const TIMEOUT = 120000;

const test = extendedTest.extend<{
  createPortfolioPage: CreatePortfolioPage;
  portfolioList: PortfolioList;
  portfolioItem: PortfolioItem;
  portfolioInformation: PortfolioInformation;
  portfolioHeader: PortfolioHeader;
  metricsTable: MetricsTable;
  portfolioImpactsPage: PortfolioImpactsPage;
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
  portfolioImpactsPage: async ({ page }, use) => {
    await use(new PortfolioImpactsPage(page));
  },
  portfolioHeader: async ({ page }, use) => {
    await use(new PortfolioHeader(page));
  },
  map: async ({ page }, use) => {
    await use(new Map(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  metricsTable: async ({ page }, use) => {
    await use(new MetricsTable(page));
  },
});

test.describe('Portfolio: IMPACTS', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;
  const dataSetVersion = PORTFOLIO_CONFIGS['v3.2.0'].dataSetVersion;
  let apiYears: number[] = [];
  let apiCurrency: string;

  let analysisType = 'Perils, EI, Scores';

  const chartAverageAnnualLossOverTimeLabel = 'Average Annual Loss over Time';
  const chartPortfolioValueAtRiskWindFloodLabel =
    'Portfolio Value at Risk (Wind+Flood)';
  const chartClimateAdjustedValuationOverTimeLabel =
    'Climate Adjusted Valuation Over Time';
  const chartTechnicalPremiumOverTimeLabel = 'Technical premium Over Time';
  const chartTransmissionChannelImpactsOverTimeLabel =
    'Transmission Channel Impacts Over Time';

  test.beforeEach(
    'Go to Portfolio: IMPACTS page',
    async ({
      portfolioHeader,
      portfolioItem,
      portfolioList,
      portfolioInformation,
      portfolioImpactsPage,
      page,
      homePage,
    }) => {
      test.setTimeout(TIMEOUT);

      await homePage.navigateByURL();
      await portfolioList.searchBy(portfolioName);
      await portfolioItem.PortfolioName.click();
      await portfolioInformation.waitForResultSet();
      await portfolioInformation.clickOnLaunchButton();
      await expect(portfolioHeader.ImpactsTab).toBeVisible();
      await portfolioHeader.ImpactsTab.click();

      // Helper function to wait for a specific response
      async function waitForResponseByName(page, expectedName) {
        return page.waitForResponse(async (response) => {
          if (
            response.url().includes('/result_sets/') &&
            response.status() === 200
          ) {
            const responseBody = await response.json();
            return responseBody.name === expectedName;
          }
        });
      }

      // Timeout function to allow for cases where only one response is received
      async function waitWithTimeout(promise, timeout) {
        return Promise.race([
          promise,
          new Promise((resolve) => setTimeout(() => resolve(null), timeout)),
        ]);
      }

      // Wait for both responses, with a timeout to handle cases where one is missing
      const [impactsResponse, prplResponse] = await Promise.all([
        waitWithTimeout(
          waitForResponseByName(page, 'Impacts result set'),
          5000,
        ), // Adjust timeout as needed
        waitWithTimeout(waitForResponseByName(page, 'PRPL result set'), 5000),
      ]);

      // Process 'Impacts result set' response if it exists
      if (impactsResponse) {
        const impactsResponseBody = await impactsResponse.json();
        apiYears = impactsResponseBody.options.perils_options.years;
        apiCurrency = impactsResponseBody.options.defaults.value_currency_code;
      }

      // Process 'PRPL result set' response if it exists
      if (prplResponse) {
        const prplResponseBody = await prplResponse.json();
        apiYears =
          prplResponseBody.options.damages_options.perils_options.years;
        apiCurrency =
          prplResponseBody.options.damages_options.defaults.value_currency_code;
      }

      await waitForContentLoaded(page);
      await expect(portfolioImpactsPage.Body).toBeVisible();
    },
  );

  // Test: Validate main controls
  test('Validate main controls', async ({
    portfolioHeader,
    portfolioImpactsPage,
  }) => {
    test.setTimeout(TIMEOUT);
    await portfolioHeader.validateControls(
      portfolioName,
      analysisType,
      dataSetVersion,
    );
    await portfolioImpactsPage.validateControls();
  });

  // Test: Validate breadcrumbs
  test('Validate breadcrumbs', async ({ page, portfolioHeader }) => {
    await waitForContentLoaded(page);
    await portfolioHeader.validateBreadcrumbs();
  });

  // Test: Validate tabs
  test('Validate tabs', async ({ portfolioHeader }) => {
    await portfolioHeader.validateTablist();
  });

  // Test: Validate default tab state (Overview, Hazard...)
  test('Validate default tab state', async ({ portfolioHeader }) => {
    await portfolioHeader.validateDefaultTabsState('Impacts');
  });

  // Test: Validate Scenario Dropdown
  test('Validate Scenario Dropdown', async ({ portfolioImpactsPage }) => {
    await portfolioImpactsPage.validateScenarioDropdown();
  });

  // Test: Validate Year Dropdown
  test('Validate Year Dropdown', async ({ portfolioImpactsPage }) => {
    await portfolioImpactsPage.validateYearDropdown();
  });

  // Test: Validate "Average Annual Loss over Time" chart
  test('Validate "Average Annual Loss over Time" metric chart', async ({
    portfolioImpactsPage,
  }) => {
    await portfolioImpactsPage.verifyChartVisibility(
      chartAverageAnnualLossOverTimeLabel,
    );
    await portfolioImpactsPage.verifyChartLegend(
      chartAverageAnnualLossOverTimeLabel,
    );
  });

  // Test: Validate "Portfolio Value at Risk (Wind+Flood)" chart
  test('Validate "Portfolio Value at Risk (Wind+Flood)" metric chart', async ({
    portfolioImpactsPage,
  }) => {
    await portfolioImpactsPage.verifyChartVisibility(
      chartPortfolioValueAtRiskWindFloodLabel,
    );
    await portfolioImpactsPage.verifyChartLegend(
      chartPortfolioValueAtRiskWindFloodLabel,
    );
  });

  // Test: Validate "Climate Adjusted Valuation Over Time" chart
  test('Validate "Climate Adjusted Valuation Over Time" metric chart', async ({
    portfolioImpactsPage,
  }) => {
    await portfolioImpactsPage.verifyChartVisibility(
      chartClimateAdjustedValuationOverTimeLabel,
    );
    await portfolioImpactsPage.verifyChartLegend(
      chartClimateAdjustedValuationOverTimeLabel,
    );
  });

  // Test: Validate "Technical premium Over Time" chart
  test('Validate "Technical premium Over Time" metric chart', async ({
    portfolioImpactsPage,
  }) => {
    await portfolioImpactsPage.verifyChartVisibility(
      chartTechnicalPremiumOverTimeLabel,
    );
    await portfolioImpactsPage.verifyChartLegend(
      chartTechnicalPremiumOverTimeLabel,
    );
  });

  // Test: Validate "Transmission Channel Impacts Over Time" chart
  test('Validate "Transmission Channel Impacts Over Time" metric chart', async ({
    portfolioImpactsPage,
  }) => {
    await portfolioImpactsPage.verifyChartVisibility(
      chartTransmissionChannelImpactsOverTimeLabel,
    );
    await portfolioImpactsPage.verifyChartLegend(
      chartTransmissionChannelImpactsOverTimeLabel,
    );
  });

  // Test: Validate Metrics table
  test('Validate Metrics table', async ({ metricsTable }) => {
    await test.step('Verify "Average Annual Loss" metrics', async () => {
      const averageAnnualLoss = `Average Annual Loss(${apiCurrency})`;
      const impactsMetricsAverageAnnualLossTooltip =
        'Sum of average annual losses due to flood, wind, heat, wildfire, and drought for the portfolio';

      // Remove 1995 from the API years, since it should not be present in the chart
      const expectedYears = apiYears.filter((year) => year !== 1995);
      const randomIndex = Math.floor(Math.random() * expectedYears.length);
      const randomYear = expectedYears[randomIndex];

      await metricsTable.verifyMetricsTableVisibility(
        averageAnnualLoss,
        impactsMetricsAverageAnnualLossTooltip,
        `${randomYear}`,
      );
    });

    await test.step('Verify "Technical Premium" metrics', async () => {
      const technicalPremium = `Technical Premium(${apiCurrency})`;
      const impactsMetricsTechnicalPremiumTooltip =
        'Sum of technical premium (cost of insurance) due to flood, wind, and wildfire for the portfolio';

      // Remove 1995 from the API years, since it should not be present in the chart
      const expectedYears = apiYears.filter((year) => year !== 1995);
      const randomIndex = Math.floor(Math.random() * expectedYears.length);
      const randomYear = expectedYears[randomIndex];

      await metricsTable.verifyMetricsTableVisibility(
        technicalPremium,
        impactsMetricsTechnicalPremiumTooltip,
        `${randomYear}`,
      );
    });

    await test.step('Verify "Benchmark Asset Value" metrics', async () => {
      const benchmarkAssetValue = `Benchmark Asset Value(${apiCurrency})`;
      const impactsMetricsBenchmarkAssetValueTooltip =
        'Sum of benchmark (non-climate risk-adjusted) asset values for the portfolio';

      // Remove 1995 from the API years, since it should not be present in the chart
      const expectedYears = apiYears.filter((year) => year !== 1995);
      const randomIndex = Math.floor(Math.random() * expectedYears.length);
      const randomYear = expectedYears[randomIndex];

      await metricsTable.verifyMetricsTableVisibility(
        benchmarkAssetValue,
        impactsMetricsBenchmarkAssetValueTooltip,
        `${randomYear}`,
      );
    });

    await test.step('Verify "Climate-Adjusted Asset Value" metrics', async () => {
      const climateAdjustedAssetValue = `Climate-Adjusted Asset Value(${apiCurrency})`;
      const impactsMetricsClimateAdjustedAssetValueTooltip =
        'Sum of climate-adjusted asset values for the portfolio';

      // Remove 1995 from the API years, since it should not be present in the chart
      const expectedYears = apiYears.filter((year) => year !== 1995);
      const randomIndex = Math.floor(Math.random() * expectedYears.length);
      const randomYear = expectedYears[randomIndex];

      await metricsTable.verifyMetricsTableVisibility(
        climateAdjustedAssetValue,
        impactsMetricsClimateAdjustedAssetValueTooltip,
        `${randomYear}`,
      );
    });

    await test.step('Verify "Total Climate Risk Adjustment" metrics', async () => {
      const totalClimateRiskAdjustment = `Total Climate Risk Adjustment(${apiCurrency})`;
      const impactsMetricsTotalClimateRiskAdjustmentTooltip =
        'Sum of climate risk adjustments to the values of the assets for the portfolio';

      // Remove 1995 from the API years, since it should not be present in the chart
      const expectedYears = apiYears.filter((year) => year !== 1995);
      const randomIndex = Math.floor(Math.random() * expectedYears.length);
      const randomYear = expectedYears[randomIndex];

      await metricsTable.verifyMetricsTableVisibility(
        totalClimateRiskAdjustment,
        impactsMetricsTotalClimateRiskAdjustmentTooltip,
        `${randomYear}`,
      );
    });
  });

  // Test: Validate Locations table
  test('Validate Locations table', async ({ page, portfolioImpactsPage }) => {
    const yearToDefault = '2040';
    const yearTo = '2100';
    await portfolioImpactsPage.validateLocationsTable(yearToDefault);

    await portfolioImpactsPage.setYear(yearTo);
    await portfolioImpactsPage.validateLocationsTable(yearTo);

    await expect(
      page.getByRole('link', { name: 'Marikina City' }),
    ).toBeVisible(); // we have it in the file
    await expect(
      page.getByRole('link', { name: 'Location#1840020490' }),
    ).toBeVisible(); // since we have one location without Location name
    await expect(
      portfolioImpactsPage.LocationsTablePagination,
    ).not.toBeVisible(); // since we have 3 ocation is the file
    const tableRows = portfolioImpactsPage.LocationTable.locator('tbody tr');
    const rowCount = await tableRows.count();
    expect(rowCount).toBe(3);
  });
});
