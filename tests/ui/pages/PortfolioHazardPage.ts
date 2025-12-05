// tests/ui/pages/PortfolioHazardPage.ts

import { Page, Locator ,expect} from '@playwright/test';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';
import { waitForContentLoaded } from '@utils/helpers';
const envUrl = testConfig[ENV].appUrl;

export class PortfolioHazardPage {
  readonly page: Page;
  readonly portfolioHeader: PortfolioHeader;

  readonly PortfolioHazardBody: Locator;
  readonly PortfolioHazardMap: Locator;
  readonly PortfolioHazardScoreSwitcher: Locator;
  readonly PortfolioOverviewScoreSwitcherTab: Locator;
  readonly ScoreSwitcherTab: Locator;
  readonly ScoreSwitcherItem: Locator;
  readonly ChartLabel: Locator;
  readonly ChartDescription: Locator;
  readonly Filters: Locator;
  readonly PortfolioHazardContentBlock: Locator;
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
  readonly ChartScoreLabel: Locator;
  readonly ScorePieChart: Locator;
  readonly ChartScore: Locator;
  readonly ChartScoreInner: Locator;
  readonly LocationDriversTableLabel: Locator;
  readonly YearFromColumnName: Locator;
  readonly YearFromColumnTooltip: Locator;
  readonly YearToColumnName: Locator;
  readonly YearToColumnTooltip: Locator;
  readonly ChangeColumnName: Locator;
  readonly ChangeColumnTooltip: Locator;
  readonly LocationTable: Locator;
  readonly LocationTableHeader: Locator;
  readonly LocationTableRow: Locator;
  readonly LocationColumnLabel: Locator;
  readonly LocationsTablePagination: Locator;

  readonly ChartLegendItem: Locator;
  readonly ChartLegendItemColor: Locator;
  readonly ChartLegendItemText: Locator;
  readonly ChartLegendItemTooltip: Locator;

