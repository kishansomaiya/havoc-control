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

test.describe('Portfolio: COMPLIANCE > Filters', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;
  const dataSetVersion = PORTFOLIO_CONFIGS['v3.2.0'].dataSetVersion;
  const analysisType = 'Disclosure, Perils, EI, Scores';
  let apiYears: number[] = [];

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

      // Helper function to wait for a specific response
      async function waitForResponseByName(page, expectedName) {
        return page.waitForResponse(async (response) => {
          if (
            response.url().includes('/result_sets/') &&
            response.status() === 200
          ) {
            const responseBody = await response.json();
            return responseBody.name === expectedName;
          }
        });
      }

      // Timeout function to allow for cases where only one response is received
      async function waitWithTimeout(promise, timeout) {
        return Promise.race([
          promise,
          new Promise((resolve) => setTimeout(() => resolve(null), timeout)),
        ]);
      }

      // Wait for the "Disclosure result set" response
      const [disclosureResponse] = await Promise.all([
        waitWithTimeout(
          waitForResponseByName(page, 'Disclosure result set'),
          5000,
        ),
      ]);

      // Process 'Disclosure result set' response if it exists
      if (disclosureResponse) {
        const disclosureResponseBody = await disclosureResponse.json();
        apiYears = disclosureResponseBody.options.perils_options.years;
      }

      await waitForContentLoaded(page);
      await expect(portfolioCompliancePage.Body).toBeVisible();
    },
  );

  test('Validate main controls', async ({
    portfolioHeader,
    portfolioCompliancePage,
  }) => {
    test.setTimeout(TIMEOUT);
    await portfolioHeader.validateControls(
      portfolioName,
      analysisType,
      dataSetVersion,
    );
    await portfolioCompliancePage.validateControls();
  });

  // Test: Validate breadcrumbs
  test('Validate breadcrumbs', async ({ page, portfolioHeader }) => {
    await waitForContentLoaded(page);
    await portfolioHeader.validateBreadcrumbs();
  });

  // Test: Validate tabs
  test('Validate header tabs', async ({ portfolioHeader }) => {
    await portfolioHeader.validateTablist();
  });

  // Test: Validate default tab state (Overview, Hazard...)
  test('Validate default header tab state', async ({ portfolioHeader }) => {
    await portfolioHeader.validateDefaultTabsState('Compliance');
  });

  // Test: Validate Hazard Categories
  test('Validate Hazard Categories', async ({ portfolioCompliancePage }) => {
    await portfolioCompliancePage.validateHazardCategories();
  });

  // Test: Validate Hazard Categories
  test('Hazard Categories can be switched', async ({
    portfolioCompliancePage,
  }) => {
    const text = '-related Hazards';

    //Temperature
    await portfolioCompliancePage.FiltersHazardCategoryTemperatureTab.click();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryTemperatureTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryTemperatureTab,
    ).toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.ChartSingleRelatedHazardsTitle,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.ChartSingleRelatedHazardsTitle,
    ).toContainText(`Temperature${text}`);

    await expect(
      portfolioCompliancePage.FiltersHazardCategoryAllTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryAllTab,
    ).not.toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWaterTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWaterTab,
    ).not.toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWindTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWindTab,
    ).not.toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.FiltersHazardCategorySolidMassTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategorySolidMassTab,
    ).not.toHaveClass(/MuiButton-contained/);

    // Water
    await portfolioCompliancePage.FiltersHazardCategoryWaterTab.click();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWaterTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWaterTab,
    ).toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.ChartSingleRelatedHazardsTitle,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.ChartSingleRelatedHazardsTitle,
    ).toContainText(`Water${text}`);

    await expect(
      portfolioCompliancePage.FiltersHazardCategoryAllTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryAllTab,
    ).not.toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryTemperatureTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryTemperatureTab,
    ).not.toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWindTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWindTab,
    ).not.toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.FiltersHazardCategorySolidMassTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategorySolidMassTab,
    ).not.toHaveClass(/MuiButton-contained/);

    // Wind
    await portfolioCompliancePage.FiltersHazardCategoryWindTab.click();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWindTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWindTab,
    ).toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.ChartSingleRelatedHazardsTitle,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.ChartSingleRelatedHazardsTitle,
    ).toContainText(`Wind${text}`);

    await expect(
      portfolioCompliancePage.FiltersHazardCategoryAllTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryAllTab,
    ).not.toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryTemperatureTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryTemperatureTab,
    ).not.toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWaterTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWaterTab,
    ).not.toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.FiltersHazardCategorySolidMassTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategorySolidMassTab,
    ).not.toHaveClass(/MuiButton-contained/);

    // Solid Mass
    await portfolioCompliancePage.FiltersHazardCategorySolidMassTab.click();
    await expect(
      portfolioCompliancePage.FiltersHazardCategorySolidMassTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategorySolidMassTab,
    ).toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.ChartSingleRelatedHazardsTitle,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.ChartSingleRelatedHazardsTitle,
    ).toContainText(`Solid Mass${text}`);

    await expect(
      portfolioCompliancePage.FiltersHazardCategoryAllTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryAllTab,
    ).not.toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryTemperatureTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryTemperatureTab,
    ).not.toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWaterTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWaterTab,
    ).not.toHaveClass(/MuiButton-contained/);
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWindTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWindTab,
    ).not.toHaveClass(/MuiButton-contained/);
  });

  // Test: Validate Scenario Dropdown
  test('SCENARIO: Validate "Scenario" Dropdown', async ({
    portfolioCompliancePage,
  }) => {
    await portfolioCompliancePage.validateScenarioDropdown();
    await portfolioCompliancePage.setScenario126();
    await portfolioCompliancePage.setScenario245();
    await portfolioCompliancePage.setScenario585();
  });

  // Test: Validate Years Dropdown
  test('YEAR: Validate "Years" Dropdown', async ({
    portfolioCompliancePage,
  }) => {
    await portfolioCompliancePage.validateApiYears(apiYears);
  });

  test('YEAR: Validate "Years" Dropdown helptext', async ({
    portfolioCompliancePage,
  }) => {
    await expect(portfolioCompliancePage.FiltersYearHelpText).toBeVisible();
    await expect(portfolioCompliancePage.FiltersYearHelpText).toContainText(
      'Regulations require 3 time-horizons',
    );
    await expect(
      portfolioCompliancePage.FiltersYearHelpTextTooltip,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersYearHelpTextTooltip,
    ).toHaveAttribute(
      'aria-label',
      'Regulations require reports to define 3 years; a short-term, medium-term, and long-term time-horizon.',
    );
  });

  // Test: Validate selected Years by default
  test('YEAR: Validate selected "Years" by default', async ({
    portfolioCompliancePage,
  }) => {
    await portfolioCompliancePage.validateDefaultSelectedYears();
  });

  test('YEAR: Should remove the "year" chip when the "X" icon is clicked', async ({
    portfolioCompliancePage,
  }) => {
    const yearToRemove = 2025;
    await portfolioCompliancePage.removeYearChip(yearToRemove);
    await portfolioCompliancePage.isYearChipRemoved(yearToRemove);
    await expect(portfolioCompliancePage.FiltersYearChip).toHaveCount(2);
  });

  test('YEAR: Unable to remove last year chip', async ({
    portfolioCompliancePage,
  }) => {
    const yearToRemove = 2025;
    const yearToRemove2 = 2040;
    await portfolioCompliancePage.removeYearChip(yearToRemove);
    await portfolioCompliancePage.isYearChipRemoved(yearToRemove);
    await portfolioCompliancePage.removeYearChip(yearToRemove2);
    await portfolioCompliancePage.isYearChipRemoved(yearToRemove2);
    await expect(portfolioCompliancePage.FiltersYearChip).toHaveCount(1);
    await expect(portfolioCompliancePage.FiltersYearChip).toHaveClass(
      /Mui-disabled/,
    );
  });

  test('YEAR: At least one checkbox should be selected', async ({
    page,
    portfolioCompliancePage,
  }) => {
    const yearToRemove = 2025;
    const yearToRemove2 = 2040;

    await portfolioCompliancePage.removeYearChip(yearToRemove);
    await portfolioCompliancePage.isYearChipRemoved(yearToRemove);
    await portfolioCompliancePage.removeYearChip(yearToRemove2);
    await portfolioCompliancePage.isYearChipRemoved(yearToRemove2);

    const yearDropDown = portfolioCompliancePage.FiltersYearMultiSelect;
    await yearDropDown.click();

    await expect(portfolioCompliancePage.FiltersYearListLabel).toBeVisible();
    await expect(page.locator('[data-value="2020"]')).toBeVisible();
    await expect(page.locator('[data-value="2020"]')).not.toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2020"]')).not.toHaveClass(
      /Mui-selected/,
    );
    await expect(page.locator('[data-value="2025"]')).toBeVisible();
    await expect(page.locator('[data-value="2025"]')).not.toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2025"]')).not.toHaveClass(
      /Mui-selected/,
    );
    await expect(page.locator('[data-value="2030"]')).toBeVisible();
    await expect(page.locator('[data-value="2030"]')).not.toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2030"]')).not.toHaveClass(
      /Mui-selected/,
    );
    await expect(page.locator('[data-value="2040"]')).toBeVisible();
    await expect(page.locator('[data-value="2040"]')).not.toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2040"]')).not.toHaveClass(
      /Mui-selected/,
    );
    await expect(page.locator('[data-value="2050"]')).toBeVisible();
    await expect(page.locator('[data-value="2050"]')).toHaveClass(
      /Mui-selected/,
    );
    await expect(page.locator('[data-value="2050"]')).toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2075"]')).toBeVisible();
    await expect(page.locator('[data-value="2075"]')).not.toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2075"]')).not.toHaveClass(
      /Mui-selected/,
    );
    await expect(page.locator('[data-value="2100"]')).toBeVisible();
    await expect(page.locator('[data-value="2100"]')).not.toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2100"]')).not.toHaveClass(
      /Mui-selected/,
    );
  });
  test('YEAR: Maximum 3 checkboes can be selected', async ({
    page,
    portfolioCompliancePage,
  }) => {
    const yearDropDown = portfolioCompliancePage.FiltersYearMultiSelect;
    await yearDropDown.click();

    await expect(portfolioCompliancePage.FiltersYearListLabel).toBeVisible();
    await expect(page.locator('[data-value="2020"]')).toBeVisible();
    await expect(page.locator('[data-value="2020"]')).toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2020"]')).not.toHaveClass(
      /Mui-selected/,
    );
    await expect(page.locator('[data-value="2025"]')).toBeVisible();
    await expect(page.locator('[data-value="2025"]')).not.toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2025"]')).toHaveClass(
      /Mui-selected/,
    );
    await expect(page.locator('[data-value="2030"]')).toBeVisible();
    await expect(page.locator('[data-value="2030"]')).toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2030"]')).not.toHaveClass(
      /Mui-selected/,
    );
    await expect(page.locator('[data-value="2040"]')).toBeVisible();
    await expect(page.locator('[data-value="2040"]')).not.toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2040"]')).toHaveClass(
      /Mui-selected/,
    );
    await expect(page.locator('[data-value="2050"]')).toBeVisible();
    await expect(page.locator('[data-value="2050"]')).toHaveClass(
      /Mui-selected/,
    );
    await expect(page.locator('[data-value="2050"]')).not.toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2075"]')).toBeVisible();
    await expect(page.locator('[data-value="2075"]')).toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2075"]')).not.toHaveClass(
      /Mui-selected/,
    );
    await expect(page.locator('[data-value="2100"]')).toBeVisible();
    await expect(page.locator('[data-value="2100"]')).toHaveClass(
      /Mui-disabled/,
    );
    await expect(page.locator('[data-value="2100"]')).not.toHaveClass(
      /Mui-selected/,
    );
  });

  test('YEAR: Checkboes can be selected/deselected', async ({
    page,
    portfolioCompliancePage,
  }) => {
    const yearDropDown = portfolioCompliancePage.FiltersYearMultiSelect;
    const year = 2025;

    const yearChip2040 = portfolioCompliancePage.FiltersYearChip.filter({
      hasText: '2040',
    });
    const yearChip2050 = portfolioCompliancePage.FiltersYearChip.filter({
      hasText: '2050',
    });
    const yearChip2100 = portfolioCompliancePage.FiltersYearChip.filter({
      hasText: '2100',
    });

    await yearDropDown.click();

    // uncheck the 2025 year
    await expect(portfolioCompliancePage.FiltersYearListLabel).toBeVisible();
    await expect(page.locator(`[data-value="${year}"]`)).toBeVisible();
    await expect(
      page.locator(`[data-value="${year}"]`).locator('input'),
    ).toBeChecked();
    await portfolioCompliancePage.clickCheckboxFor(year.toString());
    await expect(
      page.locator(`[data-value="${year}"]`).locator('input'),
    ).not.toBeChecked();

    // close the dropdown list
    await page.locator('.MuiBackdrop-root').first().click();
    await expect(
      portfolioCompliancePage.FiltersYearListLabel,
    ).not.toBeVisible();

    // Check that the unchecked year chip is not displayed
    await portfolioCompliancePage.isYearChipRemoved(year);
    await expect(portfolioCompliancePage.FiltersYearChip).toHaveCount(2);
    await expect(yearChip2040).toBeVisible();
    await expect(yearChip2040).not.toHaveClass(/Mui-disabled/);
    await expect(yearChip2050).toBeVisible();
    await expect(yearChip2050).not.toHaveClass(/Mui-disabled/);

    // uncheck the 2100 year
    await yearDropDown.click();
    const year2 = 2100;
    await expect(portfolioCompliancePage.FiltersYearListLabel).toBeVisible();
    await expect(page.locator(`[data-value="${year2}"]`)).toBeVisible();
    await expect(
      page.locator(`[data-value="${year2}"]`).locator('input'),
    ).not.toBeChecked();
    await portfolioCompliancePage.clickCheckboxFor(year2.toString());
    await expect(
      page.locator(`[data-value="${year2}"]`).locator('input'),
    ).toBeChecked();

    // close the dropdown list
    await page.locator('.MuiBackdrop-root').first().click();
    await expect(
      portfolioCompliancePage.FiltersYearListLabel,
    ).not.toBeVisible();

    // Check that the checked year chip is displayed
    await expect(portfolioCompliancePage.FiltersYearChip).toHaveCount(3);
    await expect(yearChip2040).toBeVisible();
    await expect(yearChip2040).not.toHaveClass(/Mui-disabled/);
    await expect(yearChip2050).toBeVisible();
    await expect(yearChip2050).not.toHaveClass(/Mui-disabled/);
    await expect(yearChip2100).toBeVisible();
    await expect(yearChip2100).not.toHaveClass(/Mui-disabled/);
  });

  test('The "Temperature" category TAB should be DISABLED if category is disabled on the "Data Settings" modal', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await expect(dataSettingsModal.Body).toBeVisible();
    await expect(dataSettingsModal.CategorySection).toBeVisible();
    await dataSettingsModal.disableToggle('Temperature');
    await dataSettingsModal.clickOnApply();
    // Check that the TAB is disabled
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryTemperatureTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryTemperatureTab,
    ).toBeDisabled();
  });

  test('The "Water" category TAB should be DISABLED if category is disabled on the "Data Settings" modal', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await expect(dataSettingsModal.Body).toBeVisible();
    await expect(dataSettingsModal.CategorySection).toBeVisible();
    await dataSettingsModal.disableToggle('Water');
    await dataSettingsModal.clickOnApply();
    // Check that the TAB is disabled
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWaterTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWaterTab,
    ).toBeDisabled();
  });

  test('The "Wind" category TAB should be DISABLED if category is disabled on the "Data Settings" modal', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await expect(dataSettingsModal.Body).toBeVisible();
    await expect(dataSettingsModal.CategorySection).toBeVisible();
    await dataSettingsModal.disableToggle('Wind');
    await dataSettingsModal.clickOnApply();
    // Check that the TAB is disabled
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWindTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategoryWindTab,
    ).toBeDisabled();
  });

  test('The "Solid Mass" category TAB should be DISABLED if category is disabled on the "Data Settings" modal', async ({
    portfolioCompliancePage,
    dataSettingsModal,
  }) => {
    await expect(portfolioCompliancePage.DataSettingsGearIcon).toBeVisible();
    await portfolioCompliancePage.DataSettingsGearIcon.click();
    await expect(dataSettingsModal.Body).toBeVisible();
    await expect(dataSettingsModal.CategorySection).toBeVisible();
    await dataSettingsModal.disableToggle('Solid Mass');
    await dataSettingsModal.clickOnApply();
    // Check that the TAB is disabled
    await expect(
      portfolioCompliancePage.FiltersHazardCategorySolidMassTab,
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.FiltersHazardCategorySolidMassTab,
    ).toBeDisabled();
  });
});
