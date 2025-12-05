// tests/ui/pages/PortfolioOverviewPage.ts

import { Page, Locator,expect } from '@playwright/test';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';
import { waitForContentLoaded } from '@utils/helpers';
const envUrl = testConfig[ENV].appUrl;

export class PortfolioOverviewPage {
  readonly page: Page;
  readonly portfolioHeader: PortfolioHeader;
  readonly PortfolioOverviewBody: Locator;
  readonly PortfolioOverviewMap: Locator;
  readonly PortfolioOverviewScoreSwitcher: Locator;
  readonly PortfolioOverviewScoreSwitcherTab: Locator;
  readonly PortfolioOverviewScoreSwitcherItem: Locator;
  readonly PortfolioOverviewScoreLevelsMapLegend: Locator;
  readonly PortfolioOverviewClimateScoreCharts: Locator;
  readonly PortfolioOverviewClimateScoreChartsHeader: Locator;
  readonly PortfolioOverviewClimateScoreChartsHeaderTitle: Locator;
  readonly PortfolioOverviewClimateScoreChartsHeaderDescription: Locator;
  readonly PortfolioOverviewClimateRiskScoreChart: Locator;
  readonly PortfolioOverviewClimateRiskScoreAllChart: Locator;
  readonly PortfolioOverviewClimateRiskScoreChartItem: Locator;
  readonly RiskScoreSmallChartsItem: Locator;
  readonly RiskScoreSmallChartsItemBlock: Locator;
  readonly RiskScoreSmallChartsItemTitle: Locator;
  readonly RiskScoreSmallChartsItemTooltip: Locator;
  readonly RiskScoreSmallChartsItemTooltipIcon: Locator;
  readonly RiskScoreSmallChartsItemValue: Locator;
  readonly RiskScoreSmallChartsItemScoreLevel: Locator;
  readonly LocationsScoreTableBlock: Locator;
  readonly LocationsScoreTableTitle: Locator;
  readonly LocationsScoreTable: Locator;
  readonly LocationsScoreTableHeader: Locator;
  readonly LocationsScoreTableHeaderColumnFirst: Locator;
  readonly LocationsScoreTableColumnName: Locator;
  readonly LocationsScoreTableColumnNameTooltip: Locator;
  readonly LocationsScoreTableRow: Locator;
  readonly LocationsScoreTableLocationCell: Locator;
  readonly LocationsScoreTableLocationName: Locator;
  readonly LocationsScoreTableLocationValueCurrent: Locator;
  readonly LocationsScoreTableLocationValueChange: Locator;
  readonly LocationsScoreTableLocationValueOverall: Locator;
  readonly LocationsScoreTablePagination: Locator;

