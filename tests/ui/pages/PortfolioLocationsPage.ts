// tests/ui/pages/PortfolioLocationsPage.ts

import { Page, Locator,expect } from '@playwright/test';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { SingleLocationHeader } from '@components/SingleLocationHeader';
import { testConfig } from 'testConfig';
import { ENV } from 'playwright.config';
import { waitForContentLoaded } from '@utils/helpers';

const envUrl = testConfig[ENV].appUrl;

export class PortfolioLocationsPage {
  readonly page: Page;
  readonly portfolioHeader: PortfolioHeader;
  readonly singleLocationHeader: SingleLocationHeader;

  readonly PortfolioLocationsBody: Locator;
  readonly PortfolioLocationsMap: Locator;
  readonly PortfolioLocationsList: Locator;
  readonly ShowingQtyResults: Locator;
  readonly Search: Locator;
  readonly SearchInput: Locator;
  readonly SearchIcon: Locator;
  readonly SearchButton: Locator;
  readonly SearchClearIcon: Locator;
  readonly LocationsResultList: Locator;
  readonly LocationsResultItemList: Locator;
  readonly LocationsItemList: Locator;
  readonly PortfolioLocationsListBlock: Locator;
  readonly LocationsItem: Locator;
  readonly LocationsItemId: Locator;
  readonly LocationsItemData: Locator;
  readonly LocationsItemName: Locator;
  readonly LocationsItemCoordinates: Locator;
  readonly LocationsItemArrowButton: Locator;
  readonly LocationsItemArrowIcon: Locator;

