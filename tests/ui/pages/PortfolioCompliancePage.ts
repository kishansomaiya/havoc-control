// tests/ui/pages/PortfolioCompliancePage.ts

import { Page, Locator,expect } from '@playwright/test';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';
import { waitForContentLoaded } from '@utils/helpers';

const envUrl = testConfig[ENV].appUrl;

export class PortfolioCompliancePage {
  readonly page: Page;
  readonly portfolioHeader: PortfolioHeader;

  readonly Body: Locator;

  // Filters
  readonly Filters: Locator;

  readonly FiltersHazardCategory: Locator;
  readonly FiltersHazardCategoryAllTab: Locator;
  readonly FiltersHazardCategoryDisclosure: Locator;
  readonly FiltersHazardCategoryDisclosureTitle: Locator;
  readonly FiltersHazardCategoryTemperatureTab: Locator;
  readonly FiltersHazardCategoryWaterTab: Locator;
  readonly FiltersHazardCategoryWindTab: Locator;
  readonly FiltersHazardCategorySolidMassTab: Locator;

  // Scenario
  readonly FiltersScenario: Locator;
  readonly FiltersScenarioLabel: Locator;
  readonly FiltersScenarioSelectBox: Locator;
  readonly FiltersScenarioOption: Locator;
  readonly FiltersScenarioOptionTitle: Locator;
  readonly FiltersScenarioOptionDescription: Locator;

  // Year
  readonly FiltersYear: Locator;
  readonly FiltersYearLabel: Locator;
  readonly FiltersYearMultiSelect: Locator;
  readonly FiltersYearChip: Locator;
  readonly FiltersYearChipXIcon: Locator;
  readonly FiltersYearListLabel: Locator;
  readonly FiltersYearListOption: Locator;
  readonly FiltersYearListOptionCheckbox: Locator;
  readonly FiltersYearListOptionValue: Locator;
  readonly FiltersYearHelpText: Locator;
  readonly FiltersYearHelpTextTooltip: Locator;

  // Data Settings
  readonly DataSettingsGearIcon: Locator;
  readonly DataSettingsModal: Locator;

  // Charts
  readonly ChartsAll: Locator;
  readonly ChartsWater: Locator;
  readonly ChartsWind: Locator;
  readonly ChartsSolidMass: Locator;
  readonly ChartTitle: Locator;
  readonly ChartGraph: Locator;

  // Chart Legend
  readonly ChartLegend: Locator;
  readonly ChartLegendItem: Locator;
  readonly ChartLegendItemTitleNotAvailable: Locator;
  readonly ChartLegendItemTitleHighestExposure: Locator;
  readonly ChartLegendItemTitleLowestExposure: Locator;
  readonly ChartLegendItemColor: Locator;
  readonly ChartLegendItemText: Locator;

  // Location Exposure By Hazard And Year
  readonly LocationExposureByHazardAndYearChartSection: Locator;
  readonly LocationExposureByHazardAndYearChartTitle: Locator;
  readonly LocationExposureByHazardAndYearCharts: Locator;
  readonly HazardRelatedChart: Locator;
  readonly HazardRelatedChartTitle: Locator;
  readonly HazardRelatedChartGraph: Locator;

  // Chart Tooltip
  readonly ChartTooltip: Locator;
  readonly ChartTooltipYear: Locator;
  readonly ChartTooltipScore: Locator;
  readonly ChartTooltipScoreColor: Locator;
  readonly ChartTooltipScoreLabel: Locator;
  readonly ChartTooltipScoreValue: Locator;
  readonly ChartTooltipScorePercantage: Locator;

  // EU Hazard Alignment
  readonly EuHazardAlignment: Locator;
  readonly EuHazardAlignmentTitle: Locator;
  readonly EuHazardAlignmentTable: Locator;
  readonly TableHeader: Locator;
  readonly TableHeaderTitle: Locator;
  readonly TableBody: Locator;
  readonly TableBodyRow: Locator;
  readonly TableBodyCell: Locator;
  readonly TableBodyCellMetric: Locator;
  readonly TableBodyCellMetricExposure: Locator;
  readonly TableBodyCellMetricTitle: Locator;
  readonly TableBodyCellMetricDescription: Locator;
  readonly TableBodyCellMetricSource: Locator;
  readonly HazardTypeTitle: Locator;

