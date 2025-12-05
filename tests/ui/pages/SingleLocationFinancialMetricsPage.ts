// tests/ui/pages/SingleLocationHazardPage.ts

import { Page, Locator,expect } from '@playwright/test';
import { SingleLocationHeader } from '@components/SingleLocationHeader';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';
import { waitForContentLoaded } from '@utils/helpers';
const envUrl = testConfig[ENV].appUrl;

export class SingleLocationFinancialMetricsPage {
  readonly page: Page;
  readonly singleLocationHeader: SingleLocationHeader;

  readonly Body: Locator;

  // Filters
  readonly Filters: Locator;

  readonly FiltersViewBy: Locator;
  readonly FiltersScenario: Locator;
  readonly FiltersYear: Locator;

  readonly ViewBy: Locator;
  readonly ViewByLabel: Locator;
  readonly ViewBySelectBox: Locator;
  readonly ViewByOption: Locator;

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

  // Metrics
  readonly Metrics: Locator;

  // Graph/Graph
  readonly Graph: Locator;

  readonly GraphTransmissionChannel: Locator;
  readonly GraphOperationalRisk: Locator;
  readonly GraphTechnicalPremium: Locator;
  readonly GraphMarketRisk: Locator;

  readonly GraphLabel: Locator;
  readonly YAxisGraphLabel: Locator;
  readonly XAxisGraphLabel: Locator;

  readonly GraphChart: Locator;

  readonly ChartLegend: Locator;
  readonly ChartLegendItem: Locator;
  readonly ChartLegendItemColor: Locator;
  readonly ChartLegendItemText: Locator;

  constructor(page: Page) {
    this.page = page;

    // Body
    this.Body = page.getByTestId('slp-financial-metrics-body');

    // Filters
    this.Filters = page.getByTestId('slp-financial-metrics-filters');

    this.FiltersViewBy = page.getByTestId('slp-financial-metrics-filters-year');
    this.FiltersScenario = page.getByTestId(
      'slp-financial-metrics-filters-scenario',
    );
    this.FiltersYear = page.getByTestId('slp-financial-metrics-filters-year');

    this.ViewBy = page.getByTestId('view-by-field-form-control');
    this.ViewByLabel = page.getByTestId('view-by-field-label');
    this.ViewBySelectBox = page.getByTestId('view-by-field-select');
    this.ViewByOption = page.getByTestId('view-by-field-option');

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

    // Metrics
    this.Metrics = page.getByTestId('metrics');

    // Graph
    this.Graph = page.getByTestId('slp-financial-metrics-graph');

    //Transmission Channel
    this.GraphTransmissionChannel = page.getByTestId(
      'slp-financial-metrics-graph-transmission-channel',
    );
    this.GraphOperationalRisk = page.getByTestId(
      'slp-financial-metrics-graph-operational-risk',
    );
    this.GraphTechnicalPremium = page.getByTestId(
      'slp-financial-metrics-graph-technical-premium',
    );
    this.GraphMarketRisk = page.getByTestId(
      'slp-financial-metrics-graph-market-risk',
    );

    this.GraphLabel = page.getByTestId('graph-label');
    this.GraphChart = page.getByTestId('graph-chart');

    this.YAxisGraphLabel = page.locator('.MuiChartsAxis-label');
    this.XAxisGraphLabel = page.locator('.MuiChartsAxis-tickLabel');

    this.ChartLegend = page.getByTestId('chart-legend');
    this.ChartLegendItem = page.getByTestId('chart-legend-item');
    this.ChartLegendItemColor = page.getByTestId('chart-legend-item-color');
    this.ChartLegendItemText = page.getByTestId('chart-legend-item-text');
  }

