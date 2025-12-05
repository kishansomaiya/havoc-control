// tests/ui/components/EditSettings.ts

import { Page, Locator,expect } from '@playwright/test';
export class EditSettings {
  readonly page: Page;
  readonly Title: Locator;
  readonly ImportDataTab: Locator;
  readonly EditSettings: Locator;
  readonly CancelButton: Locator;
  readonly CreateButton: Locator;
  readonly Form: Locator;
  readonly PrimaryInformation: Locator;
  readonly AnalysisTypeLabel: Locator;
  readonly PortfolioInformationLabel: Locator;
  readonly PortfolioNameInputField: Locator;
  readonly PortfolioNameHelpText: Locator;
  readonly CategoryInputField: Locator;
  readonly CategoryHelpText: Locator;
  readonly DataVersionDropDownField: Locator;
  readonly EiVersionDropDownField: Locator;
  readonly AnalysisTypeRadioButtons: Locator;
  readonly AnalysisTypeRadioButtonsTitle: Locator;
  readonly AnalysisTypeRadioButtonsDescription: Locator;
  readonly PerilAndScoresRadioButton: Locator;
  readonly PerilScoresAndEconomicImpactRadioButton: Locator;
  readonly CustomRadioButton: Locator;

  // Run Disclosure Analysis
  readonly RunDisclosureAnalysis: Locator;
  readonly RunDisclosureAnalysisTitle: Locator;
  readonly RunDisclosureAnalysisDescription: Locator;
  readonly RunDisclosureAnalysisCheckbox: Locator;

  readonly DataSettingsLabel: Locator;
  readonly CustomizeButton: Locator;
  readonly DataSettingsPortfolioParamsInfo: Locator;

  readonly RestoreDefaultsButton: Locator;
  readonly CustomDataSettingsForm: Locator;
  readonly CustomDataSettingsFormPeril: Locator;
  readonly CustomDataSettingsFormEconomicImpacts: Locator;
  readonly CustomDataSettingsFormScores: Locator;
  readonly CustomDataSettingsFormFloodMesh: Locator;

  readonly PerilMetricsRadioButton: Locator;
  readonly EconomicImpactsRadioButton: Locator;
  readonly ScoresRadioButton: Locator;
  readonly FloodMeshRadioButton: Locator;

  readonly ProgressBar: Locator;
  readonly CreatingProgressText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.Title = page.getByRole('heading', { name: 'Create New Portfolio' });
    this.ImportDataTab = page.getByRole('tab', { name: 'Import Data' });
    this.EditSettings = page.getByRole('tab', { name: 'Edit Settings' });
    // this.CancelButton = page.getByRole('button', { name: 'Cancel' });
    this.CancelButton = page.getByTestId('create-edit-portfolio-cancel-button');
    // this.CreateButton = page.getByRole('button', { name: 'Create' });
    this.CreateButton = page.getByTestId('create-portfolio-create-button');
    this.Form = page.getByTestId('edit-settings-form');
    this.PrimaryInformation = page.getByTestId('edit-settings-primary-info');
    this.AnalysisTypeLabel = page.getByTestId('edit-settings-analysis-type');
    this.PortfolioInformationLabel = page.getByTestId(
      'edit-settings-portfolio-information-label',
    );
    this.PortfolioNameInputField = page.getByPlaceholder(
      'Enter Portfolio Name',
    );
    this.PortfolioNameHelpText = page.locator('#name-helper-text');
    this.CategoryInputField = page.getByPlaceholder(
      'i.e. Scores, Economic Impact',
    );
    this.CategoryHelpText = page.locator('#category-helper-text');
    this.DataVersionDropDownField = page.getByTestId(
      'edit-settings-data-version',
    );
    this.EiVersionDropDownField = page.getByTestId('edit-settings-ei-version');

    this.AnalysisTypeRadioButtons = page.getByTestId(
      'analysis-type-radio-buttons',
    );
    this.AnalysisTypeRadioButtonsTitle = page.getByTestId(
      'analysis-type-radio-button-title',
    );
    this.AnalysisTypeRadioButtonsDescription = page.getByTestId(
      'analysis-type-radio-button-description',
    );
    this.PerilAndScoresRadioButton = page
      .getByTestId('analysis-type')
      .locator('input[aria-label="Perils and Scores"]');
    this.PerilScoresAndEconomicImpactRadioButton = page
      .getByTestId('analysis-type')
      .locator('input[aria-label="Perils, Scores, and Economic Impact"]');
    this.CustomRadioButton = page
      .getByTestId('analysis-type')
      .locator('[aria-label="Custom"]');
    this.DataSettingsLabel = page.getByTestId('data-settings-label');
    this.CustomizeButton = page.getByTestId('edit-settings-customize-button');
    this.DataSettingsPortfolioParamsInfo = page.getByTestId(
      'data-settings-portfolio-params-info',
    );

