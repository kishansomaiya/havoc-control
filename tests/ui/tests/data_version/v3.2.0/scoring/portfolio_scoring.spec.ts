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
import { PortfolioScoringPage } from '@pages/PortfolioScoringPage';
import { HomePage } from '@pages/HomePage';
import * as path from 'path';
import { parseCsvFile } from '@utils/parseCsvFile';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const TIMEOUT = 120000;

const test = extendedTest.extend<{
  createPortfolioPage: CreatePortfolioPage;
  portfolioList: PortfolioList;
  portfolioItem: PortfolioItem;
  portfolioInformation: PortfolioInformation;
  portfolioHeader: PortfolioHeader;
  portfolioScoringPage: PortfolioScoringPage;
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
  portfolioScoringPage: async ({ page }, use) => {
    await use(new PortfolioScoringPage(page));
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

test.describe('Portfolio: SCORING', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;
  const dataSetVersion = PORTFOLIO_CONFIGS['v3.2.0'].dataSetVersion;
  const analysisType = 'Disclosure, Perils, EI, Scores';
  let locationsQty: number;
  let fileData: any[] = [];

  test.beforeEach(
    'Create Portfolio > Await the resultset > Go to Portfolio > Scoring page',
    async ({
      portfolioHeader,
      portfolioItem,
      portfolioList,
      portfolioInformation,
      portfolioScoringPage,
      page,
      homePage,
    }) => {
      test.setTimeout(TIMEOUT); // Extend the test timeout

      const fileName = 'CSV_3_cities.csv';
      const filePath = path.resolve(`./fixtures/${fileName}`);
      fileData = await parseCsvFile(filePath);
      locationsQty = fileData.length;

      await homePage.navigateByURL();
      await portfolioList.searchBy(portfolioName);
      await portfolioItem.PortfolioName.click();
      await portfolioInformation.waitForResultSet();
      await portfolioInformation.clickOnLaunchButton();
      await expect(portfolioHeader.ScoringTab).toBeVisible();
      await portfolioHeader.ScoringTab.click();
      await waitForContentLoaded(page);
      await expect(portfolioScoringPage.Body).toBeVisible();
      await waitForContentLoaded(page);
    },
  );

  // Test: Validate main controls
  test('Validate main controls', async ({
    portfolioHeader,
    portfolioScoringPage,
  }) => {
    test.setTimeout(TIMEOUT);
    await portfolioHeader.validateControls(
      portfolioName,
      analysisType,
      dataSetVersion,
    );
    await portfolioScoringPage.validateControls();
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
  });

  // Test: Validate default tab state (Overview, Hazard...)
  test('Validate default tab state', async ({ portfolioHeader }) => {
    await portfolioHeader.validateDefaultTabsState('Scoring');
  });

  // Test: Validate Score Switcher tab list (All Perils, Flood, Wind...)
  test('Validate Score Switcher tab list', async ({ portfolioScoringPage }) => {
    await portfolioScoringPage.validateScoreSwitcherTablist();
  });

  // Test: Validate "Score type" dropdown
  test('Validate "Score type" dropdown', async ({ portfolioScoringPage }) => {
    await portfolioScoringPage.validateScoreTypeDropdown();
  });

  // Test: Validate Default Score Switcher Tabs State
  test('Validate Default Score Switcher Tabs State', async ({
    portfolioScoringPage,
  }) => {
    await portfolioScoringPage.validateDefaultScoreSwitcherTabsState();
  });

  // Test: Validate Chart Titles
  test('Validate chart TITLES', async ({ portfolioScoringPage }) => {
    await portfolioScoringPage.validateRiskScoreSmallChartsItemTitles();
  });

  // Test: Validate Chart Descriptions
  test('Validate chart DESCRIPTIONS', async ({
    page,
    portfolioScoringPage,
  }) => {
    await waitForContentLoaded(page);
    await portfolioScoringPage.validateRiskScoreSmallChartsItemTooltips();
  });

  // Test: Validate Chart Values
  test('Validate chart VALUES', async ({ page, portfolioScoringPage }) => {
    await waitForContentLoaded(page);
    await portfolioScoringPage.validateRiskScoreSmallChartsValues();
  });

  // Test: Validate Chart Levels
  test('Validate chart LEVELS', async ({ page, portfolioScoringPage }) => {
    await waitForContentLoaded(page);
    await portfolioScoringPage.validateRiskScoreSmallChartsLevels();
  });

  // Test: Validate Chart Legend
  test('Validate chart LEGEND', async ({ page, portfolioScoringPage }) => {
    await waitForContentLoaded(page);
    await portfolioScoringPage.verifyChartLegend();
  });

  // Test: Verify Scatter Chart Items
  test('Verify Scatter Chart Items', async ({ page, portfolioScoringPage }) => {
    await waitForContentLoaded(page);
    const expectedQty = locationsQty;
    const scatterItems = portfolioScoringPage.ScatterChartItem;
    const scatterItemsCircleCount =
      portfolioScoringPage.ScatterChartItemCircle;

    await test.step('Verify items qty', async () => {
      await expect(scatterItems).toHaveCount(expectedQty);
      await expect(scatterItemsCircleCount).toHaveCount(expectedQty);
    });

    await test.step('Verify "short" tooltip text on hover', async () => {
      // Step 2: Loop through each scatter chart item and hover
      const scatterItemsCount = await scatterItems.count();

      for (let i = 0; i < scatterItemsCount; i++) {
        const scatterItem = scatterItems.nth(i);

        // Hover over the scatter item to trigger the tooltip
        await scatterItem.hover();

        // Wait for the tooltip to become visible
        await expect(
          portfolioScoringPage.ScatterChartShortTooltip,
        ).toBeVisible();
        await expect(
          portfolioScoringPage.ScatterChartShortTooltipText,
        ).toBeVisible();

        // Get the actual tooltip text
        const actualTooltipText =
          await portfolioScoringPage.ScatterChartShortTooltipText.textContent();

        // Step 3: Compare the displayed tooltip with locationsData
        let matchedLocation = false;

        for (const location of fileData) {
          const { locationId, locationName } = location;

          // Prepare the expected tooltip text
          let expectedTooltipText =
            locationName && locationName.trim() !== ''
              ? `Location ID: ${locationId} (${locationName})`
              : `Location ID: ${locationId}`;

          // Compare the actual tooltip text with the expected
          if (actualTooltipText.includes(expectedTooltipText)) {
            matchedLocation = true;
            break;
          }
        }

        await portfolioScoringPage.HazardScoresTitle.click();

        // Optional: Add a short delay to prevent too fast interactions
        await page.waitForTimeout(1000);
      }
    });

    await test.step('Verify circle items tooltip', async () => {
      await scatterItems.first().click();
      await expect(portfolioScoringPage.ScatterChartTooltip).toBeVisible();
      await expect(portfolioScoringPage.ScatterChartTooltipText).toBeVisible();
      await expect(
        portfolioScoringPage.ScatterChartTooltipCloseButton,
      ).toBeVisible();
      await expect(
        portfolioScoringPage.HazardScoresLocationTitle,
      ).toBeVisible();
      await expect(
        portfolioScoringPage.HazardScoresLocationTitle,
      ).toContainText('Location ');
      await expect(
        portfolioScoringPage.HazardScoresLocationXIcon,
      ).toBeVisible();
      await portfolioScoringPage.HazardScoresLocationXIcon.click();
      await expect(
        portfolioScoringPage.HazardScoresLocationXIcon,
      ).not.toBeVisible();
      await expect(
        portfolioScoringPage.HazardScoresLocationTitle,
      ).toContainText('All Locations');
      await expect(portfolioScoringPage.ScatterChartTooltip).not.toBeVisible();
      await scatterItems.first().click();
      await expect(portfolioScoringPage.ScatterChartTooltip).toBeVisible();
      await expect(
        portfolioScoringPage.HazardScoresLocationTitle,
      ).toBeVisible();
      await expect(
        portfolioScoringPage.HazardScoresLocationTitle,
      ).toContainText('Location ');
      await expect(
        portfolioScoringPage.ScatterChartTooltipCloseButton,
      ).toBeVisible();
      await portfolioScoringPage.ScatterChartTooltipCloseButton.click();
      await expect(portfolioScoringPage.ScatterChartTooltip).not.toBeVisible();
      await expect(
        portfolioScoringPage.HazardScoresLocationXIcon,
      ).not.toBeVisible();
      await expect(
        portfolioScoringPage.HazardScoresLocationTitle,
      ).toContainText('All Locations');
    });

    await test.step('Verify "Show Location ID"', async () => {
      // Check
      await portfolioScoringPage.checkShowLocationId();
      await expect(
        portfolioScoringPage.ScatterChartItemLocationId.first(),
      ).toBeVisible();
      // await expect(portfolioScoringPage.ScatterChartItemLocationId.first()).toHaveText(locationId);

      // Uncheck
      await portfolioScoringPage.unCheckShowLocationId();
      await expect(
        portfolioScoringPage.ScatterChartItemLocationId,
      ).not.toBeVisible();
    });
  });
});
