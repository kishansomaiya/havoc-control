import { extendedTest, expect } from '@utils/authFixture';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { PortfolioList } from '@components/PortfolioList';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { waitForContentLoaded } from '@utils/helpers';
import { PortfolioCompliancePage } from '@pages/PortfolioCompliancePage';
import { HomePage } from '@pages/HomePage';
import { DataSettingsModal } from '@components/DataSettingsModal';
import { EditPortfolioPage } from '@pages/EditPortfolioPage';
import { EditSettings } from '@components/EditSettings';
import { PortfolioLocationsPage } from '@pages/PortfolioLocationsPage';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const TIMEOUT = 120000;

const test = extendedTest.extend<{
  createPortfolioPage: CreatePortfolioPage;
  portfolioList: PortfolioList;
  portfolioItem: PortfolioItem;
  portfolioInformation: PortfolioInformation;
  portfolioHeader: PortfolioHeader;
  portfolioCompliancePage: PortfolioCompliancePage;
  homePage: HomePage;
  dataSettingsModal: DataSettingsModal;
  editPortfolioPage: EditPortfolioPage;
  editSettingsTab: EditSettings;
  portfolioLocationsPage: PortfolioLocationsPage;
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
  portfolioCompliancePage: async ({ page }, use) => {
    await use(new PortfolioCompliancePage(page));
  },
  portfolioHeader: async ({ page }, use) => {
    await use(new PortfolioHeader(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  dataSettingsModal: async ({ page }, use) => {
    await use(new DataSettingsModal(page));
  },
  editPortfolioPage: async ({ page }, use) => {
    await use(new EditPortfolioPage(page));
  },
  editSettingsTab: async ({ page }, use) => {
    await use(new EditSettings(page));
  },
  portfolioLocationsPage: async ({ page }, use) => {
    await use(new PortfolioLocationsPage(page));
  },
});

test.describe('Portfolio: COMPLIANCE > All > Location Exposure By Hazard And Year', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;

  test.beforeEach(
    'Go to Portfolio: COMPLIANCE page',
    async ({
      portfolioHeader,
      portfolioItem,
      portfolioList,
      portfolioInformation,
      portfolioCompliancePage,
      page,
      homePage,
    }) => {
      test.setTimeout(TIMEOUT);

      await homePage.navigateByURL();
      await portfolioList.searchBy(portfolioName);
      await portfolioItem.PortfolioName.click();
      await portfolioInformation.waitForResultSet();
      await portfolioInformation.clickOnLaunchButton();
      await expect(portfolioHeader.ComplianceTab).toBeVisible();
      await portfolioHeader.ComplianceTab.click();
      await waitForContentLoaded(page);
      await expect(portfolioCompliancePage.Body).toBeVisible();
    },
  );

  test('Validate main controls', async ({ portfolioCompliancePage }) => {
    await portfolioCompliancePage.validateHazardCategories();
    await portfolioCompliancePage.validateDefaultHazardCategory();
  });

  test('Validate "Location Exposure By Hazard And Year" section', async ({
    portfolioCompliancePage,
    page,
  }) => {
    const yearChipFirst =
      await portfolioCompliancePage.FiltersYearChip.first().textContent();
    const yearChipSecond =
      await portfolioCompliancePage.FiltersYearChip.nth(1).textContent();
    const yearChipThird =
      await portfolioCompliancePage.FiltersYearChip.nth(2).textContent();

    await portfolioCompliancePage.validateLocationExposureByHazardAndYear();
    await expect(
      page
        .locator('.MuiChartsAxis-label')
        .filter({ hasText: 'Number Of Locations' })
        .first(),
    ).toBeVisible();
    await expect(portfolioCompliancePage.HazardRelatedChartGraph).toHaveCount(
      4,
    );
    await expect(
      portfolioCompliancePage.HazardRelatedChartGraph.nth(0),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.HazardRelatedChartGraph.nth(1),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.HazardRelatedChartGraph.nth(2),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.HazardRelatedChartGraph.nth(3),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.HazardRelatedChartTitle.first(),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.HazardRelatedChartTitle.first(),
    ).toHaveText('Temperature-related');
    await expect(
      portfolioCompliancePage.HazardRelatedChartTitle.nth(1),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.HazardRelatedChartTitle.nth(1),
    ).toHaveText('Wind-related');
    await expect(
      portfolioCompliancePage.HazardRelatedChartTitle.nth(2),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.HazardRelatedChartTitle.nth(2),
    ).toHaveText('Water-related');
    await expect(
      portfolioCompliancePage.HazardRelatedChartTitle.nth(3),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.HazardRelatedChartTitle.nth(3),
    ).toHaveText('Solid Mass-related');
    await expect(
      portfolioCompliancePage.HazardRelatedChartGraph.first()
        .locator('.MuiChartsAxis-directionX')
        .locator('.MuiChartsAxis-tickLabel'),
    ).toHaveCount(3);
    await expect(
      portfolioCompliancePage.HazardRelatedChartGraph.first().filter({
        hasText: `${yearChipFirst}`,
      }),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.HazardRelatedChartGraph.first().filter({
        hasText: `${yearChipSecond}`,
      }),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.HazardRelatedChartGraph.first().filter({
        hasText: `${yearChipThird}`,
      }),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.HazardRelatedChartGraph.first()
        .locator('.MuiBarElement-root')
        .nth(0),
    ).toBeVisible();
  });

  test('Only selected years should be shown in the chart', async ({
    portfolioCompliancePage,
    page,
  }) => {
    const yearChipFirst =
      await portfolioCompliancePage.FiltersYearChip.first().textContent();
    const yearChipSecond =
      await portfolioCompliancePage.FiltersYearChip.nth(1).textContent();
    const yearChipThird =
      await portfolioCompliancePage.FiltersYearChip.nth(2).textContent();

    await test.step('Remove the "2025" year', async () => {
      const yearToRemove = parseInt(yearChipFirst, 10);

      await portfolioCompliancePage.removeYearChip(yearToRemove);
      await portfolioCompliancePage.isYearChipRemoved(2025);
      await waitForContentLoaded(page);
    });

    await test.step('Verify that the graph is not displayed for the removed year in the charts', async () => {
      const xAxis =
        await portfolioCompliancePage.HazardRelatedChartGraph.first()
          .locator('.MuiChartsAxis-directionX')
          .locator('.MuiChartsAxis-tickLabel');

      await expect(portfolioCompliancePage.HazardRelatedChartGraph).toHaveCount(
        4,
      );
      await expect(
        portfolioCompliancePage.HazardRelatedChartGraph.first(),
      ).toBeVisible();
      await expect(xAxis).toHaveCount(2);
      await expect(xAxis.first()).toHaveText(`${yearChipSecond}`);
      await expect(xAxis.last()).toHaveText(`${yearChipThird}`);
      await expect(
        portfolioCompliancePage.HazardRelatedChartGraph.first().filter({
          hasText: `${yearChipFirst}`,
        }),
      ).not.toBeVisible();
      await expect(
        portfolioCompliancePage.HazardRelatedChartGraph.first().filter({
          hasText: `${yearChipSecond}`,
        }),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.HazardRelatedChartGraph.first().filter({
          hasText: `${yearChipThird}`,
        }),
      ).toBeVisible();
    });
  });

  test('The chart for the disabled category should NOT be shown', async ({
    portfolioCompliancePage,
    dataSettingsModal,
    page,
  }) => {
    await test.step('Open Data Settings Modal and disable "Temperature" category', async () => {
      await portfolioCompliancePage.openDataSettings();
      await dataSettingsModal.disableToggle('Temperature');
      await dataSettingsModal.clickOnApply();
      await waitForContentLoaded(page);
    });

    await test.step('Verify that the category chart is NOT displayed', async () => {
      await expect(portfolioCompliancePage.HazardRelatedChartGraph).toHaveCount(
        3,
      );
      await expect(
        portfolioCompliancePage.HazardRelatedChartGraph.nth(0),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.HazardRelatedChartGraph.nth(1),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.HazardRelatedChartGraph.nth(2),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.HazardRelatedChartTitle.first(),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.HazardRelatedChartTitle.first(),
      ).toHaveText('Wind-related');
      await expect(
        portfolioCompliancePage.HazardRelatedChartTitle.nth(1),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.HazardRelatedChartTitle.nth(1),
      ).toHaveText('Water-related');
      await expect(
        portfolioCompliancePage.HazardRelatedChartTitle.nth(2),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.HazardRelatedChartTitle.nth(2),
      ).toHaveText('Solid Mass-related');
      await expect(
        portfolioCompliancePage.HazardRelatedChartTitle.filter({
          hasText: 'Temperature-related',
        }),
      ).not.toBeVisible();
    });
  });

  // TODO: In future count number of locations from the API or uploaded file
  test('The Y axis should display the number of locations', async ({
    portfolioCompliancePage,
    page,
  }) => {
    const locationQty = '3'; // based on the uploaded test file for the portfolio
    const yAxis = await portfolioCompliancePage.HazardRelatedChartGraph.first()
      .locator('.MuiChartsAxis-directionY')
      .locator('.MuiChartsAxis-tickLabel');

    await waitForContentLoaded(page);
    await expect(
      portfolioCompliancePage.HazardRelatedChartGraph.first(),
    ).toBeVisible();
    await expect(yAxis).toHaveCount(4); // including 0
    await expect(yAxis.first()).toBeVisible();
    await expect(yAxis.first()).toHaveText('0');
    await expect(yAxis.last()).toBeVisible();
    await expect(yAxis.last()).toHaveText(locationQty);
  });

  test('Validate "Score Level" tooltip', async ({
    portfolioCompliancePage,
    page,
  }) => {
    const tooltip = page.getByRole('tooltip');
    const numOfLocations = tooltip
      .locator('.MuiChartsTooltip-valueCell')
      .locator('p');
    const yearChipFirst =
      await portfolioCompliancePage.FiltersYearChip.first().textContent();

    // Refactored based on change request
    await expect(
      portfolioCompliancePage.HazardRelatedChartGraph.first()
        .locator('.MuiBarElement-root')
        .nth(0),
    ).toBeVisible();
    await portfolioCompliancePage.HazardRelatedChartGraph.first()
      .locator('.MuiBarElement-root')
      .nth(0)
      .hover();

    await expect(tooltip).toBeVisible();
    await expect(tooltip).toContainText(yearChipFirst);
    await expect(tooltip).toContainText('Highest');
    await expect(tooltip).toContainText('High');
    await expect(tooltip).toContainText('Medium');
    await expect(tooltip).toContainText('Low');
    await expect(tooltip).toContainText('Lowest');
    await expect(tooltip).toContainText('Not Available');
    await expect(numOfLocations.first()).toBeVisible();
    await expect(numOfLocations).toHaveCount(6);
    await expect(tooltip).toContainText('%');
  });

  test('Validate chart legend', async ({ portfolioCompliancePage }) => {
    await portfolioCompliancePage.validateChartLegend();
  });
});