  // Availability Legend
  readonly AvailabilityLegend: Locator;
  readonly AvailabilityLegendItem: Locator;
  readonly AvailabilityLegendItemIcon: Locator;
  readonly AvailabilityLegendItemLabel: Locator;

  // Drill Down (Single Hazard Category page)
  readonly ChartsSingle: Locator;
  readonly ChartsSingleRelatedHazards: Locator;
  readonly CategoryRelatedHazards: Locator;
  readonly CategoryRelatedHazardsChronic: Locator;
  readonly CategoryRelatedHazardsAcute: Locator;
  readonly ChartsSingleRelatedHazardsSelectAll: Locator;
  readonly ChartSingleRelatedHazardsTitle: Locator;
  readonly DrillDownMetrics: Locator;
  readonly DrillDownMetricsRadioButtonBlock: Locator;
  readonly DrillDownMetricsRadioButtonLabel: Locator;
  readonly DrillDownMetricsRadioButtonIcon: Locator;
  readonly DrillDownMetricsRadioButton: Locator;

  readonly ChartSinglecategoryExposureByYearAndScenario: Locator;
  readonly ChartSinglecategoryExposureByYearAndScenarioTitle: Locator;

  // Locations table
  readonly LocationTable: Locator;
  readonly LocationTableTitle: Locator;
  readonly LocationTableBody: Locator;
  readonly LocationTableHeaderColumn: Locator;
  readonly LocationTableRow: Locator;
  readonly LocationTableLocationName: Locator;
  readonly LocationTableRowCell: Locator;

  // Pagination
  readonly LocationTablePagination: Locator;

