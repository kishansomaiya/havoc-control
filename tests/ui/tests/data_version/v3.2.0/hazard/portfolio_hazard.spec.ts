// tests/ui/tests/portfolioHazard.authenticated.spec.ts
// import { test as baseTest, expect } from '@playwright/test';
import { extendedTest, expect } from '@utils/authFixture';
import { Map } from '@components/Map';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { PortfolioList } from '@components/PortfolioList';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { waitForContentLoaded } from '@utils/helpers';
import { PortfolioHazardPage } from '@pages/PortfolioHazardPage';
import { HomePage } from '@pages/HomePage';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const TIMEOUT = 300000;

const test = extendedTest.extend<{
  createPortfolioPage: CreatePortfolioPage;
  portfolioList: PortfolioList;
  portfolioItem: PortfolioItem;
  portfolioInformation: PortfolioInformation;
  portfolioHeader: PortfolioHeader;
  portfolioHazardPage: PortfolioHazardPage;
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
  portfolioHazardPage: async ({ page }, use) => {
    await use(new PortfolioHazardPage(page));
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
});

test.describe('Portfolio: HAZARD', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;
  const dataSetVersion = PORTFOLIO_CONFIGS['v3.2.0'].dataSetVersion;
  const analysisType = 'Disclosure, Perils, EI, Scores';

  test.beforeEach(
    'Go to Homepage > Go to Portfolio Hazard page',
    async ({
      portfolioHeader,
      portfolioItem,
      portfolioList,
      portfolioInformation,
      portfolioHazardPage,
      page,
      homePage,
    }) => {
      test.setTimeout(TIMEOUT); // Extend the test timeout

      await homePage.navigateByURL();
      await portfolioList.searchBy(portfolioName);
      await portfolioItem.PortfolioName.click();
      await portfolioInformation.waitForResultSet();
      await portfolioInformation.clickOnLaunchButton();
      await expect(portfolioHeader.HazardTab).toBeVisible();
      await portfolioHeader.HazardTab.click();
      await waitForContentLoaded(page);
      await expect(portfolioHazardPage.PortfolioHazardBody).toBeVisible();
    },
  );

  // Test: Validate main controls
  test('Validate main controls', async ({
    portfolioHeader,
    portfolioHazardPage,
  }) => {
    test.setTimeout(TIMEOUT); // Extend the test timeout
    await portfolioHeader.validateControls(
      portfolioName,
      analysisType,
      dataSetVersion,
    );
    await portfolioHazardPage.validateControls();
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

  // Test: Validate Map controls
  test('Validate Map controls', async ({ page, map }) => {
    await waitForContentLoaded(page);
    await map.validateControls();
    await expect(map.PortfolioHazardScoreMapLegend).toBeVisible();
  });

  // Test: Validate default tab state (Overview, Hazard...)
  test('Validate default tab state', async ({ portfolioHeader }) => {
    await portfolioHeader.validateDefaultTabsState('Hazard');
  });

  // Test: Validate Score Switcher tab list (Flood, Wind...)
  test('Validate Score Switcher tab list', async ({ portfolioHazardPage }) => {
    await portfolioHazardPage.validateScoreSwitcherTablist();
  });

  // Test: Validate Scenario Dropdown
  test('Validate Scenario Dropdown', async ({ portfolioHazardPage }) => {
    await portfolioHazardPage.validateScenarioDropdown();
  });

  // Test: Validate Year Dropdown
  test('Validate Year Dropdown', async ({ portfolioHazardPage }) => {
    await portfolioHazardPage.validateYearDropdown();
  });

  // Test: Validate Pie Chart Score label for each tab
  test('Validate Pie Chart Score label for each tab', async ({
    portfolioHazardPage,
  }) => {
    await portfolioHazardPage.validateChartScoreLabel();
  });

  // Test: Validate Pie Chart & levels
  test('Validate Pie Chart & levels', async ({ portfolioHazardPage }) => {
    await portfolioHazardPage.checkLegendColorsAndTexts();
  });

  // Test: Validate Pie Chart Score description
  test('Validate Pie Chart Score description', async ({
    page,
    portfolioHazardPage,
  }) => {
    await waitForContentLoaded(page);
    await portfolioHazardPage.validateChartScoreDescription();
  });

  // Test: Validate Locations table
  test('Validate Locations table', async ({ page, portfolioHazardPage }) => {
    const yearToDefault = '2040';
    const yearTo = '2100';
    await portfolioHazardPage.validateLocationsTable(yearToDefault);

    await portfolioHazardPage.setYear(yearTo);
    await portfolioHazardPage.validateLocationsTable(yearTo);

    await expect(
      page.getByRole('link', { name: 'Marikina City' }),
    ).toBeVisible(); // we have it in the file
    await expect(
      page.getByRole('link', { name: 'Location#1840020490' }),
    ).toBeVisible(); // since we have one location without Location name
    await expect(
      portfolioHazardPage.LocationsTablePagination,
    ).not.toBeVisible(); // since we have 3 ocation is the file
    const tableRows = page.locator(
      '[data-testid="portfolio-hazard-location-drivers-table"] tbody tr',
    );
    const rowCount = await tableRows.count();
    expect(rowCount).toBe(3);
  });

  test('Validate Metric Dropdown', async ({ portfolioHazardPage }) => {
    // "Flood"
    await test.step('Validate Metric Dropdown for "Flood" Tab', async () => {
      const tab = 'Flood';
      await portfolioHazardPage.selectTab(tab);
      await portfolioHazardPage.validateMetricDropdown(tab);
    });

    // "Flood" can be changed
    await test.step('Metrics for "Flood" can be changed', async () => {
      await portfolioHazardPage.setMetric(
        'Fraction of land within the 90m grid cell inundated by high tide',
      );
    });

    // "Wind"
    await test.step('Validate Metric Dropdown for "Wind" Tab', async () => {
      const tab = 'Wind';
      await portfolioHazardPage.selectTab(tab);
      await portfolioHazardPage.validateMetricDropdown(tab);
    });

    // "Wind" can be changed
    await test.step('Metrics for "Wind" can be changed', async () => {
      await portfolioHazardPage.setMetric(
        'Average annual wind speed (in km/h)',
      );
    });

    // "Wildfire"
    await test.step('Validate Metric Dropdown for "Wildfire" Tab', async () => {
      const tab = 'Wildfire';
      await portfolioHazardPage.selectTab(tab);
      await portfolioHazardPage.validateMetricDropdown(tab);
    });

    // "Heat"
    await test.step('Validate Metric Dropdown for "Heat" Tab', async () => {
      const tab = 'Heat';
      await portfolioHazardPage.selectTab(tab);
      await portfolioHazardPage.validateMetricDropdown(tab);
    });

    // "Heat" can be changed
    await test.step('Metrics for "Heat" can be changed', async () => {
      await portfolioHazardPage.setMetric(
        'Average temperature (in C) in April',
      );
    });

    // "Precip"
    await test.step('Validate Metric Dropdown for "Precip" Tab', async () => {
      const tab = 'Precip';
      await portfolioHazardPage.selectTab(tab);
      await portfolioHazardPage.validateMetricDropdown(tab);
    });

    // "Precip" can be changed
    await test.step('Metrics for "Precip" can be changed', async () => {
      await portfolioHazardPage.setMetric(
        'Maximum daily total water equivalent precipitation (in mm) experienced at the 10-year return period',
      );
    });

    // "Cold"
    await test.step('Validate Metric Dropdown for "Cold" Tab', async () => {
      const tab = 'Cold';
      await portfolioHazardPage.selectTab(tab);
      await portfolioHazardPage.validateMetricDropdown(tab);
    });
    // "Cold" can be changed
    await test.step('Metrics for "Cold" can be changed', async () => {
      await portfolioHazardPage.setMetric(
        'Absolute cold wave: annual count of 3-day periods with avg temp <-5C',
      );
    });

    // "Drought"
    await test.step('Validate Metric Dropdown for "Drought" Tab', async () => {
      const tab = 'Drought';
      await portfolioHazardPage.selectTab(tab);
      await portfolioHazardPage.validateMetricDropdown(tab);
    });

    // "Drought" can be changed
    await test.step('Metrics for "Drought" can be changed', async () => {
      await portfolioHazardPage.setMetric(
        'Months per year where the rolling 6-month average Standardized Precipitation Evapotranspiration Index is below -2',
      );
    });

    // "Hail"
    await test.step('Validate Metric Dropdown for "Hail" Tab', async () => {
      const tab = 'Hail';
      await portfolioHazardPage.selectTab(tab);
      await portfolioHazardPage.validateMetricDropdown(tab);
    });

    // "Hail" can be changed
    await test.step('Metrics for "Hail" can be changed', async () => {
      await portfolioHazardPage.setMetric(
        'Number of days per year where environmental conditions are conducive to severe thunderstorm formation',
      );
    });
  });
});
