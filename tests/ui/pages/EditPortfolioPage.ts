// tests/ui/pages/EditPortfolioPage.ts

import { Page, Locator, expect } from '@playwright/test';
import { ImportDataTab } from '@components/ImportData';
import { EditSettings } from '@components/EditSettings';
import { HomePage } from './HomePage';
import { PortfolioList } from '@components/PortfolioList';

export class EditPortfolioPage {
  readonly page: Page;
  readonly importDataTab: ImportDataTab;
  readonly editSettingsTab: EditSettings;
  readonly homePage: HomePage;
  readonly portfolioList: PortfolioList;

  readonly Title: Locator;
  readonly LocationsQty: Locator;
  readonly ImportData: Locator;
  readonly EditSettings: Locator;
  readonly CancelButton: Locator;
  readonly SaveButton: Locator;
  readonly CreateDuplicateButton: Locator;
  readonly DuplicateEditSettings: Locator;
  readonly ChangeAnalysisTypeCheckBox: Locator;
  readonly SavingProgressText: Locator;

  constructor(page: Page) {
    this.page = page;
    this.importDataTab = new ImportDataTab(page);
    this.editSettingsTab = new EditSettings(page);
    this.homePage = new HomePage(page);
    this.portfolioList = new PortfolioList(page);

    this.Title = page.getByTestId('create-portfolio-title');
    this.LocationsQty = page.getByTestId(
      'edit-duplicate-portfolio-locations-qty',
    );
    this.ImportData = page.getByRole('tab', { name: 'Import Data' });
    this.EditSettings = page.getByTestId('edit-portfolio-edit-settings-tab');
    this.DuplicateEditSettings = page.getByTestId(
      'duplicate-portfolio-edit-settings',
    );
    this.CancelButton = page.getByTestId('create-edit-portfolio-cancel-button');
    this.SaveButton = page.getByTestId('create-portfolio-save-button');
    this.CreateDuplicateButton = page.getByTestId(
      'duplicate-portfolio-create-button',
    );
    this.ChangeAnalysisTypeCheckBox = page
      .getByTestId('change-analysis-type-checkbox')
      .locator('input');
    this.SavingProgressText = page.getByText('Saving');
  }

  async navigateByURL(portfolioId: string) {
    await this.page.goto(`/edit-portfolio/${portfolioId}`);
    await this.page.waitForLoadState('load');
  }

  async validateControls() {
    await this.page.waitForLoadState('load');
    await expect(this.Title).toBeVisible();
    await expect(this.LocationsQty).toBeVisible();
    await expect(this.CancelButton).toBeVisible();
    await expect(this.SaveButton).toBeDisabled();
    await expect(this.ImportData).not.toBeVisible();
    await expect(this.EditSettings).toBeVisible();
    await expect(this.editSettingsTab.PortfolioNameInputField).toBeVisible();
    await expect(this.editSettingsTab.CategoryInputField).toBeVisible();
    await expect(this.editSettingsTab.RunDisclosureAnalysis).toBeVisible();
    await expect(this.editSettingsTab.RunDisclosureAnalysisTitle).toBeVisible();
    await expect(this.editSettingsTab.RunDisclosureAnalysisTitle).toContainText(
      'Run Disclosure Analysis',
    );
    await expect(
      this.editSettingsTab.RunDisclosureAnalysisDescription,
    ).toBeVisible();
    await expect(
      this.editSettingsTab.RunDisclosureAnalysisDescription,
    ).toContainText(
      'Check this box if you wish to download and view the Disclosure Hazards for this portfolio. Selecting this value will remove Custom analysis from available Analysis Types (right), and will restrict Data Version to 3.2.0 or greater (below).',
    );
    await expect(
      this.editSettingsTab.RunDisclosureAnalysisCheckbox,
    ).toBeVisible();
    await expect(
      this.editSettingsTab.DataVersionDropDownField.locator('input'),
    ).toBeDisabled();
    // await expect(
    //   this.editSettingsTab.EiVersionDropDownField.locator('input'),
    // ).toBeDisabled();
    await expect(this.ChangeAnalysisTypeCheckBox).toBeVisible();
    await expect(this.ChangeAnalysisTypeCheckBox).not.toBeChecked();
  }

  async validateDuplicateControls() {
    await this.page.waitForLoadState('load');
    await expect(this.Title).toBeVisible();
    await expect(this.LocationsQty).toBeVisible();
    await expect(this.CancelButton).toBeVisible();
    await expect(this.CreateDuplicateButton).toBeDisabled();
    await expect(this.ImportData).not.toBeVisible();
    await expect(this.DuplicateEditSettings).toBeVisible();
    await expect(this.editSettingsTab.PortfolioNameInputField).toBeVisible();
    await expect(this.editSettingsTab.CategoryInputField).toBeVisible();
    await expect(
      this.editSettingsTab.DataVersionDropDownField.locator('input'),
    ).toBeVisible();
    // await expect(
    //   this.editSettingsTab.EiVersionDropDownField.locator('input'),
    // ).toBeVisible();
    await expect(this.ChangeAnalysisTypeCheckBox).not.toBeVisible();
  }

  async validateDisabledAnalysisTypes() {
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
        this.page
          .locator(
            `${radioButtonSelector} [data-testid="analysis-type-radio-buttons"]`,
          )
          .locator('input'),
      ).toBeDisabled();

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

  async validateEnabledAnalysisTypes() {
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
        this.page
          .locator(
            `${radioButtonSelector} [data-testid="analysis-type-radio-buttons"]`,
          )
          .locator('input'),
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
}
