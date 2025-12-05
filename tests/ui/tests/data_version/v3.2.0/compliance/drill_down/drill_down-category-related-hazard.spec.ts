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

test.describe('Portfolio: COMPLIANCE > Drill Down > <Category>-Related Hazards', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;
  let euHazardMetadata: any[] = [];

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
      await waitForContentLoaded(page);
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

  test('Open a single category and validate title of the "<CATEGORY>-related Hazards" section', async ({
    portfolioCompliancePage,
  }) => {
    await test.step('Validate a "Temperature" category', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
      await portfolioCompliancePage.validateRelatedHazardsTitle(category);
    });
    await test.step('Validate a "Wind" category', async () => {
      const category = 'Wind';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
      await portfolioCompliancePage.validateRelatedHazardsTitle(category);
    });
    await test.step('Validate a "Water" category', async () => {
      const category = 'Water';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
      await portfolioCompliancePage.validateRelatedHazardsTitle(category);
    });
    await test.step('Validate a "Solid Mass" category', async () => {
      const category = 'Solid Mass';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
      await portfolioCompliancePage.validateRelatedHazardsTitle(category);
    });
  });

  test('A "Select All" toggle is displayed', async ({
    portfolioCompliancePage,
  }) => {
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('A "Select All" toggle is displayed', async () => {
      await expect(
        portfolioCompliancePage.ChartsSingleRelatedHazardsSelectAll,
      ).toBeVisible();
    });
  });

  test('A "Select all" toggle should be checked by default', async ({
    portfolioCompliancePage,
  }) => {
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('A "Select all" toggle should be checked by default', async () => {
      await expect(
        portfolioCompliancePage.ChartsSingleRelatedHazardsSelectAll,
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartsSingleRelatedHazardsSelectAll.locator(
          'input',
        ),
      ).toBeChecked();
    });
  });

  test('The metrics radio-button group is displayed within the "<CATEGORY>-related Hazards" section', async ({
    portfolioCompliancePage,
  }) => {
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('Check section availablity', async () => {
      await expect(
        portfolioCompliancePage.CategoryRelatedHazards,
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.CategoryRelatedHazards.getByTestId(
          'metrics-radio-groups',
        ),
      ).toBeVisible();
    });
  });
  test('A tooltip is displayed on mouse over the disabled metric ', async ({
    portfolioCompliancePage,
    page,
  }) => {
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('Mouse over the disabled metric and verify a tooltip', async () => {
      const tooltip = await page.getByRole('tooltip');
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
      await expect(
        portfolioCompliancePage.CategoryRelatedHazardsChronic.locator(
          'label',
        ).first(),
      ).toHaveClass(/Mui-disabled/);
      await expect(
        portfolioCompliancePage.CategoryRelatedHazardsChronic.locator(
          'input',
        ).first(),
      ).toBeDisabled();
      await expect(
        portfolioCompliancePage.CategoryRelatedHazardsAcute.locator(
          'label',
        ).first(),
      ).toHaveClass(/Mui-disabled/);
      await expect(
        portfolioCompliancePage.CategoryRelatedHazardsAcute.locator(
          'input',
        ).first(),
      ).toBeDisabled();
      await portfolioCompliancePage.CategoryRelatedHazardsChronic.locator(
        'label',
      )
        .first()
        .hover();
      await expect(tooltip).toBeVisible();
      const tooltipContent = await tooltip.textContent();
      expect(tooltipContent).toBe(
        'Before selecting specific metric uncheck "Select all" toggle first',
      );
    });
  });

  test('The metrics radio-buttons are DISABLED if the "Select all" toggle is CHECKED', async ({
    portfolioCompliancePage,
  }) => {
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('Check radio-buttons status', async () => {
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
      await expect(
        portfolioCompliancePage.CategoryRelatedHazardsChronic.locator(
          'label',
        ).first(),
      ).toHaveClass(/Mui-disabled/);
      await expect(
        portfolioCompliancePage.CategoryRelatedHazardsChronic.locator(
          'input',
        ).first(),
      ).toBeDisabled();
      await expect(
        portfolioCompliancePage.CategoryRelatedHazardsAcute.locator(
          'label',
        ).first(),
      ).toHaveClass(/Mui-disabled/);
      await expect(
        portfolioCompliancePage.CategoryRelatedHazardsAcute.locator(
          'input',
        ).first(),
      ).toBeDisabled();
    });
  });

  test('The metrics radio-buttons are ENABLED if the "Select all" toggle is UNCHECKED', async ({
    portfolioCompliancePage,
  }) => {
    await test.step('Navigate to "Temperature" drill down page', async () => {
      const category = 'Temperature';
      await portfolioCompliancePage.navigateToSingleCategoryTab(category);
    });
    await test.step('Check radio-buttons status', async () => {
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
      await portfolioCompliancePage.ChartsSingleRelatedHazardsSelectAll.locator(
        'input',
      ).uncheck();
      await expect(
        portfolioCompliancePage.ChartsSingleRelatedHazardsSelectAll.locator(
          'input',
        ),
      ).not.toBeChecked();
      await expect(
        portfolioCompliancePage.CategoryRelatedHazardsChronic.locator(
          'label',
        ).first(),
      ).not.toHaveClass(/Mui-disabled/);
      await expect(
        portfolioCompliancePage.CategoryRelatedHazardsChronic.locator(
          'input',
        ).first(),
      ).not.toBeDisabled();
      await expect(
        portfolioCompliancePage.CategoryRelatedHazardsAcute.locator(
          'label',
        ).first(),
      ).not.toHaveClass(/Mui-disabled/);
      await expect(
        portfolioCompliancePage.CategoryRelatedHazardsAcute.locator(
          'input',
        ).first(),
      ).not.toBeDisabled();
    });
  });

  test('First metric radio-button should be selected by default', async ({
    portfolioCompliancePage,
  }) => {
    const categoryTitle = 'Temperature'; // TODO: set the categoory for test

    await test.step('Navigate to "Temperature" drill down page', async () => {
      await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
    });
    await test.step('Verify first radio-button state', async () => {
      const radioButtonLocatorSelectAll =
        portfolioCompliancePage.ChartsSingleRelatedHazardsSelectAll.locator(
          'input',
        );
      const sectionLocators = {
        chronic: portfolioCompliancePage.CategoryRelatedHazardsChronic,
        acute: portfolioCompliancePage.CategoryRelatedHazardsAcute,
      };

      await expect(
        portfolioCompliancePage.CategoryRelatedHazards,
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartsSingleRelatedHazardsSelectAll,
      ).toBeVisible();
      await expect(radioButtonLocatorSelectAll).toBeChecked();
      await radioButtonLocatorSelectAll.uncheck();
      await expect(sectionLocators.chronic).toBeVisible();
      await expect(sectionLocators.acute).toBeVisible();
      await expect(
        sectionLocators.chronic.locator(
          portfolioCompliancePage.DrillDownMetricsRadioButton.first(),
        ),
      ).toBeVisible();
      await expect(
        sectionLocators.chronic.locator(
          portfolioCompliancePage.DrillDownMetricsRadioButton.first(),
        ),
      ).toBeChecked();
      await expect(
        sectionLocators.chronic.locator(
          portfolioCompliancePage.DrillDownMetricsRadioButton.nth(1),
        ),
      ).not.toBeChecked();
      await expect(
        sectionLocators.acute.locator(
          portfolioCompliancePage.DrillDownMetricsRadioButton.first(),
        ),
      ).toBeVisible();
      await expect(
        sectionLocators.acute.locator(
          portfolioCompliancePage.DrillDownMetricsRadioButton.first(),
        ),
      ).not.toBeChecked();
      await expect(
        sectionLocators.acute.locator(
          portfolioCompliancePage.DrillDownMetricsRadioButton.nth(1),
        ),
      ).not.toBeChecked();
    });
  });
  test('List of available metrics is based on the API response', async ({
    portfolioCompliancePage,
    page,
  }) => {
    const categoryTitle = 'Temperature'; // TODO: set the categoory for test

    await test.step('Navigate to "Temperature" drill down page', async () => {
      await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
    });
    await test.step('Check the list of available metrics', async () => {
      const criteria = {
        category: `${categoryTitle.toLowerCase().replace(' ', '_')}`,
        availability: 'available',
      };
      const matchingValues = findMatchingData(euHazardMetadata, criteria);

      // Iterate over all categories and collect enhanced names
      for (const category in matchingValues) {
        const metricsAll = matchingValues[category].metrics;
        const enhancedNames = metricsAll.map((metric) => metric.enhanced_name);

        // Validate enhanced names exist in the UI
        for (const enhancedName of enhancedNames) {
          const uiLocator = page
            .locator('[data-testid="metrics-radio-group"]')
            .locator(`text=${enhancedName}`);
          // Assert the UI contains the enhanced name
          await expect(uiLocator).toBeVisible();
        }
      }
    });
  });

  test('Only metrics for the selected metric group are displayed', async ({
    portfolioCompliancePage,
    dataSettingsModal,
    page,
  }) => {
    const categoryTitle = 'Temperature'; // TODO: set the categoory for test

    const categoryLocator = page.locator(
      '[data-testid="data-settings-modal-hazard-category"]',
      {
        has: page.locator('h6', { hasText: `${categoryTitle}` }),
      },
    );
    const checkboxLocatorSelectAllButton = categoryLocator.locator(
      'label:has-text("Select all") input[type="checkbox"]',
    );
    const sectionLocators = {
      chronic: categoryLocator.locator('span:has-text("Chronic Options")'),
      acute: categoryLocator.locator('span:has-text("Acute Options")'),
    };

    const criteria = {
      category: `${categoryTitle.toLowerCase().replace(' ', '_')}`,
      availability: 'available',
    };
    const matchingValues = findMatchingData(euHazardMetadata, criteria);
    const metrics = {
      chronic: matchingValues.filter((value) => value.type === 'chronic'),
      acute: matchingValues.filter((value) => value.type === 'acute'),
    };

    // Helper to validate checkboxes
    const validateCheckboxes = async (
      section,
      metrics,
      shouldBeDisabled?,
      shouldBeVisible?,
      shouldBeChecked?,
    ) => {
      await expect(section).toBeVisible();
      for (const { title } of metrics.filter(
        (item) => item.title !== 'Precipitation or hydrological variability',
        (item) => item.title !== 'Storms (dust and sandstorms)',
      )) {
        const metricCheckbox = categoryLocator.locator(
          `label:has-text("${title}") input[type="checkbox"]`,
        );
        if (shouldBeDisabled) {
          await expect(metricCheckbox).toBeDisabled(); // Validate the checkbox is disabled
        } else {
          await expect(metricCheckbox).not.toBeDisabled(); // Validate the checkbox is enabled
        }
        if (shouldBeVisible) {
          await expect(metricCheckbox).toBeVisible(); // Validate the checkbox is visible
        } else {
          await expect(metricCheckbox).not.toBeVisible(); // Validate the checkbox is not visible
        }
        if (shouldBeChecked) {
          await expect(metricCheckbox).toBeChecked(); // Validate the checkbox is checked
        } else {
          await expect(metricCheckbox).not.toBeChecked(); // Validate the checkbox is unchecked
        }
      }
    };

    await test.step('Navigate to "Temperature" drill down page', async () => {
      await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
    });

    await test.step('Open Data Settings Modal and uncheck all "Chronic" metrics', async () => {
      await portfolioCompliancePage.openDataSettings();
    });

    await test.step('Uncheck "Select all" for Chronic and validate changes', async () => {
      // Uncheck "Select all"
      await checkboxLocatorSelectAllButton.first().uncheck();
      // Chronic
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        false,
      );
      // Acute
      await validateCheckboxes(
        sectionLocators.acute,
        metrics.acute,
        false,
        true,
        true,
      );
      await dataSettingsModal.clickOnApply();
      await waitForContentLoaded(page);
    });

    await test.step('Verify first radio-button state', async () => {
      // TODO: CONTINUE HERE
      const radioButtonLocatorSelectAll =
        portfolioCompliancePage.ChartsSingleRelatedHazardsSelectAll.locator(
          'input',
        );
      const sectionLocator = {
        chronic: portfolioCompliancePage.CategoryRelatedHazardsChronic,
        acute: portfolioCompliancePage.CategoryRelatedHazardsAcute,
      };

      await expect(
        portfolioCompliancePage.CategoryRelatedHazards,
      ).toBeVisible();
      await expect(
        portfolioCompliancePage.ChartsSingleRelatedHazardsSelectAll,
      ).toBeVisible();
      await expect(radioButtonLocatorSelectAll).toBeChecked();
      await expect(sectionLocator.chronic).not.toBeVisible();
      await radioButtonLocatorSelectAll.uncheck();
      await expect(sectionLocator.chronic).not.toBeVisible();
      await expect(sectionLocator.acute).toBeVisible();
      await expect(
        sectionLocator.acute.locator(
          portfolioCompliancePage.DrillDownMetricsRadioButton.first(),
        ),
      ).toBeVisible();
      await expect(
        sectionLocator.acute.locator(
          portfolioCompliancePage.DrillDownMetricsRadioButton.first(),
        ),
      ).toBeChecked();
      await expect(
        sectionLocator.acute.locator(
          portfolioCompliancePage.DrillDownMetricsRadioButton.nth(1),
        ),
      ).not.toBeChecked();
    });
  });
});
