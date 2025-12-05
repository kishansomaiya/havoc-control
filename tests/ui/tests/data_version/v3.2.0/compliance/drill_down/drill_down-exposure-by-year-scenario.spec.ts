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

test.describe('Portfolio: COMPLIANCE > Drill Down > [Category] Exposure by Year and Scenario', () => {
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

  test('Open a single category and validate default title of the "<CATEGORY>-Exposure by Year and Scenario" section', async ({
    portfolioCompliancePage,
  }) => {
    await test.step('Validate a "Temperature" category', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
      await portfolioCompliancePage.validateExposureByYearAndScenarioTitle(
        category,
      );
    });
    await test.step('Validate a "Wind" category', async () => {
      const category = 'Wind';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
      await portfolioCompliancePage.validateExposureByYearAndScenarioTitle(
        category,
      );
    });
    await test.step('Validate a "Water" category', async () => {
      const category = 'Water';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
      await portfolioCompliancePage.validateExposureByYearAndScenarioTitle(
        category,
      );
    });
    await test.step('Validate a "Solid Mass" category', async () => {
      const category = 'Solid Mass';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
      await portfolioCompliancePage.validateExposureByYearAndScenarioTitle(
        category,
      );
    });
  });

  test('Validate "<Category> Exposure By Hazard And Year" chart', async ({
    portfolioCompliancePage,
    page,
  }) => {
    const yearChipFirst =
      await portfolioCompliancePage.FiltersYearChip.first().textContent();
    const yearChipSecond =
      await portfolioCompliancePage.FiltersYearChip.nth(1).textContent();
    const yearChipThird =
      await portfolioCompliancePage.FiltersYearChip.nth(2).textContent();

    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });

    await test.step('Validate chart', async () => {
      await expect(
        page
          .locator('.MuiChartsAxis-label')
          .filter({ hasText: 'Number Of Locations' })
          .first(),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario,
      ).toHaveCount(1);
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario,
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.locator(
          '.MuiChartsAxis-directionX',
        ).locator('.MuiChartsAxis-tickLabel'),
      ).toHaveCount(3);
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.filter(
          {
            hasText: `${yearChipFirst}`,
          },
        ),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.filter(
          {
            hasText: `${yearChipSecond}`,
          },
        ),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.filter(
          {
            hasText: `${yearChipThird}`,
          },
        ),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.locator(
          '.MuiBarElement-root',
        ).nth(0),
      ).toBeVisible();
    });
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

    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('Remove the "2025" year', async () => {
      const yearToRemove = parseInt(yearChipFirst, 10);

      await portfolioCompliancePage.removeYearChip(yearToRemove);
      await portfolioCompliancePage.isYearChipRemoved(2025);
      await waitForContentLoaded(page);
    });

    await test.step('Verify that the graph is not displayed for the removed year in the charts', async () => {
      const xAxis =
        await portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.locator(
          '.MuiChartsAxis-directionX',
        ).locator('.MuiChartsAxis-tickLabel');

      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario,
      ).toHaveCount(1);
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario,
      ).toBeVisible();
      await expect(xAxis).toHaveCount(2);
      await expect(xAxis.first()).toHaveText(`${yearChipSecond}`);
      await expect(xAxis.last()).toHaveText(`${yearChipThird}`);
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.filter(
          {
            hasText: `${yearChipFirst}`,
          },
        ),
      ).not.toBeVisible();
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.filter(
          {
            hasText: `${yearChipSecond}`,
          },
        ),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.filter(
          {
            hasText: `${yearChipThird}`,
          },
        ),
      ).toBeVisible();
    });
  });

  // TODO: In future count number of locations from the API or uploaded file
  test('The Y axis should display the number of locations', async ({
    portfolioCompliancePage,
    page,
  }) => {
    const locationQty = '3'; // based on the uploaded test file for the portfolio
    const yAxis =
      await portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.locator(
        '.MuiChartsAxis-directionY',
      ).locator('.MuiChartsAxis-tickLabel');
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('Verify the number of locations', async () => {
      await waitForContentLoaded(page);
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario,
      ).toBeVisible();
      await expect(yAxis).toHaveCount(4); // including 0
      await expect(yAxis.first()).toBeVisible();
      await expect(yAxis.first()).toHaveText('0');
      await expect(yAxis.nth(1)).toBeVisible();
      await expect(yAxis.nth(1)).toHaveText('1');
      await expect(yAxis.nth(2)).toBeVisible();
      await expect(yAxis.nth(2)).toHaveText('2');
      await expect(yAxis.last()).toBeVisible();
      await expect(yAxis.last()).toHaveText(locationQty);
    });
  });

  test('Validate "Score Level" tooltip for all metrics', async ({
    portfolioCompliancePage,
    page,
  }) => {
    const tooltip = page.getByRole('tooltip');
    const numOfLocations = tooltip
      .locator('.MuiChartsTooltip-valueCell')
      .locator('p');
    const yearChipFirst =
      await portfolioCompliancePage.FiltersYearChip.first().textContent();
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('Validate tooltip data', async () => {
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.locator(
          '.MuiBarElement-root',
        ).nth(0),
      ).toBeVisible();
      await portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.locator(
        '.MuiBarElement-root',
      )
        .nth(0)
        .hover();

      // Refactored based on change request
      await expect(tooltip).toBeVisible();
      await expect(numOfLocations.first()).toBeVisible();
      await expect(numOfLocations).toHaveCount(6);
      await expect(tooltip).toContainText(yearChipFirst);
      await expect(tooltip).toContainText('Highest');
      await expect(tooltip).toContainText('High');
      await expect(tooltip).toContainText('Medium');
      await expect(tooltip).toContainText('Low');
      await expect(tooltip).toContainText('Lowest');
      await expect(tooltip).toContainText('Not Available');
      await expect(tooltip).toContainText('%');
    });
  });

  test('Validate "Score Level" tooltip for a single metric', async ({
    portfolioCompliancePage,
  }) => {
    const yearChipFirst =
      await portfolioCompliancePage.FiltersYearChip.first().textContent();

    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('UNCHECK the "Select all" toggle', async () => {
      await portfolioCompliancePage.uncheckSelectAllToggle();
    });

    await test.step('Validate tooltip data', async () => {
      await expect(
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.locator(
          '.MuiBarElement-root',
        ).nth(0),
      ).toBeVisible();
      await portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenario.locator(
        '.MuiBarElement-root',
      )
        .nth(0)
        .hover();

      await expect(portfolioCompliancePage.ChartTooltip).toBeVisible();
      await expect(portfolioCompliancePage.ChartTooltipYear).toHaveText(
        yearChipFirst,
      );
      await expect(portfolioCompliancePage.ChartTooltipScoreColor).toHaveCount(
        6,
      );
      await expect(
        portfolioCompliancePage.ChartTooltipScoreColor.first(),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartTooltipScoreColor.last(),
      ).toBeVisible();
      await expect(portfolioCompliancePage.ChartTooltipScoreLabel).toHaveCount(
        6,
      );
      await expect(
        portfolioCompliancePage.ChartTooltipScoreLabel.first(),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartTooltipScoreLabel.first(),
      ).toHaveText('Highest');
      await expect(
        portfolioCompliancePage.ChartTooltipScoreLabel.last(),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartTooltipScoreLabel.last(),
      ).toHaveText('Not Available');
      await expect(portfolioCompliancePage.ChartTooltipScoreValue).toHaveCount(
        6,
      );
      await expect(
        portfolioCompliancePage.ChartTooltipScoreValue.first(),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartTooltipScoreValue.last(),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartTooltipScorePercantage,
      ).toHaveCount(6);
      await expect(
        portfolioCompliancePage.ChartTooltipScorePercantage.first(),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartTooltipScorePercantage.last(),
      ).toBeVisible();
      // await expect(portfolioCompliancePage.ChartTooltipScoreValue.first()).toHaveText('calculated value'); // TODO: Add test if have time
      // await expect(portfolioCompliancePage.ChartTooltipScoreValue.last()).toHaveText('calculated value'); // TODO: Add test if have time
    });
  });

  test('Validate chart legend', async ({ portfolioCompliancePage }) => {
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('Validate legend', async () => {
      await portfolioCompliancePage.ChartLegend.scrollIntoViewIfNeeded();
      await portfolioCompliancePage.validateChartLegend();
    });
  });

  test('If the "Select all" toggle is Disabled, the chart title matches the selected metric label', async ({
    portfolioCompliancePage,
  }) => {
    const categoryTitle = 'Temperature'; // TODO: set the categoory for test

    await test.step('Navigate to "Temperature" drill down page', async () => {
      await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
    });

    await test.step('Disable a "Select all" toggle and verify the chart title', async () => {
      const radioButtonLocatorSelectAll =
        portfolioCompliancePage.ChartsSingleRelatedHazardsSelectAll.locator(
          'input',
        );
      const sectionLocators = {
        chronic: portfolioCompliancePage.CategoryRelatedHazardsChronic,
        acute: portfolioCompliancePage.CategoryRelatedHazardsAcute,
      };
      const metricRadioButton =
        portfolioCompliancePage.DrillDownMetricsRadioButton;
      const metricRadioButtonLabel =
        portfolioCompliancePage.DrillDownMetricsRadioButtonLabel;
      const enhancedNameFirst = await sectionLocators.chronic
        .locator(metricRadioButtonLabel.first())
        .textContent();
      const enhancedNameSecond = await sectionLocators.chronic
        .locator(metricRadioButtonLabel.nth(1))
        .textContent();

      await expect(
        portfolioCompliancePage.CategoryRelatedHazards,
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartsSingleRelatedHazardsSelectAll,
      ).toBeVisible();
      await expect(radioButtonLocatorSelectAll).toBeChecked();
      await radioButtonLocatorSelectAll.uncheck();
      await expect(sectionLocators.chronic).toBeVisible();
      await expect(
        sectionLocators.chronic.locator(metricRadioButton.first()),
      ).toBeVisible();
      await expect(
        sectionLocators.chronic.locator(metricRadioButton.first()),
      ).toBeChecked();

      const metricRadioButtonUiLocator =
        portfolioCompliancePage.DrillDownMetricsRadioButtonBlock;
      const chartTitleUiLocator =
        portfolioCompliancePage.ChartSinglecategoryExposureByYearAndScenarioTitle;

      await expect(metricRadioButtonUiLocator.first()).toBeVisible();
      await expect(chartTitleUiLocator).toBeVisible();
      await expect(chartTitleUiLocator).toHaveText(enhancedNameFirst);

      //change the metric
      await expect(metricRadioButtonUiLocator.nth(1)).toBeVisible();
      await expect(metricRadioButton.nth(1)).toBeVisible();
      await expect(metricRadioButton.nth(1)).not.toBeChecked();
      await metricRadioButton.nth(1).check();
      await expect(metricRadioButton.nth(0)).not.toBeChecked();
      await expect(metricRadioButton.nth(1)).toBeChecked();
      await expect(chartTitleUiLocator).toHaveText(enhancedNameSecond);
    });
  });
});
