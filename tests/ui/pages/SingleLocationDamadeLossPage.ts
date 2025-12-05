// tests/ui/pages/SingleLocationHazardPage.ts

import { Page, Locator,expect } from '@playwright/test';
import { SingleLocationHeader } from '@components/SingleLocationHeader';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';
import { waitForContentLoaded } from '@utils/helpers';
const envUrl = testConfig[ENV].appUrl;

export class SingleLocationDamadeLossPage {
  readonly page: Page;
  readonly singleLocationHeader: SingleLocationHeader;

  readonly Body: Locator;
  readonly DamageLossTabs: Locator;

  // Buttons
  readonly DamageLossButtons: Locator;
  readonly DamageLossButton: Locator;
  readonly DamageButton: Locator;
  readonly LossButton: Locator;

  // Filters
  readonly Filters: Locator;

  readonly FiltersDamageLossType: Locator;
  readonly FiltersScenario: Locator;
  readonly FiltersYear: Locator;

  readonly DamageLossType: Locator;
  readonly DamageLossTypeLabel: Locator;
  readonly DamageLossTypeSelectBox: Locator;
  readonly DamageLossTypeOption: Locator;

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
  readonly GraphLabel: Locator;
  readonly YAxisGraphLabel: Locator;
  readonly XAxisGraphLabel: Locator;

  readonly GraphButtons: Locator;
  readonly GraphButton: Locator;
  readonly AcuteGraphButton: Locator;
  readonly ChronicGraphButton: Locator;

  readonly GraphChart: Locator;

  readonly GraphCheckBoxes: Locator;
  readonly GraphCheckBox: Locator;
  readonly GraphCheckBoxLabel: Locator;
  readonly FloodCheckBox: Locator;
  readonly WindCheckBox: Locator;
  readonly WildfireCheckBox: Locator;
  readonly HeatCoolingCheckBox: Locator;
  readonly HeatProductivityCheckBox: Locator;
  readonly DroughtCheckBox: Locator;

  readonly FloodCheckBoxLabel: Locator;
  readonly WindCheckBoxLabel: Locator;
  readonly WildfireCheckBoxLabel: Locator;
  readonly HeatCoolingCheckBoxLabel: Locator;
  readonly HeatProductivityCheckBoxLabel: Locator;
  readonly DroughtCheckBoxLabel: Locator;

