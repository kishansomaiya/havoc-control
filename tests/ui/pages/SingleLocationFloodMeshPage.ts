// tests/ui/pages/SingleLocationFloodMeshPage.ts

import { Page, Locator,expect } from '@playwright/test';
import { SingleLocationHeader } from '@components/SingleLocationHeader';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';
import { waitForContentLoaded } from '@utils/helpers';
const envUrl = testConfig[ENV].appUrl;

export class SingleLocationFloodMeshPage {
  readonly page: Page;
  readonly singleLocationHeader: SingleLocationHeader;

  readonly Body: Locator;
  readonly Map: Locator;

  readonly Filters: Locator;
  readonly FiltersForm: Locator;

  readonly FiltersScenario: Locator;
  readonly FiltersScenarioLabel: Locator;
  readonly FiltersScenarioSelectBox: Locator;
  readonly FiltersScenarioOption: Locator;
  readonly FiltersScenarioOptionTitle: Locator;
  readonly FiltersScenarioOptionDescription: Locator;

  readonly FiltersYear: Locator;
  readonly FiltersYearLabel: Locator;
  readonly FiltersYearSelectBox: Locator;
  readonly FiltersYearOption: Locator;

  readonly FiltersMetric: Locator;
  readonly FiltersMetricLabel: Locator;
  readonly FiltersMetricSelectBox: Locator;
  readonly FiltersMetricOption: Locator;

  // Metrics
  readonly Metrics: Locator;

  // Chart
  readonly ChartLabel: Locator;
  readonly ChartDescription: Locator;
  readonly ChartPieLabel: Locator;
  readonly ChartPie: Locator;

  readonly ChartLegend: Locator;
  readonly ChartLegendItem: Locator;
  readonly ChartLegendItemColor: Locator;
  readonly ChartLegendItemText: Locator;
  readonly ChartLegendItemTooltip: Locator;