  constructor(page: Page) {
    this.page = page;

    // Body
    this.Body = page.getByTestId('compliance-body');

    // Filters
    this.Filters = page.getByTestId('compliance-filters');

    // Filters > Hazard Category
    this.FiltersHazardCategory = page.getByTestId(
      'compliance-filters-hazard-category',
    );
    this.FiltersHazardCategoryAllTab = page.getByTestId(
      'compliance-filters-hazard-category-all',
    );
    this.FiltersHazardCategoryDisclosure = page.getByTestId(
      'compliance-filters-hazard-category-disclosure',
    );
    this.FiltersHazardCategoryDisclosureTitle = page.getByTestId(
      'compliance-filters-hazard-category-disclosure-title',
    );
    this.FiltersHazardCategoryTemperatureTab = page
      .getByTestId('compliance-filters-hazard-category-disclosure')
      .filter({ hasText: 'Temperature' });
    this.FiltersHazardCategoryWaterTab = page
      .getByTestId('compliance-filters-hazard-category-disclosure')
      .filter({ hasText: 'Water' });
    this.FiltersHazardCategoryWindTab = page
      .getByTestId('compliance-filters-hazard-category-disclosure')
      .filter({ hasText: 'Wind' });
    this.FiltersHazardCategorySolidMassTab = page
      .getByTestId('compliance-filters-hazard-category-disclosure')
      .filter({ hasText: 'Solid Mass' });

    // Filters > Scenario
    this.FiltersScenario = page.getByTestId('scenario-select-form-control');
    this.FiltersScenarioLabel = page.getByTestId('scenario-field-label');
    this.FiltersScenarioSelectBox = page.getByTestId('scenario-field-select');
    this.FiltersScenarioOption = page.getByTestId('scenario-option');
    this.FiltersScenarioOptionTitle = page.getByTestId('scenario-option-title');
    this.FiltersScenarioOptionDescription = page.getByTestId(
      'scenario-option-description',
    );

    // Filters > Year
    this.FiltersYear = page.getByTestId('compliance-filters-year');
    this.FiltersYearLabel = page.getByTestId('compliance-filters-year-label');
    this.FiltersYearMultiSelect = page.getByTestId(
      'compliance-filters-year-multiselect',
    );
    this.FiltersYearChip = page.locator(
      '[data-testid="compliance-filters-year-chip"]',
    );
    this.FiltersYearChipXIcon = page.getByTestId(
      'compliance-filters-year-chip-x-icon',
    );
    this.FiltersYearListLabel = page.getByTestId(
      'compliance-filters-year-list-label',
    );
    this.FiltersYearListOption = page.getByTestId(
      'compliance-filters-year-list-option',
    );
    this.FiltersYearListOptionCheckbox = page.getByTestId(
      'compliance-filters-year-list-option-checkbox',
    );
    this.FiltersYearListOptionValue = page.getByTestId(
      'compliance-filters-year-list-option-value',
    );
    this.FiltersYearHelpText = page.getByTestId(
      'compliance-filters-year-helptext',
    );
    this.FiltersYearHelpTextTooltip = page.getByTestId(
      'compliance-filters-year-helptext-tooltip',
    );

    // Data Settings
    this.DataSettingsGearIcon = page.getByTestId(
      'open-compliance-configuration-dialog-icon',
    );
    this.DataSettingsModal = page.getByTestId('data-settings-modal');

    // Scores

    // Charts
    this.ChartsAll = page.getByTestId('compliance-charts-all');

    // Chart Legend
    this.ChartLegend = page.getByTestId('hazard-related-chart-graph-legend');
    this.ChartLegendItem = page.getByTestId('score-levels-map-legend');
    this.ChartLegendItemTitleNotAvailable = page
      .getByTestId('score-levels-map-legend-score-level-highest')
      .first();
    this.ChartLegendItemTitleHighestExposure = page
      .getByTestId('score-levels-map-legend-score-level-highest')
      .last();
    this.ChartLegendItemTitleLowestExposure = page.getByTestId(
      'score-levels-map-legend-score-level-lowest',
    );
    this.ChartLegendItemColor = page.getByTestId(
      'score-levels-map-legend-value',
    );

    // Location Exposure By Hazard And Year
    this.LocationExposureByHazardAndYearChartSection = page.getByTestId(
      'compliance-location-exposure-by-hazard-and-year-chart',
    );
    this.LocationExposureByHazardAndYearChartTitle = page.getByTestId(
      'location-exposure-by-hazard-and-year-title',
    );
    this.LocationExposureByHazardAndYearCharts = page.getByTestId(
      'location-exposure-by-hazard-and-year-charts',
    );
    this.HazardRelatedChart = page.getByTestId('hazard-related-chart');
    this.HazardRelatedChartTitle = page.getByTestId(
      'hazard-related-chart-title',
    );
    this.HazardRelatedChartGraph = page.getByTestId(
      'hazard-related-chart-graph',
    );

    // Chart tooltip
    this.ChartTooltip = page.getByTestId('chart-tooltip');
    this.ChartTooltipYear = page.getByTestId('chart-tooltip-year');
    this.ChartTooltipScore = page.getByTestId('chart-tooltip-score');
    this.ChartTooltipScoreColor = page.getByTestId('chart-tooltip-score-color');
    this.ChartTooltipScoreLabel = page.getByTestId('chart-tooltip-score-label');
    this.ChartTooltipScoreValue = page.getByTestId('chart-tooltip-score-value');
    this.ChartTooltipScorePercantage = page.getByTestId(
      'chart-tooltip-score-percentage',
    );

    // EU Hazard Alignment
    this.EuHazardAlignment = page.getByTestId('compliance-eu-hazard-alignment');
    this.EuHazardAlignmentTitle = page.getByTestId(
      'compliance-eu-hazard-alignment-title',
    );
    this.EuHazardAlignmentTable = page.getByTestId(
      'compliance-eu-hazard-alignment-table',
    );
    this.TableHeader = page.getByTestId(
      'compliance-eu-hazard-alignment-table-head',
    );
    this.TableHeaderTitle = page.getByTestId(
      'compliance-eu-hazard-alignment-table-head-title',
    );
    this.TableBody = page.getByTestId(
      'compliance-eu-hazard-alignment-table-body',
    );
    this.TableBodyRow = page.getByTestId(
      'compliance-eu-hazard-alignment-table-body-row',
    );
    this.TableBodyCell = page.getByTestId(
      'compliance-eu-hazard-alignment-table-body-cell',
    );
    this.TableBodyCellMetric = page.getByTestId('table-body-cell-metric');
    this.TableBodyCellMetricExposure = page
      .getByTestId('table-body-cell-metric-exposure')
      .locator('svg');
    // Availability Legend
    this.AvailabilityLegend = page.getByTestId(
      'table-body-cell-metric-exposure-legend',
    );
    this.AvailabilityLegendItem = page.getByTestId(
      'table-body-cell-metric-exposure-legend-item',
    );
    this.AvailabilityLegendItemIcon = page
      .getByTestId('table-body-cell-metric-exposure-legend-item')
      .locator('svg');
    this.AvailabilityLegendItemLabel = page.getByTestId(
      'table-body-cell-metric-exposure-legend-item-label',
    );

    this.TableBodyCellMetricTitle = page.getByTestId(
      'table-body-cell-metric-title',
    );
    this.TableBodyCellMetricDescription = page.getByTestId(
      'table-body-cell-metric-description',
    );
    this.TableBodyCellMetricSource = page.getByTestId(
      'table-body-cell-metric-description-source',
    ); // Jupiter Metric, Risk Driver
    this.HazardTypeTitle = page.getByTestId(
      'compliance-eu-hazard-alignment-table-body-hazard-type-title',
    ); // Chronic, Acute

    // Drill Down (Single Hazard Category page)
    this.ChartsSingle = page.getByTestId('compliance-charts-single');
    this.ChartsSingleRelatedHazardsSelectAll = page.getByTestId(
      'compliance-charts-single-category-select-all-toggle',
    );
    this.ChartsSingleRelatedHazards = page.getByTestId(
      'compliance-related-hazards',
    );
    this.CategoryRelatedHazards = page.getByTestId(
      'compliance-hazard-metric-selector',
    );
    this.ChartSingleRelatedHazardsTitle = page.getByTestId(
      'compliance-related-hazards-title',
    );

    // Metrics
    this.DrillDownMetrics = page.getByTestId('metrics-radio-groups');
    this.CategoryRelatedHazardsChronic = page.locator(
      '[data-testid="metrics-radio-group"]',
      {
        has: page.locator('h6', { hasText: 'Chronic' }),
      },
    );
    this.CategoryRelatedHazardsAcute = page.locator(
      '[data-testid="metrics-radio-group"]',
      {
        has: page.locator('h6', { hasText: 'Acute' }),
      },
    );
    this.DrillDownMetricsRadioButtonBlock = page.getByTestId(
      'metrics-radio-button',
    );
    this.DrillDownMetricsRadioButtonLabel = page.getByTestId(
      'metrics-radio-button-label',
    );
    this.DrillDownMetricsRadioButtonIcon = page
      .getByTestId('metrics-radio-button')
      .locator('span');
    this.DrillDownMetricsRadioButton = page
      .getByTestId('metrics-radio-button')
      .locator('input');

    // Exposure by Year and Scenario
    this.ChartSinglecategoryExposureByYearAndScenario = page.getByTestId(
      'compliance-category-exposure-by-year-and-scenario',
    );
    this.ChartSinglecategoryExposureByYearAndScenarioTitle = page.getByTestId(
      'compliance-category-exposure-by-year-and-scenario-title',
    );

    // Location Table
    this.LocationTable = page.getByTestId(
      'compliance-charts-single-category-location-table',
    );
    this.LocationTableTitle = page.getByTestId(
      'compliance-charts-single-category-location-table-title',
    );
    this.LocationTableBody = page.getByTestId(
      'locations-ranked-by-compliance-table',
    );
    this.LocationTableHeaderColumn = page
      .getByTestId('locations-ranked-by-compliance-table')
      .locator('h6');
    this.LocationTableRow = page.getByTestId(
      'portfolio-overview-location-score-table-row',
    );
    this.LocationTableLocationName = page.getByTestId(
      'location-score-table-location-name',
    );
    this.LocationTableRowCell = page.getByTestId(
      'portfolio-overview-location-score-table-location-cell',
    );

    // Pagination
    this.LocationTablePagination = page.getByTestId(
      'compliance-score-table-pagination',
    );
  }

