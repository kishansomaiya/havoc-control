// tests/ui/pages/SingleLocationHazardPage.ts

import { Page, Locator,expect } from '@playwright/test';
import { SingleLocationHeader } from '@components/SingleLocationHeader';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';
import { waitForContentLoaded } from '@utils/helpers';
const envUrl = testConfig[ENV].appUrl;
import fs from 'fs';

export class SingleLocationHazardPage {
  readonly page: Page;
  readonly singleLocationHeader: SingleLocationHeader;

  readonly Body: Locator;
  readonly ScoreTabsFilters: Locator;
  readonly MetricsChart: Locator;

  // Score switcher
  readonly ScoreSwitcher: Locator;
  readonly ScoreSwitcherTab: Locator;
  readonly ScoreSwitcherItem: Locator;

  // Filters
  readonly Filters: Locator;
  readonly FiltersYear: Locator;
  readonly FiltersScenario: Locator;

  readonly Scenario: Locator;
  readonly ScenarioLabel: Locator;
  readonly ScenarioSelectBox: Locator;
  readonly ScenarioOption: Locator;
  readonly ScenarioOptionTitle: Locator;
  readonly ScenarioOptionDescription: Locator;

  readonly Year: Locator;
  readonly YearLabel: Locator;
  readonly YearSelectBox: Locator;
  readonly YearOption: Locator;

  // Table "Hazard Metric Comparison"
  readonly Metrics: Locator;

  readonly Table: Locator;
  readonly TableLabel: Locator;
  readonly TableHeader: Locator;
  readonly TableHeaderRow: Locator;
  readonly TableRow: Locator;
  readonly TableRowLabel: Locator;
  readonly TableRowRadioButton: Locator;
  readonly TableYearFromValue: Locator;
  readonly TableYearToValue: Locator;
  readonly TableChangeValue: Locator;
  readonly TableChangeIndicator: Locator;

  readonly HazardMetricColumnName: Locator;

  readonly YearFromColumn: Locator;
  readonly YearFromColumnName: Locator;
  readonly YearFromColumnTooltip: Locator;

  readonly YearToColumn: Locator;
  readonly YearToColumnName: Locator;
  readonly YearToColumnTooltip: Locator;

  readonly ChangeColumn: Locator;
  readonly ChangeColumnName: Locator;
  readonly ChangeColumnTooltip: Locator;

  // Chart/Graph
  readonly Chart: Locator;
  readonly ChartLabel: Locator;
  readonly ChartDescription: Locator;
  readonly ChartGraph: Locator;
  readonly ChartLegend: Locator;
  readonly ChartLegendItem: Locator;
  readonly ChartLegendItemColor: Locator;
  readonly ChartLegendItemText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Body
    this.Body = page.getByTestId('slp-hazard-body');
    this.ScoreTabsFilters = page.getByTestId('slp-hazard-scoretabs-filters');
    this.MetricsChart = page.getByTestId('slp-hazard-metrics-chart');

    // Score Switcher
    this.ScoreSwitcher = page.getByTestId('slp-hazard-score-switcher');
    this.ScoreSwitcherTab = page.getByTestId('score-switcher-tab');
    this.ScoreSwitcherItem = page.getByTestId('score-switcher-item');

    // Filters
    this.Filters = page.getByTestId('slp-hazard-filters');
    this.FiltersScenario = page.getByTestId('slp-hazard-filters-scenario');
    this.FiltersYear = page.getByTestId('slp-hazard-filters-year');

    this.Scenario = page.getByTestId('scenario-select-form-control');
    this.ScenarioLabel = page.getByTestId('scenario-field-label');
    this.ScenarioSelectBox = page.getByTestId('scenario-field-select');
    this.ScenarioOption = page.getByTestId('scenario-option');
    this.ScenarioOptionTitle = page.getByTestId('scenario-option-title');
    this.ScenarioOptionDescription = page.getByTestId(
      'scenario-option-description',
    );

    this.Year = page.getByTestId('year-select-field');
    this.YearLabel = page.getByTestId('year-field-label');
    this.YearSelectBox = page.getByTestId('year-field-select');
    this.YearOption = page.getByTestId('year-field-option');