  constructor(page: Page) {
    this.page = page;
    this.portfolioHeader = new PortfolioHeader(page);

    // Body
    this.PortfolioOverviewBody = page.getByTestId('portfolio-overview-body');

    // Map & score switchers
    this.PortfolioOverviewMap = page.getByTestId('portfolio-overview-map');
    this.PortfolioOverviewScoreSwitcher = page.getByTestId(
      'portfolio-overview-score-switcher',
    );
    this.PortfolioOverviewScoreSwitcherTab =
      page.getByTestId('score-switcher-tab');
    this.PortfolioOverviewScoreSwitcherItem = page.getByTestId(
      'score-switcher-item',
    );
    this.PortfolioOverviewClimateScoreCharts = page.getByTestId(
      'portfolio-overview-score-map-legend',
    );

    // Portfolio Climate Scores Charts
    this.PortfolioOverviewClimateScoreCharts = page.getByTestId(
      'portfolio-overview-climate-score-chart',
    );
    this.PortfolioOverviewClimateScoreChartsHeader = page.getByTestId(
      'portfolio-overview-climate-score-chart-header',
    );
    this.PortfolioOverviewClimateScoreChartsHeaderTitle = page.getByTestId(
      'portfolio-overview-climate-score-chart-header-title',
    );
    this.PortfolioOverviewClimateScoreChartsHeaderDescription =
      page.getByTestId(
        'portfolio-overview-climate-score-chart-header-description',
      );
    this.PortfolioOverviewClimateRiskScoreChart = page.getByTestId(
      'portfolio-overview-climate-risk-score-chart',
    );
    this.PortfolioOverviewClimateRiskScoreAllChart = page.getByTestId(
      'portfolio-overview-climate-risk-score-small-charts',
    );
    this.PortfolioOverviewClimateRiskScoreChartItem = page.getByTestId(
      'portfolio-overview-climate-risk-score-small-charts-item',
    );
    this.RiskScoreSmallChartsItem = page.getByTestId(
      'risk-score-small-charts-item',
    );
    this.RiskScoreSmallChartsItemBlock = page.getByTestId(
      'risk-score-small-charts-item-block',
    );
    this.RiskScoreSmallChartsItemTitle = page.getByTestId(
      'risk-score-small-charts-item-title',
    );
    this.RiskScoreSmallChartsItemTooltip = page.getByTestId(
      'risk-score-small-charts-item-tooltip',
    );
    this.RiskScoreSmallChartsItemTooltipIcon = page.getByTestId(
      'risk-score-small-charts-item-tooltip-icon',
    );
    this.RiskScoreSmallChartsItemValue = page.getByTestId(
      'risk-score-small-charts-item-value',
    );
    this.RiskScoreSmallChartsItemScoreLevel = page.getByTestId(
      'risk-score-small-charts-item-score-level',
    );

    // Locations Score Table
    this.LocationsScoreTableBlock = page.getByTestId(
      'portfolio-overview-location-score-table-block',
    );
    this.LocationsScoreTableTitle = page.getByTestId(
      'portfolio-overview-location-score-table-title',
    );
    this.LocationsScoreTable = page.getByTestId(
      'portfolio-overview-location-score-table',
    );
    this.LocationsScoreTableHeader = page.getByTestId(
      'portfolio-overview-location-score-table-header',
    );
    this.LocationsScoreTableHeaderColumnFirst = page.getByTestId(
      'location-score-table-column-first',
    );
    this.LocationsScoreTableColumnName = page.getByTestId(
      'portfolio-overview-location-score-table-column-name',
    );
    this.LocationsScoreTableColumnNameTooltip = page.getByTestId(
      'portfolio-overview-location-score-table-column-name-tooltip',
    );
    this.LocationsScoreTableRow = page.getByTestId(
      'portfolio-overview-location-score-table-row',
    );
    this.LocationsScoreTableLocationCell = page.getByTestId(
      'portfolio-overview-location-score-table-location-cell',
    );
    this.LocationsScoreTableLocationName = page.getByTestId(
      'location-score-table-location-name',
    );
    this.LocationsScoreTableLocationValueCurrent = page.getByTestId(
      'location-score-table-location-value-current',
    );
    this.LocationsScoreTableLocationValueChange = page.getByTestId(
      'location-score-table-location-value-change',
    );
    this.LocationsScoreTableLocationValueOverall = page.getByTestId(
      'location-score-table-location-value-overall',
    );
    this.LocationsScoreTablePagination = page.getByTestId(
      'location-score-table-pagination',
    );
  }
  async navigateByURL(portfolioId: string) {
    const portfolioOverviewPageUrl = `${envUrl}/portfolios/${portfolioId}`;
    await this.page.goto(portfolioOverviewPageUrl);
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);
    await expect(this.portfolioHeader.OverviewTab).toBeVisible();
  }

  async validateControls() {
    const chartsTitle = 'Portfolio Climate Scores';
    const chartsDescription =
      'Jupiter Climate Scores translate physical climate hazards into a score, calculated on a scale from 0-100 using the SSP5-8.5 scenario. The scores use the years 2020 and 2050 to measure the change in climate hazard. A lower score reflects less exposure to climate.';
    const locationTitle = 'Location';
    await this.page.waitForLoadState('load');
    await expect(
      this.PortfolioOverviewClimateScoreChartsHeaderTitle,
    ).toBeVisible();
    await expect(
      this.PortfolioOverviewClimateScoreChartsHeaderTitle,
    ).toContainText(chartsTitle);
    await expect(
      this.PortfolioOverviewClimateScoreChartsHeaderDescription,
    ).toBeVisible();
    await expect(
      this.PortfolioOverviewClimateScoreChartsHeaderDescription,
    ).toContainText(chartsDescription);
    await expect(this.LocationsScoreTableHeaderColumnFirst).toBeVisible();
    await expect(this.LocationsScoreTableHeaderColumnFirst).toContainText(
      locationTitle,
    );
    await expect(this.LocationsScoreTableLocationCell.first()).toBeVisible();
    await expect(this.LocationsScoreTableLocationName.first()).toBeVisible();
    await expect(
      this.LocationsScoreTableLocationValueCurrent.first(),
    ).toBeVisible();
    await expect(
      this.LocationsScoreTableLocationValueChange.first(),
    ).toBeVisible();
    await expect(
      this.LocationsScoreTableLocationValueOverall.first(),
    ).toBeVisible();
  }

  async validateScoreSwitcherTablist() {
    // Define the tab names you want to check
    const tabNames = [
      'All Perils',
      'Flood',
      'Wind',
      'Wildfire',
      'Heat',
      'Precip',
      'Cold',
      'Drought',
      'Hail',
    ];
    // Loop through each tab and check if it is visible
    for (const tabName of tabNames) {
      // Find the tab by its inner text and check if it's visible
      const tabLocator = this.PortfolioOverviewScoreSwitcherItem.locator(
        `text=${tabName}`,
      );
      await expect(tabLocator).toBeVisible();
    }
  }

  async validateDefaultScoreSwitcherTabsState() {
    // Define the default selected tab
    const defaultTabName = 'Flood';

    // Get the locator for the selected tab by checking for the 'MuiButton-contained' class
    const selectedTab = this.PortfolioOverviewScoreSwitcherItem.filter({
      hasText: defaultTabName,
    });
    await expect(selectedTab).toHaveClass(/MuiButton-contained/);

    // Define the other tabs you want to check for not being selected
    const otherTabs = [
      'All Perils',
      'Wind',
      'Wildfire',
      'Heat',
      'Precip',
      'Cold',
      'Drought',
      'Hail',
    ];

    // Loop through each other tab and check that it's not selected
    for (const tabName of otherTabs) {
      const tabLocator = this.PortfolioOverviewScoreSwitcherItem.filter({
        hasText: tabName,
      });
      if (tabName === 'Hail') {
        // For the disabled tab "Hail", verify that it is disabled
        await expect(tabLocator).toBeDisabled();
      } else {
        // For other tabs, check that they do not have the 'MuiButton-contained' class
        await expect(tabLocator).not.toHaveClass(/MuiButton-contained/);
      }
    }
  }
  async validateLocationsTableTitle() {
    // Define the score switcher tabs
    const tabs = [
      'All Perils',
      'Flood',
      'Wind',
      'Wildfire',
      'Heat',
      'Precip',
      'Cold',
      'Drought',
      // 'Hail' is disabled, so we exclude it
    ];

    // Iterate over each tab and perform actions
    for (const tabName of tabs) {
      // Find the locator for the current tab
      const tabLocator = this.PortfolioOverviewScoreSwitcherItem.filter({
        hasText: tabName,
      });

      // Click the tab
      await tabLocator.click();

      // Construct the expected title
      const expectedTitle = `Locations Ranked by ${tabName} Score`;

      // Locate the title element
      const titleLocator = this.LocationsScoreTableTitle;
      // Verify that the title text matches the selected tab
      await expect(titleLocator).toHaveText(expectedTitle);
    }
  }

  async validateRiskScoreSmallChartsItemTitles() {
    // Define the expected titles, but handle the "Precip" case separately
    const expectedTitles = [
      'All Perils',
      'Flood',
      'Wind',
      'Wildfire',
      'Heat',
      'Precip',
      'Cold',
      'Drought',
      'Hail',
    ];

    // Loop through each expected title
    for (const title of expectedTitles) {
      // Handle the case where 'Precip' should match 'Precipitation' in the UI
      const expectedText = title === 'Precip' ? 'Precipitation' : title;

      // Find the locator for each chart item title by filtering based on the expected text
      const chartItemTitle = this.RiskScoreSmallChartsItemTitle.filter({
        hasText: expectedText,
      });

      // Check that the title is visible
      await expect(chartItemTitle).toBeVisible();

      // Check that the title contains the correct text
      await expect(chartItemTitle).toHaveText(expectedText);
    }
  }

  async validateRiskScoreSmallChartsItemTooltips() {
    // Define the expected titles (excluding 'All Perils') and their corresponding tooltip descriptions
    const expectedTooltips = {
      Flood:
        'Score uses the mean hazard values for the 200-year return period flood depth and the mean fraction of the land within the 90m grid cell with 200-year return period flooding',
      Wind: 'Score uses the mean hazard value for the 100-year return period maximum 1-minute sustained wind speed',
      Wildfire:
        'Score uses the mean value for the annual probability of a major wildfire either originating or propagating into the 90m cell the asset is located within',
      Heat: 'Score uses the mean hazard values for the number of days per year exceeding 35°C, number of days per year the Wet Bulb Globe temperature exceeds 32°C, and the number of Cooling Degree Days per year',
      Precip:
        'Score uses the mean hazard value for the 100-year return period maximum daily total water equivalent precipitation',
      Cold: 'Score uses the mean hazard values for the number of days per year below 0°C and the number of Heating Degree Days per year',
      Drought:
        'Score uses the mean value for the annual water stress (ratio of human water demand to water supply) for local and upstream watersheds',
      Hail: 'Score uses the mean hazard value for the number of days per year where large hail is possible (note: Overall score for hail is not available due to large uncertainty surrounding hail patterns under a changing climate)',
    };

    // Loop through each expected title and its corresponding tooltip
    for (const [title, expectedTooltip] of Object.entries(expectedTooltips)) {
      // Find the locator for the title element
      const titleLocator = this.RiskScoreSmallChartsItemTitle.filter({
        hasText: title,
      });

      // Find the corresponding tooltip for the title
      const tooltipLocator = titleLocator
        .locator('..')
        .locator('[data-testid="risk-score-small-charts-item-tooltip"]');

      // Check that the tooltip is visible
      await expect(tooltipLocator).toBeVisible();

      // Check that the aria-label contains the correct description text
      await expect(tooltipLocator).toHaveAttribute(
        'aria-label',
        expectedTooltip,
      );
    }
  }

  async validateLocationsTooltips() {
    // Define the expected titles and their corresponding tooltip descriptions
    const expectedTooltips = {
      'Current Hazard': 'Measures the absolute level of hazard for 2020',
      'Change Hazard':
        'Measures the level of change between the years 2050 and 2020',
      'Overall Hazard':
        'Combines the hazard and change scores and benchmarks this value against a global weighted average of the scores in populated areas',
    };

    // Loop through each expected title and its corresponding tooltip
    for (const [title, expectedTooltip] of Object.entries(expectedTooltips)) {
      // Find the locator for the title element
      const titleLocator = this.LocationsScoreTableColumnName.filter({
        hasText: title,
      });

      // Find the corresponding tooltip for the title
      const tooltipLocator = titleLocator
        .locator('..')
        .locator(this.LocationsScoreTableColumnNameTooltip);

      // Check that the tooltip is visible
      await expect(tooltipLocator).toBeVisible();

      // Check that the aria-label contains the correct description text
      await expect(tooltipLocator).toHaveAttribute(
        'aria-label',
        expectedTooltip,
      );
    }
  }

  async validateRiskScoreSmallChartsValues() {
    const expectedItems = [
      'All Perils',
      'Flood',
      'Wind',
      'Wildfire',
      'Heat',
      'Precipitation',
      'Cold',
      'Drought',
      'Hail',
    ];

    for (const item of expectedItems) {
      let containerLocator;

      // Handle "All Perils" separately
      if (item === 'All Perils') {
        containerLocator = this.RiskScoreSmallChartsItemBlock.first(); // "All Perils" chart is the first one
      } else {
        // Locate the container for the specific item based on its title
        containerLocator =
          this.PortfolioOverviewClimateRiskScoreChartItem.filter({
            has: this.RiskScoreSmallChartsItemTitle.filter({ hasText: item }),
          });
      }

      // Locate the value element within the identified container
      const valueLocator = containerLocator.locator(
        this.RiskScoreSmallChartsItemValue,
      );

      // Check that the value element is visible
      await expect(valueLocator).toBeVisible();
    }
  }

  async validateRiskScoreSmallChartsLevels() {
    const expectedItems = [
      'All Perils',
      'Flood',
      'Wind',
      'Wildfire',
      'Heat',
      'Precipitation',
      'Cold',
      'Drought',
      'Hail',
    ];

    for (const item of expectedItems) {
      let containerLocator;

      // Handle "All Perils" separately
      if (item === 'All Perils') {
        containerLocator = this.RiskScoreSmallChartsItemBlock.first(); // "All Perils" chart is the first one
      } else {
        // Locate the container for the specific item based on its title
        containerLocator =
          this.PortfolioOverviewClimateRiskScoreChartItem.filter({
            has: this.RiskScoreSmallChartsItemTitle.filter({ hasText: item }),
          });
      }

      // Locate the value element within the identified container
      const valueLocator = containerLocator.locator(
        this.RiskScoreSmallChartsItemValue,
      );
      const levelLocator = containerLocator.locator(
        this.RiskScoreSmallChartsItemScoreLevel,
      );
      // Ensure both the value and level elements are visible
      await expect(valueLocator).toBeVisible();
      await expect(levelLocator).toBeVisible();

      // Get the dynamic value from the "aria-valuenow" attribute
      const valueText = await valueLocator.getAttribute('aria-valuenow');
      const value = parseInt(valueText || '0', 10);

      // Determine the expected level based on the value
      let expectedLevel: string;
      if (valueText === 'NaN') {
        expectedLevel = 'Not Available';
      } else if (value >= 0 && value <= 20) {
        expectedLevel = 'Lowest';
      } else if (value >= 21 && value <= 40) {
        expectedLevel = 'Low';
      } else if (value >= 41 && value <= 60) {
        expectedLevel = 'Medium';
      } else if (value >= 61 && value <= 80) {
        expectedLevel = 'High';
      } else if (value >= 81 && value <= 100) {
        expectedLevel = 'Highest';
      }

      // Check that the score level matches the expected level
      await expect(levelLocator).toHaveText(expectedLevel);
    }
  }
}
