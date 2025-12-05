// tests/ui/components/ExportPortfolioMenuDropDown.ts

import { Page, Locator,expect } from '@playwright/test';
import { PortfolioInformation } from '@components/PortfolioInformation';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { parseCsvFile } from '@utils/parseCsvFile';

export class ExportPortfolioMenuDropDown {
  private readonly __filename: string;
  private readonly __dirname: string;
  readonly page: Page;
  readonly portfolioInformation: PortfolioInformation;
  readonly ExportMenu: Locator;
  readonly ExportMenuStandardLabel: Locator;
  readonly ExportMenuItem: Locator;
  readonly ExportStandardPerils: Locator;
  readonly ExportStandardScores: Locator;
  readonly ExportStandardPortfolioMetrics: Locator;
  readonly ExportEnhancedPerils: Locator;
  readonly ExportEnhancedScores: Locator;
  readonly ExportStandardFloodMesh: Locator;
  readonly SlrButton: Locator;
  readonly Downloading: Locator;

  readonly SlrModal: Locator;

  constructor(page: Page) {
    // Convert import.meta.url to file path
    this.__filename = fileURLToPath(import.meta.url);
    this.__dirname = path.dirname(this.__filename);
    this.page = page;
    this.portfolioInformation = new PortfolioInformation(page);
    this.ExportMenu = page.getByTestId('portfolio-details-export-menu');
    this.ExportMenuStandardLabel = page.getByTestId(
      'portfolio-details-export-menu-standard',
    );
    this.ExportMenuItem = page.getByTestId(
      'portfolio-details-export-menu-item',
    );
    this.SlrButton = page.getByTestId(
      'portfolio-details-export-menu-single-loc-report',
    );
    this.ExportStandardPerils = page
      .getByRole('menuitem', { name: 'Perils' })
      .first();
    this.ExportStandardScores = page
      .getByRole('menuitem', { name: 'Scores' })
      .first();
    this.ExportStandardPortfolioMetrics = page.getByRole('menuitem', {
      name: 'Portfolio Metrics',
    });
    this.ExportStandardFloodMesh = page.getByRole('menuitem', {
      name: 'Flood Mesh',
    });
    this.ExportEnhancedPerils = page
      .getByRole('menuitem', { name: 'Perils' })
      .nth(1);
    this.ExportEnhancedScores = page
      .getByRole('menuitem', { name: 'Scores' })
      .nth(1);
    this.Downloading = page.getByText('Downloading');

    this.SlrModal = page.getByTestId('download-slr-modal-box');
  }

  async validateControlsSimple() {
    await this.page.waitForLoadState('load');
    await expect(this.ExportMenu).toBeVisible();
    await expect(this.ExportStandardPerils).toBeVisible();
    await expect(this.ExportStandardScores).toBeVisible();
    await expect(this.ExportStandardPortfolioMetrics).toBeVisible();
    await expect(this.SlrButton).toBeVisible();
    await expect(this.ExportStandardFloodMesh).toBeDisabled();
    await expect(this.ExportEnhancedPerils).toBeVisible();
    await expect(this.ExportEnhancedScores).toBeVisible();
  }
  async validateControlsSimpleDisabled() {
    await this.page.waitForLoadState('load');
    await expect(this.ExportMenu).toBeVisible();
    await expect(this.ExportStandardPerils).toBeDisabled();
    await expect(this.ExportStandardScores).toBeDisabled();
    await expect(this.ExportStandardPortfolioMetrics).toBeDisabled();
    await expect(this.SlrButton).toBeDisabled();
    await expect(this.ExportStandardFloodMesh).toBeDisabled();
    await expect(this.ExportEnhancedPerils).toBeDisabled();
    await expect(this.ExportEnhancedScores).toBeDisabled();
  }

  async validateControls() {
    await this.page.waitForLoadState('load');
    await expect(this.ExportMenu).toBeVisible();
    await expect(this.SlrButton).toBeVisible();

    const standardMenuItems = [
      'Perils',
      'Scores',
      'Portfolio Metrics',
      'Flood Mesh',
    ];
    const enhancedMenuItems = ['Perils', 'Scores'];
    const menuItems = this.ExportMenuItem;
    const menuItemTexts = await menuItems.allTextContents();

    // Check that all standard items exist in the list
    for (const item of standardMenuItems) {
      expect(menuItemTexts).toContain(item);
    }
    // Check that all enhanced items exist in the list
    for (const item of enhancedMenuItems) {
      expect(menuItemTexts).toContain(item);
    }
    // Optionally: Check for disabled items
    const disabledItems = await this.page
      .locator('[aria-disabled="true"]')
      .allTextContents();
    expect(disabledItems).toContain('Flood Mesh'); // For example, check if 'Flood Mesh' is disabled.
  }

