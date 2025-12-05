// tests/ui/components/PortfolioInformation.ts

import { Page, Locator,expect } from '@playwright/test';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { PortfolioOverviewPage } from '@pages/PortfolioOverviewPage';

import { waitForContentLoaded } from '@utils/helpers';
 const LAUNCH_VISIBLE_TIMEOUT = 30000

export class PortfolioInformation {
  readonly page: Page;
  readonly portfolioItem: PortfolioItem;
  readonly portfolioHeader: PortfolioHeader;
  readonly portfolioOverviewPage: PortfolioOverviewPage;
  readonly PortfolioDetailsHeader: Locator;
  readonly PortfolioName: Locator;
  readonly AnalysisType: Locator;
  readonly LocationsQty: Locator;
  readonly ExportArrow: Locator;
  readonly ExportButton: Locator;
  readonly LaunchButton: Locator;
  readonly Params: Locator;
  readonly ParamsDataLabel: Locator;
  readonly ParamsDataValue: Locator;
  readonly PerilParams: Locator;
  readonly PerilParamsTitle: Locator;
  readonly ScoresParams: Locator;
  readonly ScoresParamsTitle: Locator;
  readonly EiParams: Locator;
  readonly EiParamsTitle: Locator;
  readonly Map: Locator;
  readonly MapControls: Locator;
  readonly ExportMenu: Locator;

  constructor(page: Page) {
    this.page = page;
    this.portfolioItem = new PortfolioItem(page);
    this.portfolioOverviewPage = new PortfolioOverviewPage(page);
    this.portfolioHeader = new PortfolioHeader(page);
    this.PortfolioDetailsHeader = page.getByTestId('portfolio-details-header');
    this.PortfolioName = page.getByTestId('portfolio-details-portfolio-name');
    this.AnalysisType = page.getByTestId(
      'portfolio-details-portfolio-analysis-type',
    ); // also used for Pending
    this.LocationsQty = page.getByTestId('portfolio-details-location-qty');
    this.LaunchButton = page.getByTestId('portfolio-details-launch-button');
    this.ExportArrow = page.getByTestId('portfolio-details-export-arrow');
    this.ExportButton = page.getByTestId('portfolio-details-export-button');
    this.Params = page.getByTestId('portfolio-details-params');
    this.PerilParams = page.getByTestId('portfolio-details-params-perils');
    this.PerilParamsTitle = page.getByTestId(
      'portfolio-details-params-perils-title',
    );
    this.ParamsDataLabel = page.getByTestId(
      'portfolio-details-params-data-label',
    );
    this.ParamsDataValue = page.getByTestId(
      'portfolio-details-params-data-value',
    );
    this.ScoresParams = page.getByTestId('portfolio-details-params-scores');
    this.ScoresParamsTitle = page.getByTestId(
      'portfolio-details-params-scores-title',
    );
    this.EiParams = page.getByTestId(
      'portfolio-details-params-economic-impact',
    );
    this.EiParamsTitle = page.getByTestId(
      'portfolio-details-params-economic-impact-title',
    );
    this.Map = page.getByTestId('mapboxgl-map');
    this.MapControls = page.getByTestId('map-controls');
    this.ExportMenu = page.getByTestId('portfolio-details-export-menu');
  }

  async validatePendingControls() {
    await this.page.waitForLoadState('load');
    await expect(this.PortfolioDetailsHeader).toBeVisible();
    await expect(this.PortfolioName).toBeVisible();
    await expect(this.AnalysisType).toBeVisible();
    await expect(this.AnalysisType).toHaveText('Pending');
    await expect(this.LocationsQty).toBeVisible();
    await expect(this.ExportButton).toBeVisible();
    await expect(this.LaunchButton).toBeDisabled();
    await expect(this.Params).toBeVisible();
    await expect(this.Map).toBeVisible();
    await expect(this.MapControls).toBeVisible();
  }

  async validateCompletedControls(analysisTypeFull: string) {
    await this.page.waitForLoadState('load');
    await expect(this.PortfolioDetailsHeader).toBeVisible();
    await expect(this.PortfolioName).toBeVisible();
    await expect(this.AnalysisType).toBeVisible();
    await expect(this.AnalysisType).toHaveText(analysisTypeFull);
    await expect(this.LocationsQty).toBeVisible();
    await expect(this.ExportButton).toBeVisible();
    await expect(this.LaunchButton).toBeVisible();
    await expect(this.Params).toBeVisible();
    await expect(this.Map).toBeVisible();
    await expect(this.MapControls).toBeVisible();
  }

  async waitForResultSet() {
    const TIMEOUT = 900000; // Timeout in milliseconds (900000ms = 15 minutes)
    await this.portfolioItem.CreationDateLoadingText.waitFor({
      state: 'hidden',
      timeout: TIMEOUT,
    });
    await this.portfolioItem.CreationDateLoadingWaitTime.waitFor({
      state: 'hidden',
      timeout: TIMEOUT,
    });
    await this.portfolioItem.CreationDateProgressIcon.waitFor({
      state: 'hidden',
      timeout: TIMEOUT,
    });
  }

  async clickOnExportMenu() {
    await expect(this.ExportButton).toBeVisible();
    await this.ExportButton.click();
    await expect(this.ExportMenu).toBeVisible();
  }

  async clickOnLaunchButton() {
    await expect(this.LaunchButton).toBeVisible({timeout:LAUNCH_VISIBLE_TIMEOUT});
    await this.LaunchButton.click();
    await expect(this.portfolioHeader.OverviewTab).toBeVisible();
    await waitForContentLoaded(this.page);
  }
}
