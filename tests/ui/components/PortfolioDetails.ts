// tests/ui/components/PortfolioDetails.ts

import { Page, Locator,expect } from '@playwright/test';

export class PortfolioDetails {
  readonly page: Page;
  readonly PortfolioDetails: Locator;
  readonly PortfolioDetailsHeader: Locator;
  readonly PortfolioDetailsParams: Locator;
  readonly PortfolioDetailsMap: Locator;

  constructor(page: Page) {
    this.page = page;
    this.PortfolioDetails = page.getByTestId('portfolio-details');
    this.PortfolioDetailsHeader = page.getByTestId('portfolio-details-header');
    this.PortfolioDetailsParams = page.getByTestId('portfolio-details-params');
    this.PortfolioDetailsMap = page.getByTestId('portfolio-item-map');
  }

  async validateControls() {
    await this.page.waitForLoadState('load');
    await expect(this.PortfolioDetails).toBeVisible();
    await expect(this.PortfolioDetailsHeader).toBeVisible();
    await expect(this.PortfolioDetailsParams).toBeVisible();
    await expect(this.PortfolioDetailsMap).toBeVisible();
  }

  async launchPortfolio() {
    await this.page.waitForLoadState('load');
  }
}
