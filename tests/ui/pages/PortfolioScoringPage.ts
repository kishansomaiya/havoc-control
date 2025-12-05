// tests/ui/pages/PortfolioScoringPage.ts

import { Page, Locator,expect } from '@playwright/test';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';
import { waitForContentLoaded } from '@utils/helpers';
const envUrl = testConfig[ENV].appUrl;

export class PortfolioScoringPage {
  readonly page: Page;
  readonly portfolioHeader: PortfolioHeader;

  readonly Body: Locator;

  readonly Map: Locator;

  // Score Switcher
  readonly ScoreSwitcher: Locator;
  readonly ScoreSwitcherTab: Locator;
  readonly ScoreSwitcherItem: Locator;

  // Filters
  readonly FiltersScoreType: Locator;
  readonly FiltersScoreTypeLabel: Locator;
  readonly FiltersScoreTypeSelectBox: Locator;
  readonly FiltersScoreTypeOption: Locator;

  // Scoring Chart
  readonly ScoringChart: Locator;
  readonly LocationsScoringChart: Locator;
  readonly LocationsScoringChartLabel: Locator;
  readonly ShowLocations: Locator;
  readonly ShowLocationsCheckbox: Locator;
  readonly ShowLocationsCheckboxButton: Locator;

  // Legend
  readonly ChartLegend: Locator;
  readonly ChartLegendItem: Locator;
  readonly ChartLegendItemColor: Locator;
  readonly ChartLegendItemText: Locator;

  readonly ScatterChart: Locator;
  readonly ScatterChartItem: Locator;
  readonly ScatterChartItemCircle: Locator;
  readonly ScatterChartItemLocationId: Locator;

  readonly ScatterChartShortTooltip: Locator;
  readonly ScatterChartShortTooltipText: Locator;

  readonly ScatterChartTooltip: Locator;
  readonly ScatterChartTooltipText: Locator;
  readonly ScatterChartTooltipCloseButton: Locator;
  readonly ScatterChartTooltipLeftButton: Locator;
  readonly ScatterChartTooltipCaption: Locator;
  readonly ScatterChartTooltipRightButton: Locator;

  // Hazard Scores
  readonly HazardScores: Locator;
  readonly HazardScoresTitle: Locator;
  readonly HazardScoresDescription: Locator;
  readonly HazardScoresLocationTitle: Locator;
  readonly HazardScoresLocationXIcon: Locator;

  //Charts
  readonly HazardScoresCharts: Locator;
  readonly RiskScoreSmallChartsItem: Locator;
  readonly RiskScoreSmallChartsItemBlock: Locator;
  readonly RiskScoreSmallChartsItemTitle: Locator;
  readonly RiskScoreSmallChartsItemTooltip: Locator;
  readonly RiskScoreSmallChartsItemTooltipIcon: Locator;
  readonly RiskScoreSmallChartsItemValue: Locator;
  readonly RiskScoreSmallChartsItemScoreLevel: Locator;

  readonly XAxisChartLabel: Locator;
  readonly YAxisChartLabel: Locator;