  //   TODO: verify this before using
  async navigateByURL(portfolioId: string, locationId: string) {
    const slpFinancialMetricsPageUrl = `${envUrl}/portfolios/${portfolioId}/locations/${locationId}/financial`;
    await this.page.goto(slpFinancialMetricsPageUrl);
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);
    await expect(this.singleLocationHeader.FinancialMetricsTab).toBeVisible();
    await expect(this.Body).toBeVisible();
  }

  async validateControls() {
    await waitForContentLoaded(this.page);
    await this.page.waitForLoadState('load');
    await expect(this.Body).toBeVisible();
    await expect(this.ViewBy).toBeVisible();
    await expect(this.Scenario).toBeVisible();
    await expect(this.Year).toBeVisible();
    await expect(this.Metrics).toBeVisible();
    await expect(this.Graph).toBeVisible();
    await expect(this.GraphLabel).toBeVisible();
    await expect(this.GraphChart).toBeVisible();
    await expect(this.YAxisGraphLabel).toBeVisible();
    await expect(this.ChartLegend).toBeVisible();
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

  async validateViewByDropdown() {
    const options = {
      default: 'Transmission Channel',
      values: [
        'Transmission Channel',
        'Operational Risk',
        'Technical Premium',
        'Market Risk',
      ],
    };
    await expect(this.ViewBySelectBox).toContainText(options.default);

    // Click to open Damage/Loss Type dropdown
    await this.ViewBySelectBox.click();
    const optionsCount = await this.page
      .locator('[role="listbox"] >> li')
      .count();
    const optionsText: string[] = [];

    for (let i = 0; i < optionsCount; i++) {
      const option = await this.ViewByOption.nth(i).textContent();
      optionsText.push(option || '');
    }

    // Validate Damage/Loss Type options
    expect(optionsText).toEqual(options.values);
  }

  // Set Damage/Loss Type
  async setViewByOption(viewBy: string) {
    await this.ViewBySelectBox.click();
    const option = await this.page.getByRole('option', { name: viewBy });
    // Scroll the option into view if it's not visible
    const isVisible = await option.isVisible();
    if (!isVisible) {
      await option.scrollIntoViewIfNeeded();
    }
    await option.click();
    await expect(this.ViewBySelectBox).toContainText(viewBy);
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

  async verifyGraph(
    viewBy: string,
    apiCurrency: string,
    apiEiOwnershipCost?: boolean,
    apiEiNetIncome?: boolean,
  ) {
    const graphTransmissionChannelLabel = 'Loss by Transmission Channel';
    const graphOperationalRiskLabel = 'Loss by Operational Risk';
    const graphTechnicalPremiumLabel = 'Loss by Technical Premium';
    const graphMarketRiskLabel = 'Loss by Market Risk';
    const graphYAxisLabel = `Value (${apiCurrency})`;

    const graphTransmissionChannelLegendItems = {
      operationalExpenses: 'Operational Expenses',
      operationalRevenue: 'Operational Revenue',
      capitalExpenditures: 'Capital Expenditures',
    };
    const graphOperationalRiskLegendItems = {
      netOperatingIncome: 'Net Operating Income',
      costofOwnership: 'Cost of Ownership',
    };
    const graphTechnicalPremiumLegendItems = {
      technicalPremium: 'Technical Premium',
    };
    const graphMarketRiskLegendItems = {
      benchmarkAssetValue: 'Benchmark Asset Value',
      climateAdjustedAssetValue: 'Climate-Adjusted Asset Value',
    };
    await expect(this.Graph).toBeVisible();
    await expect(this.GraphLabel).toBeVisible();

    if (viewBy == 'Transmission Channel') {
      // 1. Transmission Channel
      await this.setViewByOption(viewBy);
      await expect(this.GraphTransmissionChannel).toBeVisible();
      await expect(this.GraphLabel).toContainText(
        graphTransmissionChannelLabel,
      );
      await expect(this.YAxisGraphLabel).toBeVisible();
      await expect(this.YAxisGraphLabel).toContainText(graphYAxisLabel);
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTransmissionChannelLegendItems.operationalExpenses,
        }),
      ).toBeVisible();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTransmissionChannelLegendItems.operationalExpenses,
        }),
      ).toBeVisible();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTransmissionChannelLegendItems.operationalExpenses,
        }),
      ).toBeVisible();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTransmissionChannelLegendItems.operationalRevenue,
        }),
      ).toBeVisible();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTransmissionChannelLegendItems.operationalRevenue,
        }),
      ).toBeVisible();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTransmissionChannelLegendItems.capitalExpenditures,
        }),
      ).toBeVisible();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTransmissionChannelLegendItems.capitalExpenditures,
        }),
      ).toBeVisible();

      // other should be hidden
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphOperationalRiskLegendItems.netOperatingIncome,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphOperationalRiskLegendItems.netOperatingIncome,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphOperationalRiskLegendItems.costofOwnership,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphOperationalRiskLegendItems.costofOwnership,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTechnicalPremiumLegendItems.technicalPremium,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTechnicalPremiumLegendItems.technicalPremium,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphMarketRiskLegendItems.benchmarkAssetValue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphMarketRiskLegendItems.benchmarkAssetValue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphMarketRiskLegendItems.climateAdjustedAssetValue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphMarketRiskLegendItems.climateAdjustedAssetValue,
        }),
      ).toBeHidden();
    } else if (viewBy == 'Operational Risk') {
      // 2. Operational Risk (Hidden for my resultSet)
      await this.setViewByOption(viewBy);
      await expect(this.GraphOperationalRisk).toBeVisible();
      await expect(this.GraphLabel).toContainText(graphOperationalRiskLabel);
      await expect(this.YAxisGraphLabel).toBeVisible();
      await expect(this.YAxisGraphLabel).toContainText(graphYAxisLabel);
      // TODO: Improve with API response verification
      if (apiEiNetIncome === null && apiEiOwnershipCost === null) {
        await expect(
          this.ChartLegendItemText.filter({
            hasText: graphOperationalRiskLegendItems.netOperatingIncome,
          }),
        ).toBeHidden(); // Not displayed if EI_netIncome value is absent for all the Years (EI_netIncome: null)
        await expect(
          this.ChartLegendItemText.filter({
            hasText: graphOperationalRiskLegendItems.costofOwnership,
          }),
        ).toBeHidden(); // Not displayed if EI_ownershipCost value is absent for all the Years (EI_ownershipCost: null)
      } else if (apiEiNetIncome !== null && apiEiOwnershipCost === null) {
        await expect(
          this.ChartLegendItemText.filter({
            hasText: graphOperationalRiskLegendItems.netOperatingIncome,
          }),
        ).toBeVisible(); // Displayed if EI_netIncome value present for at least one year for all the Years
        await expect(
          this.ChartLegendItemColor.filter({
            hasText: graphOperationalRiskLegendItems.netOperatingIncome,
          }),
        ).toBeVisible(); // Displayed if EI_netIncome value present for at least one year for all the Years
        await expect(
          this.ChartLegendItemText.filter({
            hasText: graphOperationalRiskLegendItems.costofOwnership,
          }),
        ).toBeHidden(); // Not displayed if EI_ownershipCost value is absent for all the Years (EI_ownershipCost: null)
        await expect(
          this.ChartLegendItemColor.filter({
            hasText: graphOperationalRiskLegendItems.costofOwnership,
          }),
        ).toBeHidden(); // Not displayed if EI_ownershipCost value is absent for all the Years (EI_ownershipCost: null)
      } else if (apiEiNetIncome === null && apiEiOwnershipCost !== null) {
        await expect(
          this.ChartLegendItemText.filter({
            hasText: graphOperationalRiskLegendItems.netOperatingIncome,
          }),
        ).toBeHidden(); // Not displayed if EI_netIncome value is absent for all the Years (EI_netIncome: null)
        await expect(
          this.ChartLegendItemColor.filter({
            hasText: graphOperationalRiskLegendItems.netOperatingIncome,
          }),
        ).toBeHidden(); // Not displayed if EI_netIncome value is absent for all the Years (EI_netIncome: null)
        await expect(
          this.ChartLegendItemText.filter({
            hasText: graphOperationalRiskLegendItems.costofOwnership,
          }),
        ).toBeVisible(); // Displayed if EI_ownershipCost value present for at least one year for all the Years
        await expect(
          this.ChartLegendItemColor.filter({
            hasText: graphOperationalRiskLegendItems.costofOwnership,
          }),
        ).toBeVisible(); // Displayed if EI_ownershipCost value present for at least one year for all the Years
      }

      // other should be hidden
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTransmissionChannelLegendItems.operationalExpenses,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTransmissionChannelLegendItems.operationalExpenses,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTransmissionChannelLegendItems.operationalRevenue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTransmissionChannelLegendItems.operationalRevenue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTransmissionChannelLegendItems.capitalExpenditures,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTransmissionChannelLegendItems.capitalExpenditures,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTechnicalPremiumLegendItems.technicalPremium,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTechnicalPremiumLegendItems.technicalPremium,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphMarketRiskLegendItems.benchmarkAssetValue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphMarketRiskLegendItems.benchmarkAssetValue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphMarketRiskLegendItems.climateAdjustedAssetValue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphMarketRiskLegendItems.climateAdjustedAssetValue,
        }),
      ).toBeHidden();
    } else if (viewBy == 'Technical Premium') {
      // 3. Technical Premium
      await this.setViewByOption(viewBy);
      await expect(this.GraphTechnicalPremium).toBeVisible();
      await expect(this.GraphLabel).toContainText(graphTechnicalPremiumLabel);
      await expect(this.YAxisGraphLabel).toBeVisible();
      await expect(this.YAxisGraphLabel).toContainText(graphYAxisLabel);
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTechnicalPremiumLegendItems.technicalPremium,
        }),
      ).toBeVisible();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTechnicalPremiumLegendItems.technicalPremium,
        }),
      ).toBeVisible();

      // other should be hidden
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphOperationalRiskLegendItems.netOperatingIncome,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphOperationalRiskLegendItems.costofOwnership,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTransmissionChannelLegendItems.operationalExpenses,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTransmissionChannelLegendItems.operationalExpenses,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTransmissionChannelLegendItems.operationalRevenue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTransmissionChannelLegendItems.operationalRevenue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTransmissionChannelLegendItems.capitalExpenditures,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTransmissionChannelLegendItems.capitalExpenditures,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphMarketRiskLegendItems.benchmarkAssetValue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphMarketRiskLegendItems.benchmarkAssetValue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphMarketRiskLegendItems.climateAdjustedAssetValue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphMarketRiskLegendItems.climateAdjustedAssetValue,
        }),
      ).toBeHidden();
    } else if (viewBy == 'Market Risk') {
      // 4. Market Risk
      await this.setViewByOption(viewBy);
      await expect(this.GraphMarketRisk).toBeVisible();
      await expect(this.GraphLabel).toContainText(graphMarketRiskLabel);
      await expect(this.YAxisGraphLabel).toBeVisible();
      await expect(this.YAxisGraphLabel).toContainText(graphYAxisLabel);
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphMarketRiskLegendItems.benchmarkAssetValue,
        }),
      ).toBeVisible();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphMarketRiskLegendItems.benchmarkAssetValue,
        }),
      ).toBeVisible();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphMarketRiskLegendItems.climateAdjustedAssetValue,
        }),
      ).toBeVisible();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphMarketRiskLegendItems.climateAdjustedAssetValue,
        }),
      ).toBeVisible();

      // other should be hidden
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphOperationalRiskLegendItems.netOperatingIncome,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphOperationalRiskLegendItems.costofOwnership,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTransmissionChannelLegendItems.operationalExpenses,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTransmissionChannelLegendItems.operationalExpenses,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTransmissionChannelLegendItems.operationalRevenue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTransmissionChannelLegendItems.operationalRevenue,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemText.filter({
          hasText: graphTransmissionChannelLegendItems.capitalExpenditures,
        }),
      ).toBeHidden();
      await expect(
        this.ChartLegendItemColor.filter({
          hasText: graphTransmissionChannelLegendItems.capitalExpenditures,
        }),
      ).toBeHidden();
    }
  }
}
