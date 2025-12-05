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

test.describe('Portfolio: COMPLIANCE > Drill Down > "Data Settings" modal', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;
  let euHazardMetadata: string[] = [];

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
        obj.availability === criteria.availability
      ) {
        // Extract 'type', 'category', 'availability', and 'title'
        const { category, type, availability, title } = obj;
        // Push only the matching fields (no metrics)
        result.push({ category, type, availability, title });
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

  test('Clicking on the gear icon should open the "Data Settings" modal window for a single category', async ({
    portfolioCompliancePage,
  }) => {
    await portfolioCompliancePage.navigateToSingleCategoryTab('Temperature');
    await portfolioCompliancePage.openDataSettings();
  });

  test('Validate "Data Settings" modal window for a single category', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    const categoryTitle = 'Temperature'; // TODO: set the categoory for test
    await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
    await portfolioCompliancePage.openDataSettings();
    await dataSettingsModal.validateControlsSingle(categoryTitle);
    await expect(dataSettingsModal.Title).toHaveText('Data Settings');
    await expect(dataSettingsModal.Description).toHaveText(
      'Select which data you would like to include in your results.',
    );
  });

  test('Verify category data on the modal', async ({
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

    // Ensure response is available
    expect(euHazardMetadata).not.toBeNull();

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
    await test.step('Open Data Settings Modal', async () => {
      // Open the "Data Settings" modal window
      await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
      await portfolioCompliancePage.openDataSettings();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
    });

    await test.step('Validate Chronic Options', async () => {
      await expect(sectionLocators.chronic).toBeVisible();
      await expect(checkboxLocatorSelectAllButton.first()).toBeVisible();
      await expect(checkboxLocatorSelectAllButton.first()).toBeChecked();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );
    });

    await test.step('Validate Acute Options', async () => {
      await expect(sectionLocators.acute).toBeVisible();
      await expect(checkboxLocatorSelectAllButton.nth(1)).toBeVisible();
      await expect(checkboxLocatorSelectAllButton.nth(1)).toBeChecked();
      await validateCheckboxes(
        sectionLocators.acute,
        metrics.acute,
        false,
        true,
        true,
      );
    });
  });

  test('The "Select all" check-box works properly', async ({
    portfolioCompliancePage,
    dataSettingsModal,
    page,
  }) => {
    const categoryTitle = 'Water'; // TODO: set the categoory for test
    const categoryLocator = page.locator(
      '[data-testid="data-settings-modal-hazard-category"]',
      {
        has: page.locator('h6', { hasText: `${categoryTitle}` }),
      },
    );
    const checkboxLocatorSelectAll = categoryLocator.getByTestId(
      'data-settings-modal-checkbox-select-all-button',
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

    await test.step('Open Data Settings Modal', async () => {
      await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
      await portfolioCompliancePage.openDataSettings();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
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
    });

    await test.step('Check "Select all" for Chronic and validate changes', async () => {
      await checkboxLocatorSelectAllButton.first().check();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );
      await validateCheckboxes(
        sectionLocators.acute,
        metrics.acute,
        false,
        true,
        true,
      );
    });

    await test.step('Uncheck "Select all" for Acute and validate changes', async () => {
      await checkboxLocatorSelectAllButton.nth(1).uncheck();
      await validateCheckboxes(
        sectionLocators.acute,
        metrics.acute,
        false,
        true,
        false,
      );
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );
    });

    await test.step('Check "Select all" for Acute and validate changes', async () => {
      // Check "Select all" for Acute and validate changes
      await checkboxLocatorSelectAllButton.nth(1).check();
      await validateCheckboxes(
        sectionLocators.acute,
        metrics.acute,
        false,
        true,
        true,
      );
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );
    });

    await test.step('Verify that the section is NOT disabled when all checkboxes are unchecked', async () => {
      // Uncheck "Select all" for Chronic and Acute and validate changes
      await checkboxLocatorSelectAllButton.first().uncheck();
      await checkboxLocatorSelectAllButton.nth(1).uncheck();
      await expect(checkboxLocatorSelectAll.first()).not.toBeDisabled();
      await expect(checkboxLocatorSelectAll.nth(1)).not.toBeDisabled();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        false,
      );
      await validateCheckboxes(
        sectionLocators.acute,
        metrics.acute,
        false,
        true,
        false,
      );
    });

    await test.step('Verify that the category section is ENABLED and all checkboxes are visible, enabled and checked', async () => {
      // Enable the "Select all" for Chronic and Acute and validate changes
      await checkboxLocatorSelectAllButton.first().check();
      await checkboxLocatorSelectAllButton.nth(1).check();
      // Verify that the section is ENABLED and all checkboxes are visible, enabled and checked
      await expect(checkboxLocatorSelectAllButton.first()).toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).not.toBeDisabled();
      await expect(checkboxLocatorSelectAllButton.nth(1)).toBeChecked();
      await expect(checkboxLocatorSelectAll.nth(1)).not.toBeDisabled();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );
      await validateCheckboxes(
        sectionLocators.acute,
        metrics.acute,
        false,
        true,
        true,
      );
    });
  });

  test('Verify the "Select all" check-box status & UI', async ({
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
    const checkboxLocatorSelectAll = categoryLocator.getByTestId(
      'data-settings-modal-checkbox-select-all-button',
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

    await test.step('Open Data Settings Modal', async () => {
      await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
      await portfolioCompliancePage.openDataSettings();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
    });

    const titleFirst = metrics.chronic[0].title;
    let metricCheckboxFirst = categoryLocator.locator(
      `label:has-text("${titleFirst}") input[type="checkbox"]`,
    );
    const titleSecond = metrics.chronic[1].title;
    let metricCheckboxSecond = categoryLocator.locator(
      `label:has-text("${titleSecond}") input[type="checkbox"]`,
    );

    const titleThird = metrics.chronic[2].title;
    let metricCheckboxThird = categoryLocator.locator(
      `label:has-text("${titleThird}") input[type="checkbox"]`,
    );

    await test.step('Verify the MIXED state of the "Select all" checkbox', async () => {
      await expect(checkboxLocatorSelectAll.first()).toBeVisible();
      await expect(checkboxLocatorSelectAll.first()).toBeChecked();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );

      await metricCheckboxFirst.uncheck();
      await expect(metricCheckboxFirst).not.toBeChecked();
      await expect(metricCheckboxSecond).toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).toHaveClass(
        /MuiCheckbox-indeterminate/,
      );
      await metricCheckboxFirst.check();
      await expect(metricCheckboxFirst).toBeChecked();
      await expect(metricCheckboxSecond).toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).not.toHaveClass(
        /MuiCheckbox-indeterminate/,
      );
      await metricCheckboxFirst.uncheck();
      await metricCheckboxSecond.uncheck();
      await expect(metricCheckboxFirst).not.toBeChecked();
      await expect(metricCheckboxSecond).not.toBeChecked();
      await expect(metricCheckboxThird).toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).toHaveClass(
        /MuiCheckbox-indeterminate/,
      );
      await checkboxLocatorSelectAll.first().click();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );
      await expect(checkboxLocatorSelectAll.first()).toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).not.toHaveClass(
        /MuiCheckbox-indeterminate/,
      );
    });
  });

  test('A single metric checkbox is checked after all checkboxes were unchecked and then single checked', async ({
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
    const checkboxLocatorSelectAll = categoryLocator.getByTestId(
      'data-settings-modal-checkbox-select-all-button',
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

    await test.step('Open Data Settings Modal', async () => {
      await portfolioCompliancePage.navigateToSingleCategoryTab('Temperature');
      await portfolioCompliancePage.openDataSettings();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
    });

    const titleFirst = metrics.chronic[0].title;
    let metricCheckboxFirst = categoryLocator.locator(
      `label:has-text("${titleFirst}") input[type="checkbox"]`,
    );
    const titleSecond = metrics.chronic[1].title;
    let metricCheckboxSecond = categoryLocator.locator(
      `label:has-text("${titleSecond}") input[type="checkbox"]`,
    );

    await test.step('Verify the state of all checkboxes', async () => {
      await expect(checkboxLocatorSelectAll.first()).toBeVisible();
      await expect(checkboxLocatorSelectAll.first()).toBeChecked();
      await expect(checkboxLocatorSelectAll.nth(1)).toBeVisible();
      await expect(checkboxLocatorSelectAll.nth(1)).toBeChecked();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );

      await test.step('Uncheck "Select all" for Chronic and Acute', async () => {
        await checkboxLocatorSelectAllButton.first().uncheck();
        await checkboxLocatorSelectAllButton.nth(1).uncheck();
        await expect(checkboxLocatorSelectAllButton.first()).toBeVisible();
        await expect(checkboxLocatorSelectAllButton.first()).not.toBeChecked();
        await expect(checkboxLocatorSelectAllButton.nth(1)).toBeVisible();
        await expect(checkboxLocatorSelectAllButton.nth(1)).not.toBeChecked();
      });

      await test.step('Check single metric checkbox and verify the behavior and staet of all other checkboxes', async () => {
        await metricCheckboxFirst.click();
        await expect(metricCheckboxFirst).toBeChecked();
        await expect(metricCheckboxSecond).not.toBeChecked();
        await metricCheckboxSecond.click();
        await validateCheckboxes(
          sectionLocators.acute,
          metrics.acute,
          false,
          true,
          false,
        );
        await expect(checkboxLocatorSelectAll.first()).toBeChecked();
        await expect(checkboxLocatorSelectAll.first()).toHaveClass(
          /MuiCheckbox-indeterminate/,
        );
        await expect(checkboxLocatorSelectAll.nth(1)).not.toBeChecked();
        await expect(checkboxLocatorSelectAll.nth(1)).not.toHaveClass(
          /MuiCheckbox-indeterminate/,
        );
      });
    });
  });

  test('When All checkboxes are disabled, the error message is shown', async ({
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

    await test.step('Open Data Settings Modal', async () => {
      await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
      await portfolioCompliancePage.openDataSettings();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
    });

    await test.step('Uncheck "Select all" for Chronic and Acute and validate changes', async () => {
      await checkboxLocatorSelectAllButton.first().uncheck();
      await checkboxLocatorSelectAllButton.nth(1).uncheck();
      await expect(dataSettingsModal.ErrorMessage).toBeVisible();
      await expect(dataSettingsModal.ErrorMessage).toHaveText(
        'At least one metric needs to be selected and enabled',
      );
      await expect(dataSettingsModal.ApplyButton).toBeDisabled();
    });
  });

  test('Validate the "Unsaved Changes" modal', async ({
    portfolioCompliancePage,
    dataSettingsModal,
    page,
  }) => {
    const categoryTitle = 'Wind'; // TODO: set the categoory for test
    const categoryLocator = page.locator(
      '[data-testid="data-settings-modal-hazard-category"]',
      {
        has: page.locator('h6', { hasText: `${categoryTitle}` }),
      },
    );
    const checkboxLocatorSelectAllButton = categoryLocator.locator(
      'label:has-text("Select all") input[type="checkbox"]',
    );

    await test.step('Open Data Settings Modal', async () => {
      await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
      await portfolioCompliancePage.openDataSettings();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
    });

    await test.step('Make changes and verify the behavior', async () => {
      await expect(checkboxLocatorSelectAllButton.first()).toBeVisible();
      await checkboxLocatorSelectAllButton.first().uncheck();
      await dataSettingsModal.clickOnCancelWithChanges();
      await dataSettingsModal.validateUnsavedChangesModalControls();
    });
  });

  test('"Unsaved Changes": - Clicking "Go Back", closes the Unsaved Changes modal and keep Data Settings modal opened', async ({
    portfolioCompliancePage,
    dataSettingsModal,
    page,
  }) => {
    const categoryTitle = 'Water'; // TODO: set the categoory for test
    const categoryLocator = page.locator(
      '[data-testid="data-settings-modal-hazard-category"]',
      {
        has: page.locator('h6', { hasText: `${categoryTitle}` }),
      },
    );
    const checkboxLocatorSelectAllButton = categoryLocator.locator(
      'label:has-text("Select all") input[type="checkbox"]',
    );

    await test.step('Open Data Settings Modal', async () => {
      await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
      await portfolioCompliancePage.openDataSettings();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
    });

    await test.step('Make changes and click on "Cancel"', async () => {
      await expect(checkboxLocatorSelectAllButton.first()).toBeVisible();
      await checkboxLocatorSelectAllButton.first().uncheck();
      await expect(checkboxLocatorSelectAllButton.first()).not.toBeChecked();
      await dataSettingsModal.clickOnCancelWithChanges();
      await dataSettingsModal.validateUnsavedChangesModalControls();
    });

    await test.step('Click on "Go Back" and verify the behavior', async () => {
      await dataSettingsModal.UnsavedChangesModalGoBackButton.click();
      await expect(dataSettingsModal.UnsavedChangesModal).not.toBeVisible();
      await expect(dataSettingsModal.Body).toBeVisible();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
      await expect(checkboxLocatorSelectAllButton.first()).toBeVisible();
      await expect(checkboxLocatorSelectAllButton.first()).not.toBeChecked();
    });
  });

  test('Clicking "Apply" only options from the currently viewed Hazard are applied', async ({
    portfolioCompliancePage,
    dataSettingsModal,
    page,
  }) => {
    const categoryTitle = 'Temperature'; // TODO: set the categoory for test
    const categoryTitle2 = 'Water'; // TODO: set the categoory for test
    const categoryLocator = page.locator(
      '[data-testid="data-settings-modal-hazard-category"]',
      {
        has: page.locator('h6', { hasText: `${categoryTitle}` }),
      },
    );
    const checkboxLocatorSelectAllButton = categoryLocator.locator(
      'label:has-text("Select all") input[type="checkbox"]',
    );
    const categoryLocator2 = page.locator(
      '[data-testid="data-settings-modal-hazard-category"]',
      {
        has: page.locator('h6', { hasText: `${categoryTitle2}` }),
      },
    );
    const checkboxLocatorSelectAllButton2 = categoryLocator2.locator(
      'label:has-text("Select all") input[type="checkbox"]',
    );

    await test.step('Open Data Settings Modal', async () => {
      await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
      await portfolioCompliancePage.openDataSettings();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
    });

    await test.step('Make changes and click on "Apply"', async () => {
      await expect(checkboxLocatorSelectAllButton.first()).toBeVisible();
      await checkboxLocatorSelectAllButton.first().uncheck();
      await expect(checkboxLocatorSelectAllButton.first()).not.toBeChecked();
      await dataSettingsModal.clickOnApply();
      // Verify that the changes are applied
      await expect(dataSettingsModal.UnsavedChangesModal).not.toBeVisible();
      await expect(dataSettingsModal.Body).not.toBeVisible();
      await portfolioCompliancePage.openDataSettings();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
      await expect(checkboxLocatorSelectAllButton.first()).toBeVisible();
      await expect(checkboxLocatorSelectAllButton.first()).not.toBeChecked();
      await dataSettingsModal.clickOnXIconNoChanges();
      await portfolioCompliancePage.navigateToSingleCategoryTab('Water');
      await portfolioCompliancePage.openDataSettings();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
      await expect(checkboxLocatorSelectAllButton2.first()).toBeVisible();
      await expect(checkboxLocatorSelectAllButton2.first()).toBeChecked();
      await dataSettingsModal.clickOnCancelNoChanges();
      // Verify that the changes are applied on the ALL modal
      await portfolioCompliancePage.FiltersHazardCategoryAllTab.click();
      await portfolioCompliancePage.openDataSettings();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
      await expect(checkboxLocatorSelectAllButton.first()).toBeVisible();
      await expect(checkboxLocatorSelectAllButton.first()).not.toBeChecked();
    });
  });
  test('"Unsaved Changes": - Clicking "Discard Changes", discard all the changes and close both modals', async ({
    portfolioCompliancePage,
    dataSettingsModal,
    page,
  }) => {
    const categoryTitle = 'Solid Mass'; // TODO: set the categoory for test
    const categoryLocator = page.locator(
      '[data-testid="data-settings-modal-hazard-category"]',
      {
        has: page.locator('h6', { hasText: `${categoryTitle}` }),
      },
    );
    const checkboxLocatorSelectAllButton = categoryLocator.locator(
      'label:has-text("Select all") input[type="checkbox"]',
    );

    await test.step('Open Data Settings Modal', async () => {
      await portfolioCompliancePage.navigateToSingleCategoryTab(categoryTitle);
      await portfolioCompliancePage.openDataSettings();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
    });

    await test.step('Make changes and click on "Cancel"', async () => {
      await expect(checkboxLocatorSelectAllButton.first()).toBeVisible();
      await checkboxLocatorSelectAllButton.first().uncheck();
      await expect(checkboxLocatorSelectAllButton.first()).not.toBeChecked();
      await dataSettingsModal.clickOnCancelWithChanges();
      await dataSettingsModal.validateUnsavedChangesModalControls();
    });

    await test.step('Click on "Discard Changes" and verify the behavior', async () => {
      await dataSettingsModal.UnsavedChangesModalDiscardChangesButton.click();
      await expect(dataSettingsModal.UnsavedChangesModal).not.toBeVisible();
      await expect(dataSettingsModal.Body).not.toBeVisible();
      // Verify that the changes are not applied
      await portfolioCompliancePage.openDataSettings();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
      await expect(checkboxLocatorSelectAllButton.first()).toBeVisible();
      await expect(checkboxLocatorSelectAllButton.first()).toBeChecked();
    });
  });
});