  async validateDisabledControls() {
    await this.page.waitForLoadState('load');
    await expect(this.ExportMenu).toBeVisible();
    await expect(this.SlrButton).toBeDisabled();

    const standardMenuItems = [
      'Perils',
      'Scores',
      'Portfolio Metrics',
      'Flood Mesh',
    ];
    const enhancedMenuItems = ['Perils', 'Scores'];
    const menuItems = this.ExportMenuItem;
    const menuItemTexts = await menuItems.allTextContents();

    // Check that all standard items exist in the list
    for (const item of standardMenuItems) {
      expect(menuItemTexts).toContain(item);
    }
    // Check that all enhanced items exist in the list
    for (const item of enhancedMenuItems) {
      expect(menuItemTexts).toContain(item);
    }
    // Optionally: Check for disabled items
    const disabledItems = await this.page
      .locator('[aria-disabled="true"]')
      .allTextContents();
    expect(disabledItems).toContain('Flood Mesh'); // For example, check if 'Flood Mesh' is disabled.
    expect(disabledItems).toContain('Perils'); // For example, check if 'Flood Mesh' is disabled.
    expect(disabledItems).toContain('Portfolio Metrics'); // For example, check if 'Flood Mesh' is disabled.
    expect(disabledItems).toContain('Scores'); // For example, check if 'Flood Mesh' is disabled.
  }

  async clickOnSlrMenuItem() {
    await expect(this.SlrButton).toBeVisible();
    await this.SlrButton.click();
    await expect(this.SlrModal).toBeVisible();
  }

  async exportStandardPerils() {
    await expect(this.ExportStandardPerils).toBeVisible();
    await this.ExportStandardPerils.click();
    await expect(this.Downloading).toBeVisible();
  }
  async exportStandardScores() {
    await expect(this.ExportStandardScores).toBeVisible();
    await this.ExportStandardScores.click();
    await expect(this.Downloading).toBeVisible();
  }
  async exportStandardPortfolioMetrics() {
    await expect(this.ExportStandardPortfolioMetrics).toBeVisible();
    await this.ExportStandardPortfolioMetrics.click();
    await expect(this.Downloading).toBeVisible();
  }
  async exportEnhancedPerils() {
    await expect(this.ExportEnhancedPerils).toBeVisible();
    await this.ExportEnhancedPerils.click();
    await expect(this.Downloading).toBeVisible();
  }
  async exportEnhancedScores() {
    await expect(this.ExportEnhancedScores).toBeVisible();
    await this.ExportEnhancedScores.click();
    await expect(this.Downloading).toBeVisible();
  }

  async verifyDownloadedStandardPerils(portfolioName: string) {
    const expectedFileName = `${portfolioName}-standard-perils.csv`;

    // Wait for download and trigger the action
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportStandardPerils(),
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
      'resultId',
      'locationId',
      'latitude',
      'longitude',
      'locationName',
      'EI_productivity',
    ];

    // Check if the downloaded file contains the expected columns
    const actualColumns = Object.keys(downloadedData[0]);
    expectedColumns.forEach((column) => {
      expect(actualColumns).toContain(column); // Ensure all expected columns are present
    });


  }

  async verifyDownloadedStandardScores(portfolioName: string) {
    const expectedFileName = `${portfolioName}-standard-scores.csv`;

    // Wait for download and trigger the action
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportStandardScores(),
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
      'locationName',
      'latitude',
      'longitude',
      'population',
      'FL_hazard_score',
      'AP_overall_pctAdmin1',
    ];

    // Check if the downloaded file contains the expected columns
    const actualColumns = Object.keys(downloadedData[0]);
    expectedColumns.forEach((column) => {
      expect(actualColumns).toContain(column); // Ensure all expected columns are present
    });


  }

  async verifyDownloadedStandardPortfolioMetrics(portfolioName: string) {
    const expectedFileName = `${portfolioName}-standard-portfolio-metrics.csv`;

    // Wait for download and trigger the action
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportStandardPortfolioMetrics(),
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
      'resultId',
      'valueCurrencyCode',
      'scenario',
      'year',
      'PL_FL_loss10yr_building',
      'PL_EI_climateAdjValue',
    ];

    // Check if the downloaded file contains the expected columns
    const actualColumns = Object.keys(downloadedData[0]);
    expectedColumns.forEach((column) => {
      expect(actualColumns).toContain(column); // Ensure all expected columns are present
    });


  }

  async verifyDownloadedEnhancedPerils(portfolioName: string) {
    const expectedFileName = `${portfolioName}-enhanced-perils.csv`;

    // Wait for download and trigger the action
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportEnhancedPerils(),
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
      'resultId',
      'locationId',
      'Latitude',
      'Longitude',
      'Location Name',
      'Building Value',
      'Economic Impact on Productivity',
    ];

    // Check if the downloaded file contains the expected columns
    const actualColumns = Object.keys(downloadedData[0]);
    expectedColumns.forEach((column) => {
      expect(actualColumns).toContain(column); // Ensure all expected columns are present
    });


  }

  async verifyDownloadedEnhancedScores(portfolioName: string) {
    const expectedFileName = `${portfolioName}-enhanced-scores.csv`;

    // Wait for download and trigger the action
    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.exportEnhancedScores(),
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
      'Location Name',
      'Latitude',
      'Longitude',
      'population',
      'Flood Present Day Hazard',
      'All Perils Overall Hazard (Admin1)',
    ];

    // Check if the downloaded file contains the expected columns
    const actualColumns = Object.keys(downloadedData[0]);
    expectedColumns.forEach((column) => {
      expect(actualColumns).toContain(column); // Ensure all expected columns are present
    });


  }
}