  constructor(page: Page) {
    this.page = page;
    this.portfolioHeader = new PortfolioHeader(page);

    // Body
    this.Body = page.getByTestId('scoring-body');

    // Map & score switchers
    this.Map = page.getByTestId('hazard-scores-map');

    // Score Switcher
    this.ScoreSwitcher = page.getByTestId('scoring-score-switcher');
    this.ScoreSwitcherTab = page.getByTestId('score-switcher-tab');
    this.ScoreSwitcherItem = page.getByTestId('score-switcher-item');

    // Filters
    this.FiltersScoreType = page.getByTestId('scoring-filter-score-type');
    this.FiltersScoreTypeLabel = page.getByTestId('benchmark-field-label');
    this.FiltersScoreTypeSelectBox = page.getByTestId('benchmark-field-select');
    this.FiltersScoreTypeOption = page.getByTestId('benchmark-field-option');

    // Scoring Chart
    this.ScoringChart = page.getByTestId('scoring-chart');
    this.LocationsScoringChart = page.getByTestId('locations-scoring-chart');
    this.LocationsScoringChartLabel = page.getByTestId(
      'locations-scoring-chart-label',
    );
    this.ShowLocations = page.getByTestId('show-locations');
    this.ShowLocationsCheckbox = page.getByTestId('show-locations-checkbox');
    this.ShowLocationsCheckboxButton = page.getByLabel('Show Location ID');

    this.ChartLegend = page.getByTestId('scatter-chart');
    this.ScatterChartItem = page.getByTestId('scatter-chart-item');
    this.ScatterChartItemCircle = page.getByTestId('scatter-chart-item-circle');
    this.ScatterChartItemLocationId = page.getByTestId(
      'scatter-chart-item-location-id',
    );

    this.ScatterChartShortTooltip = page.getByTestId(
      'scatter-chart-short-tooltip',
    );
    this.ScatterChartShortTooltipText = page.getByTestId(
      'scatter-chart-short-tooltip-text',
    );

    this.ScatterChartTooltip = page.getByTestId('scatter-chart-tooltip');
    this.ScatterChartTooltipText = page.getByTestId(
      'scatter-chart-tooltip-text',
    );
    this.ScatterChartTooltipCloseButton = page.getByTestId(
      'scatter-chart-tooltip-x-button',
    );
    this.ScatterChartTooltipLeftButton = page.getByTestId(
      'scatter-chart-tooltip-left-button',
    );
    this.ScatterChartTooltipCaption = page.getByTestId(
      'scatter-chart-tooltip-caption',
    );
    this.ScatterChartTooltipRightButton = page.locator(
      'scatter-chart-tooltip-right-button',
    );
    // Legend
    this.ChartLegend = page.getByTestId('scoring-chart-legend');
    this.ChartLegendItem = page.getByTestId('chart-legend-item');
    this.ChartLegendItemColor = page.getByTestId('chart-legend-item-color');
    this.ChartLegendItemText = page.getByTestId('chart-legend-item-text');

    // Hazard Scores
    this.HazardScores = page.getByTestId('hazard-scores');
    this.HazardScoresTitle = page.getByTestId('hazard-scores-title');
    this.HazardScoresDescription = page.getByTestId(
      'hazard-scores-description',
    );
    this.HazardScoresLocationTitle = page.getByTestId(
      'hazard-scores-locations-title',
    );
    this.HazardScoresLocationXIcon = page.getByTestId('location-x-button');

    // Chart
    this.HazardScoresCharts = page.getByTestId('hazard-scores-charts');
    this.RiskScoreSmallChartsItem = page.getByTestId(
      'hazard-scores-single-chart',
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

    this.XAxisChartLabel = page.locator('text=Present Day Hazard Score');
    this.YAxisChartLabel = page
      .locator('.MuiChartsAxis-label')
      .filter({ hasText: '2020-2050 Change Score' });
  }
  async navigateByURL(portfolioId: string) {
    const PageUrl = `${envUrl}/portfolios/${portfolioId}`;
    await this.page.goto(PageUrl);
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);
    await expect(this.portfolioHeader.OverviewTab).toBeVisible();
  }