    this.RestoreDefaultsButton = page.getByTestId('restore-defaults-button');
    this.CustomDataSettingsForm = page.getByTestId('custom-data-settings-form');
    this.CustomDataSettingsFormPeril = page.getByTestId(
      'custom-data-settings-form-peril',
    );
    this.CustomDataSettingsFormEconomicImpacts = page.getByTestId(
      'custom-data-settings-form-economic-impacts',
    );
    this.CustomDataSettingsFormScores = page.getByTestId(
      'custom-data-settings-form-scores',
    );
    this.CustomDataSettingsFormFloodMesh = page.getByTestId(
      'custom-data-settings-form-flood-mesh',
    );

    this.PerilMetricsRadioButton = page.getByLabel('Peril Metrics');
    this.EconomicImpactsRadioButton = page.getByLabel('Economic Impacts');
    this.ScoresRadioButton = page.getByLabel('Scores');
    this.FloodMeshRadioButton = page.getByLabel('Flood Mesh');

    this.ProgressBar = page.getByRole('progressbar').getByRole('img');
    this.CreatingProgressText = page.getByText('Creating');

    // Disclosure Analysis
    this.RunDisclosureAnalysis = page.getByTestId('run-disclosure-analysis');
    this.RunDisclosureAnalysisTitle = page.getByTestId(
      'run-disclosure-analysis-checkbox-title',
    );
    this.RunDisclosureAnalysisDescription = page.getByTestId(
      'run-disclosure-analysis-checkbox-description',
    );
    this.RunDisclosureAnalysisCheckbox = page
      .getByTestId('run-disclosure-analysis-checkbox')
      .locator('input[type="checkbox"]');
  }

  async validateControls() {
    await this.page.waitForLoadState('load');
    await expect(this.Title).toBeVisible();
    await expect(this.CancelButton).toBeVisible();
    await expect(this.CreateButton).toBeDisabled();
    await expect(this.ImportDataTab).toBeVisible();
    await expect(this.EditSettings).toBeVisible();
    await expect(this.Form).toBeVisible();
    await expect(this.PrimaryInformation).toBeVisible();
    await expect(this.AnalysisTypeLabel).toBeVisible();
    await expect(this.PortfolioInformationLabel).toBeVisible();
    await expect(this.PortfolioInformationLabel).toContainText(
      'Primary Information',
    );
    await expect(this.PortfolioNameInputField).toBeVisible();
    await expect(this.CategoryInputField).toBeVisible();
    await expect(this.DataVersionDropDownField).toBeVisible();
    await expect(this.DataVersionDropDownField).toContainText('3.2.0');
    await expect(this.AnalysisTypeLabel).toBeVisible();
    await expect(this.AnalysisTypeLabel).toContainText('Analysis type');
    await expect(this.DataSettingsLabel).toBeVisible();
    await expect(this.CustomizeButton).toBeVisible();
    await expect(this.DataSettingsPortfolioParamsInfo).toBeVisible();
  }

  async validateAnalysisTypes() {
    await this.page.waitForLoadState('load');

    // Define the expected titles and descriptions for the radio buttons
    const expectedData = [
      {
        title: 'Perils and Scores',
        description:
          'Jupiter hazard data metrics with scores that translate those hazards into a number from 0-100. For those only interested in climate hazard.',
      },
      {
        title: 'Perils, Scores, and Economic Impact',
        description:
          'Jupiter hazard metrics and scores with quantification of damage, loss, and economic impact. For those who want to calculate the financial impact of climate hazard.',
      },
      {
        title: 'Custom',
        description:
          'Choose the analysis settings and outputs you want. Note: Depending on what is selected, some visuals and reports may not be available.',
      },
    ];

    for (let i = 0; i < expectedData.length; i++) {
      const radioButtonSelector = `[data-testid="analysis-type"]:nth-of-type(${i + 1})`;

      // Check if the radio button itself is visible
      await expect(
        this.page.locator(
          `${radioButtonSelector} [data-testid="analysis-type-radio-buttons"]`,
        ),
      ).toBeVisible();

      // Check if the title is correct
      const title = await this.page
        .locator(
          `${radioButtonSelector} [data-testid="analysis-type-radio-button-title"]`,
        )
        .textContent();
      expect(title?.trim()).toBe(expectedData[i].title);

      // Check if the description is correct
      const description = await this.page
        .locator(
          `${radioButtonSelector} [data-testid="analysis-type-radio-button-description"]`,
        )
        .textContent();
      expect(description?.trim()).toBe(expectedData[i].description);
    }
  }

  async selectPerilsScoresType() {
    const isChecked = await this.PerilAndScoresRadioButton.isChecked();
    if (!isChecked) {
      await this.PerilAndScoresRadioButton.check();
    }

    const newState = await this.PerilAndScoresRadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(
      this.PerilScoresAndEconomicImpactRadioButton,
    ).not.toBeChecked();
    await expect(this.CustomRadioButton).not.toBeChecked();
    await expect(this.CustomizeButton).toBeVisible();
    await expect(this.CustomDataSettingsForm).not.toBeVisible();
    await expect(this.RestoreDefaultsButton).not.toBeVisible();
  }

  async enableDisclosure() {
    const isChecked = await this.RunDisclosureAnalysisCheckbox.isChecked();
    if (!isChecked) {
      await this.RunDisclosureAnalysis.click();
    }
    const newState = await this.RunDisclosureAnalysisCheckbox.isChecked();
    expect(newState).toBeTruthy();
  }

  async selectPerilScoresAndEconomicImpactType() {
    const isChecked =
      await this.PerilScoresAndEconomicImpactRadioButton.isChecked();
    if (!isChecked) {
      await this.PerilScoresAndEconomicImpactRadioButton.check();
    }

    const newState =
      await this.PerilScoresAndEconomicImpactRadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(this.PerilAndScoresRadioButton).not.toBeChecked();
    await expect(this.CustomRadioButton).not.toBeChecked();
    await expect(this.CustomizeButton).toBeVisible();
    await expect(this.CustomDataSettingsForm).not.toBeVisible();
    await expect(this.RestoreDefaultsButton).not.toBeVisible();
  }

  async selectCustomType() {
    const isChecked = await this.CustomRadioButton.isChecked();
    if (!isChecked) {
      await this.CustomRadioButton.check();
    }

    const newState = await this.CustomRadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(this.CustomizeButton).not.toBeVisible();
    await expect(this.CustomDataSettingsForm).toBeVisible();
    await expect(this.RestoreDefaultsButton).toBeVisible();
    await expect(this.PerilAndScoresRadioButton).not.toBeChecked();
    await expect(
      this.PerilScoresAndEconomicImpactRadioButton,
    ).not.toBeChecked();
  }

  async setFloodMesh() {
    await expect(this.CustomDataSettingsForm).toBeVisible();
    await expect(this.CustomDataSettingsFormFloodMesh).toBeVisible();
    const isChecked = await this.FloodMeshRadioButton.isChecked();
    if (!isChecked) {
      await this.FloodMeshRadioButton.check();
    }

    const newState = await this.FloodMeshRadioButton.isChecked();
    expect(newState).toBeTruthy();
    // await expect(this.PerilMetricsRadioButton).toBeChecked();
    // await expect(this.ScoresRadioButton).toBeChecked();
    // await expect(this.EconomicImpactsRadioButton).not.toBeChecked();
  }

  async setPortfolioName() {
    const now = new Date();
    const formattedDateTime = now.getTime();
    const portfolioName = `Automation-${formattedDateTime}`;
    await this.PortfolioNameInputField.clear();
    await this.PortfolioNameInputField.fill(portfolioName);
    await expect(this.PortfolioNameInputField).toHaveValue(portfolioName);
    return portfolioName;
  }

  async setSpecificPortfolioName(portfolioName: string) {
    await this.PortfolioNameInputField.clear();
    await this.PortfolioNameInputField.fill(portfolioName);
    await expect(this.PortfolioNameInputField).toHaveValue(portfolioName);
  }

  async setPortfolioNameFloodMesh(dataSetVersion: string) {
    const now = new Date();
    const formattedDateTime = now.getTime();
    const portfolioName = `Auto-FM-${dataSetVersion}-${formattedDateTime}`;
    await this.PortfolioNameInputField.clear();
    await this.PortfolioNameInputField.fill(portfolioName);
    await expect(this.PortfolioNameInputField).toHaveValue(portfolioName);
    return portfolioName;
  }

  async setCategory() {
    const now = new Date();
    const formattedDateTime = now.getTime();
    const categoryName = `Cat-Automation-${formattedDateTime}`;
    await this.CategoryInputField.clear();
    await this.CategoryInputField.fill(categoryName);
    await this.page
      .getByRole('option', { name: `Add "${categoryName}"` })
      .isVisible();
    await this.page
      .getByRole('option', { name: `Add "${categoryName}"` })
      .click();
    await expect(this.CategoryInputField).toHaveValue(categoryName);
    return categoryName;
  }

  async setSpecificCategory(categoryName: string) {
    await this.CategoryInputField.clear();
    await this.CategoryInputField.fill(categoryName);
    const categoryNotExist = await this.page
      .getByRole('option', { name: `Add "${categoryName}"` })
      .isVisible();
    if (categoryNotExist) {
      await this.page
        .getByRole('option', { name: `Add "${categoryName}"` })
        .click();
    } else {
      await this.page.getByRole('option', { name: `${categoryName}` }).click();
    }
    await expect(this.CategoryInputField).toHaveValue(categoryName);
  }

  async setDataVersion(dataVersion: string) {
    await this.DataVersionDropDownField.click();
    await expect(
      this.page.getByRole('option', { name: dataVersion }),
    ).toBeVisible();
    await this.page.getByRole('option', { name: dataVersion }).click();
    await expect(this.DataVersionDropDownField).toContainText(dataVersion);
  }

  async setEiVersion(eIVersion: string) {
    await this.EiVersionDropDownField.click();
    await expect(
      this.page.getByRole('option', { name: eIVersion }),
    ).toBeVisible();
    await this.page.getByRole('option', { name: eIVersion }).click();
    await expect(this.EiVersionDropDownField).toContainText(eIVersion);
  }
}
