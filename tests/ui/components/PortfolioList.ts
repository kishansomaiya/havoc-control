// tests/ui/components/PortfolioList.ts

import { Page, Locator,expect } from '@playwright/test';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { waitForContentLoaded } from '@utils/helpers';

export class PortfolioList {
  readonly page: Page;
  readonly YourPortfolios: Locator;
  readonly CreatePortfolioButton: Locator;
  readonly PortfolioList: Locator;
  readonly portfolioItem: PortfolioItem;
  readonly portfolioInformation: PortfolioInformation;
  readonly PortfolioListResultsQty: Locator;
  readonly SearchInput: Locator;
  readonly SearchIcon: Locator;
  readonly SearchClearIcon: Locator;
  readonly MyPortfoliosTab: Locator;
  readonly PortfolioCategoriesTabItem: Locator;
  readonly PortfoliosSharedWithMeTab: Locator;
  readonly MyTeamsPortfoliosTab: Locator;

  constructor(page: Page) {
    this.page = page;
    this.YourPortfolios = page.getByRole('heading', {
      name: 'Your Portfolios',
    });
    this.CreatePortfolioButton = page.getByTestId('create-portfolio-button');
    this.PortfolioList = page.getByTestId('portfolio-list');
    this.PortfolioListResultsQty = page.getByTestId(
      'portfolio-list-results-qty',
    );
    this.SearchInput = page
      .getByTestId('portfolio-list-search-field')
      .locator('input');
    this.SearchIcon = page.getByTestId('portfolio-list-search-icon');
    this.SearchClearIcon = page.getByTestId('portfolio-list-search-clear-icon');
    this.MyPortfoliosTab = page.getByTestId(
      'portfolio-category-tab-myPortfolios',
    );
    this.PortfoliosSharedWithMeTab = page.getByTestId(
      'portfolio-category-tab-portfoliosSharedWithMe',
    );
    this.MyTeamsPortfoliosTab = page.getByTestId(
      'portfolio-category-tab-myTeamsPortfolios',
    );
  }

  async validateControls() {
    await this.page.waitForLoadState('load');
    await expect(this.YourPortfolios).toBeVisible();
    await expect(this.CreatePortfolioButton).toBeVisible();
    await expect(this.PortfolioListResultsQty).toBeVisible();
    await expect(this.PortfolioList).toBeVisible();
  }

  async validateSearchControls() {
    const placeholder = await this.SearchInput.getAttribute('placeholder');
    await expect(this.SearchInput).toBeVisible();
    expect(placeholder).toBe('Search');
    await expect(this.SearchIcon).toBeVisible();
    await expect(this.SearchClearIcon).toBeVisible();
    await expect(this.PortfolioListResultsQty).toBeVisible();
    await expect(this.SearchInput).toBeVisible();
    await expect(this.PortfolioList).toBeVisible();
  }

  async searchBy(searchPhrase: string) {
    // Wait for page to be ready
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);

    // Ensure search input is visible and ready
    await expect(this.SearchInput).toBeVisible();
    await expect(this.SearchInput).toBeEditable();

    // More reliable input clearing using triple-click + type
    await this.SearchInput.click({ clickCount: 3 });
    await this.SearchInput.fill(searchPhrase);

    // Verify the input was filled correctly
    await expect(this.SearchInput).toHaveValue(searchPhrase);

    // Wait for search debouncing and results to update
    // Most search UIs have ~300-500ms debouncing
    await this.page.waitForTimeout(500);

    // Wait for search results to be processed
    await waitForContentLoaded(this.page, 'portfolio-loading-spinner');

    // Additional verification that results have updated
    await expect(this.PortfolioListResultsQty).toBeVisible();
  }

  // Advanced version with retry logic for flaky environments
  async searchByWithRetry(searchPhrase: string, maxRetries: number = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Wait for page to be ready
        await this.page.waitForLoadState('load');
        await waitForContentLoaded(this.page);

        // Ensure search input is visible and ready
        await expect(this.SearchInput).toBeVisible({ timeout: 10000 });
        await expect(this.SearchInput).toBeEditable();

        // Clear input using multiple strategies for maximum reliability
        await this.SearchInput.focus();
        await this.page.keyboard.press('Control+a');
        await this.page.keyboard.press('Delete');
        await this.SearchInput.fill(searchPhrase);

        // Verify the input was filled correctly with retry
        await expect(this.SearchInput).toHaveValue(searchPhrase, {
          timeout: 5000,
        });

        // Wait for search debouncing
        await this.page.waitForTimeout(750);

        // Wait for search results to be processed
        await waitForContentLoaded(this.page);

        // Check if portfolio list is visible before strict verification
        const isPortfolioListVisible = await this.PortfolioList.isVisible();

        if (isPortfolioListVisible) {
          await expect(
            this.PortfolioList.getByTestId('portfolio-item-name')
              .getByText(searchPhrase, {exact: true})
              .first(),
          ).toBeVisible();
        } else {
          // If portfolio list is not visible, just verify the results quantity element exists
          // This is a more lenient check for cases where no results are expected
          await expect(this.PortfolioListResultsQty).toBeVisible({
            timeout: 5000,
          });
        }

        // If we get here, the search was successful
        return;
      } catch (error) {
        if (attempt === maxRetries) {
          throw new Error(
            `Search failed after ${maxRetries} attempts: ${error.message}`,
          );
        }

        // Log attempt failure and wait before retry

        await this.page.waitForTimeout(1000);
      }
    }
  }
}
