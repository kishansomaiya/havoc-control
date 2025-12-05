// tests/ui/components/PortfolioItemMenuDropDown.ts

import { Page, Locator,expect } from '@playwright/test';
import { EditPortfolioPage } from '@pages/EditPortfolioPage';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseCsvFile } from '@utils/parseCsvFile';

export class PortfolioItemMenuDropDown {
  private readonly __filename: string;
  private readonly __dirname: string;

  readonly page: Page;
  readonly editPortfolioPage: EditPortfolioPage;
  readonly List: Locator;
  readonly EditSettings: Locator;
  readonly Download: Locator;
  readonly Downloading: Locator;
  readonly Duplicate: Locator;
  readonly Delete: Locator;
  readonly DownloadGeoCodeLog: Locator;
  readonly CopyDebugLog: Locator;

  readonly ConfirmModal: Locator;
  readonly ConfirmModalTitle: Locator;
  readonly ConfirmModalMessage: Locator;
  readonly ConfirmModalCancelButton: Locator;
  readonly ConfirmModalDeleteButton: Locator;

  readonly PortfolioContextMenu: Locator;

  constructor(page: Page) {
    // Convert import.meta.url to file path
    this.__filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(this.__filename);

    this.page = page;
    this.editPortfolioPage = new EditPortfolioPage(page);
    this.List = page.getByTestId('portfolio-item-menu');
    this.EditSettings = page.getByTestId('portfolio-item-menu-edit');
    this.Download = page.getByTestId('portfolio-item-menu-download');
    this.Downloading = page.getByText('Downloading');
    this.Duplicate = page.getByTestId('portfolio-item-menu-duplicate');
    this.Delete = page.getByTestId('portfolio-item-menu-delete');
    this.DownloadGeoCodeLog = page.getByTestId(
      'portfolio-item-menu-download-geocode-log',
    );
    this.CopyDebugLog = page.getByTestId('portfolio-item-menu-copy-debug-log');

    this.ConfirmModal = page.getByTestId('confirm-modal-box');
    this.ConfirmModalTitle = page.getByTestId('confirm-modal-title');
    this.ConfirmModalMessage = page.getByTestId('confirm-modal-message');
    this.ConfirmModalCancelButton = page.getByTestId(
      'confirm-modal-button-cancel',
    );
    this.ConfirmModalDeleteButton = page.getByTestId(
      'confirm-modal-button-confirm',
    );
    this.PortfolioContextMenu = page.getByRole('menu');
  }

  async validateControls() {
    await this.page.waitForLoadState('load');
    await expect(this.List).toBeVisible();
    await expect(this.EditSettings).toBeVisible();
    await expect(this.Download).toBeVisible();
    await expect(this.Duplicate).toBeVisible();
    await expect(this.Delete).toBeVisible();
    await expect(this.DownloadGeoCodeLog).toBeVisible();
    await expect(this.CopyDebugLog).toBeVisible();
  }

  async clickOnEditSettings() {
    await expect(this.EditSettings).toBeVisible();
    await this.EditSettings.click();
    await this.page.waitForLoadState('load');
    await expect(this.editPortfolioPage.Title).toBeVisible();
  }

  async clickOnDuplicate() {
    await expect(this.Duplicate).toBeVisible();
    await this.Duplicate.click();
    await this.page.waitForLoadState('load');
    await expect(this.editPortfolioPage.Title).toBeVisible();
  }

  async clickOnDelete() {
    await expect(this.Delete).toBeVisible();
    await this.Delete.click();
    await expect(this.ConfirmModal).toBeVisible();
  }

  async confirmDelete() {
    await expect(this.ConfirmModalDeleteButton).toBeVisible();
    await this.ConfirmModalDeleteButton.click();
    await expect(this.ConfirmModalDeleteButton).toBeDisabled();
    await this.ConfirmModalDeleteButton.waitFor({
      state: 'hidden',
    });
    await this.ConfirmModal.waitFor({
      state: 'hidden',
    });
  }

  async validateDeletePortfolioModalControls() {
    await expect(this.ConfirmModal).toBeVisible();
    await expect(this.ConfirmModalTitle).toBeVisible();
    await expect(this.ConfirmModalTitle).toHaveText('Delete Portfolio');
    await expect(this.ConfirmModalMessage).toBeVisible();
    await expect(this.ConfirmModalMessage).toHaveText(
      'Are you sure you want to delete this portfolio and its associated locations? This action cannot be undone.',
    );
    await expect(this.ConfirmModalCancelButton).toBeVisible();
    await expect(this.ConfirmModalCancelButton).toHaveText('Cancel');
    await expect(this.ConfirmModalDeleteButton).toBeVisible();
    await expect(this.ConfirmModalDeleteButton).toHaveText('Delete');
  }

