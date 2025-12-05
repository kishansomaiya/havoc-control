// tests/ui/components/PortfolioSlrModal.ts

import { Page, Locator,expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mammoth from 'mammoth';

export class PortfolioSlrModal {
  private readonly __filename: string;
  private readonly __dirname: string;

  readonly modalBulkTitleText: string;
  readonly modalSingleTitleText: string;

  readonly includeInDownloadLabelText: string;
  readonly allLocationsRadioButtonName: string;
  readonly specifyLocationRadioButtonName: string;

  readonly scenarioLabelText: string;
  readonly radioButtonName_245: string;
  readonly radioButtonHelpText_245: string;
  readonly radioButtonName_585: string;
  readonly radioButtonHelpText_585: string;

  readonly templateTypeLabelText: string;
  readonly changeReportRadioButtonName: string;
  readonly changeReportRadioButtonHelpText: string;
  readonly exposureReportRadioButtonName: string;
  readonly exposureReportRadioButtonHelpText: string;

  readonly templateFormatLabelText: string;
  readonly basicRadioButtonName: string;
  readonly basicRadioButtonHelpText: string;
  readonly standardRadioButtonName: string;
  readonly standardRadioButtonHelpText: string;
  readonly advancedRadioButtonName: string;
  readonly advancedRadioButtonHelpText: string;

  readonly page: Page;
  readonly SlrModal: Locator;
  readonly ModalTitle: Locator;
  readonly IncludeInDownloadLabel: Locator;
  readonly ScenarioLabel: Locator;
  readonly TemplateTypeLabel: Locator;
  readonly TemplateFormatLabel: Locator;
  readonly DownloadButton: Locator;
  readonly Downloading: Locator;
  readonly CancelButton: Locator;

  readonly RadioButton: Locator;
  readonly RadioButtonName: Locator;
  readonly RadioButtonHelpText: Locator;

  readonly IncludeInDownloadButtons: Locator;
  readonly ScenarioButtons: Locator;
  readonly TemplateTypeButtons: Locator;
  readonly TemplateFormatButtons: Locator;

  readonly LocationIdInput: Locator;
  readonly AllLocationsRadioButton: Locator;
  readonly Ssp245RadioButton: Locator;
  readonly SpecifyLocationRadioButton: Locator;
  readonly Ssp585RadioButton: Locator;
  readonly ChangeReportRadioButton: Locator;
  readonly ExplosureReportRadioButton: Locator;
  readonly BasicRadioButton: Locator;
  readonly StandardRadioButton: Locator;
  readonly AdvancedRadioButton: Locator;

  constructor(page: Page) {
    this.page = page;

    // Convert import.meta.url to file path
    this.__filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(this.__filename);

    this.SlrModal = page.getByTestId('download-slr-modal-box');

    this.RadioButton = page.getByTestId('download-slr-modal-radio-button');
    this.RadioButtonName = page.getByTestId(
      'download-slr-modal-radio-button-name',
    );
    this.RadioButtonHelpText = page.getByTestId(
      'download-slr-modal-radio-button-helptext',
    );

    this.ModalTitle = page.getByTestId('download-slr-modal-title');
    this.modalBulkTitleText = 'Bulk Download Single-Location Reports';
    this.modalSingleTitleText = 'Download Single-Location Reports';

    // Include in Download
    this.IncludeInDownloadLabel = page.getByTestId(
      'download-slr-modal-include',
    );
    this.IncludeInDownloadButtons = page.getByTestId(
      'download-slr-modal-download-type',
    );
    this.AllLocationsRadioButton = page.getByLabel('all');
    this.SpecifyLocationRadioButton = page.getByLabel('single_location');

    this.includeInDownloadLabelText = 'Include in Download';
    this.allLocationsRadioButtonName = 'All Locations';
    this.specifyLocationRadioButtonName = 'Specify Location ID';
    this.LocationIdInput = page
      .getByTestId('download-slr-modal-location-id-input')
      .locator('input');

    // Scenario
    this.ScenarioLabel = page.getByTestId('download-slr-modal-scenario-title');
    this.ScenarioButtons = page.getByTestId(
      'download-slr-modal-scenario-buttons',
    );
    this.Ssp245RadioButton = page.getByLabel('ssp245');
    this.Ssp585RadioButton = page.getByLabel('ssp585');

    this.scenarioLabelText = 'Scenario';
    this.radioButtonName_245 = 'SSP2-4.5';
    this.radioButtonHelpText_245 = 'Middle GHG Emissions';
    this.radioButtonName_585 = 'SSP5-8.5';
    this.radioButtonHelpText_585 = 'High GHG Emissions';

    // Template Type
    this.TemplateTypeLabel = page.getByTestId(
      'download-slr-modal-template-type-title',
    );
    this.TemplateTypeButtons = page.getByTestId(
      'download-slr-modal-template-type-buttons',
    );
    this.ChangeReportRadioButton = page.getByLabel('change');
    this.ExplosureReportRadioButton = page.getByLabel('exposure');

    this.templateTypeLabelText = 'Template Type';
    this.changeReportRadioButtonName = 'Change Report';
    this.changeReportRadioButtonHelpText = 'Shows metrics by percent change';
    this.exposureReportRadioButtonName = 'Exposure Report';
    this.exposureReportRadioButtonHelpText = 'Shows metrics by exposure band';

    // Template Format
    this.TemplateFormatLabel = page.getByTestId(
      'download-slr-modal-template-format-title',
    );
    this.TemplateFormatButtons = page.getByTestId(
      'download-slr-modal-template-format-buttons',
    );
    this.BasicRadioButton = page.getByLabel('basic');
    this.StandardRadioButton = page.getByLabel('standard');
    this.AdvancedRadioButton = page.getByLabel('advanced');

    this.templateFormatLabelText = 'Template Format';
    this.basicRadioButtonName = 'Basic';
    this.basicRadioButtonHelpText = 'Peril metrics only';
    this.standardRadioButtonName = 'Standard';
    this.standardRadioButtonHelpText = 'Peril metrics and scores';
    this.advancedRadioButtonName = 'Advanced';
    this.advancedRadioButtonHelpText =
      'Peril metrics, scores and economic impact';

    // Buttons
    this.CancelButton = page.getByTestId('download-slr-modal-button-cancel');
    this.DownloadButton = page.getByTestId('download-slr-modal-button-confirm');
    this.Downloading = page.getByText('Downloading');
  }

  async clickOnCancel() {
    await expect(this.CancelButton).toBeVisible();
    await this.CancelButton.click();
    await this.SlrModal.waitFor({
      state: 'hidden',
    });
  }

  async clickOnDownload() {
    await expect(this.DownloadButton).toBeVisible();
    await this.DownloadButton.click();
    await expect(this.DownloadButton).toBeDisabled();
    await this.DownloadButton.waitFor({
      state: 'hidden',
    });
    await this.SlrModal.waitFor({
      state: 'hidden',
    });
  }

  async selectSsp245() {
    const isChecked = await this.Ssp245RadioButton.isChecked();
    if (!isChecked) {
      await this.Ssp245RadioButton.check();
    }

    const newState = await this.Ssp245RadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(this.Ssp585RadioButton).not.toBeChecked();
  }

  async selectSsp585() {
    const isChecked = await this.Ssp585RadioButton.isChecked();
    if (!isChecked) {
      await this.Ssp585RadioButton.check();
    }

    const newState = await this.Ssp585RadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(this.Ssp245RadioButton).not.toBeChecked();
  }

  async selectAllLocations() {
    const isChecked = await this.AllLocationsRadioButton.isChecked();
    if (!isChecked) {
      await this.AllLocationsRadioButton.check();
    }

    const newState = await this.AllLocationsRadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(this.SpecifyLocationRadioButton).not.toBeChecked();
  }

  async selectSpecifyLocation() {
    const isChecked = await this.SpecifyLocationRadioButton.isChecked();
    if (!isChecked) {
      await this.SpecifyLocationRadioButton.check();
    }

    const newState = await this.SpecifyLocationRadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(this.AllLocationsRadioButton).not.toBeChecked();
  }

  async selectChangeReport() {
    const isChecked = await this.ChangeReportRadioButton.isChecked();
    if (!isChecked) {
      await this.ChangeReportRadioButton.check();
    }

    const newState = await this.ChangeReportRadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(this.ExplosureReportRadioButton).not.toBeChecked();
  }

  async selectExplosureReport() {
    const isChecked = await this.ExplosureReportRadioButton.isChecked();
    if (!isChecked) {
      await this.ExplosureReportRadioButton.check();
    }

    const newState = await this.ExplosureReportRadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(this.ChangeReportRadioButton).not.toBeChecked();
  }

  async selectBasic() {
    const isChecked = await this.BasicRadioButton.isChecked();
    if (!isChecked) {
      await this.BasicRadioButton.check();
    }

    const newState = await this.BasicRadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(this.StandardRadioButton).not.toBeChecked();
    await expect(this.AdvancedRadioButton).not.toBeChecked();
  }
  async selectStandard() {
    const isChecked = await this.StandardRadioButton.isChecked();
    if (!isChecked) {
      await this.StandardRadioButton.check();
    }

    const newState = await this.StandardRadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(this.BasicRadioButton).not.toBeChecked();
    await expect(this.AdvancedRadioButton).not.toBeChecked();
  }

  async selectAdvanced() {
    const isChecked = await this.AdvancedRadioButton.isChecked();
    if (!isChecked) {
      await this.AdvancedRadioButton.check();
    }

    const newState = await this.AdvancedRadioButton.isChecked();
    expect(newState).toBeTruthy();
    await expect(this.BasicRadioButton).not.toBeChecked();
    await expect(this.StandardRadioButton).not.toBeChecked();
  }

  async verifyDefaultState() {
    await expect(this.AllLocationsRadioButton).toBeVisible();
    await expect(this.AllLocationsRadioButton).not.toBeChecked();
    await expect(this.SpecifyLocationRadioButton).toBeVisible();
    await expect(this.SpecifyLocationRadioButton).toBeChecked();
    await expect(this.Ssp245RadioButton).toBeVisible();
    await expect(this.LocationIdInput).toBeVisible();
    await expect(this.Ssp245RadioButton).not.toBeChecked();
    await expect(this.Ssp585RadioButton).toBeVisible();
    await expect(this.Ssp585RadioButton).toBeChecked();
    await expect(this.ChangeReportRadioButton).toBeVisible();
    await expect(this.ChangeReportRadioButton).toBeChecked();
    await expect(this.ExplosureReportRadioButton).toBeVisible();
    await expect(this.ExplosureReportRadioButton).not.toBeChecked();

    await expect(this.BasicRadioButton).toBeVisible();
    await expect(this.BasicRadioButton).toBeChecked();
    await expect(this.AdvancedRadioButton).toBeVisible();
    await expect(this.AdvancedRadioButton).not.toBeChecked();
    await expect(this.DownloadButton).toBeDisabled(); // by default when the 'Specify Location ID' is selected
    await expect(this.CancelButton).toBeEnabled();
  }

  async verifySingleLocationDefaultState() {
    await expect(this.AllLocationsRadioButton).toBeHidden();
    await expect(this.SpecifyLocationRadioButton).toBeHidden();
    await expect(this.LocationIdInput).toBeHidden();
    await expect(this.Ssp245RadioButton).toBeVisible();
    await expect(this.Ssp245RadioButton).not.toBeChecked();
    await expect(this.Ssp585RadioButton).toBeVisible();
    await expect(this.Ssp585RadioButton).toBeChecked();
    await expect(this.ChangeReportRadioButton).toBeVisible();
    await expect(this.ChangeReportRadioButton).toBeChecked();
    await expect(this.ExplosureReportRadioButton).toBeVisible();
    await expect(this.ExplosureReportRadioButton).not.toBeChecked();
    await expect(this.BasicRadioButton).toBeVisible();
    await expect(this.BasicRadioButton).toBeChecked();
    await expect(this.StandardRadioButton).toBeVisible();
    await expect(this.StandardRadioButton).not.toBeChecked();
    await expect(this.AdvancedRadioButton).toBeVisible();
    await expect(this.AdvancedRadioButton).not.toBeChecked();
    await expect(this.DownloadButton).toBeEnabled();
    await expect(this.CancelButton).toBeEnabled();
  }

  async validateSlrElementsText() {
    await expect(this.ModalTitle).toBeVisible();
    await expect(this.ModalTitle).toHaveText(this.modalBulkTitleText);
    await expect(this.IncludeInDownloadLabel).toBeVisible();
    await expect(this.IncludeInDownloadLabel).toHaveText(
      this.includeInDownloadLabelText,
    );
    await expect(this.IncludeInDownloadButtons).toContainText(
      this.allLocationsRadioButtonName,
    );
    await expect(this.IncludeInDownloadButtons).toContainText(
      this.specifyLocationRadioButtonName,
    );
    await expect(this.ScenarioLabel).toBeVisible();
    await expect(this.ScenarioLabel).toHaveText(this.scenarioLabelText);
    await expect(this.ScenarioButtons).toContainText(this.radioButtonName_245);
    await expect(this.ScenarioButtons).toContainText(
      this.radioButtonHelpText_245,
    );
    await expect(this.ScenarioButtons).toContainText(this.radioButtonName_585);
    await expect(this.ScenarioButtons).toContainText(
      this.radioButtonHelpText_585,
    );
    await expect(this.TemplateTypeLabel).toBeVisible();
    await expect(this.TemplateTypeLabel).toHaveText(this.templateTypeLabelText);
    await expect(this.TemplateTypeButtons).toContainText(
      this.changeReportRadioButtonName,
    );
    await expect(this.TemplateTypeButtons).toContainText(
      this.changeReportRadioButtonHelpText,
    );
    await expect(this.TemplateTypeButtons).toContainText(
      this.exposureReportRadioButtonName,
    );
    await expect(this.TemplateTypeButtons).toContainText(
      this.exposureReportRadioButtonHelpText,
    );

    await expect(this.TemplateFormatLabel).toBeVisible();
    await expect(this.TemplateFormatLabel).toHaveText(
      this.templateFormatLabelText,
    );
    await expect(this.TemplateFormatButtons).toContainText(
      this.basicRadioButtonName,
    );
    await expect(this.TemplateFormatButtons).toContainText(
      this.basicRadioButtonHelpText,
    );
    await expect(this.TemplateFormatButtons).toContainText(
      this.standardRadioButtonName,
    );
    await expect(this.TemplateFormatButtons).toContainText(
      this.standardRadioButtonHelpText,
    );
    await expect(this.TemplateFormatButtons).toContainText(
      this.advancedRadioButtonName,
    );
    await expect(this.TemplateFormatButtons).toContainText(
      this.advancedRadioButtonHelpText,
    );
    await expect(this.CancelButton).toHaveText('Cancel');
    await expect(this.DownloadButton).toHaveText('Download');
  }
  async validateSingleReportElementsText() {
    await expect(this.ModalTitle).toBeVisible();
    await expect(this.ModalTitle).toHaveText(this.modalSingleTitleText);
    await expect(this.IncludeInDownloadLabel).toBeHidden();
    await expect(this.IncludeInDownloadButtons).toBeHidden();
    await expect(this.ScenarioLabel).toBeVisible();
    await expect(this.ScenarioLabel).toHaveText(this.scenarioLabelText);
    await expect(this.ScenarioButtons).toContainText(this.radioButtonName_245);
    await expect(this.ScenarioButtons).toContainText(
      this.radioButtonHelpText_245,
    );
    await expect(this.ScenarioButtons).toContainText(this.radioButtonName_585);
    await expect(this.ScenarioButtons).toContainText(
      this.radioButtonHelpText_585,
    );
    await expect(this.TemplateTypeLabel).toBeVisible();
    await expect(this.TemplateTypeLabel).toHaveText(this.templateTypeLabelText);
    await expect(this.TemplateTypeButtons).toContainText(
      this.changeReportRadioButtonName,
    );
    await expect(this.TemplateTypeButtons).toContainText(
      this.changeReportRadioButtonHelpText,
    );
    await expect(this.TemplateTypeButtons).toContainText(
      this.exposureReportRadioButtonName,
    );
    await expect(this.TemplateTypeButtons).toContainText(
      this.exposureReportRadioButtonHelpText,
    );

    await expect(this.TemplateFormatLabel).toBeVisible();
    await expect(this.TemplateFormatLabel).toHaveText(
      this.templateFormatLabelText,
    );
    await expect(this.TemplateFormatButtons).toContainText(
      this.basicRadioButtonName,
    );
    await expect(this.TemplateFormatButtons).toContainText(
      this.basicRadioButtonHelpText,
    );
    await expect(this.TemplateFormatButtons).toContainText(
      this.standardRadioButtonName,
    );
    await expect(this.TemplateFormatButtons).toContainText(
      this.standardRadioButtonHelpText,
    );
    await expect(this.TemplateFormatButtons).toContainText(
      this.advancedRadioButtonName,
    );
    await expect(this.TemplateFormatButtons).toContainText(
      this.advancedRadioButtonHelpText,
    );
    await expect(this.CancelButton).toHaveText('Cancel');
    await expect(this.DownloadButton).toHaveText('Download');
  }

  async downloadAndVerifySlr(
    locationId: string,
    expectedText1: string,
    expectedText2: string,
  ) {
    const expectedFileName = `location_${locationId}_report.docx`;
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.clickOnDownload(),
    ]);

    // Save the downloaded file to a specified path
    const downloadPath = path.join(
      this.__dirname,
      '../test-results',
      expectedFileName,
    );
    await download.saveAs(downloadPath);

    // Check if the file is not empty
    const fileStats = fs.statSync(downloadPath);
    expect(fileStats.size).toBeGreaterThan(0); // Ensure the file is not empty

    // Extract text content from the .docx file
    const fileContent = await mammoth.extractRawText({ path: downloadPath });

    // Check if the extracted content matches expected text
    expect(fileContent.value).toContain(expectedText1); // Ensure content is as expected
    expect(fileContent.value).toContain(expectedText2); // Ensure content is as expected
  }

  async verifyMultipleDownloads(numOfDownloads: number) {
    const expectedFileNames = Array.from(
      { length: numOfDownloads },
      (_, index) => `report_${index + 1}.docx`,
    );

    // Prepare promises for multiple download events
    const downloadPromises = [];
    for (let i = 0; i < numOfDownloads; i++) {
      downloadPromises.push(this.page.waitForEvent('download'));
    }

    // Trigger the download
    await this.clickOnDownload();

    // Wait for all download events to occur
    const downloads = await Promise.all(downloadPromises);

    // Save each downloaded file and check if it's not empty
    for (let i = 0; i < downloads.length; i++) {
      const download = downloads[i];
      const downloadPath = path.join(
        this.__dirname,
        '../test-results',
        expectedFileNames[i],
      );

      // Save the file to the specified path
      await download.saveAs(downloadPath);

      // Check if the file is not empty
      const fileStats = fs.statSync(downloadPath);
      expect(fileStats.size).toBeGreaterThan(0); // Ensure the file is not empty
    }
  }
}
