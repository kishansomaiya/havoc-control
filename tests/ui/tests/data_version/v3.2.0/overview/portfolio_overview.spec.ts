// tests/ui/tests/authenticated/result_set/portfolio_Overview.auth.result_set.spec.ts

import { extendedTest, expect } from '@utils/authFixture';
import { Map } from '@components/Map';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { PortfolioList } from '@components/PortfolioList';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { PortfolioOverviewPage } from '@pages/PortfolioOverviewPage';
// import * as path from 'path';
// import { parseCsvFile } from '@utils/parseCsvFile';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const TIMEOUT = 300000;

const test = extendedTest.extend<{
  map: Map;
  portfolioHeader: PortfolioHeader;
  createPortfolioPage: CreatePortfolioPage;
  portfolioItem: PortfolioItem;
  portfolioList: PortfolioList;
  portfolioInformation: PortfolioInformation;
  portfolioOverviewPage: PortfolioOverviewPage;
}>({
  createPortfolioPage: async ({ page }, use) => {
    await use(new CreatePortfolioPage(page));
  },
  portfolioItem: async ({ page }, use) => {
    await use(new PortfolioItem(page));
  },
  portfolioOverviewPage: async ({ page }, use) => {
    await use(new PortfolioOverviewPage(page));
  },
  portfolioHeader: async ({ page }, use) => {
    await use(new PortfolioHeader(page));
  },
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
  portfolioInformation: async ({ page }, use) => {
    await use(new PortfolioInformation(page));
  },
  map: async ({ page }, use) => {
    await use(new Map(page));
  },
});

test.describe('Portfolio: Overview', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;
  const analysisType = 'Disclosure, Perils, EI, Scores';

  test.beforeEach(
    'Navigate to Homepage',
    async ({
      homePage,
      portfolioInformation,
      portfolioOverviewPage,
      portfolioHeader,
      portfolioList,
      portfolioItem,
    }) => {
      await homePage.navigateByURL();
      await portfolioList.searchBy(portfolioName);
      await portfolioInformation.waitForResultSet();
      await portfolioItem.PortfolioName.click();
      await portfolioInformation.clickOnLaunchButton();
      await expect(portfolioHeader.OverviewTab).toBeVisible();
      await expect(portfolioOverviewPage.PortfolioOverviewBody).toBeVisible();
    },
  );

  test('Validating main controls', async ({
    portfolioOverviewPage,
    portfolioHeader,
  }) => {
    test.setTimeout(TIMEOUT);
    const dataSetVersion = '3.2.0';

    await portfolioHeader.validateControls(
      portfolioName,
      analysisType,
      dataSetVersion,
    );
    await portfolioOverviewPage.validateControls();
  });

  test('Validate breadcrumbs', async ({ portfolioHeader }) => {
    test.setTimeout(TIMEOUT);
    await portfolioHeader.validateBreadcrumbs();
  });

  test('Validating tabs', async ({ portfolioHeader }) => {
    await portfolioHeader.validateTablist();
  });

  test("Validating Map & it's controls", async ({ map }) => {
    await map.validateControls();
    await expect(map.PortfolioOverviewScoreMapLegend).toBeVisible();
  });

  test('Validating main tab state(Overview, Hazard...)', async ({
    portfolioHeader,
  }) => {
    await portfolioHeader.validateDefaultTabsState('Overview');
  });

  test('Validating tab Score Switcher Tab list(All Perils, Flood...)', async ({
    portfolioOverviewPage,
  }) => {
    await portfolioOverviewPage.validateScoreSwitcherTablist();
  });

  test('Validating tab Score Switcher Tabs state', async ({
    portfolioOverviewPage,
  }) => {
    await portfolioOverviewPage.validateDefaultScoreSwitcherTabsState();
  });
  test('Validating tab Locations Table Title', async ({
    portfolioOverviewPage,
  }) => {
    await portfolioOverviewPage.validateLocationsTableTitle();
  });
  test('Validating Charts Item Titles', async ({ portfolioOverviewPage }) => {
    await portfolioOverviewPage.validateRiskScoreSmallChartsItemTitles();
  });
  test('Validating Charts Item Tooltips', async ({ portfolioOverviewPage }) => {
    await portfolioOverviewPage.validateRiskScoreSmallChartsItemTooltips();
  });
  test('Validating Charts Values', async ({ portfolioOverviewPage }) => {
    await portfolioOverviewPage.validateRiskScoreSmallChartsValues();
  });
  test('Validating Charts Levels', async ({ portfolioOverviewPage }) => {
    await portfolioOverviewPage.validateRiskScoreSmallChartsLevels();
  });
  test('Validating Locations table Tooltips', async ({
    portfolioOverviewPage,
  }) => {
    await portfolioOverviewPage.validateLocationsTooltips();
  });
  test('Validating Locations table data', async ({
    page,
    portfolioOverviewPage,
  }) => {
    await expect(
      page.getByRole('link', { name: 'Marikina City' }),
    ).toBeVisible(); // we have it in the file
    await expect(
      page.getByRole('link', { name: 'Location#1840020490' }),
    ).toBeVisible(); // since we have one location without Location name
    await expect(
      portfolioOverviewPage.LocationsScoreTablePagination,
    ).not.toBeVisible(); // since we have 3 ocation is the file
    const tableRows = await page.locator(
      '[data-testid="portfolio-overview-location-score-table"] tbody tr',
    );
    const rowCount = await tableRows.count();
    expect(rowCount).toBe(3);
  });
});