    // Metrics table
    this.Metrics = page.getByTestId('slp-hazard-metrics');
    this.Table = page.getByTestId('slp-hazard-metrics-table');
    this.TableLabel = page.getByTestId('slp-hazard-metrics-table-label');

    this.TableHeader = page.getByTestId('slp-hazard-metrics-table-header');
    this.TableHeaderRow = page.getByTestId(
      'slp-hazard-metrics-table-header-row',
    );
    this.TableRow = page.getByTestId('table-row');
    this.TableRowLabel = page.getByTestId('table-row-label');
    this.TableRowRadioButton = page.getByTestId('table-radio-button');
    this.TableYearFromValue = page.getByTestId('table-year-from-value');
    this.TableYearToValue = page.getByTestId('table-year-to-value');
    this.TableChangeValue = page.getByTestId('table-change-value');
    this.TableChangeIndicator = page.getByTestId('table-change-indicator');

    this.HazardMetricColumnName = page.getByTestId(
      'hazard-metrics-column-name',
    );

    this.YearFromColumn = page.getByTestId('year-from');
    this.YearFromColumnName = page.getByTestId('year-from-column-name');
    this.YearFromColumnTooltip = page.getByTestId('year-from-tooltip');

    this.YearToColumn = page.getByTestId('year-to');
    this.YearToColumnName = page.getByTestId('year-to-column-name');
    this.YearToColumnTooltip = page.getByTestId('year-to-tooltip');

    this.ChangeColumn = page.getByTestId('change');
    this.ChangeColumnName = page.getByTestId('change-column-name');
    this.ChangeColumnTooltip = page.getByTestId('change-tooltip');