  async clickOnDownload() {
    await expect(this.Download).toBeVisible();
    await this.Download.click();
    await expect(this.Downloading).toBeVisible();
  }

  async verifyDownloadedPortfolio(portfolioName: string, fileName: string) {
    const expectedFileName = `${portfolioName}.csv`;
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.clickOnDownload(),
    ]);

    const downloadPath = path.join(
      this.__dirname,
      '../test-results',
      expectedFileName,
    );
    await download.saveAs(downloadPath);

    // expect(download.suggestedFilename()).toBe(expectedFileName);

    // Parse both the downloaded file and the original reference file
    const downloadedData = await parseCsvFile(downloadPath);
    const originalFilePath = path.join(this.__dirname, '../fixtures', fileName);
    const originalData = await parseCsvFile(originalFilePath);

    // Sort both data sets by locationId
    const sortByLocationId = (a: any, b: any) =>
      a.locationId.localeCompare(b.locationId);

    const sortedDownloadedData = downloadedData.sort(sortByLocationId);
    const sortedOriginalData = originalData.sort(sortByLocationId);

    // Specify the columns you want to compare (adjust as per your actual columns)
    const columnsToCompare = [
      'locationId',
      'latitude',
      'longitude',
      'locationName',
      'population',
    ];

    // Compare the specified columns and their values after sorting
    sortedDownloadedData.forEach((downloadedRow, index) => {
      const originalRow = sortedOriginalData[index];

      columnsToCompare.forEach((column) => {
        // Output the rows for debugging purposes




        // Normalize values and compare
        const normalizeValue = (value: any) => {
          if (value === '\\N') return '';
          return String(value).trim();
        };

        expect(normalizeValue(downloadedRow[column])).toBe(
          normalizeValue(originalRow[column]),
        );
        // // Normalize data types before comparing
        // expect(String(downloadedRow[column]).trim()).toBe(
        //   String(originalRow[column]).trim(),
        // );
      });
    });
  }

  async copyAndVerifyDebugLog(portfolioName: string) {
    const context = await this.page.context(); // Access current context
    await context.grantPermissions(['clipboard-read', 'clipboard-write']); // Grant clipboard permissions

    // Ensure the copy button is visible and then click it
    await expect(this.CopyDebugLog).toBeVisible();
    await this.CopyDebugLog.click();

    // Wait for clipboard data to be updated
    const copiedContent = await this.page.evaluate(() =>
      navigator.clipboard.readText(),
    );

    // Validate that the copied content is not empty
    expect(copiedContent).not.toBe('');

    // Validate that the copied content starts and ends with the correct markers
    expect(
      copiedContent.startsWith('>>>>>>>>>>>>>>>>>>> DEBUG_LOG_START'),
    ).toBe(true);
    expect(copiedContent.endsWith('>>>>>>>>>>>>>>>>>>> DEBUG_LOG_END')).toBe(
      true,
    );

    // Validate that the copied content includes the portfolio name
    expect(copiedContent.includes(`"name": "${portfolioName}"`)).toBe(true);

    // // Optionally log the copied content for debugging purposes
    //
  }

  async clickOnDownloadGeoCodeLog() {
    await expect(this.DownloadGeoCodeLog).toBeVisible();
    await this.DownloadGeoCodeLog.click();
    await expect(this.Downloading).toBeVisible();
  }

  async verifyDownloadedGeocodeLog(portfolioName: string) {
    const expectedFileName = `${portfolioName}-geocode-log.csv`;

    // Wait for download and trigger the action
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.clickOnDownloadGeoCodeLog(),
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

    // Parse the downloaded CSV file
    const downloadedData = await parseCsvFile(downloadPath);

    // Check that the file has at least one row of data
    expect(downloadedData.length).toBeGreaterThan(0);

    // Define the expected columns
    const expectedColumns = [
      'locationId',
      'geocode_status',
      'address',
      'latitude',
      'longitude',
    ];

    // Check if the downloaded file contains the expected columns
    const actualColumns = Object.keys(downloadedData[0]);
    expectedColumns.forEach((column) => {
      expect(actualColumns).toContain(column); // Ensure all expected columns are present
    });


  }
}
