// tests/ui/components/PortfolioItem.ts

import { Page, Locator,expect } from '@playwright/test';
import { PortfolioItemMenuDropDown } from './PortfolioItemMenuDropDown';
import { PortfolioList } from './PortfolioList';
import { HomePage } from '@pages/HomePage';

export class PortfolioItem {
  readonly analysisTypePendingText: string;
  readonly page: Page;
  readonly homePage: HomePage;
  readonly portfolioList: PortfolioList;
  readonly portfolioItemMenuDropDown: PortfolioItemMenuDropDown;
  readonly PortfolioItemInfo: Locator;
  readonly PortfolioName: Locator;
  readonly CategoryName: Locator;
  readonly AnalysisType: Locator;
  readonly CreationDate: Locator;
  readonly CreationDateLoadingText: Locator;
  readonly CreationDateProgressIcon: Locator;
  readonly CreationDateLoadingWaitTime: Locator;
  readonly LocationsQty: Locator;
  readonly Menu: Locator;
  readonly loadingSpinner: Locator;
  readonly PortfolioContextMenu: Locator;
  readonly DeleteModal: Locator;

  constructor(page: Page) {
    this.analysisTypePendingText = 'Pending';
    this.page = page;
    this.portfolioItemMenuDropDown = new PortfolioItemMenuDropDown(page);
    this.portfolioList = new PortfolioList(page);
    this.homePage = new HomePage(page);
    this.loadingSpinner = page
      .getByTestId('loading-spinner')
      .locator('[role="progressbar"]');
    this.PortfolioItemInfo = page.getByTestId('portfolio-item-info');
    this.PortfolioName = page.getByTestId('portfolio-item-name');
    this.CategoryName = page.getByTestId('portfolio-item-category');
    this.AnalysisType = page.getByTestId('portfolio-item-analysis-type'); // also used for Pending
    this.CreationDate = page.getByTestId('portfolio-item-created-at-date');
    this.CreationDateLoadingText = page.getByTestId(
      'portfolio-item-loading-text',
    );
    this.CreationDateProgressIcon = page.getByTestId(
      'portfolio-item-loading-progress-icon',
    );
    this.CreationDateLoadingWaitTime = page.getByTestId(
      'portfolio-item-loading-estimated-time-text',
    );
    this.LocationsQty = page.getByTestId('portfolio-item-location-qty');
    this.Menu = page.getByTestId('portfolio-item-menu-icon');
    this.PortfolioContextMenu = page.getByRole('menu');
    this.DeleteModal = page.getByTestId('confirm-modal-box');
  }

  async validateControls() {
    await this.page.waitForLoadState('load');
    await expect(this.PortfolioItemInfo).toBeVisible();
    await expect(this.PortfolioName).toBeVisible();
    await expect(this.AnalysisType).toBeVisible();
    await expect(this.CategoryName).toBeVisible();
    await expect(this.CreationDateLoadingText).toBeVisible();
    await expect(this.CreationDateLoadingWaitTime).toBeVisible();
    await expect(this.CreationDateProgressIcon).toBeVisible();
    await expect(this.LocationsQty).toBeVisible();
    await expect(this.Menu).toBeVisible();
  }

  async validateCompletedResultSetControls() {
    await this.page.waitForLoadState('load');
    await expect(this.PortfolioItemInfo).toBeVisible();
    await expect(this.PortfolioName).toBeVisible();
    await expect(this.CategoryName).toBeVisible();
    await expect(this.AnalysisType).toBeVisible();
    await expect(this.CreationDate).toBeVisible();
    await expect(this.LocationsQty).toBeVisible();
    await expect(this.Menu).toBeVisible();
  }

  async clickOnMenu() {
    await expect(this.Menu).toBeVisible();
    await this.Menu.click();
    await expect(this.portfolioItemMenuDropDown.List).toBeVisible();
  }

  async waitForResultSet() {
    const TIMEOUT = 600000; // Timeout in milliseconds (600000ms = 10 minutes)
    await this.CreationDateLoadingText.waitFor({
      state: 'hidden',
      timeout: TIMEOUT,
    });
    await this.CreationDateLoadingWaitTime.waitFor({
      state: 'hidden',
      timeout: TIMEOUT,
    });
    await this.CreationDateProgressIcon.waitFor({
      state: 'hidden',
      timeout: TIMEOUT,
    });
  }

  async deletePortfolio(portfolioName: string) {
    // Search for the portfolio by name
    await this.portfolioList.searchBy(portfolioName);

    // Check if the portfolio exists by inspecting the text of the results quantity
    try {
      const isPortfolioVisible = await this.PortfolioName.isVisible();



      if (isPortfolioVisible) {

        // await this.PortfolioName.click();
        if (
          !(await this.portfolioItemMenuDropDown.PortfolioContextMenu.isVisible())
        ) {
          await this.clickOnMenu();
        }
        await this.portfolioItemMenuDropDown.clickOnDelete();
        await this.portfolioItemMenuDropDown.confirmDelete();
        await this.DeleteModal.waitFor({ state: 'hidden' });
        const qty0Text = 'Showing 0 Results';
        await this.portfolioList.searchBy(portfolioName);
        await expect(this.PortfolioItemInfo).not.toBeVisible();
        await expect(this.portfolioList.PortfolioListResultsQty).toHaveText(
          qty0Text,
        );
      } else if (!isPortfolioVisible) {

      }
    } catch (error) {

    }
  }
}
