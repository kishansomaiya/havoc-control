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

test.describe('Portfolio: COMPLIANCE > All > EU HAZARD ALIGNMENT', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;

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

      await waitForContentLoaded(page);
      await expect(portfolioCompliancePage.Body).toBeVisible();
    },
  );

  test('Validate table controls', async ({ portfolioCompliancePage }) => {
    await portfolioCompliancePage.validateEuHazardAlignment();
  });

  test('Validate availablity legend', async ({
    portfolioCompliancePage,
    page,
  }) => {
    // const jupiterMetricIcon = portfolioCompliancePage.AvailabilityLegendItem.filter({hasText: 'Jupiter Metric'}).locator('svg');
    // const riskDriverIcon = portfolioCompliancePage.AvailabilityLegendItem.filter({hasText: 'Risk Driver'}).locator('svg');
    // const notAvailableIcon = portfolioCompliancePage.AvailabilityLegendItem.filter({hasText: 'Not Available'}).locator('svg');

    await portfolioCompliancePage.AvailabilityLegend.scrollIntoViewIfNeeded();
    await expect(portfolioCompliancePage.AvailabilityLegend).toBeVisible();
    await expect(portfolioCompliancePage.AvailabilityLegendItem).toHaveCount(3);
    await expect(
      portfolioCompliancePage.AvailabilityLegendItem.nth(0),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.AvailabilityLegendItemIcon,
    ).toHaveCount(3);
    await expect(
      portfolioCompliancePage.AvailabilityLegendItemIcon.nth(0),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.AvailabilityLegendItemIcon.nth(1),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.AvailabilityLegendItemIcon.nth(2),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.AvailabilityLegendItemLabel.nth(0),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.AvailabilityLegendItemLabel.nth(0),
    ).toHaveText('Jupiter Metric');
    await expect(
      portfolioCompliancePage.AvailabilityLegendItemLabel.nth(1),
    ).toHaveText('Risk Driver');
    await expect(
      portfolioCompliancePage.AvailabilityLegendItemLabel.nth(2),
    ).toHaveText('Not Available');
    await waitForContentLoaded(page);
  });

  test('Validate Category-related titles', async ({
    portfolioCompliancePage,
  }) => {
    const categoryTitle = '-Related Hazard';
    await portfolioCompliancePage.EuHazardAlignment.scrollIntoViewIfNeeded();
    await expect(portfolioCompliancePage.TableHeaderTitle).toHaveCount(4);
    await expect(portfolioCompliancePage.TableHeaderTitle.nth(0)).toBeVisible();
    await expect(portfolioCompliancePage.TableHeaderTitle.nth(0)).toHaveText(
      `Temperature${categoryTitle}`,
    );
    await expect(portfolioCompliancePage.TableHeaderTitle.nth(1)).toBeVisible();
    await expect(portfolioCompliancePage.TableHeaderTitle.nth(1)).toHaveText(
      `Wind${categoryTitle}`,
    );
    await expect(portfolioCompliancePage.TableHeaderTitle.nth(2)).toBeVisible();
    await expect(portfolioCompliancePage.TableHeaderTitle.nth(2)).toHaveText(
      `Water${categoryTitle}`,
    );
    await expect(portfolioCompliancePage.TableHeaderTitle.nth(3)).toBeVisible();
    await expect(portfolioCompliancePage.TableHeaderTitle.nth(3)).toHaveText(
      `Solid Mass${categoryTitle}`,
    );
  });

  test('Disabled on the "Data Settings" modal category should NOT be displayed in the table', async ({
    portfolioCompliancePage,
    dataSettingsModal,
    page,
  }) => {
    const categoryTitle = '-Related Hazard';

    await test.step('Open Data Settings Modal and disable "Temperature" category', async () => {
      await portfolioCompliancePage.openDataSettings();
      await dataSettingsModal.disableToggle('Temperature');
      await dataSettingsModal.clickOnApply();
      await waitForContentLoaded(page);
    });

    await test.step('Verify that the category header is not displayed', async () => {
      await portfolioCompliancePage.EuHazardAlignment.scrollIntoViewIfNeeded();
      await expect(portfolioCompliancePage.TableHeaderTitle).toHaveCount(3);
      await expect(
        portfolioCompliancePage.TableHeaderTitle.nth(0),
      ).toBeVisible();
      await expect(portfolioCompliancePage.TableHeaderTitle.nth(0)).toHaveText(
        `Wind${categoryTitle}`,
      );
      await expect(
        portfolioCompliancePage.TableHeaderTitle.nth(1),
      ).toBeVisible();
      await expect(portfolioCompliancePage.TableHeaderTitle.nth(1)).toHaveText(
        `Water${categoryTitle}`,
      );
      await expect(
        portfolioCompliancePage.TableHeaderTitle.nth(2),
      ).toBeVisible();
      await expect(portfolioCompliancePage.TableHeaderTitle.nth(2)).toHaveText(
        `Solid Mass${categoryTitle}`,
      );
      await expect(
        portfolioCompliancePage.TableHeaderTitle.nth(3),
      ).not.toBeVisible();
      await expect(
        portfolioCompliancePage.TableHeaderTitle.filter({
          hasText: `Temperature${categoryTitle}`,
        }),
      ).not.toBeVisible();
    });
  });
  test('The correct metric data should be displayed in the table', async ({
    portfolioCompliancePage,
  }) => {
    await portfolioCompliancePage.EuHazardAlignment.scrollIntoViewIfNeeded();
    await expect(
      portfolioCompliancePage.TableBodyCellMetric.first(),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.TableBodyCellMetricExposure.first(),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.TableBodyCellMetricTitle.first(),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.TableBodyCellMetricTitle.first(),
    ).toHaveText('Changing temperature (air)');
    await expect(
      portfolioCompliancePage.TableBodyCellMetricTitle.first(),
    ).toHaveCSS('font-weight', '600');
    await expect(
      portfolioCompliancePage.TableBodyCellMetricSource.first(),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.TableBodyCellMetricSource.first(),
    ).toHaveText('Jupiter Metric:');
    await expect(
      portfolioCompliancePage.TableBodyCellMetricSource.first(),
    ).toHaveCSS('font-style', 'italic');
    await expect(
      portfolioCompliancePage.TableBodyCellMetricSource.first(),
    ).toHaveCSS('text-decoration-line', 'underline');
    await expect(
      portfolioCompliancePage.TableBodyCellMetricDescription.first(),
    ).toBeVisible();
    await expect(
      portfolioCompliancePage.TableBodyCellMetricDescription.first(),
    ).toHaveText(
      'Jupiter Metric: "Average or maximum annual temperature (in C)"',
    );
    await expect(
      portfolioCompliancePage.TableBodyCellMetricDescription.first(),
    ).toHaveCSS('font-style', 'italic');
  });
});