  async navigateByURL(portfolioId: string) {
    const portfolioCompliancePageUrl = `${envUrl}/portfolios/${portfolioId}/compliance`;
    await this.page.goto(portfolioCompliancePageUrl);
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);
    await expect(this.portfolioHeader.ComplianceTab).toBeVisible();
    await expect(this.Body).toBeVisible();
  }
  async navigateToSingleCategoryTab(category: string) {
    const categoryTabLocator = this.page
      .getByTestId('compliance-filters-hazard-category-disclosure')
      .filter({ hasText: `${category}` });
    await expect(categoryTabLocator).toBeVisible();
    await categoryTabLocator.click();
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);
    await expect(categoryTabLocator).toHaveClass(/MuiButton-contained/);
    await expect(this.ChartsSingleRelatedHazards).toBeVisible();
  }

  async openDataSettings() {
    await expect(this.DataSettingsGearIcon).toBeVisible();
    await this.DataSettingsGearIcon.click();
    await expect(this.DataSettingsModal).toBeVisible();
  }

  async validateControls() {
    await waitForContentLoaded(this.page);
    await this.page.waitForLoadState('load');
    await expect(this.Body).toBeVisible();
    await expect(this.FiltersHazardCategory).toBeVisible();
    await expect(this.FiltersScenario).toBeVisible();
    await expect(this.FiltersYear).toBeVisible();
    await expect(this.DataSettingsGearIcon).toBeVisible();
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

  async validateHazardCategories() {
    await expect(this.FiltersHazardCategoryAllTab).toBeVisible();
    await expect(this.FiltersHazardCategoryTemperatureTab).toBeVisible();
    await expect(this.FiltersHazardCategoryWaterTab).toBeVisible();
    await expect(this.FiltersHazardCategoryWindTab).toBeVisible();
    await expect(this.FiltersHazardCategorySolidMassTab).toBeVisible();
  }

  async validateDefaultHazardCategory() {
    await expect(this.FiltersHazardCategoryAllTab).toBeVisible();
    await expect(this.FiltersHazardCategoryAllTab).toHaveClass(
      /MuiButton-contained/,
    );
  }

  async validateLocationExposureByHazardAndYear() {
    await expect(
      this.LocationExposureByHazardAndYearChartSection,
    ).toBeVisible();
    await expect(this.LocationExposureByHazardAndYearChartTitle).toBeVisible();
    await expect(this.LocationExposureByHazardAndYearChartTitle).toHaveText(
      'Location Exposure By Hazard And Year',
    );
    await expect(this.LocationExposureByHazardAndYearCharts).toBeVisible();
    await expect(this.HazardRelatedChart.first()).toBeVisible();
    await expect(this.HazardRelatedChartTitle.first()).toBeVisible();
    await expect(this.HazardRelatedChartGraph.first()).toBeVisible();
    await expect(this.ChartLegend).toBeVisible();
  }

  async validateChartLegend() {
    await expect(this.ChartLegend).toBeVisible();
    await expect(this.ChartLegendItem.first()).toBeVisible();
    await expect(this.ChartLegendItemColor.first()).toBeVisible();
    await expect(this.ChartLegendItemColor.nth(5)).toBeVisible();
    await expect(this.ChartLegendItem).toHaveCount(2);
    await expect(this.ChartLegendItem.nth(0)).toBeVisible();
    await expect(this.ChartLegendItem.nth(1)).toBeVisible();
    await expect(this.ChartLegendItemTitleNotAvailable).toBeVisible();
    await expect(this.ChartLegendItemTitleNotAvailable).toHaveText(
      'Not Available',
    );
    await expect(this.ChartLegendItemTitleHighestExposure).toBeVisible();
    await expect(this.ChartLegendItemTitleHighestExposure).toHaveText(
      'Highest Exposure',
    );
    await expect(this.ChartLegendItemTitleLowestExposure).toBeVisible();
    await expect(this.ChartLegendItemTitleLowestExposure).toHaveText(
      'Lowest Exposure',
    );
  }

  async validateEuHazardAlignment() {
    await this.EuHazardAlignment.scrollIntoViewIfNeeded();
    await expect(this.EuHazardAlignment).toBeVisible();
    await expect(this.EuHazardAlignmentTitle).toBeVisible();
    await expect(this.EuHazardAlignmentTitle).toHaveText('EU Hazard Alignment');
    await expect(this.EuHazardAlignmentTable).toBeVisible();
    await expect(this.TableHeader).toBeVisible();
    await expect(this.TableHeaderTitle.first()).toBeVisible();
    await expect(this.TableBody).toBeVisible();
    await expect(this.HazardTypeTitle.first()).toBeVisible();
    await expect(this.HazardTypeTitle.first()).toHaveText('Chronic');
    await expect(this.HazardTypeTitle.nth(1)).toBeVisible();
    await expect(this.HazardTypeTitle.nth(1)).toHaveText('Acute');
    await expect(this.HazardTypeTitle).toHaveCount(2);
    // await expect(this.TableBodyCellMetric.locator('div')).toHaveCount(2); // TODO: add test to get the total number of all metrics from the API /metadata
    await expect(this.TableBodyCellMetricExposure.first()).toBeVisible();
    await expect(this.TableBodyCellMetricTitle.first()).toBeVisible();
    await expect(this.TableBodyCellMetricDescription.first()).toBeVisible();
    await expect(this.TableBodyCellMetricSource.first()).toBeVisible();
  }

  async validateRelatedHazardsTitle(category: string) {
    const text = '-related Hazards';
    await expect(this.ChartSingleRelatedHazardsTitle).toBeVisible();
    await expect(this.ChartSingleRelatedHazardsTitle).toContainText(
      `${category}${text}`,
    );
  }

  async validateExposureByYearAndScenarioTitle(category: string) {
    const text = ' Exposure by Year and Scenario';
    await expect(this.ChartSingleRelatedHazardsTitle).toBeVisible();
    await expect(
      this.ChartSinglecategoryExposureByYearAndScenarioTitle,
    ).toContainText(`${category}${text}`);
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

    await expect(this.FiltersScenarioLabel).toBeVisible();
    await expect(this.FiltersScenarioLabel).toContainText('Scenario');

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
    await this.page
      .getByRole('option', { name: scenarioOptions.default })
      .click(); //close
  }

  // Set Year
  async clickCheckboxFor(value: string) {
    // await this.FiltersYearMultiSelect.click();
    const option = await this.page.getByRole('option', { name: value });
    // Scroll the option into view if it's not visible
    const isVisible = await option.isVisible();
    if (!isVisible) {
      await option.scrollIntoViewIfNeeded();
    }
    await option.click();
  }

  // Method to click the "X" icon for a specific year chip
  async removeYearChip(year: number) {
    const yearChip = this.FiltersYearChip.filter({ hasText: year.toString() });
    const deleteIcon = yearChip.locator(
      '[data-testid="compliance-filters-year-chip-x-icon"]',
    );

    await expect(yearChip).toBeVisible()
    await expect(deleteIcon).toBeVisible()

    // Click the "X" icon to remove the chip
    await deleteIcon.click();
  }

  // Method to check that the year chip has been removed
  async isYearChipRemoved(year: number) {
    await this.page.waitForLoadState('load');
    const yearChip = this.FiltersYearChip.locator(`text=${year}`);
    await expect(yearChip).toHaveCount(0);
  }

  // Method to check the "Year" dropdown based on the returned years from the API response
  async validateApiYears(apiYears: number[]) {
    // Remove 1995 from the API response, if it exists
    const filteredApiYears = apiYears.filter((year) => year !== 1995);

    // Open the multi-select box using the prepared locator
    const yearDropDown = this.FiltersYearMultiSelect;

    await expect(this.FiltersYearLabel).toBeVisible();
    await expect(this.FiltersYearLabel).toContainText('Year');
    await yearDropDown.click();
    await expect(this.FiltersYearListLabel).toBeVisible();
    await expect(this.FiltersYearListLabel).toBeDisabled();
    await expect(this.FiltersYearListLabel).toContainText('Select up to 3');

    // Step 3: Locate all year options in the multi-select box
    const yearOption = this.FiltersYearListOption;

    // Get all options' values
    const displayedYears = await yearOption.evaluateAll((options) =>
      options.map((option) => option.getAttribute('data-value')),
    );

    // Validate that the years from the API are included in the displayed years (excluding 1995)
    expect(displayedYears.sort()).toEqual(filteredApiYears.map(String).sort());
  }

  async uncheckSelectAllToggle() {
    await expect(this.CategoryRelatedHazards).toBeVisible();
    await expect(this.ChartsSingleRelatedHazardsSelectAll).toBeVisible();
    const isSelectAllChecked =
      this.ChartsSingleRelatedHazardsSelectAll.locator('input').isChecked();
    if (isSelectAllChecked) {
      await this.ChartsSingleRelatedHazardsSelectAll.locator('input').uncheck();
      await expect(
        this.ChartsSingleRelatedHazardsSelectAll.locator('input'),
      ).not.toBeChecked();
    } else {
      return;
    }
  }

  async checkSelectAllToggle() {
    await expect(this.CategoryRelatedHazards).toBeVisible();
    await expect(this.ChartsSingleRelatedHazardsSelectAll).toBeVisible();
    const isSelectAllChecked =
      this.ChartsSingleRelatedHazardsSelectAll.locator('input').isChecked();
    if (!isSelectAllChecked) {
      await this.ChartsSingleRelatedHazardsSelectAll.locator('input').check();
      await expect(
        this.ChartsSingleRelatedHazardsSelectAll.locator('input'),
      ).toBeChecked();
    } else {
      return;
    }
  }

  async validateDefaultSelectedYears() {
    // Default years that should ideally be selected
    const defaultSelectedYears = ['2025', '2040', '2050'];

    // Open the multi-select box using the prepared locator
    const yearDropDown = this.FiltersYearMultiSelect;
    await yearDropDown.click();

    // Step 3: Locate all year options in the multi-select box
    const yearOption = this.FiltersYearListOption;

    // Get all options' values and their selected status
    const displayedYears = await yearOption.evaluateAll((options) =>
      options.map((option) => ({
        value: option.getAttribute('data-value'),
        isSelected: option.getAttribute('aria-selected') === 'true', // Check if the option is selected
      })),
    );

    // Extract values of displayed years and currently selected years
    const displayedYearsValues = displayedYears.map((option) => option.value);
    const selectedYears = displayedYears
      .filter((option) => option.isSelected)
      .map((option) => option.value);

    // Step 4: Validate selections
    const availableDefaultYears = defaultSelectedYears.filter((year) =>
      displayedYearsValues.includes(year),
    );

    if (availableDefaultYears.length === 3) {
      // Validate that all default years are selected
      expect(selectedYears.sort()).toEqual(availableDefaultYears.sort());
    } else {
      // Validate that the first three available options are selected
      const firstThreeAvailable = displayedYearsValues.slice(0, 3);
      expect(selectedYears.sort()).toEqual(firstThreeAvailable.sort());
    }
  }
}