  constructor(page: Page) {
    this.page = page;

    // Body
    this.PortfolioHazardBody = page.getByTestId('portfolio-hazard-body');
    this.PortfolioHazardContentBlock = page.getByTestId(
      'portfolio-hazard-content-block',
    );

    // Map & score switchers
    this.PortfolioHazardMap = page.getByTestId('portfolio-hazard-map');
    this.PortfolioHazardScoreSwitcher = page.getByTestId(
      'portfolio-hazard-score-switcher',
    );
    this.ScoreSwitcherTab = page.getByTestId('score-switcher-tab');
    this.ScoreSwitcherItem = page.getByTestId('score-switcher-item');
    this.ChartLabel = page.getByTestId('portfolio-hazard-chart-label');
    this.ChartDescription = page.getByTestId(
      'portfolio-hazard-chart-description',
    );
    this.FiltersForm = page.getByTestId('portfolio-hazard-filters-form');
    this.Filters = page.getByTestId('portfolio-hazard-filters');
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
    this.ChartScore = page.getByTestId('portfolio-hazard-chart-score');
    this.ChartScoreInner = page.getByTestId('portfolio-hazard-chart-inner');
    this.ChartScoreLabel = page.getByTestId(
      'portfolio-hazard-chart-score-label',
    );
    this.ScorePieChart = page.getByTestId('pie-chart');
    this.LocationDriversTableLabel = page.getByTestId(
      'portfolio-hazard-location-drivers-table-title',
    );
    this.LocationTable = page.getByTestId(
      'portfolio-hazard-location-drivers-table',
    );
    this.LocationTableHeader = page.getByTestId(
      'portfolio-hazard-location-drivers-table-header',
    );
    this.LocationTableRow = page.getByTestId('table-row');
    this.LocationColumnLabel = page.getByTestId(
      'portfolio-hazard-location-drivers-table-column-first',
    );
    this.YearFromColumnName = page.getByTestId(
      'portfolio-hazard-location-drivers-table-year-from',
    );
    this.YearFromColumnTooltip = page.getByTestId(
      'portfolio-hazard-location-drivers-table-year-from-tooltip-icon',
    );
    this.YearToColumnName = page.getByTestId(
      'portfolio-hazard-location-drivers-table-year-to',
    );
    this.YearToColumnTooltip = page.getByTestId(
      'portfolio-hazard-location-drivers-table-year-to-tooltip-icon',
    );
    this.ChangeColumnName = page.getByTestId(
      'portfolio-hazard-location-drivers-table-year-change',
    );
    this.ChangeColumnTooltip = page.getByTestId(
      'portfolio-hazard-location-drivers-table-year-change-tooltip-icon',
    );
    this.LocationsTablePagination = page.getByTestId(
      'table-location-pagination',
    );

    this.ChartLegendItem = page.getByTestId('chart-legend-item');
    this.ChartLegendItemColor = page.getByTestId('chart-legend-item-color');
    this.ChartLegendItemText = page.getByTestId('chart-legend-item-text');
    this.ChartLegendItemTooltip = page.getByTestId('chart-legend-item-tooltip');
  }
  async navigateByURL(portfolioId: string) {
    const portfolioHazardPageUrl = `${envUrl}/portfolios/${portfolioId}/hazard`;
    await this.page.goto(portfolioHazardPageUrl);
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);
    await expect(this.portfolioHeader.HazardTab).toBeVisible();
    await expect(this.PortfolioHazardBody).toBeVisible();
  }

  async validateControls() {
    const chartLabel = 'Hazard Level';
    const chartScoreLabel = '% Locations by Hazard Level - ';
    const locationDriversTableLabel = 'Location Hazard Drivers - ';
    await waitForContentLoaded(this.page);
    await this.page.waitForLoadState('load');
    await expect(this.PortfolioHazardBody).toBeVisible();
    await expect(this.PortfolioHazardMap).toBeVisible();
    await expect(this.PortfolioHazardScoreSwitcher).toBeVisible();
    await expect(this.ScoreSwitcherTab).toBeVisible();
    await expect(this.PortfolioHazardContentBlock).toBeVisible();
    await expect(this.FiltersForm).toBeVisible();
    await expect(this.ChartLabel).toBeVisible();
    await expect(this.ChartLabel).toContainText(chartLabel);
    await expect(this.ChartDescription).toBeVisible();
    await expect(this.ChartScore).toBeVisible();
    await expect(this.ChartScoreLabel).toBeVisible();
    await expect(this.ChartScoreLabel).toContainText(chartScoreLabel);
    await expect(this.LocationDriversTableLabel).toBeVisible();
    await expect(this.LocationDriversTableLabel).toContainText(
      locationDriversTableLabel,
    );
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

  async validateLocationsTableLabel() {
    // Define the score switcher tabs
    const tabs = [
      'Flood',
      'Wind',
      'Wildfire',
      'Heat',
      'Precip',
      'Cold',
      'Drought',
      'Hail',
    ];

    // Iterate over each tab and perform actions
    for (const tabName of tabs) {
      // Find the locator for the current tab
      const tabLocator = this.ScoreSwitcherItem.filter({
        hasText: tabName,
      });

      // Click the tab
      await tabLocator.click();

      // Construct the expected title
      const expectedLabel = `Location Hazard Drivers - ${tabName}`;

      // Locate the label element
      const titleLocator = this.LocationDriversTableLabel;

      // Verify that the label text matches the selected tab
      await expect(titleLocator).toHaveText(expectedLabel);
    }
  }

  async validateChartScoreLabel() {
    // Define the score switcher tabs
    const tabs = [
      'Flood',
      'Wind',
      'Wildfire',
      'Heat',
      'Precip',
      'Cold',
      'Drought',
      'Hail',
    ];

    // Iterate over each tab and perform actions
    for (const tabName of tabs) {
      // Find the locator for the current tab
      const tabLocator = this.ScoreSwitcherItem.filter({
        hasText: tabName,
      });

      // Click the tab
      await tabLocator.click();

      // Construct the expected title
      const expectedLabel = `% Locations by Hazard Level - ${tabName}`;

      // Locate the label element
      const titleLocator = this.ChartScoreLabel;
      // Verify that the label text matches the selected tab
      await expect(titleLocator).toHaveText(expectedLabel);
    }
  }

  async checkLegendColorsAndTexts() {
    const expectedItems = [
      { color: 'Lowest', text: 'Lowest' },
      { color: 'Low', text: 'Low' },
      { color: 'Medium', text: 'Medium' },
      { color: 'High', text: 'High' },
      { color: 'Highest', text: 'Highest' },
      { color: 'Not Available', text: 'Not Available' },
    ];


    // Check if the count of legend items matches
    await expect(this.ChartLegendItem).toHaveCount(expectedItems.length);
    const legendItemsCount = await this.ChartLegendItem.count();

    for (let i = 0; i < legendItemsCount; i++) {
      const legendColor = await this.ChartLegendItemColor.nth(i).textContent();
      const legendText = await this.ChartLegendItemText.nth(i).textContent();

      // Check if color and text match the expected values
      expect(legendColor?.trim()).toBe(expectedItems[i].color);
      expect(legendText?.trim()).toBe(expectedItems[i].text);
    }
  }

  async validateChartScoreDescription() {
    // Locate the label element
    const descriptionLocator = this.ChartDescription;

    const tabLocatorFlood = this.ScoreSwitcherItem.filter({ hasText: 'Flood' });
    const tabLocatorHeat = this.ScoreSwitcherItem.filter({ hasText: 'Heat' });

    // Construct the expected title
    const description_Flood_Depth_100 =
      'Mean depth of the water (in meters) at the 100-year return period';
    const metric_Flood_Fr90mmHighTide =
      'Fraction of land within the 90m grid cell inundated by high tide';
    const description_Flood_Fr90mmHighTide =
      'Mean fraction of land within the 90m grid cell inundated by high tides on an annual basis. Set to -9999 outside coastal areas.';
    const metric_HeatAnnual = 'Average annual temperature (in C)';
    const description_HeatAverageAnnual =
      "Average annual temperature (in °C), calculated as the average of each month's average temperature";

    // Click the tab
    await tabLocatorFlood.click();
    await waitForContentLoaded(this.page);
    // Verify that the description text matches the selected metric
    await expect(descriptionLocator).toHaveText(description_Flood_Depth_100);

    // Select metric
    await this.setMetric(metric_Flood_Fr90mmHighTide);
    // Verify that the description text matches the selected metric
    await expect(descriptionLocator).toHaveText(
      description_Flood_Fr90mmHighTide,
    );

    // Click the tab
    await tabLocatorHeat.click();
    await waitForContentLoaded(this.page);
    // Select metric
    await this.setMetric(metric_HeatAnnual);
    // Verify that the description text matches the selected metric
    await expect(descriptionLocator).toHaveText(description_HeatAverageAnnual);
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

  // Select tab (e.g., "Flood", "Wind", etc.)
  async selectTab(tabName: string) {
    const tabLocator = this.ScoreSwitcherTab.locator(`text=${tabName}`);
    await tabLocator.click();
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

  // Validate Metric dropdown for the selected tab
  async validateMetricDropdown(selectedTab: string) {
    const metricOptionsByTab = {
      Flood: {
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
      },
      Wind: {
        default:
          'Maximum 1-minute sustained wind speed (in km/hr) experienced at the 100-year return period',
        values: [
          'Maximum 1-minute sustained wind speed (in km/hr) experienced at the 10-year return period',
          'Maximum 1-minute sustained wind speed (in km/hr) experienced at the 20-year return period',
          'Maximum 1-minute sustained wind speed (in km/hr) experienced at the 50-year return period',
          'Maximum 1-minute sustained wind speed (in km/hr) experienced at the 100-year return period',
          'Maximum 1-minute sustained wind speed (in km/hr) experienced at the 200-year return period',
          'Maximum 1-minute sustained wind speed (in km/hr) experienced at the 500-year return period',
          'Average annual wind speed (in km/h)',
          'Max wind speed (in km/h) for the year',
        ],
      },
      Wildfire: {
        default: 'Annual probability of wildfire',
        values: ['Annual probability of wildfire'],
      },
      Heat: {
        default: 'Days per year with temperature >35C',
        values: [
          'Days per year with temperature >35C',
          'Days per year with temperature >38C',
          'Days per year with temperature exceeding the local historical 99th percentile temperature',
          'Annual sum of the daily mean temperature minus 18C indicating a need for air conditioning',
          'Number of days per year where the Wet-Bulb Globe Temperature (WBGT) exceeds 32C',
          'Number of days per year where the Wet-Bulb Globe Temperature (WBGT) exceeds 35C',
          'Absolute heat wave: annual count of 3-day periods with high temp >35C and low temp >24C',
          'Relative heat wave: annual count of 3-day periods with high temp > local historical 95th percentile temp',
          'Average annual temperature (in C)',
          'Max temperature (in C) for the year',
          'Average temperature (in C) in January',
          'Average temperature (in C) in February',
          'Average temperature (in C) in March',
          'Average temperature (in C) in April',
          'Average temperature (in C) in May',
          'Average temperature (in C) in June',
          'Average temperature (in C) in July',
          'Average temperature (in C) in August',
          'Average temperature (in C) in September',
          'Average temperature (in C) in October',
          'Average temperature (in C) in November',
          'Average temperature (in C) in December',
        ],
      },
      Cold: {
        default: 'Days per year with temperature <0C',
        values: [
          'Days per year with temperature <0C',
          'Days per year with temperature <-10C',
          'Annual sum of 18C minus the daily mean temperature indicating a need for heating',
          'Absolute cold wave: annual count of 3-day periods with avg temp <-5C',
          'Relative cold wave: annual count of 3-day periods with low temp < local historical 10th percentile temp',
        ],
      },
      Precip: {
        default:
          'Maximum daily total water equivalent precipitation (in mm) experienced at the 100-year return period',
        values: [
          'Maximum daily total water equivalent precipitation (in mm) experienced at the 10-year return period',
          'Maximum daily total water equivalent precipitation (in mm) experienced at the 20-year return period',
          'Maximum daily total water equivalent precipitation (in mm) experienced at the 50-year return period',
          'Maximum daily total water equivalent precipitation (in mm) experienced at the 100-year return period',
          'Maximum daily total water equivalent precipitation (in mm) experienced at the 200-year return period',
          'Maximum daily total water equivalent precipitation (in mm) experienced at the 500-year return period',
          'Total water equivalent precipitation (in mm) for the year',
          'Total water equivalent precipitation (in mm) for January',
          'Total water equivalent precipitation (in mm) for February',
          'Total water equivalent precipitation (in mm) for March',
          'Total water equivalent precipitation (in mm) for April',
          'Total water equivalent precipitation (in mm) for May',
          'Total water equivalent precipitation (in mm) for June',
          'Total water equivalent precipitation (in mm) for July',
          'Total water equivalent precipitation (in mm) for August',
          'Total water equivalent precipitation (in mm) for September',
          'Total water equivalent precipitation (in mm) for October',
          'Total water equivalent precipitation (in mm) for November',
          'Total water equivalent precipitation (in mm) for December',
        ],
      },
      Drought: {
        default:
          'Total water stress: human water demand / water supply for the local and upstream watersheds',
        values: [
          'Months per year where the rolling 3-month average Standardized Precipitation Evapotranspiration Index is below -2',
          'Months per year where the rolling 6-month average Standardized Precipitation Evapotranspiration Index is below -2',
          'Total water stress: human water demand / water supply for the local and upstream watersheds',
        ],
      },
      Hail: {
        default:
          'Number of days per year where large hail (>2 in / 5 cm in diameter) is possible',
        values: [
          'Number of days per year where large hail (>2 in / 5 cm in diameter) is possible',
          'Number of days per year where environmental conditions are conducive to severe thunderstorm formation',
        ],
      },
    };

    const tabData = metricOptionsByTab[selectedTab];
    if (!tabData)
      throw new Error(`Test data not found for tab: ${selectedTab}`);

    // Validate default value
    await expect(this.FiltersMetricSelectBox).toContainText(tabData.default);

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
    expect(metricOptionsText).toEqual(tabData.values);

    await this.page.getByRole('option', { name: tabData.default }).click(); //close
  }

  async validateLocationsTable(yearTo: string) {
    const locationTitle = 'Location';
    await expect(this.LocationColumnLabel).toBeVisible();
    await expect(this.LocationColumnLabel).toContainText(locationTitle);
    await expect(this.LocationTableHeader).toBeVisible();
    await expect(this.LocationTableRow.first()).toBeVisible();

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

    // 2020
    const yearToTooltip = `Mean value for selected Metric and ${yearTo} year`;
    await expect(this.YearToColumnName).toBeVisible();
    await expect(this.YearToColumnName).toContainText(yearTo);
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
}
