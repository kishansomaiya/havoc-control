// tests/ui/pages/PortfolioImpactsPage.ts

import { Page, Locator,expect } from '@playwright/test';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';
import { waitForContentLoaded } from '@utils/helpers';
const envUrl = testConfig[ENV].appUrl;

export class PortfolioImpactsPage {
  readonly page: Page;
  readonly portfolioHeader: PortfolioHeader;

  readonly Body: Locator;

  // Filters
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

  // Metrics
  readonly Metrics: Locator;
  readonly MetricsInfo: Locator;
  readonly MetricsTitle: Locator;
  readonly MetricsTooltip: Locator;
  readonly MetricsYearFrom: Locator;
  readonly MetricsYearFromLabel: Locator;
  readonly MetricsYearFromValue: Locator;
  readonly MetricsYearTo: Locator;
  readonly MetricsYearToLabel: Locator;
  readonly MetricsYearToValue: Locator;
  readonly MetricsYearToValuePercent: Locator;

  // Charts
  readonly Charts: Locator;
  readonly ChartBody: Locator;
  readonly ChartTitle: Locator;
  readonly ChartGraph: Locator;
  readonly ChartLegend: Locator;
  readonly ChartLegendItem: Locator;
  readonly ChartLegendItemColor: Locator;
  readonly ChartLegendItemText: Locator;

  // Climate Impact Drivers By Location
  readonly ClimateImpactDriversByLocationTableSection: Locator;
  readonly LocationTable: Locator;
  readonly LocationTablePagination: Locator;

  readonly LocationTableHeader: Locator;
  readonly LocationTableRow: Locator;
  readonly LocationColumnLabel: Locator;
  readonly LocationName: Locator;
  readonly LocationsTablePagination: Locator;

  readonly YearFromColumnName: Locator;
  readonly YearFromValue: Locator;

  readonly YearToColumnName: Locator;
  readonly YearToValue: Locator;

  readonly ChangeColumnName: Locator;
  readonly YearChangeValue: Locator;

  constructor(page: Page) {
    this.page = page;

    // Body
    this.Body = page.getByTestId('portfolio-impacts-body');

    // Filters
    this.FiltersForm = page.getByTestId('impacts-filters-form');
    this.Filters = page.getByTestId('impacts-filters');
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

    // Metrics
    this.Metrics = page.getByTestId('metrics');
    this.MetricsInfo = page.getByTestId('metrics-info');
    this.MetricsTitle = page.getByTestId('metrics-title');
    this.MetricsTooltip = page.getByTestId('metrics-tooltip');
    this.MetricsYearFrom = page.getByTestId('metrics-year-from');
    this.MetricsYearFromLabel = page.getByTestId('metrics-year-from-label');
    this.MetricsYearFromValue = page.getByTestId('metrics-year-from-value');
    this.MetricsYearTo = page.getByTestId('metrics-year-to');
    this.MetricsYearToLabel = page.getByTestId('metrics-year-to-label');
    this.MetricsYearToValue = page.getByTestId('metrics-year-to-value');
    this.MetricsYearToValuePercent = page.getByTestId(
      'metrics-year-to-value-percent',
    );

    // Charts
    this.Charts = page.getByTestId('charts');
    this.ChartBody = page.getByTestId('chart-body');
    this.ChartTitle = page.getByTestId('chart-title');
    this.ChartGraph = page.getByTestId('chart-graph');
    this.ChartLegend = page.getByTestId('chart-legend');
    this.ChartLegendItem = page.getByTestId('chart-legend-item');
    this.ChartLegendItemColor = page.getByTestId('chart-legend-item-color');
    this.ChartLegendItemText = page.getByTestId('chart-legend-item-text');

    // Table
    this.ClimateImpactDriversByLocationTableSection = page.getByTestId(
      'impacts-location-table-section',
    );

    this.LocationTable = page.getByTestId('impacts-location-table');
    this.LocationTableHeader = page.getByTestId(
      'impacts-location-table-header',
    );
    this.LocationTableRow = page.getByTestId('table-row');
    this.LocationColumnLabel = page.getByTestId(
      'impacts-location-table-column-first',
    );
    this.LocationName = page.getByTestId('location-name');
    this.YearFromColumnName = page.getByTestId('location-table-year-from');
    this.YearFromValue = page.getByTestId('year-from-value');

    this.YearToColumnName = page.getByTestId('location-table-year-to');
    this.YearToValue = page.getByTestId('year-to-value');
    this.ChangeColumnName = page.getByTestId('location-table-year-change');
    this.YearChangeValue = page.getByTestId('year-change-value');
    this.LocationsTablePagination = page.getByTestId(
      'location-table-pagination',
    );
  }

