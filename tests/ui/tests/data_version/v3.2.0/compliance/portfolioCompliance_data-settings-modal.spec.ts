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

test.describe('Portfolio: COMPLIANCE > All > "Data Settings" modal', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;
  let euHazardMetadata: string[] = [];
  let resultSetType: string[] = [];

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
        resultSetType = metadataResponseBody.metadata.result_set_type;
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

  test('Clicking on the gear icon should open the "Data Settings" modal window', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await expect(dataSettingsModal.Body).toBeVisible();
  });

  test('Validate "Data Settings" modal window', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await dataSettingsModal.validateControlsAll();
    await expect(dataSettingsModal.Title).toHaveText('Data Settings');
    await expect(dataSettingsModal.Description).toHaveText(
      'Select which data you would like to include in your results.',
    );
  });

  test('Validate "Temperature" hazard category', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    // Verify the gear icon for Data Settings is visible and click it
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();

    // Ensure the category section of the modal is visible
    await expect(dataSettingsModal.CategorySection).toBeVisible();

    // Scroll to the "Temperature" category section to ensure it is visible
    await dataSettingsModal.CategoryTemperature.scrollIntoViewIfNeeded();

    // Validate the toggle button for "Temperature" category is visible
    const toggle = dataSettingsModal.CategoryTemperatureToggleButton;
    await expect(toggle).toBeVisible();

    // Validate "Chronic Options" are visible within the "Temperature" category
    const chronicOptions = dataSettingsModal.CategoryTemperature.locator(
      'span',
      { hasText: 'Chronic Options' },
    );
    await expect(chronicOptions).toBeVisible();

    // Validate "Acute Options" are visible within the "Temperature" category
    const acuteOptions = dataSettingsModal.CategoryTemperature.locator('span', {
      hasText: 'Acute Options',
    });
    await expect(acuteOptions).toBeVisible();

    // Ensure response is available
    expect(euHazardMetadata).not.toBeNull();
    expect(resultSetType).not.toBeNull();
    expect(resultSetType).toEqual('disclosure');

    // Example criteria
    const criteria = { category: 'temperature', availability: 'available' };

    // Find all matching values along with their 'type', 'category', 'availability', and 'title'
    const matchingValues = findMatchingData(euHazardMetadata, criteria);

    // Playwright code to check if the values match the UI element
    if (matchingValues.length > 0) {
      // Iterate through all matching values and compare with UI
      for (const { title } of matchingValues) {
        const categoryTemperatureLocator =
          dataSettingsModal.CategoryTemperature;

        // Find the checkbox within the section based on the title
        const checkboxLocator = categoryTemperatureLocator
          .locator('label', { hasText: title })
          .locator('input[type="checkbox"]');

        // Validate that the checkbox is visible
        await expect(checkboxLocator).toBeVisible();
        await expect(checkboxLocator).toBeChecked();
      }
    }
  });
  test('Validate "Wind" hazard category', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await expect(dataSettingsModal.CategorySection).toBeVisible();

    await dataSettingsModal.CategoryWind.scrollIntoViewIfNeeded();

    const toggle = dataSettingsModal.CategoryWindToggleButton;
    await expect(toggle).toBeVisible();

    const chronicOptions = dataSettingsModal.CategoryWind.locator('span', {
      hasText: 'Chronic Options',
    });
    await expect(chronicOptions).toBeVisible();

    const acuteOptions = dataSettingsModal.CategoryWind.locator('span', {
      hasText: 'Acute Options',
    });
    await expect(acuteOptions).toBeVisible();

    // Ensure response is available
    expect(euHazardMetadata).not.toBeNull();
    expect(resultSetType).not.toBeNull();
    expect(resultSetType).toEqual('disclosure');

    // Example criteria
    const criteria = { category: 'wind', availability: 'available' };

    // Find all matching values along with their 'type', 'category', 'availability', and 'title'
    const matchingValues = findMatchingData(euHazardMetadata, criteria);

    const categoryWindLocator = dataSettingsModal.CategoryWind;

    // Playwright code to check if the values match the UI element
    if (matchingValues.length > 0) {
      // Iterate through all matching values and compare with UI
      for (const { title } of matchingValues) {
        if (title === 'Storms (dust and sandstorms)') {
          // Find the checkbox within the section based on the title
          const checkboxLocator = categoryWindLocator
            .locator('label', { hasText: title })
            .locator('input[type="checkbox"]');

          // Validate that the checkbox is visible
          await expect(checkboxLocator).not.toBeVisible();
        } else {
          // Find the checkbox within the section based on the title
          const checkboxLocator = categoryWindLocator
            .locator('label', { hasText: title })
            .locator('input[type="checkbox"]');

          // Validate that the checkbox is visible
          await expect(checkboxLocator).toBeVisible();
          await expect(checkboxLocator).toBeChecked();
        }
      }
    }
  });

  test('Validate "Water" hazard category', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await expect(dataSettingsModal.CategorySection).toBeVisible();

    await dataSettingsModal.CategoryWater.scrollIntoViewIfNeeded();

    const toggle = dataSettingsModal.CategoryWaterToggleButton;
    await expect(toggle).toBeVisible();

    const chronicOptions = dataSettingsModal.CategoryWater.locator('span', {
      hasText: 'Chronic Options',
    });
    await expect(chronicOptions).toBeVisible();
    const acuteOptions = dataSettingsModal.CategoryWater.locator('span', {
      hasText: 'Acute Options',
    });
    await expect(acuteOptions).toBeVisible();

    // Ensure response is available
    expect(euHazardMetadata).not.toBeNull();
    expect(resultSetType).not.toBeNull();
    expect(resultSetType).toEqual('disclosure');

    // Example criteria
    const criteria = { category: 'water', availability: 'available' };

    // Find all matching values along with their 'type', 'category', 'availability', and 'title'
    const matchingValues = findMatchingData(euHazardMetadata, criteria);

    const categoryWaterLocator = dataSettingsModal.CategoryWater;

    // Playwright code to check if the values match the UI element
    if (matchingValues.length > 0) {
      // Iterate through all matching values and compare with UI
      for (const { title } of matchingValues) {
        if (title === 'Precipitation or hydrological variability') {
          // Find the checkbox within the section based on the title
          const checkboxLocator = categoryWaterLocator
            .locator('label', { hasText: title })
            .locator('input[type="checkbox"]');

          // Validate that the checkbox is visible
          await expect(checkboxLocator).not.toBeVisible();
        } else {
          // Find the checkbox within the section based on the title
          const checkboxLocator = categoryWaterLocator
            .locator('label', { hasText: title })
            .locator('input[type="checkbox"]');

          // Validate that the checkbox is visible
          await expect(checkboxLocator).toBeVisible();
          await expect(checkboxLocator).toBeChecked();
        }
      }
    }
  });

  test('Validate "Solid Mass" hazard category', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await expect(dataSettingsModal.CategorySection).toBeVisible();

    await dataSettingsModal.CategoryWater.scrollIntoViewIfNeeded();

    //
    const toggle = dataSettingsModal.CategorySolidMassToggleButton;
    await expect(toggle).toBeVisible();

    const chronicOptions = dataSettingsModal.CategorySolidMass.locator('span', {
      hasText: 'Chronic Options',
    });
    await expect(chronicOptions).toBeVisible();
    const acuteOptions = dataSettingsModal.CategorySolidMass.locator('span', {
      hasText: 'Acute Options',
    });
    await expect(acuteOptions).toBeVisible();

    // Ensure response is available
    expect(euHazardMetadata).not.toBeNull();
    expect(resultSetType).not.toBeNull();
    expect(resultSetType).toEqual('disclosure');

    // Example criteria
    const criteria = { category: 'solid_mass', availability: 'available' };

    // Find all matching values along with their 'type', 'category', 'availability', and 'title'
    const matchingValues = findMatchingData(euHazardMetadata, criteria);

    const categorySolidMassLocator = dataSettingsModal.CategorySolidMass;

    // Playwright code to check if the values match the UI element
    if (matchingValues.length > 0) {
      // Iterate through all matching values and compare with UI
      for (const { title } of matchingValues) {
        // Find the checkbox within the section based on the title
        const checkboxLocator = categorySolidMassLocator
          .locator('label', { hasText: title })
          .locator('input[type="checkbox"]');

        // Validate that the checkbox is visible
        await expect(checkboxLocator).toBeVisible();
        await expect(checkboxLocator).toBeChecked();
      }
    }
  });

  test('TEMPERATURE: The "Select all" check-box works properly', async ({
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
    const CategoryToggleButton = page
      .locator('[data-testid="data-settings-modal-hazard-category-toggle"]')
      .filter({ hasText: `${categoryTitle}` });
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
      for (const { title } of metrics) {
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
      await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
      await portfolioCompliancePage.DataSettingsGearIcon.click();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
      await categoryLocator.scrollIntoViewIfNeeded();
    });

    await test.step('Validate Chronic Options', async () => {
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );
    });

    await test.step('Validate Acute Options', async () => {
      await validateCheckboxes(
        sectionLocators.acute,
        metrics.acute,
        false,
        true,
        true,
      );
    });

    await test.step('Uncheck "Select all" for Chronic and validate changes', async () => {
      await checkboxLocatorSelectAllButton.first().uncheck();
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

    await test.step('Verify that the category toogle is disabled when all checkboxes are unchecked', async () => {
      // Uncheck "Select all" for Chronic and Acute and validate changes
      await checkboxLocatorSelectAllButton.first().uncheck();
      await checkboxLocatorSelectAllButton.nth(1).uncheck();
      // Verify that the category toogle is disabled when all checkboxes are unchecked
      await expect(CategoryToggleButton.locator('input')).not.toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).toBeDisabled();
      await expect(checkboxLocatorSelectAll.nth(1)).toBeDisabled();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        true,
        true,
        false,
      );
      await validateCheckboxes(
        sectionLocators.acute,
        metrics.acute,
        true,
        true,
        false,
      );
    });

    await test.step('Verify that the category toogle is ENABLED and all checkboxes are visible, enabled and checked', async () => {
      // Enable thecategory toggle
      await CategoryToggleButton.click();
      // Verify that the category toogle is ENABLED and all checkboxes are visible, enabled and checked
      await expect(CategoryToggleButton.locator('input')).toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).not.toBeDisabled();
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

  test('WIND: The "Select all" check-box works properly', async ({
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
    const CategoryToggleButton = page
      .locator('[data-testid="data-settings-modal-hazard-category-toggle"]')
      .filter({ hasText: `${categoryTitle}` });
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
      await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
      await portfolioCompliancePage.DataSettingsGearIcon.click();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
      await categoryLocator.scrollIntoViewIfNeeded();
    });

    await test.step('Validate Chronic Options', async () => {
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );
    });

    await test.step('Validate Acute Options', async () => {
      await validateCheckboxes(
        sectionLocators.acute,
        metrics.acute,
        false,
        true,
        true,
      );
    });

    await test.step('Uncheck "Select all" for Chronic and validate changes', async () => {
      await checkboxLocatorSelectAllButton.first().uncheck();
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

    await test.step('Verify that the category toogle is disabled when all checkboxes are unchecked', async () => {
      // Uncheck "Select all" for Chronic and Acute and validate changes
      await checkboxLocatorSelectAllButton.first().uncheck();
      await checkboxLocatorSelectAllButton.nth(1).uncheck();
      // Verify that the category toogle is disabled when all checkboxes are unchecked
      await expect(CategoryToggleButton.locator('input')).not.toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).toBeDisabled();
      await expect(checkboxLocatorSelectAll.nth(1)).toBeDisabled();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        true,
        true,
        false,
      );
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.acute,
        true,
        true,
        false,
      );
    });

    await test.step('Verify that the category toogle is ENABLED and all checkboxes are visible, enabled and checked', async () => {
      // Enable thecategory toggle
      await CategoryToggleButton.click();
      // Verify that the category toogle is ENABLED and all checkboxes are visible, enabled and checked
      await expect(CategoryToggleButton.locator('input')).toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).not.toBeDisabled();
      await expect(checkboxLocatorSelectAll.nth(1)).not.toBeDisabled();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.acute,
        false,
        true,
        true,
      );
    });
  });
  test('WATER: The "Select all" check-box works properly', async ({
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
    const CategoryToggleButton = page
      .locator('[data-testid="data-settings-modal-hazard-category-toggle"]')
      .filter({ hasText: `${categoryTitle}` });
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
      await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
      await portfolioCompliancePage.DataSettingsGearIcon.click();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
      await categoryLocator.scrollIntoViewIfNeeded();
    });

    await test.step('Validate Chronic Options', async () => {
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );
    });

    await test.step('Validate Acute Options', async () => {
      await validateCheckboxes(
        sectionLocators.acute,
        metrics.acute,
        false,
        true,
        true,
      );
    });

    await test.step('Uncheck "Select all" for Chronic and validate changes', async () => {
      await checkboxLocatorSelectAllButton.first().uncheck();
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

    await test.step('Verify that the category toogle is disabled when all checkboxes are unchecked', async () => {
      // Uncheck "Select all" for Chronic and Acute and validate changes
      await checkboxLocatorSelectAllButton.first().uncheck();
      await checkboxLocatorSelectAllButton.nth(1).uncheck();
      // Verify that the category toogle is disabled when all checkboxes are unchecked
      await expect(CategoryToggleButton.locator('input')).not.toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).toBeDisabled();
      await expect(checkboxLocatorSelectAll.nth(1)).toBeDisabled();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        true,
        true,
        false,
      );
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.acute,
        true,
        true,
        false,
      );
    });

    await test.step('Verify that the category toogle is ENABLED and all checkboxes are visible, enabled and checked', async () => {
      // Enable thecategory toggle
      await CategoryToggleButton.click();
      // Verify that the category toogle is ENABLED and all checkboxes are visible, enabled and checked
      await expect(CategoryToggleButton.locator('input')).toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).not.toBeDisabled();
      await expect(checkboxLocatorSelectAll.nth(1)).not.toBeDisabled();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.acute,
        false,
        true,
        true,
      );
    });
  });
  test('SOLID MASS: The "Select all" check-box works properly', async ({
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
    const CategoryToggleButton = page
      .locator('[data-testid="data-settings-modal-hazard-category-toggle"]')
      .filter({ hasText: `${categoryTitle}` });
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
      for (const { title } of metrics) {
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
      await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
      await portfolioCompliancePage.DataSettingsGearIcon.click();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
      await categoryLocator.scrollIntoViewIfNeeded();
    });

    await test.step('Validate Chronic Options', async () => {
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );
    });

    await test.step('Validate Acute Options', async () => {
      await validateCheckboxes(
        sectionLocators.acute,
        metrics.acute,
        false,
        true,
        true,
      );
    });

    await test.step('Uncheck "Select all" for Chronic and validate changes', async () => {
      await checkboxLocatorSelectAllButton.first().uncheck();
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

    await test.step('Verify that the category toogle is disabled when all checkboxes are unchecked', async () => {
      // Uncheck "Select all" for Chronic and Acute and validate changes
      await checkboxLocatorSelectAllButton.first().uncheck();
      await checkboxLocatorSelectAllButton.nth(1).uncheck();
      // Verify that the category toogle is disabled when all checkboxes are unchecked
      await expect(CategoryToggleButton.locator('input')).not.toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).toBeDisabled();
      await expect(checkboxLocatorSelectAll.nth(1)).toBeDisabled();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        true,
        true,
        false,
      );
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.acute,
        true,
        true,
        false,
      );
    });

    await test.step('Verify that the category toogle is ENABLED and all checkboxes are visible, enabled and checked', async () => {
      // Enable thecategory toggle
      await CategoryToggleButton.click();
      // Verify that the category toogle is ENABLED and all checkboxes are visible, enabled and checked
      await expect(CategoryToggleButton.locator('input')).toBeChecked();
      await expect(checkboxLocatorSelectAll.first()).not.toBeDisabled();
      await expect(checkboxLocatorSelectAll.nth(1)).not.toBeDisabled();
      await validateCheckboxes(
        sectionLocators.chronic,
        metrics.chronic,
        false,
        true,
        true,
      );
      await validateCheckboxes(
        sectionLocators.chronic,
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
      for (const { title } of metrics) {
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
      await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
      await portfolioCompliancePage.DataSettingsGearIcon.click();
      await expect(dataSettingsModal.CategorySection).toBeVisible();
      await categoryLocator.scrollIntoViewIfNeeded();
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

  test('When All cagories are disabled, the error message is shown', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await expect(dataSettingsModal.Body).toBeVisible();
    await expect(dataSettingsModal.CategorySection).toBeVisible();
    await dataSettingsModal.disableToggle('Temperature');
    await dataSettingsModal.disableToggle('Wind');
    await dataSettingsModal.disableToggle('Water');
    await dataSettingsModal.disableToggle('Solid Mass');
    await expect(dataSettingsModal.ErrorMessage).toBeVisible();
    await expect(dataSettingsModal.ErrorMessage).toHaveText(
      'At least one metric needs to be selected and enabled',
    );
    await expect(dataSettingsModal.ApplyButton).toBeDisabled();
  });

  test('Validate the "Unsaved Changes" modal', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await expect(dataSettingsModal.Body).toBeVisible();
    await expect(dataSettingsModal.CategorySection).toBeVisible();
    await dataSettingsModal.disableToggle('Temperature');
    await dataSettingsModal.clickOnCancelWithChanges();
    await dataSettingsModal.validateUnsavedChangesModalControls();
  });

  test('"Unsaved Changes": - Clicking "Go Back", closes the Unsaved Changes modal and keep Data Settings modal opened', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await expect(dataSettingsModal.Body).toBeVisible();
    await expect(dataSettingsModal.CategorySection).toBeVisible();
    await dataSettingsModal.disableToggle('Temperature');
    await dataSettingsModal.clickOnCancelWithChanges();
    await dataSettingsModal.validateUnsavedChangesModalControls();
    await dataSettingsModal.UnsavedChangesModalGoBackButton.click();
    await expect(dataSettingsModal.UnsavedChangesModal).not.toBeVisible();
    await expect(dataSettingsModal.Body).toBeVisible();
    await expect(dataSettingsModal.CategorySection).toBeVisible();
    await expect(
      dataSettingsModal.CategoryTemperatureToggleButton,
    ).toBeVisible();
    await expect(
      dataSettingsModal.CategoryTemperatureToggleButton.locator('input'),
    ).not.toBeChecked();
  });

  test('"Unsaved Changes": - Clicking "Discard Changes", discard all the changes and close both modals', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await expect(dataSettingsModal.Body).toBeVisible();
    await expect(dataSettingsModal.CategorySection).toBeVisible();
    await dataSettingsModal.disableToggle('Temperature');
    await dataSettingsModal.clickOnCancelWithChanges();
    await dataSettingsModal.validateUnsavedChangesModalControls();
    await dataSettingsModal.UnsavedChangesModalDiscardChangesButton.click();
    await expect(dataSettingsModal.UnsavedChangesModal).not.toBeVisible();
    await expect(dataSettingsModal.Body).not.toBeVisible();

    // Verify that the changes are not applied
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await expect(dataSettingsModal.Body).toBeVisible();
    await expect(dataSettingsModal.CategorySection).toBeVisible();
    await expect(
      dataSettingsModal.CategoryTemperatureToggleButton,
    ).toBeVisible();
    await expect(
      dataSettingsModal.CategoryTemperatureToggleButton.locator('input'),
    ).toBeChecked();
  });
});
