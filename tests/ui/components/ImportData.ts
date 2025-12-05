// tests/ui/components/ImportData.ts

import { Page, Locator,expect } from '@playwright/test';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { waitForContentLoaded } from '@utils/helpers';

// // Convert import.meta.url to file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export class ImportDataTab {
  private readonly basePath: string;
  private readonly __filename: string;
  private readonly __dirname: string;

  readonly page: Page;
  private createPortfolioPage: CreatePortfolioPage;
  readonly UploadCsvFormLabel: Locator;
  readonly UploadCsvDownloadTemplateButton: Locator;
  readonly UploadCsvForm: Locator;
  readonly UploadCsvFormInputField: Locator;
  readonly UploadFileInput: Locator;
  readonly UploadFileInputIcon: Locator;
  readonly UploadFileInputText: Locator;
  readonly UploadCsvFormMap: Locator;
  readonly UploadCsvFormHelpText: Locator;
  readonly UploadCsvType: Locator;
  readonly UploadCsvRadioButtonCheckBox: Locator;
  readonly FileUploadStatus: Locator;
  readonly FileValidationStatus: Locator;
  readonly DeleteFileIcon: Locator;
  readonly SelectedFileInfo: Locator;
  readonly SelectedFileSize: Locator;
  readonly SelectedFileName: Locator;
  readonly FileIcon: Locator;
  readonly ProgressBar: Locator;
  readonly UploadingProgressText: Locator;
  readonly ValidatingProgressText: Locator;

  readonly EnterLatLongForm: Locator;
  readonly EnterLatLongFormMap: Locator;
  readonly EnterLatLongFormLabel: Locator;
  readonly EnterLatLongFormHelpText: Locator;
  readonly EnterLatLongType: Locator;
  readonly EnterLatLongCheckBox: Locator;
  readonly EnterLatLongInputField: Locator;
  readonly EnterLatLongInputEnterIcon: Locator;
  readonly EnterLatLongInputXIcon: Locator;
  readonly EnterLatLongFormLocationChip: Locator;
  readonly EnterLatLongFormLocationList: Locator;
  readonly EnterLatLongFormLocationXIcon: Locator;

  readonly EnterStreetAddressForm: Locator;
  readonly EnterStreetAddressFormMap: Locator;
  readonly EnterStreetAddressFormLabel: Locator;
  readonly EnterStreetAddressFormHelpText: Locator;
  readonly EnterStreetAddressFormHelpTextInvalidLocation: Locator;
  readonly EnterStreetAddressType: Locator;
  readonly EnterStreetAddressCheckbox: Locator;
  readonly EnterStreetAddressInputField: Locator;
  readonly EnterStreetAddressInputEnterIcon: Locator;
  readonly EnterStreetAddressInputXIcon: Locator;
  readonly EnterStreetAddressFormLocationChip: Locator;
  readonly EnterStreetAddressFormLocationList: Locator;
  readonly EnterStreetAddressFormLocationXIcon: Locator;
  readonly EnterStreetAddressFormValidateBtn: Locator;

  readonly EditSettingsForm: Locator;
  readonly EditSettingsPrimaryInformation: Locator;
  readonly EditSettingsAnalysisType: Locator;

  constructor(page: Page) {
    this.page = page;
    this.createPortfolioPage = new CreatePortfolioPage(page);
    // Convert import.meta.url to file path
    this.__filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(this.__filename);
    this.basePath = path.join(this.__dirname, '../fixtures/');

    this.UploadCsvForm = page.getByTestId('upload-csv-form');
    this.UploadCsvFormInputField = page.getByTestId(
      'upload-csv-form-input-field',
    );
    this.UploadFileInput = page.getByTestId('upload-file-input');
    this.UploadFileInputIcon = page.getByTestId('upload-file-input-icon');
    this.UploadFileInputText = page.getByTestId('upload-file-input-text');
    this.UploadCsvFormMap = page.getByTestId('create-new-portfolio-csv-map');
    this.UploadCsvFormLabel = page.getByTestId('upload-csv-form-label');
    this.UploadCsvDownloadTemplateButton = page.getByTestId(
      'download-template-button',
    );
    this.UploadCsvFormHelpText = page.getByTestId('upload-csv-help-text');
    this.UploadCsvType = page.getByTestId('upload-csv-radio-button');
    this.UploadCsvRadioButtonCheckBox = page
      .getByTestId('upload-csv-radio-button')
      .locator('[type="radio"]');
    this.FileUploadStatus = page.getByTestId('file-upload-status');
    this.FileValidationStatus = page.getByTestId('file-validation-status');
    this.DeleteFileIcon = page.getByTestId('upload-csv-form-delete-icon');
    this.SelectedFileInfo = page.getByTestId('selected-file-info');
    this.SelectedFileSize = page.getByTestId('selected-file-size');
    this.SelectedFileName = page.getByTestId('selected-file-name');
    this.FileIcon = page.getByTestId('file-icon');
    this.ProgressBar = page.getByRole('progressbar').getByRole('img');
    this.UploadingProgressText = page.getByText('Uploading');
    this.ValidatingProgressText = page.getByText('Validating');

    this.EnterLatLongForm = page.getByTestId('enter-lat-long-form');
    this.EnterLatLongFormMap = page.getByTestId(
      'create-new-portfolio-lat-long-map',
    );
    this.EnterLatLongFormLabel = page.getByTestId('enter-lat-long-form-label');
    this.EnterLatLongFormHelpText = page.getByTestId(
      'enter-lat-long-help-text',
    );
    this.EnterLatLongType = page.getByTestId('enter-lat-long-radio-button');
    this.EnterLatLongCheckBox = page
      .getByTestId('enter-lat-long-radio-button')
      .locator('[type="radio"]');
    this.EnterLatLongInputField = page
      .getByTestId('enter-lat-long-input-field')
      .locator('input');
    this.EnterLatLongInputEnterIcon = page.getByTestId(
      'enter-lat-long-input-enter-button',
    );
    this.EnterLatLongInputXIcon = page.getByTestId(
      'enter-lat-long-input-x-button',
    );
    this.EnterLatLongFormLocationList = page.getByTestId(
      'enter-lat-long-form-locations-list',
    );
    this.EnterLatLongFormLocationChip = page.getByTestId(
      'enter-lat-long-form-location-chip',
    );
    this.EnterLatLongFormLocationXIcon = page.getByTestId(
      'enter-lat-long-form-locations-chip-x-icon',
    );

    this.EnterStreetAddressFormMap = page.getByTestId(
      'create-new-portfolio-address-map',
    );
    this.EnterStreetAddressForm = page.getByTestId('enter-address-form');
    this.EnterStreetAddressFormLabel = page.getByTestId(
      'enter-address-form-label',
    );
    this.EnterStreetAddressFormHelpText = page.getByTestId(
      'enter-address-help-text',
    );
    this.EnterStreetAddressType = page.getByTestId(
      'enter-address-radio-button',
    );
    this.EnterStreetAddressCheckbox = page
      .getByTestId('enter-address-radio-button')
      .locator('[type="radio"]');
    this.EnterStreetAddressInputField = page
      .getByTestId('enter-address-input-field')
      .locator('input');
    this.EnterStreetAddressInputEnterIcon = page.getByTestId(
      'enter-address-input-enter-button',
    );
    this.EnterStreetAddressInputXIcon = page.getByTestId(
      'enter-address-input-x-button',
    );
    this.EnterStreetAddressFormLocationChip = page.getByTestId(
      'enter-address-form-location-chip',
    );
    this.EnterStreetAddressFormLocationList = page.getByTestId(
      'enter-address-form-locations-list',
    );
    this.EnterStreetAddressFormLocationXIcon = page.getByTestId(
      'enter-address-form-locations-chip-x-icon',
    );
    this.EnterStreetAddressFormValidateBtn = page.getByTestId(
      'enter-address-form-validate-button',
    );
    this.EnterStreetAddressFormHelpTextInvalidLocation = page
      .getByTestId('enter-address-input-field')
      .getByText('Please enter valid location');
  }

  async navigateByURL() {
    await this.page.goto('/create-portfolio');
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
  }

  async validateControls() {
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
    await waitForContentLoaded(this.page);
    await expect(this.UploadCsvType).toBeVisible();
    await expect(this.UploadCsvType).toContainText('Upload .CSV File');
    await expect(this.UploadCsvType).toContainText(
      'Ensure file contains no more than 10,000 locations',
    );

    await expect(this.EnterLatLongType).toBeVisible();
    await expect(this.EnterLatLongType).toContainText(
      'Enter Latitudes and Longitudes',
    );
    await expect(this.EnterLatLongType).toContainText(
      'Enter up to 50 locations',
    );
  }

  async validateUploadCsvControls() {
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
    await waitForContentLoaded(this.page);
    await expect(this.UploadCsvType).toBeVisible();
    await expect(this.UploadCsvRadioButtonCheckBox).toBeChecked();
    await expect(this.UploadCsvFormLabel).toBeVisible();
    await expect(this.UploadCsvForm).toBeVisible();
    await expect(this.UploadCsvFormInputField).toBeVisible();
    await expect(this.UploadCsvFormHelpText).toBeVisible();
    await expect(this.UploadCsvFormHelpText).toContainText(
      'The file must have a header row and at least one valid input data row',
    );
    await expect(this.UploadCsvFormHelpText).toContainText(
      'Format as decimal degrees with at least one non-zero decimal fraction, i.e. "40.7341,-73.9941"',
    );
    await expect(this.UploadCsvFormHelpText).toContainText(
      'Latitude ranges from -90 to +90 degrees, Longitude ranges from -180 to +180 degrees',
    );
    await expect(this.UploadCsvFormHelpText).toContainText(
      'Analysis may not be accessible for locations that are far offshore',
    );
    await expect(this.UploadCsvFormMap).toBeVisible();

    await expect(this.EnterLatLongType).toBeVisible();
    await expect(this.EnterLatLongCheckBox).not.toBeChecked();
    await expect(this.EnterLatLongFormLabel).not.toBeVisible();
    await expect(this.EnterLatLongForm).not.toBeVisible();
    await expect(this.EnterLatLongFormMap).not.toBeVisible();
    await expect(this.EnterStreetAddressForm).not.toBeVisible();
    await expect(this.EnterStreetAddressFormLabel).not.toBeVisible();
    await expect(this.EnterStreetAddressFormMap).not.toBeVisible();
  }

  async validateEnterLatLongControls() {
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
    await waitForContentLoaded(this.page);
    await expect(this.EnterLatLongType).toBeVisible();
    await expect(this.EnterLatLongCheckBox).toBeChecked();
    await expect(this.EnterLatLongForm).toBeVisible();
    await expect(this.EnterLatLongFormLabel).toBeVisible();
    await expect(this.EnterLatLongInputField).toBeVisible();
    await expect(this.EnterLatLongInputEnterIcon).toBeVisible();
    await expect(this.EnterLatLongInputXIcon).toBeVisible();
    await expect(this.EnterLatLongFormHelpText).toBeVisible();
    await expect(this.EnterLatLongFormHelpText).toContainText(
      'Format as decimal degrees with at least one non-zero decimal fraction, i.e. "40.7341,-73.9941"',
    );
    await expect(this.EnterLatLongFormHelpText).toContainText(
      'Latitude ranges from -90 to +90 degrees, Longitude ranges from -180 to +180 degrees',
    );

    await expect(this.UploadCsvType).toBeVisible();
    await expect(this.UploadCsvRadioButtonCheckBox).not.toBeChecked();
    await expect(this.UploadCsvFormLabel).not.toBeVisible();
    await expect(this.UploadCsvForm).not.toBeVisible();
    await expect(this.UploadCsvFormInputField).not.toBeVisible();
    await expect(this.EnterStreetAddressForm).not.toBeVisible();
    await expect(this.EnterStreetAddressFormLabel).not.toBeVisible();
    await expect(this.EnterStreetAddressFormMap).not.toBeVisible();
  }

  async validateEnterStreetAddressControls() {
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
    await waitForContentLoaded(this.page);
    await expect(this.EnterStreetAddressType).toBeVisible();
    await expect(this.EnterStreetAddressCheckbox).toBeChecked();
    await expect(this.EnterStreetAddressForm).toBeVisible();
    await expect(this.EnterStreetAddressFormLabel).toBeVisible();
    await expect(this.EnterStreetAddressInputField).toBeVisible();
    await expect(this.EnterStreetAddressFormHelpText).toBeVisible();
    await expect(this.EnterStreetAddressFormHelpText).toContainText(
      'Specify addresses in accordance with the format used by the national postal service of the country concerned. Additional address elements such as business names and unit, suite or floor numbers should be avoided.',
    );
    await expect(this.EnterStreetAddressFormMap).toBeVisible();

    await expect(this.UploadCsvType).toBeVisible();
    await expect(this.UploadCsvRadioButtonCheckBox).not.toBeChecked();
    await expect(this.UploadCsvFormLabel).not.toBeVisible();
    await expect(this.UploadCsvForm).not.toBeVisible();
    await expect(this.UploadCsvFormInputField).not.toBeVisible();
    await expect(this.EnterLatLongType).toBeVisible();
    await expect(this.EnterLatLongCheckBox).not.toBeChecked();
    await expect(this.EnterLatLongFormLabel).not.toBeVisible();
    await expect(this.EnterLatLongForm).not.toBeVisible();
    await expect(this.EnterLatLongFormMap).not.toBeVisible();
  }

  async togglePortfolioSelection(
    selectedRadioButton: Locator,
    formLabel: Locator,
    otherRadioButtons,
  ) {
    if (!(await selectedRadioButton.isChecked())) {
      await selectedRadioButton.check();
    }

    expect(await selectedRadioButton.isChecked()).toBeTruthy();
    await expect(formLabel).toBeVisible();

    // Verify the other 2 radio buttons are unchecked
    for (const radioButton of otherRadioButtons) {
      await expect(radioButton).not.toBeChecked();
    }
  }

  async selectUploadCsvType() {
    await this.togglePortfolioSelection(
      this.UploadCsvRadioButtonCheckBox,
      this.UploadCsvFormLabel,
      [this.EnterLatLongCheckBox, this.EnterStreetAddressCheckbox],
    );
  }

  async selectEnterLatLongType() {
    await this.togglePortfolioSelection(
      this.EnterLatLongCheckBox,
      this.EnterLatLongFormLabel,
      [this.UploadCsvRadioButtonCheckBox, this.EnterStreetAddressCheckbox],
    );
  }

  async selectEnterStreetAddressType() {
    await this.togglePortfolioSelection(
      this.EnterStreetAddressCheckbox,
      this.EnterStreetAddressFormLabel,
      [this.UploadCsvRadioButtonCheckBox, this.EnterLatLongCheckBox],
    );
  }

  async verifyDownloadTemplate() {
    const expectedFileName = 'Sample Input for Loss.csv';
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.UploadCsvDownloadTemplateButton.click(),
    ]);

    // Save the downloaded file to a specified path
    const downloadPath = path.join(
      this.__dirname,
      '../test-results',
      expectedFileName,
    );
    await download.saveAs(downloadPath);

    // Assert that the downloaded file name matches the expected name
    expect(download.suggestedFilename()).toBe(expectedFileName);

    // Compare the downloaded file with the reference file
    const originalFilePath = path.join(
      this.__dirname,
      '../fixtures',
      'Sample Input for Loss.csv',
    );
    const downloadedFile = fs.readFileSync(downloadPath, 'utf-8');
    const originalFile = fs.readFileSync(originalFilePath, 'utf-8');

    expect(downloadedFile).toBe(originalFile);
  }

  async validateFileInfo(fileName: string) {
    await this.page.waitForLoadState('load'); // Waits for the page to be fully loaded
    await waitForContentLoaded(this.page);
    await expect(this.FileIcon).toBeVisible();
    await expect(this.SelectedFileSize).toBeVisible();
    await expect(this.SelectedFileName).toBeVisible();
    await expect(this.SelectedFileName).toContainText(fileName);
    await expect(this.DeleteFileIcon).toBeVisible();
  }

  async validateSuccessFileUpload() {
    await waitForContentLoaded(this.page);
    await expect(this.FileUploadStatus).toBeVisible();
    await expect(this.FileUploadStatus).toHaveText('Upload Complete', {
      timeout: 5000,
    });
    await expect(this.FileValidationStatus).toBeVisible();
    await expect(this.FileValidationStatus).toHaveText(
      'Validation Successful',
      {
        timeout: 5000,
      },
    );
  }

  async uploadFile(fileName: string): Promise<void> {
    const filePath = path.join(this.basePath, fileName);
    await this.UploadFileInput.setInputFiles(filePath);
    await this.ProgressBar.waitFor({ state: 'hidden' });
    await this.UploadingProgressText.waitFor({ state: 'hidden' });
    await this.ValidatingProgressText.waitFor({ state: 'hidden' });
  }

  async uploadLocationsAndNavigateToEditSettingsTab(
    fileName: string,
  ): Promise<void> {
    await this.uploadFile(fileName);
    await this.validateFileInfo(fileName);
    await this.validateSuccessFileUpload();
    await expect(this.createPortfolioPage.NextButton).toBeVisible();
    await this.createPortfolioPage.NextButton.click();
    await this.page.waitForLoadState('load');
  }

  async setLocationInput(
    inputs: string,
    inputField: Locator,
    enterIcon: Locator,
    locationList: Locator,
    locationChip: Locator,
  ) {
    await inputField.clear();
    await inputField.fill(inputs);
    await expect(inputField).toHaveValue(inputs);
    await enterIcon.click();
    await expect(locationList).toBeVisible();
    await expect(locationChip).toBeVisible();
    await expect(locationChip).toContainText(inputs);
  }

  private isLatLon(input: string): boolean {
    const latLonRegex = /^-?\d{1,2}\.\d+,\s*-?\d{1,3}\.\d+$/;
    return latLonRegex.test(input.trim());
  }

  async enterInputAndNavigateToEditSettingsTab(input: string): Promise<void> {
    const isLatLon = this.isLatLon(input);

    if (isLatLon) {
      await this.selectEnterLatLongType();
      await this.setCoordinates(input);
    } else {
      await this.selectEnterStreetAddressType();
      await this.setAddresses(input);
      await expect(this.EnterStreetAddressFormValidateBtn).toBeVisible();
      await expect(this.EnterStreetAddressFormValidateBtn).toBeEnabled();
      await this.EnterStreetAddressFormValidateBtn.click();
    }
    await expect(this.createPortfolioPage.NextButton).toBeVisible();
    await expect(this.createPortfolioPage.NextButton).toBeEnabled();
    await this.createPortfolioPage.NextButton.click();
    await this.page.waitForLoadState('load');
  }

  async setCoordinates(coordinates: string) {
    await this.setLocationInput(
      coordinates,
      this.EnterLatLongInputField,
      this.EnterLatLongInputEnterIcon,
      this.EnterLatLongFormLocationList,
      this.EnterLatLongFormLocationChip,
    );
  }

  async setAddresses(addresses: string) {
    await this.setLocationInput(
      addresses,
      this.EnterStreetAddressInputField,
      this.EnterStreetAddressInputEnterIcon,
      this.EnterStreetAddressFormLocationList,
      this.EnterStreetAddressFormLocationChip,
    );
  }

  // TODO: Investigate why can't click
  async deleteChipByCoordinates(coordinates: string) {
    const chip = this.EnterLatLongFormLocationChip.filter({
      hasText: coordinates,
    });
    await expect(chip).toBeVisible();
    const deleteIcon = chip.locator(this.EnterLatLongFormLocationChip);
    expect(deleteIcon).toBeTruthy();
    await deleteIcon.click({ force: true });
    await expect(chip).not.toBeVisible();
  }

  async deleteChipByAddress(address: string) {
    const chip = this.EnterStreetAddressFormLocationChip.filter({
      hasText: address,
    });
    await expect(chip).toBeVisible();
    expect(this.EnterStreetAddressFormLocationXIcon).toBeTruthy();
    await this.EnterStreetAddressFormLocationXIcon.click();
    await expect(chip).not.toBeVisible();
  }
}