  constructor(page: Page) {
    this.page = page;

    // Body
    this.Body = page.getByTestId('slp-damage-loss-body');

    // Buttons
    this.DamageLossButtons = page.getByTestId('slp-damage-loss-buttons');
    this.DamageLossButton = page.getByTestId('slp-damage-loss-button');
    this.DamageButton = page
      .getByTestId('slp-damage-loss-button')
      .filter({ hasText: 'Damage' });
    this.LossButton = page
      .getByTestId('slp-damage-loss-button')
      .filter({ hasText: 'Loss' });
    // Filters
    this.Filters = page.getByTestId('slp-damage-loss-filters');

    this.FiltersDamageLossType = page.getByTestId(
      'slp-damage-loss-filters-type',
    );
    this.FiltersScenario = page.getByTestId('slp-damage-loss-filters-scenario');
    this.FiltersYear = page.getByTestId('slp-damage-loss-filters-year');

    this.DamageLossType = page.getByTestId(
      'damage-loss-type-select-form-control',
    );
    this.DamageLossTypeLabel = page.getByTestId('damage-loss-type-field-label');
    this.DamageLossTypeSelectBox = page.getByTestId('damage-loss-type-select');
    this.DamageLossTypeOption = page.getByTestId('damage-loss-type-option');

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
    this.Graph = page.getByTestId('slp-damage-loss-graph');
    this.GraphLabel = page.getByTestId('slp-damage-loss-graph-label');
    this.YAxisGraphLabel = page.locator('.MuiChartsAxis-label');
    this.XAxisGraphLabel = page.locator('.MuiChartsAxis-tickLabel');

    this.GraphButtons = page.getByTestId('slp-damage-loss-graph-buttons');
    this.GraphButton = page.getByTestId('slp-damage-loss-graph-button');
    this.AcuteGraphButton = page
      .getByTestId('slp-damage-loss-graph-button')
      .filter({ hasText: 'Acute' });
    this.ChronicGraphButton = page
      .getByTestId('slp-damage-loss-graph-button')
      .filter({ hasText: 'Chronic' });

    this.GraphChart = page.getByTestId('slp-damage-loss-graph-chart');

    this.GraphCheckBoxes = page.getByTestId('slp-damage-loss-graph-checkboxes');
    this.GraphCheckBox = page.getByTestId('slp-damage-loss-graph-checkbox');
    this.GraphCheckBoxLabel = page.getByTestId(
      'slp-damage-loss-graph-checkbox-label',
    );
    this.FloodCheckBox = page
      .getByTestId('slp-damage-loss-graph-checkbox')
      .filter({ hasText: 'Flood' })
      .locator('input');
    this.FloodCheckBoxLabel = page
      .getByTestId('slp-damage-loss-graph-checkbox-label')
      .filter({ hasText: 'Flood' });
    this.WindCheckBox = page
      .getByTestId('slp-damage-loss-graph-checkbox')
      .filter({ hasText: 'Wind' })
      .locator('input');
    this.WindCheckBoxLabel = page
      .getByTestId('slp-damage-loss-graph-checkbox-label')
      .filter({ hasText: 'Wind' });
    this.WildfireCheckBox = page
      .getByTestId('slp-damage-loss-graph-checkbox')
      .filter({ hasText: 'Wildfire' })
      .locator('input');
    this.WildfireCheckBoxLabel = page
      .getByTestId('slp-damage-loss-graph-checkbox-label')
      .filter({ hasText: 'Wildfire' });
    this.HeatCoolingCheckBox = page
      .getByTestId('slp-damage-loss-graph-checkbox')
      .filter({ hasText: 'Heat - Cooling' })
      .locator('input');
    this.HeatCoolingCheckBoxLabel = page
      .getByTestId('slp-damage-loss-graph-checkbox-label')
      .filter({ hasText: 'Heat - Cooling' });
    this.HeatProductivityCheckBox = page
      .getByTestId('slp-damage-loss-graph-checkbox')
      .filter({ hasText: 'Heat - Productivity' })
      .locator('input');
    this.HeatProductivityCheckBoxLabel = page
      .getByTestId('slp-damage-loss-graph-checkbox-label')
      .filter({ hasText: 'Heat - Productivity' });
    this.DroughtCheckBox = page
      .getByTestId('slp-damage-loss-graph-checkbox')
      .filter({ hasText: 'Drought' })
      .locator('input');
    this.DroughtCheckBoxLabel = page
      .getByTestId('slp-damage-loss-graph-checkbox-label')
      .filter({ hasText: 'Drought' });
  }