  async navigateByURL(portfolioId: string) {
    const portfolioImpactsPageUrl = `${envUrl}/portfolios/${portfolioId}/impacts`;
    await this.page.goto(portfolioImpactsPageUrl);
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);
    await expect(this.portfolioHeader.ImpactsTab).toBeVisible();
    await expect(this.Body).toBeVisible();
  }

  async validateControls() {
    const climateImpactDriversByLocationTableLabel =
      'Climate Impact Drivers By Location';
    await waitForContentLoaded(this.page);
    await this.page.waitForLoadState('load');
    await expect(this.Body).toBeVisible();
    await expect(this.FiltersScenario).toBeVisible();
    await expect(this.FiltersYear).toBeVisible();
    await expect(this.Metrics).toBeVisible();
    await expect(this.ClimateImpactDriversByLocationTableSection).toBeVisible();
    await expect(this.ClimateImpactDriversByLocationTableSection).toContainText(
      climateImpactDriversByLocationTableLabel,
    );
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

  async verifyImpactsMetricsVisibility(
    metricsTitleText: string,
    tooltipText: string,
    year: string,
  ) {
    // Set the year in the dropdown using the provided year
    await this.setYear(year);

    // Locate the specific metric based on the title and verify its visibility
    const metricsInfo = this.MetricsInfo.filter({
      has: this.MetricsTitle.filter({ hasText: metricsTitleText }),
    });

    // Check if the title is visible
    await expect(metricsInfo.locator(this.MetricsTitle)).toBeVisible();

    // Check if the tooltip is visible and has the correct aria-label
    await expect(metricsInfo.locator(this.MetricsTooltip)).toBeVisible();
    await expect(metricsInfo.locator(this.MetricsTooltip)).toHaveAttribute(
      'aria-label',
      tooltipText,
    );

    // Verify the year-to-label matches the selected year
    await expect(metricsInfo.locator(this.MetricsYearToLabel)).toBeVisible();
    await expect(metricsInfo.locator(this.MetricsYearToLabel)).toHaveText(year);

    // Check that the rest of the metric elements are visible
    await expect(metricsInfo.locator(this.MetricsYearFromLabel)).toBeVisible();
    await expect(metricsInfo.locator(this.MetricsYearFromValue)).toBeVisible();
    await expect(metricsInfo.locator(this.MetricsYearToValue)).toBeVisible();

    // Check if the year-to-value equals 0 or 0.0, then the percentage should be hidden
    const yearToValueText = await metricsInfo
      .locator(this.MetricsYearToValue)
      .textContent();

    if (yearToValueText?.trim() === '0' || yearToValueText?.trim() === '0.0') {
      // If value is 0 or 0.0, expect the percentage element to be hidden
      await expect(
        metricsInfo.locator(this.MetricsYearToValuePercent),
      ).toBeHidden();
    } else {
      // Otherwise, expect the percentage element to be visible
      await expect(
        metricsInfo.locator(this.MetricsYearToValuePercent),
      ).toBeVisible();
    }
  }

  async verifyChartLegend(chartTitleText: string) {
    // Locate the chart body by matching the chart title
    const chartBody = this.page.locator('[data-testid="chart-body"]', {
      has: this.page.locator('[data-testid="chart-title"]', {
        hasText: chartTitleText,
      }),
    });

    // Ensure the chart body is visible
    await expect(chartBody).toBeVisible();

    // Locate the chart legend within the chart body
    const chartLegend = chartBody.locator('[data-testid="chart-legend"]');
    await expect(chartLegend).toBeVisible();

    // Define legend items for different chart titles
    let legendItems: { color: string; text: string }[] = [];

    switch (chartTitleText) {
      case 'Average Annual Loss over Time':
        legendItems = [
          { color: 'Flood', text: 'Flood' },
          { color: 'Wind', text: 'Wind' },
          { color: 'Heat', text: 'Heat' },
          { color: 'Wildfire', text: 'Wildfire' },
          { color: 'Drought', text: 'Drought' },
        ];
        break;
      case 'Portfolio Value at Risk (Wind+Flood)':
        legendItems = [
          { color: 'PVaR 95% (20yr RP)', text: 'PVaR 95% (20yr RP)' },
          { color: 'PVaR 99% (100yr RP)', text: 'PVaR 99% (100yr RP)' },
        ];
        break;
      case 'Climate Adjusted Valuation Over Time':
        legendItems = [
          { color: 'Benchmark Value', text: 'Benchmark Value' },
          { color: 'Climate-Adjusted Value', text: 'Climate-Adjusted Value' },
        ];
        break;
      case 'Technical premium Over Time':
        legendItems = [
          {
            color: 'Technical (Risk-Based Insurance) Premium',
            text: 'Technical (Risk-Based Insurance) Premium',
          },
        ];
        break;
      case 'Transmission Channel Impacts Over Time':
        legendItems = [
          { color: 'Capital Expenditures', text: 'Capital Expenditures' },
          { color: 'Operational Revenue', text: 'Operational Revenue' },
          { color: 'Operational Expenses', text: 'Operational Expenses' },
        ];
        break;
      default:
        throw new Error(`Unsupported chart title: ${chartTitleText}`);
    }

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
    const chartGraph = chartBody.locator('[data-testid="chart-graph"]');
    await expect(chartGraph).toBeVisible();
  }

  async validateLocationsTable(yearTo: string) {
    const locationTitle = 'Location';
    await expect(this.LocationColumnLabel).toBeVisible();
    await expect(this.LocationColumnLabel).toContainText(locationTitle);
    await expect(this.LocationTableHeader).toBeVisible();
    await expect(this.LocationTableRow.first()).toBeVisible();

    // yearFrom
    const yearFrom = 'Impact 2020';
    await expect(this.YearFromColumnName).toBeVisible();
    await expect(this.YearFromColumnName).toContainText(yearFrom);

    // yearTo
    await expect(this.YearToColumnName).toBeVisible();
    await expect(this.YearToColumnName).toContainText(`Impact ${yearTo}`);

    // Change
    await expect(this.ChangeColumnName).toBeVisible();
    await expect(this.ChangeColumnName).toContainText('Change');
  }

  // Reusable function to check chart visibility based on the chart title
  async verifyChartVisibility(chartTitleText: string) {
    // Locate the parent element of the chart by matching the chart title
    const chartBody = this.page.locator('[data-testid="chart-body"]', {
      has: this.page.locator('[data-testid="chart-title"]', {
        hasText: chartTitleText,
      }),
    });

    // Check that the chart title is visible
    const chartTitle = chartBody.locator('[data-testid="chart-title"]');
    await expect(chartTitle).toBeVisible();

    // Check that the chart graph is visible
    const chartGraph = chartBody.locator('[data-testid="chart-graph"]');
    await expect(chartGraph).toBeVisible();
  }
}