  constructor(page: Page) {
    this.page = page;
    this.portfolioHeader = new PortfolioHeader(page);
    this.singleLocationHeader = new SingleLocationHeader(page);

    this.PortfolioLocationsBody = page.getByTestId('portfolio-locations-body');
    this.PortfolioLocationsMap = page.getByTestId('portfolio-locations-map');
    this.PortfolioLocationsList = page.getByTestId('portfolio-locations-list');
    this.PortfolioLocationsListBlock = page.getByTestId(
      'portfolio-locations-list-block',
    );
    this.ShowingQtyResults = page.getByTestId(
      'portfolio-locations-showing-qty-label',
    );
    this.Search = page.getByTestId('portfolio-locations-search');
    this.SearchInput = page
      .getByTestId('portfolio-locations-search')
      .locator('input');
    this.SearchButton = page.getByTestId(
      'portfolio-locations-search-clear-button',
    );
    this.SearchIcon = page.getByTestId('portfolio-locations-search-icon');
    this.SearchClearIcon = page.getByTestId(
      'portfolio-locations-search-clear-icon',
    );
    this.LocationsResultList = page.getByTestId(
      'portfolio-locations-result-list',
    );
    this.LocationsResultItemList = page.getByTestId(
      'portfolio-locations-result-item-list',
    );
    this.LocationsItemList = page.getByTestId('virtuoso-item-list');
    this.LocationsItem = page.getByTestId('portfolio-locations-item');
    this.LocationsItemId = page.getByTestId('portfolio-locations-item-id');
    this.LocationsItemData = page.getByTestId('portfolio-locations-item-data');
    this.LocationsItemName = page.getByTestId('portfolio-locations-item-name');
    this.LocationsItemCoordinates = page.getByTestId(
      'portfolio-locations-item-coordinates',
    );
    this.LocationsItemArrowButton = page.getByTestId(
      'portfolio-locations-item-arrow-button',
    );
    this.LocationsItemArrowIcon = page.getByTestId(
      'portfolio-locations-item-arrow-icon',
    );
  }
  async navigateByURL(portfolioId: string) {
    const portfolioLocationsPageUrl = `${envUrl}/portfolios/${portfolioId}/locations`;
    await this.page.goto(portfolioLocationsPageUrl);
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);
    await expect(this.portfolioHeader.LocationsTab).toBeVisible();
    await expect(this.PortfolioLocationsBody).toBeVisible();
  }

  async validateControls() {
    await waitForContentLoaded(this.page);
    await this.page.waitForLoadState('load');
    await expect(this.PortfolioLocationsBody).toBeVisible();
    await expect(this.PortfolioLocationsMap).toBeVisible();
    await expect(this.PortfolioLocationsList).toBeVisible();
    await expect(this.ShowingQtyResults).toBeVisible();
    await expect(this.Search).toBeVisible();
    await expect(this.SearchButton).toBeVisible();
    await expect(this.SearchIcon).toBeVisible();
    await expect(this.SearchClearIcon).toBeVisible();
    await expect(this.LocationsResultList).toBeVisible();
    await expect(this.LocationsItem.first()).toBeVisible();
    await expect(this.LocationsItemId.first()).toBeVisible();
    await expect(this.LocationsItemData.first()).toBeVisible();
    await expect(this.LocationsItemName.first()).toBeVisible();
    await expect(this.LocationsItemCoordinates.first()).toBeVisible();
    await expect(this.LocationsItemArrowButton.first()).toBeVisible();
    await expect(this.LocationsItemArrowIcon.first()).toBeVisible();
  }

  async searchLocationBy(searchPhrase: string) {
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);
    await expect(this.SearchInput).toBeVisible();
    await this.SearchInput.clear();
    await this.SearchInput.fill(searchPhrase);
    await expect(this.SearchInput).toHaveValue(searchPhrase);
  }

  async clickOnSingleLocation() {
    // Ensure the arrow button is visible and click it
    await expect(this.LocationsItemArrowButton).toBeVisible();
    await this.LocationsItemArrowButton.click();

    // Wait for the page to load
    await this.page.waitForLoadState('load');
    await waitForContentLoaded(this.page);

    // Ensure the LocationsTab is no longer visible, and HazardTab is visible
    await expect(this.portfolioHeader.LocationsTab).not.toBeVisible();
    await expect(this.singleLocationHeader.HazardTab).toBeVisible();
  }

  async findAndProceedToLocationById(
    locationId: string,
    locationName?: string,
  ) {
    const showingQtyResults = `Showing 1 Results`;

    // Perform search by location ID
    await this.searchLocationBy(locationId);

    // Check that the location name is visible
    await expect(
      this.LocationsItemId.filter({
        hasText: `Location ID: ${locationId}`,
      }),
    ).toBeVisible();

    // Check that the location name is contained in the results
    await expect(this.LocationsItemId).toContainText(locationId);

    // Check that the search result shows the correct quantity
    await expect(this.ShowingQtyResults).toContainText(showingQtyResults);

    // Ensure only one result is shown
    const locationsCount = await this.LocationsItem.count();
    expect(locationsCount).toBe(1);

    // Example: Additional verification based on the optional locationId
    if (locationName) {
      // Perform the verification only if locationId is provided
      await expect(
        this.LocationsItemName.filter({
          hasText: `Name: ${locationName}`,
        }),
      ).toBeVisible();
    }

    await this.clickOnSingleLocation();
  }

  async findAndProceedToLocationByName(
    locationName: string,
    locationId?: string,
  ) {
    const showingQtyResults = `Showing 1 Results`;

    // Perform search by location name
    await this.searchLocationBy(locationName);

    // Check that the location name is visible
    await expect(
      this.LocationsItemName.filter({
        hasText: `Name: ${locationName}`,
      }),
    ).toBeVisible();

    // Check that the location name is contained in the results
    await expect(this.LocationsItemName).toContainText(locationName);

    // Check that the search result shows the correct quantity
    await expect(this.ShowingQtyResults).toContainText(showingQtyResults);

    // Ensure only one result is shown
    const locationsCount = await this.LocationsItem.count();
    expect(locationsCount).toBe(1);

    // Example: Additional verification based on the optional locationId
    if (locationId) {
      // Perform the verification only if locationId is provided
      await expect(
        this.LocationsItemId.filter({
          hasText: `Location ID: ${locationId}`,
        }),
      ).toBeVisible();
    }
    await this.clickOnSingleLocation();
  }

  async findAndProceedToLocation(locationsData: any[]) {
    const showingQtyResults = `Showing 1 Results`;

    // Find the first non-empty location directly within the test
    const location = locationsData.find(
      (loc) => loc.locationName && loc.locationName.trim() !== '',
    );

    // Check if a valid location is found
    if (!location) {
      throw new Error('No valid location names found in the dataset.');
    }

    // Extract the locationName and locationId from the location
    const { locationName, locationId } = location;

    // Perform search by location name
    await this.searchLocationBy(locationName);

    // Check that the location name is visible
    await expect(
      this.LocationsItemName.filter({
        hasText: `Name: ${locationName}`,
      }),
    ).toBeVisible();

    // Check that the location name is contained in the results
    await expect(this.LocationsItemName).toContainText(locationName);

    // Check that the search result shows the correct quantity
    await expect(this.ShowingQtyResults).toContainText(showingQtyResults);

    // Ensure only one result is shown
    const locationsCount = await this.LocationsItem.count();
    expect(locationsCount).toBe(1);

    // Additional verification: Check the location ID if needed
    await expect(
      this.LocationsItemId.filter({
        hasText: `Location ID: ${locationId}`,
      }),
    ).toBeVisible();
    await this.clickOnSingleLocation();
  }
}
