// tests/ui/pages/CreatePortfolioPage.ts

import { Page, Locator, expect } from '@playwright/test';
import { ImportDataTab } from '@components/ImportData';
import { EditSettings } from '@components/EditSettings';
import { HomePage } from './HomePage';
import { PortfolioList } from '@components/PortfolioList';
import { ENV } from 'playwright.config';
import { testConfig } from 'testConfig';

export class CreatePortfolioPage {
  readonly page: Page;
  private _homePage: HomePage | null = null;
  private _portfolioList: PortfolioList | null = null;
  private _importDataTab: ImportDataTab | null = null;
  private _editSettingsTab: EditSettings | null = null;

  readonly Title: Locator;
  readonly ImportData: Locator;
  readonly EditSettings: Locator;
  readonly CancelButton: Locator;
  readonly NextButton: Locator;
  readonly CreateButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.Title = page.getByTestId('create-portfolio-title');
    this.ImportData = page.getByRole('tab', { name: 'Import Data' });
    this.EditSettings = page.getByRole('tab', { name: 'Edit Settings' });
    this.NextButton = page.getByTestId('create-portfolio-next-button');
    // this.NextButton = page.getByRole('button', { name: 'Next' });
    this.CancelButton = page.getByTestId('create-edit-portfolio-cancel-button');
    // this.CancelButton = page.getByRole('button', { name: 'Cancel' });
    this.CreateButton = page.getByTestId('create-portfolio-create-button');
    // this.CreateButton = page.getByRole('button', { name: 'Create' });
  }

  get homePage() {
    if (!this._homePage) {
      this._homePage = new HomePage(this.page);
    }
    return this._homePage;
  }

  get portfolioList() {
    if (!this._portfolioList) {
      this._portfolioList = new PortfolioList(this.page);
    }
    return this._portfolioList;
  }

  get importDataTab() {
    if (!this._importDataTab) {
      this._importDataTab = new ImportDataTab(this.page);
    }
    return this._importDataTab;
  }

  get editSettingsTab() {
    if (!this._editSettingsTab) {
      this._editSettingsTab = new EditSettings(this.page);
    }
    return this._editSettingsTab;
  }

  async navigateByURL() {
    await this.page.goto('/create-portfolio');
    await this.page.waitForLoadState('load');
  }

  async validateControls() {
    await this.page.waitForLoadState('load');
    await expect(this.Title).toBeVisible();
    await expect(this.CancelButton).toBeVisible();
    await expect(this.NextButton).toBeDisabled();
    await expect(this.ImportData).toBeVisible();
    await expect(this.EditSettings).toBeVisible();
  }

  async createPortfolio_PSEi_UploadCsv(
    fileName: string,
    dataSetVersion?: string,
  ) {
    const envUrl = testConfig[ENV].appUrl;
    await this.navigateByURL();
    await this.importDataTab.uploadLocationsAndNavigateToEditSettingsTab(
      fileName,
    );
    const portfolioName = await this.editSettingsTab.setPortfolioName();
    const categoryName = await this.editSettingsTab.setCategory();
    await this.editSettingsTab.setDataVersion(dataSetVersion);
    await this.editSettingsTab.selectPerilScoresAndEconomicImpactType();
    await expect(this.editSettingsTab.CreateButton).toBeVisible();
    await this.editSettingsTab.CreateButton.click();
    await this.editSettingsTab.CreatingProgressText.waitFor({
      state: 'hidden',
    });
    expect(this.page.url()).toMatch(envUrl);
    await expect(
      this.portfolioList.PortfolioList.getByRole('heading', {
        name: portfolioName,
      }),
    ).toBeVisible();
    await expect(this.portfolioList.PortfolioList).toContainText(categoryName);
    return {
      portfolioName,
      categoryName,
      dataSetVersion,
    };
  }

  async createPortfolio_PS_UploadCsv(
    fileName: string,
    dataSetVersion?: string,
  ) {
    const envUrl = testConfig[ENV].appUrl;
    await this.navigateByURL();
    await this.importDataTab.uploadLocationsAndNavigateToEditSettingsTab(
      fileName,
    );
    const portfolioName = await this.editSettingsTab.setPortfolioName();
    const categoryName = await this.editSettingsTab.setCategory();
    await this.editSettingsTab.setDataVersion(dataSetVersion);
    await this.editSettingsTab.selectPerilsScoresType();
    await expect(this.editSettingsTab.CreateButton).toBeVisible();
    await this.editSettingsTab.CreateButton.click();
    await this.editSettingsTab.CreatingProgressText.waitFor({
      state: 'hidden',
    });
    expect(this.page.url()).toMatch(envUrl);
    await expect(
      this.portfolioList.PortfolioList.getByRole('heading', {
        name: portfolioName,
      }),
    ).toBeVisible();
    await expect(this.portfolioList.PortfolioList).toContainText(categoryName);
    return {
      portfolioName,
      categoryName,
      dataSetVersion,
    };
  }

  async createPortfolio_PS_EnterCoordinates(
    coordinates: string,
    dataSetVersion: string,
  ) {
    const envUrl = testConfig[ENV].appUrl;
    await this.navigateByURL();
    await this.importDataTab.enterInputAndNavigateToEditSettingsTab(
      coordinates,
    );
    const portfolioName = await this.editSettingsTab.setPortfolioName();
    const categoryName = await this.editSettingsTab.setCategory();
    await this.editSettingsTab.setDataVersion(dataSetVersion);
    await this.editSettingsTab.selectPerilsScoresType();
    await expect(this.editSettingsTab.CreateButton).toBeVisible();
    await this.editSettingsTab.CreateButton.click();
    await this.editSettingsTab.CreatingProgressText.waitFor({
      state: 'hidden',
    });
    expect(this.page.url()).toMatch(envUrl);
    await expect(
      this.portfolioList.PortfolioList.getByRole('heading', {
        name: portfolioName,
      }),
    ).toBeVisible();
    await expect(this.portfolioList.PortfolioList).toContainText(categoryName);
    return {
      portfolioName,
      categoryName,
      dataSetVersion,
    };
  }

  async createPortfolio_PS_FloodMesh_UploadCsv(
    fileName: string,
    dataSetVersion: string,
  ) {
    const envUrl = testConfig[ENV].appUrl;
    await this.navigateByURL();
    await this.importDataTab.uploadLocationsAndNavigateToEditSettingsTab(
      fileName,
    );
    const portfolioName =
      await this.editSettingsTab.setPortfolioNameFloodMesh(dataSetVersion);
    const categoryName = await this.editSettingsTab.setCategory();
    await this.editSettingsTab.setDataVersion(dataSetVersion);
    await this.editSettingsTab.selectCustomType();
    await this.editSettingsTab.setFloodMesh();
    await expect(this.editSettingsTab.CreateButton).toBeVisible();
    await this.editSettingsTab.CreateButton.click();
    await this.editSettingsTab.CreatingProgressText.waitFor({
      state: 'hidden',
    });
    expect(this.page.url()).toMatch(envUrl);
    await expect(
      this.portfolioList.PortfolioList.getByRole('heading', {
        name: portfolioName,
      }),
    ).toBeVisible();
    await expect(this.portfolioList.PortfolioList).toContainText(categoryName);
    return {
      portfolioName,
      categoryName,
      dataSetVersion,
    };
  }

  async createPortfolio_PerilsScoresEconomicImpact(
    fileName: string,
    dataSetVersion: string,
    categoryName: string,
    portfolioName: string,
  ) {
    const envUrl = testConfig[ENV].appUrl;
    await this.navigateByURL();
    await this.importDataTab.uploadLocationsAndNavigateToEditSettingsTab(
      fileName,
    );
    await this.editSettingsTab.setSpecificPortfolioName(portfolioName);
    await this.editSettingsTab.setSpecificCategory(categoryName);
    await this.editSettingsTab.setDataVersion(dataSetVersion);
    await this.editSettingsTab.selectPerilScoresAndEconomicImpactType();
    await expect(this.editSettingsTab.CreateButton).toBeVisible();
    await this.editSettingsTab.CreateButton.click();
    await this.editSettingsTab.CreatingProgressText.waitFor({
      state: 'hidden',
    });
    expect(this.page.url()).toMatch(envUrl);
    await expect(
      this.portfolioList.PortfolioList.getByRole('heading', {
        name: portfolioName,
      }),
    ).toBeVisible();
    await expect(this.portfolioList.PortfolioList).toContainText(categoryName);
  }

  async createPortfolio_PerilsScores(
    fileName: string,
    dataSetVersion: string,
    categoryName: string,
    portfolioName: string,
  ) {
    const envUrl = testConfig[ENV].appUrl;
    await this.navigateByURL();
    await this.importDataTab.uploadLocationsAndNavigateToEditSettingsTab(
      fileName,
    );
    await this.editSettingsTab.setSpecificPortfolioName(portfolioName);
    await this.editSettingsTab.setSpecificCategory(categoryName);
    await this.editSettingsTab.setDataVersion(dataSetVersion);
    await this.editSettingsTab.selectPerilsScoresType();
    await expect(this.editSettingsTab.CreateButton).toBeVisible();
    await this.editSettingsTab.CreateButton.click();
    await this.editSettingsTab.CreatingProgressText.waitFor({
      state: 'hidden',
    });
    expect(this.page.url()).toMatch(envUrl);
    await expect(
      this.portfolioList.PortfolioList.getByRole('heading', {
        name: portfolioName,
      }),
    ).toBeVisible();
    await expect(this.portfolioList.PortfolioList).toContainText(categoryName);
  }

  async createPortfolio_PerilsScores_FloodMesh(
    fileName: string,
    dataSetVersion: string,
    categoryName: string,
    portfolioName: string,
  ) {
    const envUrl = testConfig[ENV].appUrl;
    await this.navigateByURL();
    await this.importDataTab.uploadLocationsAndNavigateToEditSettingsTab(
      fileName,
    );
    await this.editSettingsTab.setSpecificPortfolioName(portfolioName);
    await this.editSettingsTab.setSpecificCategory(categoryName);
    await this.editSettingsTab.setDataVersion(dataSetVersion);
    await this.editSettingsTab.selectCustomType();
    await this.editSettingsTab.setFloodMesh();
    await expect(this.editSettingsTab.CreateButton).toBeVisible();
    await this.editSettingsTab.CreateButton.click();
    await this.editSettingsTab.CreatingProgressText.waitFor({
      state: 'hidden',
    });
    expect(this.page.url()).toMatch(envUrl);
    await expect(
      this.portfolioList.PortfolioList.getByRole('heading', {
        name: portfolioName,
      }),
    ).toBeVisible();
    await expect(this.portfolioList.PortfolioList).toContainText(categoryName);
  }

  async createPortfolio_PerilsScoresDisclosure(
    fileName: string,
    dataSetVersion: string,
    categoryName: string,
    portfolioName: string,
  ) {
    const envUrl = testConfig[ENV].appUrl;
    await this.navigateByURL();
    await this.importDataTab.uploadLocationsAndNavigateToEditSettingsTab(
      fileName,
    );
    await this.editSettingsTab.setSpecificPortfolioName(portfolioName);
    await this.editSettingsTab.setSpecificCategory(categoryName);
    await this.editSettingsTab.enableDisclosure();
    await this.editSettingsTab.setDataVersion(dataSetVersion);
    await this.editSettingsTab.selectPerilsScoresType();
    await expect(this.editSettingsTab.CreateButton).toBeVisible();
    await this.editSettingsTab.CreateButton.click();
    await this.editSettingsTab.CreatingProgressText.waitFor({
      state: 'hidden',
    });
    expect(this.page.url()).toMatch(envUrl);
    await expect(
      this.portfolioList.PortfolioList.getByRole('heading', {
        name: portfolioName,
      }),
    ).toBeVisible();
    await expect(this.portfolioList.PortfolioList).toContainText(categoryName);
  }

  async createPortfolio_PerilsScoresEconomicImpactDisclosure(
    fileName: string,
    dataSetVersion: string,
    categoryName: string,
    portfolioName: string,
  ) {
    const envUrl = testConfig[ENV].appUrl;
    await this.navigateByURL();
    await this.importDataTab.uploadLocationsAndNavigateToEditSettingsTab(
      fileName,
    );
    await this.editSettingsTab.setSpecificPortfolioName(portfolioName);
    await this.editSettingsTab.setSpecificCategory(categoryName);
    await this.editSettingsTab.enableDisclosure();
    await this.editSettingsTab.setDataVersion(dataSetVersion);
    await this.editSettingsTab.selectPerilScoresAndEconomicImpactType();
    await expect(this.editSettingsTab.CreateButton).toBeVisible();
    await this.editSettingsTab.CreateButton.click();
    await this.editSettingsTab.CreatingProgressText.waitFor({
      state: 'hidden',
    });
    expect(this.page.url()).toMatch(envUrl);
    await expect(
      this.portfolioList.PortfolioList.getByRole('heading', {
        name: portfolioName,
      }),
    ).toBeVisible({ timeout: 70000 });
    await expect(this.portfolioList.PortfolioList).toContainText(categoryName);
  }
}