  constructor(page: Page) {
    this.page = page;

    // Body
    this.Body = page.getByTestId('slp-floodmesh-body');

    // Map
    this.Map = page.getByTestId('slp-floodmesh-map');

    // Filters
    this.FiltersForm = page.getByTestId('slp-floodmesh-filters-form');
    this.Filters = page.getByTestId('slp-floodmesh-filters');

    this.FiltersScenario = page.getByTestId('scenario-select-form-control');
    this.FiltersScenarioLabel = page.getByTestId('scenario-field-label');
    this.FiltersScenarioSelectBox = page.getByTestId('scenario-field-select');
    this.FiltersScenarioOption = page.getByTestId('scenario-option');
    this.FiltersScenarioOptionTitle = page.getByTestId('scenario-option-title');
    this.FiltersScenarioOptionDescription = page.getByTestId(
      'scenario-option-description',
    );

    this.FiltersYear = page.getByTestId('year-select-field');
    this.FiltersYearLabel = page.getByTestId('year-field-label');
    this.FiltersYearSelectBox = page.getByTestId('year-field-select');
    this.FiltersYearOption = page.getByTestId('year-field-option');

    this.FiltersMetric = page.getByTestId('metric-select-field');
    this.FiltersMetricLabel = page.getByTestId('metric-field-label');
    this.FiltersMetricOption = page.getByTestId('metric-field-option');
    this.FiltersMetricSelectBox = page.getByTestId('metric-field-select');

    // Metrics
    this.Metrics = page.getByTestId('metrics');

    // Chart
    this.ChartLabel = page.getByTestId('slp-floodmesh-chart-label');
    this.ChartDescription = page.getByTestId('slp-floodmesh-chart-description');
    this.ChartPieLabel = page.getByTestId('slp-floodmesh-pie-chart-label');
    this.ChartPie = page.getByTestId('pie-chart');

    // Chart Legend
    this.ChartLegend = page.getByTestId('slp-floodmesh-chart-legend');
    this.ChartLegendItem = page.getByTestId('chart-legend-item');
    this.ChartLegendItemColor = page.getByTestId('chart-legend-item-color');
    this.ChartLegendItemText = page.getByTestId('chart-legend-item-text');
    this.ChartLegendItemTooltip = page.getByTestId('chart-legend-item-tooltip');
  }
  //   TODO: verify this before using
  async navigateByURL(portfolioId: string, locationId: string) {
    const slpFloodMeshPageUrl = `${envUrl}/portfolios/${portfolioId}/locations/${locationId}/flood`;
    await this.page.goto(slpFloodMeshPageUrl);
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);
    await expect(this.singleLocationHeader.FloodMeshTab).toBeVisible();
    await expect(this.Body).toBeVisible();
  }

  async validateControls() {
    const chartLabel = 'Flood Mesh';
    const chartScoreLabel = '% Flood mesh grid by flood exposure';

    await waitForContentLoaded(this.page);
    await this.page.waitForLoadState('load');
    await expect(this.Body).toBeVisible();
    await expect(this.Map).toBeVisible();

    await expect(this.Filters).toBeVisible();
    await expect(this.Metrics).toBeVisible();
    await expect(this.ChartLabel).toBeVisible();
    await expect(this.ChartLabel).toContainText(chartLabel);
    await expect(this.ChartDescription).toBeVisible();
    await expect(this.ChartPieLabel).toBeVisible();
    await expect(this.ChartPieLabel).toContainText(chartScoreLabel);
    await expect(this.ChartLegend).toBeVisible();
  }

  async setScenario126() {
    await this.FiltersScenarioSelectBox.click();
    await expect(
      this.page.getByRole('option', { name: 'SSP1-2.6' }),
    ).toBeVisible();
    await this.page.getByRole('option', { name: 'SSP1-2.6' }).click();
    await expect(this.FiltersScenarioSelectBox).toContainText('SSP1-2.6');
  }

  async setScenario245() {
    await this.FiltersScenarioSelectBox.click();
    await expect(
      this.page.getByRole('option', { name: 'SSP2-4.5' }),
    ).toBeVisible();
    await this.page.getByRole('option', { name: 'SSP2-4.5' }).click();
    await expect(this.FiltersScenarioSelectBox).toContainText('SSP2-4.5');
  }

  async setScenario585() {
    await this.FiltersScenarioSelectBox.click();
    await expect(
      this.page.getByRole('option', { name: 'SSP5-8.5' }),
    ).toBeVisible();
    await this.page.getByRole('option', { name: 'SSP5-8.5' }).click();
    await expect(this.FiltersScenarioSelectBox).toContainText('SSP5-8.5');
  }

  // Set Year
  async setYear(year: string) {
    await this.FiltersYearSelectBox.click();
    const option = await this.page.getByRole('option', { name: year });
    // Scroll the option into view if it's not visible
    const isVisible = await option.isVisible();
    if (!isVisible) {
      await option.scrollIntoViewIfNeeded();
    }
    await option.click();
    await expect(this.FiltersYearSelectBox).toContainText(year);
  }

  // Set Metric
  async setMetric(metric: string) {
    await this.FiltersMetricSelectBox.click();
    const option = await this.page.getByRole('option', { name: metric });
    // Scroll the option into view if it's not visible
    const isVisible = await option.isVisible();
    if (!isVisible) {
      await option.scrollIntoViewIfNeeded();
    }
    await option.click();
    await expect(this.FiltersMetricSelectBox).toContainText(metric);
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

    await expect(this.FiltersScenarioSelectBox).toContainText(
      scenarioOptions.default,
    );

    // Click to open Scenario dropdown
    await this.FiltersScenarioSelectBox.click();

    // Get all Scenario option titles and descriptions
    const scenarioOptionCount = await this.page
      .locator('[role="listbox"] >> li')
      .count();
    const scenarioNames: string[] = [];
    const scenarioDescriptions: string[] = [];

    for (let i = 0; i < scenarioOptionCount; i++) {
      const name = await this.FiltersScenarioOptionTitle.nth(i).textContent();
      const description =
        await this.FiltersScenarioOptionDescription.nth(i).textContent();
      scenarioNames.push(name || '');
      scenarioDescriptions.push(description || '');
    }

    // Validate Scenario names and descriptions
    expect(scenarioNames).toEqual(scenarioOptions.names);
    expect(scenarioDescriptions).toEqual(scenarioOptions.descriptions);
    // await this.page.getByRole('option', { name: scenarioOptions.default }).click(); //close
  }

  async validateYearDropdown() {
    const yearOptions = {
      default: '2040',
      values: ['2020', '2030', '2040', '2050', '2075', '2100'],
    };

    // Check default
    await expect(this.FiltersYearSelectBox).toContainText(yearOptions.default);

    // Click to open Year dropdown
    await this.FiltersYearSelectBox.click();
    const yearOptionsCount = await this.page
      .locator('[role="listbox"] >> li')
      .count();
    const yearOptionsText: string[] = [];

    for (let i = 0; i < yearOptionsCount; i++) {
      const yearOption = await this.FiltersYearOption.nth(i).textContent();
      yearOptionsText.push(yearOption || '');
    }

    // Validate Year options
    expect(yearOptionsText).toEqual(yearOptions.values);
    // await this.page.getByRole('option', { name: yearOptions.default }).click(); //close
  }

  async validateYearsDropDownApi(apiYears: number[]) {
    // Determine the default year (2040 or the last year in the array)
    const defaultYearToCheck = 2040;
    let defaultYear: number;

    // Remove 1995 from the API years, since it should not be present in the chart
    const expectedYears = apiYears.filter((year) => year !== 1995);

    if (expectedYears.includes(defaultYearToCheck)) {
      defaultYear = defaultYearToCheck;
    } else {
      defaultYear = expectedYears[expectedYears.length - 1];
    }

    // Check that the default year is in the select box text
    await expect(this.FiltersYearSelectBox).toContainText(
      defaultYear.toString(),
    );

    // Open the year dropdown in the UI
    await this.FiltersYearSelectBox.click();

    // Capture the year options from the UI
    const yearOptions = await this.FiltersYearOption;
    const displayedYears = await yearOptions.evaluateAll((options) =>
      options.map((option) => parseInt(option.getAttribute('data-value'))),
    );

    // Check that 1995 is not in the years
    expect(displayedYears).not.toContain(1995);

    // Check that the years match the expected years (without 1995)
    expect(displayedYears).toEqual(expectedYears);
  }

  // Validate Metric dropdown
  async validateMetricDropdown() {
    const metricOptions = {
      default: 'Depth of the water (in meters) at the 100-year return period',
      values: [
        'Depth of the water (in meters) at the 10-year return period',
        'Depth of the water (in meters) at the 20-year return period',
        'Depth of the water (in meters) at the 50-year return period',
        'Depth of the water (in meters) at the 100-year return period',
        'Depth of the water (in meters) at the 200-year return period',
        'Depth of the water (in meters) at the 500-year return period',
        'Annual depth of the water (in meters) in coastal areas due to high tides',
        'Fraction of land within the 90m grid cell with flooding at the 10-year return period',
        'Fraction of land within the 90m grid cell with flooding at the 20-year return period',
        'Fraction of land within the 90m grid cell with flooding at the 50-year return period',
        'Fraction of land within the 90m grid cell with flooding at the 100-year return period',
        'Fraction of land within the 90m grid cell with flooding at the 200-year return period',
        'Fraction of land within the 90m grid cell with flooding at the 500-year return period',
        'Fraction of land within the 90m grid cell inundated by high tide',
      ],
    };

    // Validate default value
    await expect(this.FiltersMetricSelectBox).toContainText(
      metricOptions.default,
    );

    // Click to open Metric dropdown
    await this.FiltersMetricSelectBox.click();
    const metricOptionsCount = await this.page
      .locator('[role="listbox"] >> li')
      .count();
    const metricOptionsText: string[] = [];

    for (let i = 0; i < metricOptionsCount; i++) {
      const metricOption = await this.FiltersMetricOption.nth(i).textContent();
      metricOptionsText.push(metricOption || '');
    }

    // Validate Metric options
    expect(metricOptionsText).toEqual(metricOptions.values);

    await this.page
      .getByRole('option', { name: metricOptions.default })
      .click(); //close
  }

  async validateChartDescription() {
    // Locate the label element
    const descriptionLocator = this.ChartDescription;

    // Construct the expected title
    const description_Flood_Depth_100 =
      'Mean depth of the water (in meters) at the 100-year return period';

    const metric_Flood_Fr90mmHighTide =
      'Fraction of land within the 90m grid cell inundated by high tide';
    const description_Flood_Fr90mmHighTide =
      'Mean fraction of land within the 90m grid cell inundated by high tides on an annual basis. Set to -9999 outside coastal areas.';
    const metric_AnnualDepth =
      'Annual depth of the water (in meters) in coastal areas due to high tides';
    const description_AnnualDepth =
      'Mean annual depth of the water (in meters) in coastal areas due to high tides and sea-level rise';

    await waitForContentLoaded(this.page);
    // Verify that the description text matches the selected metric
    await expect(descriptionLocator).toHaveText(description_Flood_Depth_100);

    // Select metric
    await this.setMetric(metric_Flood_Fr90mmHighTide);
    // Verify that the description text matches the selected metric
    await expect(descriptionLocator).toHaveText(
      description_Flood_Fr90mmHighTide,
    );

    await waitForContentLoaded(this.page);
    // Select metric
    await this.setMetric(metric_AnnualDepth);
    // Verify that the description text matches the selected metric
    await expect(descriptionLocator).toHaveText(description_AnnualDepth);
  }

  async verifyChartLegends(dataSetVersion: string) {
    // List of 'fraction' metric values
    const fractionMetrics = [
      'FL_floodedFraction10yr_mean',
      'FL_floodedFraction20yr_mean',
      'FL_floodedFraction50yr_mean',
      'FL_floodedFraction100yr_mean',
      'FL_floodedFraction200yr_mean',
      'FL_floodedFraction500yr_mean',
      'FL_floodedFractionTidal_mean',
    ];

    // Select the current metric from the drop-down
    const metricSelect = await this.page.locator(
      '[data-testid="metric-field-select"]',
    );
    const selectedMetricValue = await metricSelect.getAttribute('value'); // gets the selected value

    // Determine if the selected value is a fraction
    let fraction = fractionMetrics.includes(selectedMetricValue);

    // Call the chart legend verification with the appropriate fraction value
    await this.verifyLegendForSelectedMetric(dataSetVersion, fraction);
  }

  async verifyLegendForSelectedMetric(
    dataSetVersion: string,
    fraction: boolean,
  ) {
    const chartLegendItems = await this.ChartLegendItem;
    const expectedValues = this.getExpectedValues(dataSetVersion, fraction);

    for (let i = 0; i < expectedValues.length; i++) {
      const legendItem = chartLegendItems.nth(i);
      const expected = expectedValues[i];

      // Verify the legend item text
      const legendText = await legendItem
        .locator('[data-testid="chart-legend-item-text"]')
        .textContent();
      expect(legendText).toBe(expected.text);

      // Verify the legend item color
      const legendColor = await legendItem
        .locator('[data-testid="chart-legend-item-color"]')
        .textContent();
      expect(legendColor).toBe(expected.color);

      // For 'Not Available', skip tooltip verification since no tooltip is expected
      if (expected.text !== 'Not Available') {
        // Verify the legend item tooltip
        const tooltipValue = await legendItem
          .locator('[data-testid="chart-legend-item-tooltip"]')
          .getAttribute('aria-label');
        expect(tooltipValue).toBe(expected.tooltip);
      } else {
        // Assert that no tooltip exists for 'Not Available'
        const tooltipExists = await legendItem
          .locator('[data-testid="chart-legend-item-tooltip"]')
          .count();
        expect(tooltipExists).toBe(0); // Ensures that no tooltip element is present
      }
    }
  }

  getExpectedValues(dataSetVersion: string, fraction: boolean) {
    if (fraction) {
      return [
        { text: 'Lowest', color: 'Lowest', tooltip: '0%' },
        { text: 'Low', color: 'Low', tooltip: '0-25%' },
        { text: 'Medium', color: 'Medium', tooltip: '25-50%' },
        { text: 'High', color: 'High', tooltip: '50-75%' },
        { text: 'Highest', color: 'Highest', tooltip: '> 75%' },
        { text: 'Not Available', color: 'Not Available', tooltip: '' },
      ];
    }

    if (dataSetVersion === '2.6.2') {
      return [
        { text: 'Lowest', color: 'Lowest', tooltip: '< 0.25 m' },
        { text: 'Low', color: 'Low', tooltip: '0.25-1.0 m' },
        { text: 'Medium', color: 'Medium', tooltip: '1.0 - 2.0 m' },
        { text: 'High', color: 'High', tooltip: '2.0 - 3.0 m' },
        { text: 'Highest', color: 'Highest', tooltip: '>= 3.0 m' },
        { text: 'Not Available', color: 'Not Available', tooltip: '' },
      ];
    }

    if (dataSetVersion === '3.0.0' || dataSetVersion === '3.1.0') {
      return [
        { text: 'Lowest', color: 'Lowest', tooltip: '< 0.1 m' },
        { text: 'Low', color: 'Low', tooltip: '0.1 - 0.5 m' },
        { text: 'Medium', color: 'Medium', tooltip: '0.5 - 1.0 m' },
        { text: 'High', color: 'High', tooltip: '1.0 - 2.0 m' },
        { text: 'Highest', color: 'Highest', tooltip: '>= 2.0 m' },
        { text: 'Not Available', color: 'Not Available', tooltip: '' },
      ];
    }

    return [];
  }
}