    // Chart
    this.Chart = page.getByTestId('slp-hazard-chart');
    this.ChartLabel = page.getByTestId('slp-hazard-chart-label');
    this.ChartDescription = page.getByTestId('slp-hazard-chart-description');
    this.ChartGraph = page.getByTestId('slp-hazard-chart-graph');
    this.ChartLegend = page.getByTestId('slp-hazard-chart-legend');
    this.ChartLegendItem = page.getByTestId('chart-legend-item');
    this.ChartLegendItemColor = page.getByTestId('chart-legend-item-color');
    this.ChartLegendItemText = page.getByTestId('chart-legend-item-text');
  }

  //   TODO: verify this before using
  async navigateByURL(portfolioId: string, locationId: string) {
    const portfolioHazardPageUrl = `${envUrl}/portfolios/${portfolioId}/locations/${locationId}`;
    await this.page.goto(portfolioHazardPageUrl);
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);
    await expect(this.singleLocationHeader.HazardTab).toBeVisible();
    await expect(this.Body).toBeVisible();
  }

  async validateControls() {
    await waitForContentLoaded(this.page);
    await this.page.waitForLoadState('load');
    await expect(this.Body).toBeVisible();
    await expect(this.ScoreSwitcher).toBeVisible();
    await expect(this.ScoreSwitcherTab).toBeVisible();
    await expect(this.Filters).toBeVisible();
    await expect(this.Scenario).toBeVisible();
    await expect(this.Year).toBeVisible();
    await expect(this.Metrics).toBeVisible();
    await expect(this.Table).toBeVisible();
    await expect(this.TableLabel).toBeVisible();
    await expect(this.Chart).toBeVisible();
    await expect(this.ChartLabel).toBeVisible();
    await expect(this.ChartDescription).toBeVisible();
    await expect(this.ChartGraph).toBeVisible();
    await expect(this.ChartLegend).toBeVisible();
  }

  async validateScoreSwitcherTablist() {
    // Define the tab names you want to check
    const tabNames = [
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

  async setScenario126() {
    await this.ScenarioSelectBox.click();
    await expect(
      this.page.getByRole('option', { name: 'SSP1-2.6' }),
    ).toBeVisible();
    await this.page.getByRole('option', { name: 'SSP1-2.6' }).click();
    await expect(this.ScenarioSelectBox).toContainText('SSP1-2.6');
  }

  async setScenario245() {
    await this.ScenarioSelectBox.click();
    await expect(
      this.page.getByRole('option', { name: 'SSP2-4.5' }),
    ).toBeVisible();
    await this.page.getByRole('option', { name: 'SSP2-4.5' }).click();
    await expect(this.ScenarioSelectBox).toContainText('SSP2-4.5');
  }

  async setScenario585() {
    await this.ScenarioSelectBox.click();
    await expect(
      this.page.getByRole('option', { name: 'SSP5-8.5' }),
    ).toBeVisible();
    await this.page.getByRole('option', { name: 'SSP5-8.5' }).click();
    await expect(this.ScenarioSelectBox).toContainText('SSP5-8.5');
  }

  // Validate Scenario dropdown (default value, names, and descriptions)
  async validateScenarioDropdown() {
    const scenarioOptions = {
      default: 'SSP5-8.5',
      names: [
        'SSP1-2.6 Low GHG Emissions',
        'SSP2-4.5 Middle GHG Emissions',
        'SSP5-8.5 High GHG Emissions',
      ],
      descriptions: [
        'Assumes a strong global commitment to reducing greenhouse gas emissions, leading to low levels of warming.',
        'Assumes moderate efforts to reduce greenhouse gas emissions and balanced outcome in terms of socio-economic development and climate change impacts.',
        'In this scenario, greenhouse gas emissions continue to rise, leading to high levels of warming and significant climate change impacts.',
      ],
    };

    await expect(this.ScenarioSelectBox).toContainText(scenarioOptions.default);

    // Click to open Scenario dropdown
    await this.ScenarioSelectBox.click();

    // Get all Scenario option titles and descriptions
    const scenarioOptionCount = await this.page
      .locator('[role="listbox"] >> li')
      .count();
    const scenarioNames: string[] = [];
    const scenarioDescriptions: string[] = [];

    for (let i = 0; i < scenarioOptionCount; i++) {
      const name = await this.ScenarioOptionTitle.nth(i).textContent();
      const description =
        await this.ScenarioOptionDescription.nth(i).textContent();
      scenarioNames.push(name || '');
      scenarioDescriptions.push(description || '');
    }

    // Validate Scenario names and descriptions
    expect(scenarioNames).toEqual(scenarioOptions.names);
    expect(scenarioDescriptions).toEqual(scenarioOptions.descriptions);
    // await this.page.getByRole('option', { name: scenarioOptions.default }).click(); //close
  }

  // Set Year
  async setYear(year: string) {
    await this.YearSelectBox.click();
    const option = await this.page.getByRole('option', { name: year });
    // Scroll the option into view if it's not visible
    const isVisible = await option.isVisible();
    if (!isVisible) {
      await option.scrollIntoViewIfNeeded();
    }
    await option.click();
    await expect(this.YearSelectBox).toContainText(year);
  }

  async validateYearDropdown() {
    const yearOptions = {
      default: '2040',
      values: [
        '2020',
        '2025',
        '2030',
        '2035',
        '2040',
        '2045',
        '2050',
        '2055',
        '2060',
        '2065',
        '2070',
        '2075',
        '2080',
        '2085',
        '2090',
        '2095',
        '2100',
      ],
    };

    await expect(this.YearSelectBox).toContainText(yearOptions.default);

    // Click to open Year dropdown
    await this.YearSelectBox.click();
    const yearOptionsCount = await this.page
      .locator('[role="listbox"] >> li')
      .count();
    const yearOptionsText: string[] = [];

    for (let i = 0; i < yearOptionsCount; i++) {
      const yearOption = await this.YearOption.nth(i).textContent();
      yearOptionsText.push(yearOption || '');
    }

    // Validate Year options
    expect(yearOptionsText).toEqual(yearOptions.values);
  }

  async verifyChartLegend() {
    // Locate the chart body by matching the chart title
    const chartBody = this.Chart;
    await expect(chartBody).toBeVisible();

    // Locate the chart legend within the chart body
    const chartLegend = chartBody.locator(
      '[data-testid="slp-hazard-chart-legend"]',
    );
    await expect(chartLegend).toBeVisible();

    // Define the expected legend items with their colors and text
    const legendItems = [
      { color: 'Upper (95th)', text: 'Upper (95th)' },
      { color: 'Mean', text: 'Mean' },
      { color: 'Lower (5th)', text: 'Lower (5th)' },
    ];

    // Loop through each expected legend item and verify its color and text
    for (const item of legendItems) {
      const legendItem = chartLegend.locator(
        '[data-testid="chart-legend-item"]',
        {
          hasText: item.text,
        },
      );

      // Verify the legend item color and text
      const legendColor = legendItem.locator(
        '[data-testid="chart-legend-item-color"]',
      );
      const legendText = legendItem.locator(
        '[data-testid="chart-legend-item-text"]',
      );

      await expect(legendColor).toBeVisible();
      await expect(legendColor).toHaveText(item.color);

      await expect(legendText).toBeVisible();
      await expect(legendText).toHaveText(item.text);
    }

    // Optional: You can add further verification for chart lines, axis labels, etc.
    const chartGraph = chartBody.locator(this.ChartGraph);
    await expect(chartGraph).toBeVisible();
  }

  async verifyChart() {
    const chartLabel = 'Hazard Values Over Time';
    const defaultMetricOption =
      'Depth of the water (in meters) at the 100-year return period';

    await expect(this.ChartLabel).toBeVisible();
    await expect(this.ChartLabel).toContainText(chartLabel);
    await expect(this.ChartDescription).toBeVisible();
    await expect(this.ChartDescription).toContainText(defaultMetricOption);
  }

  async validateMetricsTable(yearTo: string) {
    const tableLabel = `Hazard Metric Comparison 2020 to ${yearTo}`;
    await expect(this.TableLabel).toBeVisible();
    await expect(this.TableLabel).toHaveText(tableLabel);

    const columnLabel = 'Hazard Metric';
    await expect(this.HazardMetricColumnName).toBeVisible();
    await expect(this.HazardMetricColumnName).toContainText(columnLabel);
    await expect(this.TableHeader).toBeVisible();
    await expect(this.TableRow.first()).toBeVisible();
    await expect(this.TableYearFromValue.first()).toBeVisible();
    await expect(this.TableYearToValue.first()).toBeVisible();
    await expect(this.TableChangeValue.first()).toBeVisible();

    // yearFrom
    const yearFrom = '2020';
    const yearFromTooltip = 'Starting year is always 2020';
    await expect(this.YearFromColumnName).toBeVisible();
    await expect(this.YearFromColumnName).toContainText(yearFrom);
    await expect(this.YearFromColumnTooltip).toBeVisible();
    await expect(this.YearFromColumnTooltip).toHaveAttribute(
      'aria-label',
      yearFromTooltip,
    );

    // yearTo
    const yearToTooltip = `Mean value for selected Metric and ${yearTo} year`;
    await expect(this.YearToColumnName).toBeVisible();
    await expect(this.YearToColumnName).toContainText(`${yearTo}`);
    await expect(this.YearToColumnTooltip).toBeVisible();
    await expect(this.YearToColumnTooltip).toHaveAttribute(
      'aria-label',
      yearToTooltip,
    );

    // Change
    const changeTooltip = `Difference between "${yearTo}" and "2020" values`;
    await expect(this.ChangeColumnName).toBeVisible();
    await expect(this.ChangeColumnName).toContainText('Change');
    await expect(this.ChangeColumnTooltip).toBeVisible();
    await expect(this.ChangeColumnTooltip).toHaveAttribute(
      'aria-label',
      changeTooltip,
    );
  }

  // async validateMetricOptionsFor(tabName: string) {
  //   const tabLocator = this.ScoreSwitcherItem.locator(`text=${tabName}`);
  //   await expect(tabLocator).toBeVisible();
  //   await tabLocator.click();
  //   await waitForContentLoaded(this.page);
  //   await expect(this.Table).toBeVisible();

  //   const rowCount = await this.TableRow.count();

  //   // List of expected radio button values and their associated text
  //   const expectedValues = [
  //     {
  //       value: 'FL_depth10yr_mean',
  //       text: 'Depth of the water (in meters) at the 10-year return period',
  //     },
  //     {
  //       value: 'FL_depth20yr_mean',
  //       text: 'Depth of the water (in meters) at the 20-year return period',
  //     },
  //     {
  //       value: 'FL_depth50yr_mean',
  //       text: 'Depth of the water (in meters) at the 50-year return period',
  //     },
  //     {
  //       value: 'FL_depth100yr_mean',
  //       text: 'Depth of the water (in meters) at the 100-year return period',
  //     },
  //     {
  //       value: 'FL_depth200yr_mean',
  //       text: 'Depth of the water (in meters) at the 200-year return period',
  //     },
  //     {
  //       value: 'FL_depth500yr_mean',
  //       text: 'Depth of the water (in meters) at the 500-year return period',
  //     },
  //     {
  //       value: 'FL_depthTidal_mean',
  //       text: 'Annual depth of the water (in meters) in coastal areas due to high tides',
  //     },
  //     {
  //       value: 'FL_floodedFraction10yr_mean',
  //       text: 'Fraction of land within the 90m grid cell with flooding at the 10-year return period',
  //     },
  //     {
  //       value: 'FL_floodedFraction20yr_mean',
  //       text: 'Fraction of land within the 90m grid cell with flooding at the 20-year return period',
  //     },
  //     {
  //       value: 'FL_floodedFraction50yr_mean',
  //       text: 'Fraction of land within the 90m grid cell with flooding at the 50-year return period',
  //     },
  //     {
  //       value: 'FL_floodedFraction100yr_mean',
  //       text: 'Fraction of land within the 90m grid cell with flooding at the 100-year return period',
  //     },
  //     {
  //       value: 'FL_floodedFraction200yr_mean',
  //       text: 'Fraction of land within the 90m grid cell with flooding at the 200-year return period',
  //     },
  //     {
  //       value: 'FL_floodedFraction500yr_mean',
  //       text: 'Fraction of land within the 90m grid cell with flooding at the 500-year return period',
  //     },
  //     {
  //       value: 'FL_floodedFractionTidal_mean',
  //       text: 'Fraction of land within the 90m grid cell inundated by high tide',
  //     },
  //   ];

  //   // Step 5: Iterate over each row and check values and text
  //   for (let i = 0; i < rowCount; i++) {
  //     const row = this.TableRow.nth(i);
  //     const radioButton = row.locator('input[type="radio"]');
  //     const labelText = row.locator('span[class*="MuiTypography-root"]');

  //     // Get the expected value and text for this row
  //     const { value: expectedValue, text: expectedText } = expectedValues[i];

  //     // Check that the radio button value matches the expected value
  //     const actualValue = await radioButton.getAttribute('value');
  //     expect(actualValue).toBe(expectedValue);

  //     // Check that the displayed text matches the expected text
  //     const actualText = await labelText.textContent();
  //     expect(actualText?.trim()).toBe(expectedText);

  //     // Step 6: Check if the current row is the default selected option (100-year return period)
  //     if (expectedValue === 'FL_depth100yr_mean') {
  //       await expect(radioButton).toBeChecked();
  //     } else {
  //       await expect(radioButton).not.toBeChecked();
  //     }
  //   }
  // }

  async getExpectedValues(tabName: string) {
    const data = JSON.parse(
      fs.readFileSync('./fixtures/slp-hazard-metrics.json', 'utf-8'),
    );
    return data[tabName];
  }

  async validateMetricOptions(tabName: string) {
    const tabLocator = this.ScoreSwitcherItem.locator(`text=${tabName}`);
    await expect(tabLocator).toBeVisible();
    await tabLocator.click();
    await waitForContentLoaded(this.page);
    await expect(this.Table).toBeVisible();

    const rowCount = await this.TableRow.count();

    const expectedValues = await this.getExpectedValues(tabName);

    if (!expectedValues) {
      throw new Error(`Unknown tab: ${tabName}`);
    }

    // Iterate over each row and check values and text
    for (let i = 0; i < rowCount; i++) {
      const row = this.TableRow.nth(i);
      const radioButton = row.locator('input[type="radio"]');
      const labelText = row.locator('span[class*="MuiTypography-root"]');

      const {
        value: expectedValue,
        text: expectedText,
        default: isDefault,
      } = expectedValues[i];

      const actualValue = await radioButton.getAttribute('value');
      expect(actualValue).toBe(expectedValue);

      const actualText = await labelText.textContent();
      expect(actualText?.trim()).toBe(expectedText);

      if (isDefault) {
        await expect(radioButton).toBeChecked();
      } else {
        await expect(radioButton).not.toBeChecked();
      }
    }
  }
}
