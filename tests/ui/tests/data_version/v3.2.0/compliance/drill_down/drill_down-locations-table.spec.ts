import { extendedTest, expect } from '@utils/authFixture';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { PortfolioList } from '@components/PortfolioList';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { waitForContentLoaded } from '@utils/helpers';
import { PortfolioCompliancePage } from '@pages/PortfolioCompliancePage';
import { HomePage } from '@pages/HomePage';
import { DataSettingsModal } from '@components/DataSettingsModal';
import { EditPortfolioPage } from '@pages/EditPortfolioPage';
import { EditSettings } from '@components/EditSettings';
import { PortfolioLocationsPage } from '@pages/PortfolioLocationsPage';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const TIMEOUT = 120000;

const test = extendedTest.extend<{
  createPortfolioPage: CreatePortfolioPage;
  portfolioList: PortfolioList;
  portfolioItem: PortfolioItem;
  portfolioInformation: PortfolioInformation;
  portfolioHeader: PortfolioHeader;
  portfolioCompliancePage: PortfolioCompliancePage;
  homePage: HomePage;
  dataSettingsModal: DataSettingsModal;
  editPortfolioPage: EditPortfolioPage;
  editSettingsTab: EditSettings;
  portfolioLocationsPage: PortfolioLocationsPage;
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
  portfolioCompliancePage: async ({ page }, use) => {
    await use(new PortfolioCompliancePage(page));
  },
  portfolioHeader: async ({ page }, use) => {
    await use(new PortfolioHeader(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  dataSettingsModal: async ({ page }, use) => {
    await use(new DataSettingsModal(page));
  },
  editPortfolioPage: async ({ page }, use) => {
    await use(new EditPortfolioPage(page));
  },
  editSettingsTab: async ({ page }, use) => {
    await use(new EditSettings(page));
  },
  portfolioLocationsPage: async ({ page }, use) => {
    await use(new PortfolioLocationsPage(page));
  },
});

test.describe('Portfolio: COMPLIANCE > Drill Down > Locations table', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;
  let euHazardMetadata: any[] = [];
  let locationsData: any[] = [];

  test.beforeEach(
    'Go to Portfolio: COMPLIANCE page',
    async ({
      portfolioHeader,
      portfolioItem,
      portfolioList,
      portfolioInformation,
      portfolioCompliancePage,
      page,
      homePage,
    }) => {
      test.setTimeout(TIMEOUT);

      await homePage.navigateByURL();
      await portfolioList.searchBy(portfolioName);
      await portfolioItem.PortfolioName.click();
      await portfolioInformation.waitForResultSet();
      await portfolioInformation.clickOnLaunchButton();
      await expect(portfolioHeader.ComplianceTab).toBeVisible();
      await portfolioHeader.ComplianceTab.click();

      // Timeout function to allow for cases where only one response is received
      async function waitWithTimeout(promise, timeout) {
        return Promise.race([
          promise,
          new Promise((resolve) => setTimeout(() => resolve(null), timeout)),
        ]);
      }

      // Add your new wait for the response with '/metadata' in the URL
      const [metadataResponse] = await Promise.all([
        waitWithTimeout(
          page.waitForResponse(
            (response) =>
              response.url().includes('/metadata') && response.status() === 200,
          ),
          5000,
        ),
      ]);

      // Process the metadata response if it exists
      if (metadataResponse) {
        const metadataResponseBody = await metadataResponse.json();
        euHazardMetadata = metadataResponseBody.metadata.eu_hazard_metadata;
      }

      // New wait for the response with '/result_sets/<PORTFOLIO_ID>/data' in the URL
      const [resultSetResponse] = await Promise.all([
        waitWithTimeout(
          page.waitForResponse(
            (response) =>
              response.url().includes('/api/v2/result_sets/') &&
              response.url().includes('/data') &&
              response.status() === 200,
          ),
          5000,
        ),
      ]);

      // Extract necessary data
      if (resultSetResponse) {
        const resultSetData = await resultSetResponse.json();
        // Replace `yourVariable` with the actual property you need
        locationsData = resultSetData.data;
      }

      await waitForContentLoaded(page);
      await expect(portfolioCompliancePage.Body).toBeVisible();
    },
  );

  // Function to recursively find all matching values along with 'type', 'category', 'availability', and 'title'
  function findMatchingData(
    obj: any,
    criteria: { category?: string; availability?: string },
  ): any[] {
    const result: any[] = [];

    // Check if the current object matches the criteria
    if (obj && typeof obj === 'object') {
      if (
        criteria.category &&
        obj.category === criteria.category &&
        criteria.availability &&
        obj.availability === criteria.availability
      ) {
        // Extract 'type', 'category', 'availability', and 'title'
        const { category, type, availability, title, metrics } = obj;
        // Push only the matching fields (no metrics)
        result.push({ category, type, availability, title, metrics });
      }

      // Recursively search through nested objects or arrays
      for (const key in obj) {
        if (obj.hasOwnProperty(key)) {
          result.push(...findMatchingData(obj[key], criteria));
        }
      }
    }

    return result;
  }

  test('The Locations table is hidden if the "Select all" toggle is CHECKED', async ({
    portfolioCompliancePage,
  }) => {
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('Check existence of Locations table', async () => {
      await expect(
        portfolioCompliancePage.CategoryRelatedHazards,
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartsSingleRelatedHazardsSelectAll,
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartsSingleRelatedHazardsSelectAll.locator(
          'input',
        ),
      ).toBeChecked();
      await expect(portfolioCompliancePage.LocationTable).not.toBeVisible();
    });
  });
  test('The Locations table is visible if the "Select all" toggle is UNCHECKED', async ({
    portfolioCompliancePage,
  }) => {
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('UNCHECK the "Select all" toggle', async () => {
      await portfolioCompliancePage.uncheckSelectAllToggle();
    });
    await test.step('Check existence of Locations table', async () => {
      await portfolioCompliancePage.LocationTable.scrollIntoViewIfNeeded();
      await expect(portfolioCompliancePage.LocationTable).toBeVisible();
    });
  });

  test('Validate Locations table Struture & Data', async ({
    portfolioCompliancePage,
  }) => {
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('UNCHECK the "Select all" toggle', async () => {
      await portfolioCompliancePage.uncheckSelectAllToggle();
    });
    await test.step('Check existence of Locations table', async () => {
      await portfolioCompliancePage.LocationTable.scrollIntoViewIfNeeded();
      await expect(portfolioCompliancePage.LocationTable).toBeVisible();
    });

    await test.step('Verify controls & Data', async () => {
      const yearChipFirst =
        await portfolioCompliancePage.FiltersYearChip.first().textContent();
      const yearChipSecond =
        await portfolioCompliancePage.FiltersYearChip.nth(1).textContent();
      const yearChipThird =
        await portfolioCompliancePage.FiltersYearChip.nth(2).textContent();

      const firstLocationRow =
        await portfolioCompliancePage.LocationTableRow.nth(0);

      const tableYearValueFirst = await firstLocationRow.locator(
        `[data-testid="location-score-table-location-value-${yearChipFirst}"]`,
      );

      const tableYearValueSecond = await firstLocationRow.locator(
        `[data-testid="location-score-table-location-value-${yearChipSecond}"]`,
      );

      const tableYearValueThird = await firstLocationRow.locator(
        `[data-testid="location-score-table-location-value-${yearChipThird}"]`,
      );

      await portfolioCompliancePage.LocationTable.scrollIntoViewIfNeeded();
      await expect(portfolioCompliancePage.LocationTableTitle).toBeVisible();
      await expect(portfolioCompliancePage.LocationTableBody).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn,
      ).toHaveCount(4);
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(0),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(0),
      ).toHaveText('Location');
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(1),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(1),
      ).toHaveText(yearChipFirst);
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(2),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(2),
      ).toHaveText(yearChipSecond);
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(3),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(3),
      ).toHaveText(yearChipThird);
      await expect(
        portfolioCompliancePage.LocationTableRow.nth(0),
      ).toBeVisible();
      await expect(portfolioCompliancePage.LocationTableRow).toHaveCount(3);
      await expect(
        portfolioCompliancePage.LocationTableRowCell.nth(0),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableRowCell.locator('span').nth(0),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableRowCell.locator('span').nth(0),
      ).toHaveText('1.');
      await expect(
        portfolioCompliancePage.LocationTableRowCell.locator('span').nth(1),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableRowCell.locator('span').nth(1),
      ).toHaveText('2.');
      await expect(
        portfolioCompliancePage.LocationTableRowCell.locator('span').nth(2),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableRowCell.locator('span').nth(2),
      ).toHaveText('3.');
      await expect(
        portfolioCompliancePage.LocationTableLocationName.nth(0),
      ).toBeVisible();
      await expect(tableYearValueFirst).toBeVisible();
      await expect(tableYearValueSecond).toBeVisible();
      await expect(tableYearValueThird).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTablePagination,
      ).not.toBeVisible();
    });
  });

  test('Clicking on the Location name should open Locations page', async ({
    portfolioCompliancePage,
    portfolioLocationsPage,
    page,
  }) => {
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('UNCHECK the "Select all" toggle', async () => {
      await portfolioCompliancePage.uncheckSelectAllToggle();
    });
    await test.step('Check existence of Locations table', async () => {
      await portfolioCompliancePage.LocationTable.scrollIntoViewIfNeeded();
      await expect(portfolioCompliancePage.LocationTable).toBeVisible();
    });

    await test.step('Click on the location and verify behaviour', async () => {
      const location =
        await portfolioCompliancePage.LocationTableLocationName.nth(0);

      await portfolioCompliancePage.LocationTable.scrollIntoViewIfNeeded();
      await expect(portfolioCompliancePage.LocationTableTitle).toBeVisible();
      await expect(portfolioCompliancePage.LocationTableBody).toBeVisible();
      await expect(location).toBeVisible();
      await location.click();
      await waitForContentLoaded(page);
      await page.waitForLoadState('load');
      await expect(portfolioLocationsPage.PortfolioLocationsBody).toBeVisible();
    });
  });

  test('Verify Location metric data', async ({
    portfolioCompliancePage,
    page,
  }) => {
    let categoryTitle = 'Temperature';
    let firstMetric: string;
    let firstMean: string;

    await test.step('Navigate to "Temperature" drill down page', async () => {
      await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
    });
    await test.step('UNCHECK the "Select all" toggle', async () => {
      await portfolioCompliancePage.uncheckSelectAllToggle();
    });
    await test.step('Check existence of Locations table', async () => {
      await portfolioCompliancePage.LocationTable.scrollIntoViewIfNeeded();
      await expect(portfolioCompliancePage.LocationTable).toBeVisible();
    });

    await test.step('Verify the metric value for the selected "year" and "location"', async () => {
      let categoryTitle = 'Temperature';
      const criteria = {
        category: `${categoryTitle.toLowerCase().replace(' ', '_')}`,
        availability: 'available',
      };
      const matchingValues = findMatchingData(euHazardMetadata, criteria);

      for (const category in matchingValues) {
        // Extract only the first metric
        firstMetric = matchingValues[category].metrics[0].enhanced_name;
        firstMean = matchingValues[category].metrics[0].name;

        // Validate enhanced name exists in the UI
        const uiLocator = page
          .locator('[data-testid="metrics-radio-group"]')
          .locator(`text=${firstMetric}`);

        await expect(uiLocator).toBeVisible();
        const locationName =
          await portfolioCompliancePage.LocationTableLocationName.nth(
            0,
          ).textContent();

        const yearChipFirst =
          await portfolioCompliancePage.FiltersYearChip.first().textContent();

        const firstLocationRow =
          portfolioCompliancePage.LocationTableRow.nth(0);

        const tableYearValueFirst = await firstLocationRow.locator(
          `[data-testid="location-score-table-location-value-${yearChipFirst}"]`,
        );

        await portfolioCompliancePage.LocationTable.scrollIntoViewIfNeeded();
        await expect(portfolioCompliancePage.LocationTableTitle).toBeVisible();
        await expect(portfolioCompliancePage.LocationTableBody).toBeVisible();
        await expect(
          portfolioCompliancePage.LocationTableHeaderColumn,
        ).toHaveCount(4);
        await expect(
          portfolioCompliancePage.LocationTableHeaderColumn.nth(0),
        ).toBeVisible();
        await expect(tableYearValueFirst).toBeVisible();

        // Filter data based on year and location name
        const filteredData = locationsData.find(
          (entry) =>
            entry.year?.toString() === yearChipFirst.trim() &&
            entry.locationName === locationName.trim(),
        );
        const filteredValue = filteredData[firstMean].toString();
        const yearValue = await tableYearValueFirst.textContent();
        expect(yearValue).toBe(filteredValue);
        break;
      }
    });
  });

  test('Only data for selected years should be displayed', async ({
    portfolioCompliancePage,
  }) => {
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('UNCHECK the "Select all" toggle', async () => {
      await portfolioCompliancePage.uncheckSelectAllToggle();
    });
    await test.step('Check existence of Locations table', async () => {
      await portfolioCompliancePage.LocationTable.scrollIntoViewIfNeeded();
      await expect(portfolioCompliancePage.LocationTable).toBeVisible();
    });

    await test.step('Remove third year and verify data', async () => {
      const yearChipFirst =
        await portfolioCompliancePage.FiltersYearChip.first().textContent();
      const yearChipSecond =
        await portfolioCompliancePage.FiltersYearChip.nth(1).textContent();
      const yearChipThird =
        await portfolioCompliancePage.FiltersYearChip.nth(2).textContent();

      const firstLocationRow =
        await portfolioCompliancePage.LocationTableRow.nth(0);

      const tableYearValueFirst = await firstLocationRow.locator(
        `[data-testid="location-score-table-location-value-${yearChipFirst}"]`,
      );

      const tableYearValueSecond = await firstLocationRow.locator(
        `[data-testid="location-score-table-location-value-${yearChipSecond}"]`,
      );

      const tableYearValueThird = await firstLocationRow.locator(
        `[data-testid="location-score-table-location-value-${yearChipThird}"]`,
      );

      await portfolioCompliancePage.LocationTable.scrollIntoViewIfNeeded();
      await expect(portfolioCompliancePage.LocationTableTitle).toBeVisible();
      await expect(portfolioCompliancePage.LocationTableBody).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn,
      ).toHaveCount(4);
      await portfolioCompliancePage.removeYearChip(parseInt(yearChipThird, 10));
      await portfolioCompliancePage.isYearChipRemoved(
        parseInt(yearChipThird, 10),
      );
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn,
      ).toHaveCount(3);
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(0),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(0),
      ).toHaveText('Location');
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(1),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(1),
      ).toHaveText(yearChipFirst);
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(2),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableHeaderColumn.nth(2),
      ).toHaveText(yearChipSecond);
      await expect(
        portfolioCompliancePage.LocationTableRow.nth(0),
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.LocationTableRowCell.nth(0),
      ).toBeVisible();
      await expect(tableYearValueFirst).toBeVisible();
      await expect(tableYearValueSecond).toBeVisible();
      await expect(tableYearValueThird).not.toBeVisible();
    });
  });
  test('If the "Select all" toggle is UNCHECKED, the table title matches the selected metric label', async ({
    portfolioCompliancePage,
  }) => {
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('UNCHECK the "Select all" toggle', async () => {
      await portfolioCompliancePage.uncheckSelectAllToggle();
    });
    await test.step('Check existence of Locations table', async () => {
      await portfolioCompliancePage.LocationTable.scrollIntoViewIfNeeded();
      await expect(portfolioCompliancePage.LocationTable).toBeVisible();
      await expect(portfolioCompliancePage.LocationTableTitle).toBeVisible();
    });

    await test.step('Verify the table title', async () => {
      const sectionLocators = {
        chronic: portfolioCompliancePage.CategoryRelatedHazardsChronic,
        acute: portfolioCompliancePage.CategoryRelatedHazardsAcute,
      };
      const metricRadioButton =
        portfolioCompliancePage.DrillDownMetricsRadioButton;
      const metricRadioButtonLabel =
        portfolioCompliancePage.DrillDownMetricsRadioButtonLabel;
      const enhancedNameFirst = await sectionLocators.acute
        .locator(metricRadioButtonLabel.first())
        .textContent();
      const enhancedNameSecond = await sectionLocators.acute
        .locator(metricRadioButtonLabel.nth(1))
        .textContent();

      await expect(sectionLocators.acute).toBeVisible();
      await expect(
        sectionLocators.acute.locator(metricRadioButton.first()),
      ).toBeVisible();
      await expect(
        sectionLocators.chronic.locator(metricRadioButton.first()),
      ).toBeChecked();
      await expect(
        sectionLocators.acute.locator(metricRadioButton.first()),
      ).not.toBeChecked();
      await sectionLocators.acute.locator(metricRadioButton.first()).check();
      await expect(
        sectionLocators.acute.locator(metricRadioButton.first()),
      ).toBeChecked();
      await expect(
        sectionLocators.chronic.locator(metricRadioButton.first()),
      ).not.toBeChecked();

      const metricRadioButtonUiLocator =
        await portfolioCompliancePage.CategoryRelatedHazardsAcute.locator(
          portfolioCompliancePage.DrillDownMetricsRadioButtonBlock,
        );

      const metricRadioButtonAcute =
        await portfolioCompliancePage.CategoryRelatedHazardsAcute.locator(
          metricRadioButton,
        );
      const tableTitleUiLocator = portfolioCompliancePage.LocationTableTitle;

      const titleText = 'Locations Ranked by ';

      await expect(metricRadioButtonUiLocator.first()).toBeVisible();
      await portfolioCompliancePage.LocationTable.scrollIntoViewIfNeeded();
      await expect(tableTitleUiLocator).toBeVisible();
      await expect(tableTitleUiLocator).toHaveText(
        `${titleText}${enhancedNameFirst}`,
      );

      //change the metric
      await expect(metricRadioButtonUiLocator.nth(1)).toBeVisible();
      await expect(metricRadioButtonAcute.nth(1)).toBeVisible();
      await expect(metricRadioButtonAcute.nth(1)).not.toBeChecked();
      await metricRadioButtonAcute.nth(1).check();
      await expect(metricRadioButtonAcute.nth(0)).not.toBeChecked();
      await expect(metricRadioButtonAcute.nth(1)).toBeChecked();
      await portfolioCompliancePage.LocationTable.scrollIntoViewIfNeeded();
      await expect(tableTitleUiLocator).toHaveText(
        `${titleText}${enhancedNameSecond}`,
      );
    });
  });
});
