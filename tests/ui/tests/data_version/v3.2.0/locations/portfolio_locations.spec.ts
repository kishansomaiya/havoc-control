// tests/ui/tests/portfolioLocations.authenticated.spec.ts
// import { test as baseTest, expect } from '@playwright/test';
import { extendedTest, expect } from '@utils/authFixture';
import { Map } from '@components/Map';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { PortfolioList } from '@components/PortfolioList';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { waitForContentLoaded } from '@utils/helpers';
import { PortfolioLocationsPage } from '@pages/PortfolioLocationsPage';
import { HomePage } from '@pages/HomePage';
import * as path from 'path';
import { parseCsvFile } from '@utils/parseCsvFile';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const TIMEOUT = 300000;

const test = extendedTest.extend<{
  createPortfolioPage: CreatePortfolioPage;
  portfolioList: PortfolioList;
  portfolioItem: PortfolioItem;
  portfolioInformation: PortfolioInformation;
  portfolioHeader: PortfolioHeader;
  portfolioLocationsPage: PortfolioLocationsPage;
  map: Map;
  homePage: HomePage;
}>({
  createPortfolioPage: async ({ page }, use) => {
    await use(new CreatePortfolioPage(page));
  },
  portfolioItem: async ({ page }, use) => {
    await use(new PortfolioItem(page));
  },
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
  portfolioInformation: async ({ page }, use) => {
    await use(new PortfolioInformation(page));
  },
  portfolioLocationsPage: async ({ page }, use) => {
    await use(new PortfolioLocationsPage(page));
  },
  portfolioHeader: async ({ page }, use) => {
    await use(new PortfolioHeader(page));
  },
  map: async ({ page }, use) => {
    await use(new Map(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
});

test.describe('Portfolio: LOCATIONS', () => {
  let locationsQty: number;
  let fileData: any[] = [];
  let analysisType = 'Perils, EI, Scores';
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;
  const dataSetVersion = PORTFOLIO_CONFIGS['v3.2.0'].dataSetVersion;

  test.beforeEach(
    'Create Portfolio > Await the resultset > Go to Portfolio > Locations page',
    async ({
      portfolioHeader,
      portfolioItem,
      portfolioList,
      portfolioInformation,
      portfolioLocationsPage,
      page,
      homePage,
    }) => {
      test.setTimeout(TIMEOUT); // Extend the test timeout

      const fileName = 'CSV_3_cities.csv';
      const filePath = path.resolve(`./fixtures/${fileName}`);
      fileData = await parseCsvFile(filePath);
      locationsQty = fileData.length;

      await homePage.navigateByURL();
      await portfolioList.searchBy(portfolioName);
      await portfolioItem.PortfolioName.click();
      await portfolioInformation.waitForResultSet();
      await portfolioInformation.clickOnLaunchButton();
      await expect(portfolioHeader.LocationsTab).toBeVisible();
      await portfolioHeader.LocationsTab.click();
      await waitForContentLoaded(page);
      await expect(portfolioLocationsPage.PortfolioLocationsBody).toBeVisible();
    },
  );

  // Test: Validate main controls
  test('Validate main controls', async ({
    portfolioHeader,
    portfolioLocationsPage,
    page,
  }) => {
    await waitForContentLoaded(page);
    await portfolioHeader.validateControls(
      portfolioName,
      analysisType,
      dataSetVersion,
    );
    await portfolioLocationsPage.validateControls();
    const showingQtyResults = `Showing ${locationsQty} Results`;
    await expect(portfolioLocationsPage.ShowingQtyResults).toContainText(
      showingQtyResults,
    );
  });

  // Test: Validate breadcrumbs
  test('Validate breadcrumbs', async ({ page, portfolioHeader }) => {
    await waitForContentLoaded(page);
    await portfolioHeader.validateBreadcrumbs();
  });

  // Test: Validate tabs
  test('Validate tabs', async ({ portfolioHeader }) => {
    await portfolioHeader.validateTablist();
  });

  // Test: Validate Map controls
  test('Validate Map controls', async ({ page, map }) => {
    await waitForContentLoaded(page);
    await map.validateControls();
    await expect(map.PortfolioHazardScoreMapLegend).not.toBeVisible();
  });

  // Test: Validate default tab state (Overview, Hazard, Locations...)
  test('Validate default tab state', async ({ portfolioHeader }) => {
    await portfolioHeader.validateDefaultTabsState('Locations');
  });

  test('Validate Locations list', async ({ portfolioLocationsPage }) => {
    // test.setTimeout(TIMEOUT); // Extend the test timeout to 1 minute
    const scrollContainer = portfolioLocationsPage.LocationsResultItemList;

    for (const location of fileData) {
      const { locationId, locationName, latitude, longitude } = location;

      // Define the locators dynamically for the specific location
      const locationItemId = portfolioLocationsPage.LocationsItemId.filter({
        hasText: `Location ID: ${locationId}`,
      }).first();

      // Manually scroll the list until the item is visible
      let isVisible = await locationItemId.isVisible();
      while (!isVisible) {
        // Scroll down in the container
        await scrollContainer.evaluate((el) => {
          el.scrollBy(0, 200); // Adjust the scroll step as necessary
        });

        // Wait for new items to load
        await portfolioLocationsPage.page.waitForTimeout(100);

        // Check if the item is now visible
        isVisible = await locationItemId.isVisible();
      }

      // Validate that the item is visible after scrolling
      await expect(locationItemId).toBeVisible();

      // Handle case where locationName is empty and should display "Not Available"
      const expectedLocationName =
        locationName && locationName.trim() !== ''
          ? locationName
          : 'Not Available';

      // Check Location Name
      await expect(
        portfolioLocationsPage.LocationsItemName.filter({
          hasText: `Name: ${expectedLocationName}`,
        }).first(),
      ).toBeVisible();

      // Check Coordinates
      await expect(
        portfolioLocationsPage.LocationsItemCoordinates.filter({
          hasText: `Lat, Long: ${latitude}, ${longitude}`,
        }),
      ).toBeVisible();
    }
  });

  test('Verify Search by Location Name', async ({ portfolioLocationsPage }) => {
    const showingQtyResults = `Showing 1 Results`;

    // Loop through locations and perform checks, but skip empty location names
    for (const location of fileData) {
      const { locationName } = location; // Correctly extract locationName

      // Skip iteration if locationName is empty or consists of only whitespace
      if (!locationName || locationName.trim() === '') {
        continue; // Move to the next iteration if locationName is empty
      }

      // Perform search by location name
      await portfolioLocationsPage.searchLocationBy(locationName); // locationName is now correctly passed as a string

      // Check that the location name is visible
      await expect(
        portfolioLocationsPage.LocationsItemName.filter({
          hasText: `Name: ${locationName}`,
        }),
      ).toBeVisible();

      // Check that the location name is contained in the results
      await expect(portfolioLocationsPage.LocationsItemName).toContainText(
        locationName,
      );

      // Check that the search result shows the correct quantity
      await expect(portfolioLocationsPage.ShowingQtyResults).toContainText(
        showingQtyResults,
      );

      // Ensure only one result is shown
      const locationsCount = await portfolioLocationsPage.LocationsItem.count();
      expect(locationsCount).toBe(1);
    }
  });

  test('Verify Search by Location ID', async ({ portfolioLocationsPage }) => {
    const showingQtyResults = `Showing 1 Results`;
    for (const location of fileData) {
      const { locationId } = location;

      await portfolioLocationsPage.searchLocationBy(locationId);

      // Check Location Name
      await expect(
        portfolioLocationsPage.LocationsItemId.filter({
          hasText: `Location ID: ${locationId}`,
        }),
      ).toBeVisible();
      await expect(portfolioLocationsPage.LocationsItemId).toContainText(
        locationId,
      );
      await expect(portfolioLocationsPage.ShowingQtyResults).toContainText(
        showingQtyResults,
      );
      const locationsCount = await portfolioLocationsPage.LocationsItem.count();
      expect(locationsCount).toBe(1);
    }
  });

  test('Verify Search - No results', async ({ portfolioLocationsPage }) => {
    const showingQtyResults = 'Showing 0 Results';
    const searchText = 'dhdvvagskjjlyqiwu';
    await portfolioLocationsPage.searchLocationBy(searchText);
    await expect(portfolioLocationsPage.LocationsItem).not.toBeVisible();
    await expect(portfolioLocationsPage.ShowingQtyResults).toHaveText(
      showingQtyResults,
    );
  });

  test('Verify Search clear icon works', async ({ portfolioLocationsPage }) => {
    const showingQtyResults = 'Showing 0 Results';
    const searchText = 'dhdvvagskjjlyqiwu';
    await portfolioLocationsPage.searchLocationBy(searchText);
    await expect(portfolioLocationsPage.LocationsItem).not.toBeVisible();
    await expect(portfolioLocationsPage.ShowingQtyResults).toHaveText(
      showingQtyResults,
    );
    await portfolioLocationsPage.SearchClearIcon.click();
    await expect(portfolioLocationsPage.SearchInput).not.toHaveValue(
      searchText,
    );
    await expect(portfolioLocationsPage.ShowingQtyResults).not.toHaveText(
      showingQtyResults,
    ); // some data should exists for this check
    await expect(portfolioLocationsPage.LocationsItem.nth(0)).toBeVisible(); // some data should exists for this check
  });

  // Test: Navigate to Location details page
  test('Navigate to Single Location page', async ({
    portfolioLocationsPage,
  }) => {
    const showingQtyResults = `Showing 1 Results`;

    // Find the first non-empty location directly within the test
    const location = fileData.find(
      (loc) => loc.locationName && loc.locationName.trim() !== '',
    );

    // Check if a valid location is found
    if (!location) {
      throw new Error('No valid location names found in the dataset.');
    }

    // Extract the locationName and locationId from the location
    const { locationName, locationId } = location;

    // Perform search by location name
    await portfolioLocationsPage.searchLocationBy(locationName);

    // Check that the location name is visible
    await expect(
      portfolioLocationsPage.LocationsItemName.filter({
        hasText: `Name: ${locationName}`,
      }),
    ).toBeVisible();

    // Check that the location name is contained in the results
    await expect(portfolioLocationsPage.LocationsItemName).toContainText(
      locationName,
    );

    // Check that the search result shows the correct quantity
    await expect(portfolioLocationsPage.ShowingQtyResults).toContainText(
      showingQtyResults,
    );

    // Ensure only one result is shown
    const locationsCount = await portfolioLocationsPage.LocationsItem.count();
    expect(locationsCount).toBe(1);

    // Additional verification: Check the location ID if needed
    await expect(
      portfolioLocationsPage.LocationsItemId.filter({
        hasText: `Location ID: ${locationId}`,
      }),
    ).toBeVisible();
    await portfolioLocationsPage.clickOnSingleLocation();
  });
});