  //   TODO: verify this before using
  async navigateByURL(portfolioId: string, locationId: string) {
    const slpDamageLossPageUrl = `${envUrl}/portfolios/${portfolioId}/locations/${locationId}/damage`;
    await this.page.goto(slpDamageLossPageUrl);
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);
    await expect(this.singleLocationHeader.DamageLossTab).toBeVisible();
    await expect(this.Body).toBeVisible();
  }

  async validateControls() {
    await waitForContentLoaded(this.page);
    await this.page.waitForLoadState('load');
    await expect(this.Body).toBeVisible();
    await expect(this.DamageButton).toBeVisible();
    await expect(this.LossButton).toBeVisible();
    await expect(this.DamageLossType).toBeVisible();
    await expect(this.Scenario).toBeVisible();
    await expect(this.Year).toBeVisible();
    await expect(this.GraphLabel).toBeVisible();
    await expect(this.GraphChart).toBeVisible();
    await expect(this.AcuteGraphButton).toBeVisible();
    await expect(this.ChronicGraphButton).toBeVisible();
    await expect(this.GraphCheckBoxes).toBeVisible();
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

  async validateDamageLossTypeDropdown() {
    const typeOptions = {
      default: 'Total',
      values: ['Total', 'Building', 'Contents', 'Inventory', 'Downtime'],
    };

    // await this.DamageButton.click();
    // await expect(this.DamageLossTypeLabel).toContainText('Damage Type');

    await expect(this.DamageLossTypeSelectBox).toContainText(
      typeOptions.default,
    );

    // Click to open Damage/Loss Type dropdown
    await this.DamageLossTypeSelectBox.click();
    const typeOptionsCount = await this.page
      .locator('[role="listbox"] >> li')
      .count();
    const typeOptionsText: string[] = [];

    for (let i = 0; i < typeOptionsCount; i++) {
      const typeOption = await this.DamageLossTypeOption.nth(i).textContent();
      typeOptionsText.push(typeOption || '');
    }

    // Validate Damage/Loss Type options
    expect(typeOptionsText).toEqual(typeOptions.values);
  }

  // Set Damage/Loss Type
  async setDamageLossType(type: string) {
    await this.DamageLossTypeSelectBox.click();
    const option = await this.page.getByRole('option', { name: type });
    // Scroll the option into view if it's not visible
    const isVisible = await option.isVisible();
    if (!isVisible) {
      await option.scrollIntoViewIfNeeded();
    }
    await option.click();
    await expect(this.DamageLossTypeSelectBox).toContainText(type);
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

  async verifyGraph() {
    const graphDamageLabel = 'Average Annual Damage Over Time';
    const graphLossLabel = 'Average Annual Loss Over Time';
    const graphDamageYAxisLabelForAcute = '% Damage';
    const graphDamageYAxisLabelForChronic = 'Damage';
    const graphLossYAxisLabel = 'Loss (USD)';
    await expect(this.Graph).toBeVisible();
    await expect(this.GraphLabel).toBeVisible();

    await this.DamageButton.click();
    await expect(this.DamageButton).toHaveClass(/MuiButton-contained/);
    await expect(this.Graph).toBeVisible();
    await expect(this.GraphLabel).toContainText(graphDamageLabel);
    await expect(this.YAxisGraphLabel).toBeVisible();
    await expect(this.YAxisGraphLabel).toContainText(
      graphDamageYAxisLabelForAcute,
    );

    await this.LossButton.click();
    await expect(this.LossButton).toHaveClass(/MuiButton-contained/);
    await expect(this.GraphLabel).toContainText(graphLossLabel);
    await expect(this.YAxisGraphLabel).toBeVisible();
    await expect(this.YAxisGraphLabel).toContainText(graphLossYAxisLabel);

    // Ensure that the "ACUTE" button is selected and proper info is displayed
    await this.DamageButton.click();

    await this.AcuteGraphButton.click();
    await expect(this.AcuteGraphButton).toHaveClass(/MuiButton-contained/);
    await expect(this.ChronicGraphButton).toHaveClass(/MuiButton-outlined/);

    // Should be visible for "ACUTE"
    await expect(this.FloodCheckBox).toBeVisible();
    await expect(this.FloodCheckBoxLabel).toBeVisible();
    await expect(this.FloodCheckBox).toBeChecked();

    await expect(this.WindCheckBox).toBeVisible();
    await expect(this.WindCheckBoxLabel).toBeVisible();
    await expect(this.WindCheckBox).toBeChecked();

    await expect(this.WildfireCheckBox).toBeVisible();
    await expect(this.WildfireCheckBoxLabel).toBeVisible();
    await expect(this.WildfireCheckBox).toBeChecked();

    // Should NOT be visible for "ACUTE"
    await expect(this.HeatCoolingCheckBox).toBeHidden();
    await expect(this.HeatCoolingCheckBoxLabel).toBeHidden();

    await expect(this.HeatProductivityCheckBox).toBeHidden();
    await expect(this.HeatProductivityCheckBoxLabel).toBeHidden();

    await expect(this.DroughtCheckBox).toBeHidden();
    await expect(this.DroughtCheckBoxLabel).toBeHidden();

    // Click on the "CHRONIC" button is selected and proper info is displayed
    await this.ChronicGraphButton.click();
    await expect(this.ChronicGraphButton).toHaveClass(/MuiButton-contained/);
    await expect(this.AcuteGraphButton).toHaveClass(/MuiButton-outlined/);

    await expect(this.YAxisGraphLabel).toContainText(
      graphDamageYAxisLabelForChronic,
    );

    // Should be visible for "CHRONIC"
    await expect(this.HeatCoolingCheckBox).toBeVisible();
    await expect(this.HeatCoolingCheckBoxLabel).toBeVisible();
    await expect(this.HeatCoolingCheckBox).toBeChecked();

    await expect(this.HeatProductivityCheckBox).toBeVisible();
    await expect(this.HeatProductivityCheckBoxLabel).toBeVisible();
    await expect(this.HeatProductivityCheckBox).toBeChecked();

    await expect(this.DroughtCheckBox).toBeVisible();
    await expect(this.DroughtCheckBoxLabel).toBeVisible();
    await expect(this.DroughtCheckBox).toBeChecked();

    // Should NOT be visible for "CHRONIC"
    await expect(this.FloodCheckBox).toBeHidden();
    await expect(this.FloodCheckBoxLabel).toBeHidden();

    await expect(this.WindCheckBox).toBeHidden();
    await expect(this.WindCheckBoxLabel).toBeHidden();

    await expect(this.WildfireCheckBox).toBeHidden();
    await expect(this.WildfireCheckBoxLabel).toBeHidden();
  }

  async verifyChronicButtonState() {
    const typeOptions = {
      total: 'Total',
      building: 'Building',
      contents: 'Contents',
      inventory: 'Inventory',
      downtime: 'Downtime',
    };

    await this.DamageButton.click();

    await this.AcuteGraphButton.click();
    await expect(this.AcuteGraphButton).toHaveClass(/MuiButton-contained/);
    await expect(this.ChronicGraphButton).toHaveClass(/MuiButton-outlined/);

    // Total
    await this.setDamageLossType(typeOptions.total);
    await expect(this.ChronicGraphButton).toBeEnabled();

    // Building
    await this.setDamageLossType(typeOptions.building);
    await expect(this.ChronicGraphButton).toBeDisabled();

    // Contents
    await this.setDamageLossType(typeOptions.contents);
    await expect(this.ChronicGraphButton).toBeDisabled();

    // Inventory
    await this.setDamageLossType(typeOptions.inventory);
    await expect(this.ChronicGraphButton).toBeDisabled();

    // Downtime
    await this.setDamageLossType(typeOptions.downtime);
    await expect(this.ChronicGraphButton).toBeDisabled();

    await this.setDamageLossType(typeOptions.total);
    await expect(this.ChronicGraphButton).toBeEnabled();

    // Click on the "CHRONIC" button
    await this.ChronicGraphButton.click();
    await expect(this.ChronicGraphButton).toHaveClass(/MuiButton-contained/);
    await expect(this.AcuteGraphButton).toHaveClass(/MuiButton-outlined/);

    // Click onn any Damage/Loss type except Total:
    //  - ensure that the "Chronic" become disabled and Acute is selected
    //  - ensure that correct
    await this.setDamageLossType(typeOptions.contents);
    await expect(this.AcuteGraphButton).toBeEnabled();
    await expect(this.AcuteGraphButton).toHaveClass(/MuiButton-contained/);
    await expect(this.ChronicGraphButton).toBeDisabled();

    // Should be visible for "ACUTE"
    await expect(this.FloodCheckBox).toBeVisible();
    await expect(this.FloodCheckBoxLabel).toBeVisible();
    await expect(this.FloodCheckBox).toBeChecked();

    await expect(this.WindCheckBox).toBeVisible();
    await expect(this.WindCheckBoxLabel).toBeVisible();
    await expect(this.WindCheckBox).toBeChecked();

    await expect(this.WildfireCheckBox).toBeVisible();
    await expect(this.WildfireCheckBoxLabel).toBeVisible();
    await expect(this.WildfireCheckBox).toBeChecked();

    // Should NOT be visible for "ACUTE"
    await expect(this.HeatCoolingCheckBox).toBeHidden();
    await expect(this.HeatCoolingCheckBoxLabel).toBeHidden();

    await expect(this.HeatProductivityCheckBox).toBeHidden();
    await expect(this.HeatProductivityCheckBoxLabel).toBeHidden();

    await expect(this.DroughtCheckBox).toBeHidden();
    await expect(this.DroughtCheckBoxLabel).toBeHidden();
  }
}