  async validateControls() {
    const scoringChartsLabel = '2020-2050 Change Score';
    const showLocationsLabel = 'Show Location ID';
    const chartsTitle = 'Hazard Scores';
    const chartsDescription =
      'Examine your portfolio to see how it scores for present-day hazards and how those hazards will change in 2050. See if your locations are experiencing rapid changes in climate conditions that will require mitigation plans to be accelerated. The quadrant view displays dots placed based on average scores and colored based on a predetermined risk scale. Scores are generated using climate scenario SSP5-8.5.';
    const locationsTitle = 'All Locations';
    await this.page.waitForLoadState('load');
    await expect(this.Body).toBeVisible();
    await expect(this.FiltersScoreType).toBeVisible();
    await expect(this.ScoreSwitcher).toBeVisible();
    await expect(this.ScoringChart).toBeVisible();
    await expect(this.ChartLegend).toBeVisible();
    await expect(this.LocationsScoringChartLabel).toBeVisible();
    await expect(this.LocationsScoringChartLabel).toContainText(
      scoringChartsLabel,
    );
    await expect(this.ShowLocationsCheckbox).toBeVisible();
    await expect(this.ShowLocationsCheckboxButton).not.toBeChecked(); // test
    await expect(this.ShowLocations).toContainText(showLocationsLabel);
    await expect(this.HazardScoresTitle).toBeVisible();
    await expect(this.HazardScoresTitle).toContainText(chartsTitle);
    await expect(this.HazardScoresLocationTitle).toBeVisible();
    await expect(this.HazardScoresLocationTitle).toContainText(locationsTitle);
    await expect(this.HazardScoresDescription).toBeVisible();
    await expect(this.HazardScoresDescription).toContainText(chartsDescription);
    await expect(this.HazardScoresCharts).toBeVisible();
    await expect(this.XAxisChartLabel).toBeVisible();
    await expect(this.YAxisChartLabel).toBeVisible();
    await expect(this.Map).toBeVisible();
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
      const tabLocator = this.ScoreSwitcherItem.locator(`text=${tabName}`);
      await expect(tabLocator).toBeVisible();
    }
  }

  async validateDefaultScoreSwitcherTabsState() {
    // Define the default selected tab
    const defaultTabName = 'All Perils';
    // Get the locator for the selected tab by checking for the 'MuiButton-contained' class
    const selectedTab = this.ScoreSwitcherItem.filter({
      hasText: defaultTabName,
    });
    await expect(selectedTab).toHaveClass(/MuiButton-contained/);

    // Define the other tabs you want to check for not being selected
    const otherTabs = [
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
      const tabLocator = this.ScoreSwitcherItem.filter({ hasText: tabName });
      // For other tabs, check that they do not have the 'MuiButton-contained' class
      await expect(tabLocator).not.toHaveClass(/MuiButton-contained/);
    }
  }

  async setScoreType(scoreType: string) {
    await this.FiltersScoreTypeSelectBox.click();
    const option = await this.page.getByRole('option', { name: scoreType });
    // Scroll the option into view if it's not visible
    const isVisible = await option.isVisible();
    if (!isVisible) {
      await option.scrollIntoViewIfNeeded();
    }
    await option.click();
    await expect(this.FiltersScoreTypeSelectBox).toContainText(scoreType);
  }
  async checkShowLocationId() {
    const isChecked = await this.ShowLocationsCheckboxButton.isChecked();
    if (!isChecked) {
      await this.ShowLocationsCheckboxButton.check();
    }

    const newState = await this.ShowLocationsCheckboxButton.isChecked();
    expect(newState).toBeTruthy();
  }

  async unCheckShowLocationId() {
    const isChecked = await this.ShowLocationsCheckboxButton.isChecked();

    if (isChecked) {
      await this.ShowLocationsCheckboxButton.uncheck();
    }

    const newState = await this.ShowLocationsCheckboxButton.isChecked();
    expect(newState).toBeFalsy();
  }

  async validateScoreTypeDropdown() {
    const scoreTypeOptions = {
      default: 'Global',
      values: [
        'Global',
        'Country',
        'Admin 1',
        // 'Admin 2 (US Only)',
      ],
    };

    await expect(this.FiltersScoreTypeSelectBox).toContainText(
      scoreTypeOptions.default,
    );

    // Click to open Year dropdown
    await this.FiltersScoreTypeSelectBox.click();
    const scoreTypeOptionsCount = await this.page
      .locator('[role="listbox"] >> li')
      .count();
    const scoreTypeOptionsText: string[] = [];

    for (let i = 0; i < scoreTypeOptionsCount; i++) {
      const scoreTypeOption =
        await this.FiltersScoreTypeOption.nth(i).textContent();
      scoreTypeOptionsText.push(scoreTypeOption || '');
    }

    // Validate Year options
    expect(scoreTypeOptionsText).toEqual(scoreTypeOptions.values);
  }

  async validateRiskScoreSmallChartsItemTitles() {
    // Define the expected titles, but handle the "Precip" case separately
    const expectedTitles = [
      'Present Hazard Score',
      '2050 Change Score',
      'Overall Score',
    ];

    // Loop through each expected title
    for (const title of expectedTitles) {
      // Handle the case where 'Precip' should match 'Precipitation' in the UI
      const expectedText = title === 'Precip' ? 'Precipitation' : title; // TODO: remove, but check after it

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
      'Present Hazard Score': 'Measures the absolute level of hazard for 2020',
      '2050 Change Score':
        'Measures the level of change between the year in question and the hazard year (2020)',
      'Overall Score':
        'Combines the hazard and change scores and benchmarks this value against a global weighted average of the scores in populated areas',
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

  async validateRiskScoreSmallChartsValues() {
    const expectedItems = [
      'Present Hazard Score',
      '2050 Change Score',
      'Overall Score',
    ];

    for (const item of expectedItems) {
      // Locate the container for the specific item based on its title
      const containerLocator = this.RiskScoreSmallChartsItem.filter({
        has: this.RiskScoreSmallChartsItemTitle.filter({ hasText: item }),
      });

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
      'Present Hazard Score',
      '2050 Change Score',
      'Overall Score',
    ];

    for (const item of expectedItems) {
      const containerLocator = this.RiskScoreSmallChartsItem.filter({
        has: this.RiskScoreSmallChartsItemTitle.filter({ hasText: item }),
      });

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

  async verifyChartLegend() {
    await expect(this.ChartLegend).toBeVisible();

    const legendItems: { color: string; text: string }[] = [
      { color: 'Lowest', text: 'Lowest' },
      { color: 'Low', text: 'Low' },
      { color: 'Medium', text: 'Medium' },
      { color: 'High', text: 'High' },
      { color: 'Highest', text: 'Highest' },
    ];

    // Loop through each expected legend item and verify its color and text
    for (const item of legendItems) {
      // Verify the legend item color and text
      // Verify the legend item color and text
      const legendColor = this.ChartLegendItemColor.filter({
        hasText: new RegExp(`^${item.color}$`),
      });
      const legendText = this.ChartLegendItemText.filter({
        hasText: new RegExp(`^${item.text}$`),
      });

      await expect(legendColor).toBeVisible();
      await expect(legendColor).toHaveText(new RegExp(`^${item.color}$`));

      await expect(legendText).toBeVisible();
      await expect(legendText).toHaveText(new RegExp(`^${item.text}$`));
    }
  }
}
