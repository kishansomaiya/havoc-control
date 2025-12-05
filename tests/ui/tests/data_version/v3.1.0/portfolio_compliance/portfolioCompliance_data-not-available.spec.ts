import { extendedTest, expect } from '@utils/authFixture';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { PortfolioList } from '@components/PortfolioList';
import { PortfolioHeader } from '@components/PortfolioHeader';
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

test.describe('Portfolio: COMPLIANCE - Data Not Available', () => {
  const portfolioName = PORTFOLIO_CONFIGS['v3.1.0'].portfolioName;

  test.beforeEach(
    'Go to Portfolio: COMPLIANCE page',
    async ({
      portfolioHeader,
      portfolioItem,
      portfolioList,
      portfolioInformation,
      homePage,
    }) => {
      test.setTimeout(TIMEOUT);

      await homePage.navigateByURL();
      await portfolioList.searchBy(portfolioName);
      await portfolioItem.PortfolioName.click();
      await portfolioInformation.waitForResultSet();
      await portfolioInformation.clickOnLaunchButton();
      await expect(portfolioHeader.ComplianceTab).toBeVisible();
      await portfolioHeader.ComplianceTab.hover();
    },
  );

  // Test: "Data Not Available" tooltip
  test('The "Data Not Available" tooltip is displayed if absent the "Disclosure result set" is not generated ', async ({
    portfolioHeader,
  }) => {
    test.setTimeout(TIMEOUT);
    await expect(portfolioHeader.DataNotAvailableTooltip).toBeVisible();
    await expect(portfolioHeader.DataNotAvailableTooltipTitle).toBeVisible();
    await expect(portfolioHeader.DataNotAvailableTooltipTitle).toContainText(
      'Data Not Available',
    );
    await expect(
      portfolioHeader.DataNotAvailableTooltipDescription,
    ).toBeVisible();
    await expect(
      portfolioHeader.DataNotAvailableTooltipDescription,
    ).toContainText(
      'To generate the required data for this analysis, go to Home > Edit Portfolio > ',
    );
    await expect(
      portfolioHeader.DataNotAvailableTooltipEditSettingsLink,
    ).toBeVisible();
    await expect(
      portfolioHeader.DataNotAvailableTooltipEditSettingsLink,
    ).toContainText('Edit Settings & Analysis');
  });

  // Test: The "Edit Settings & Analysis" link leads to the "Portfolio > 2. Edit Settings" step
  test('The "Edit Settings & Analysis" link leads to the "Portfolio > 2. Edit Settings" step', async ({
    portfolioHeader,
    editSettingsTab,
    editPortfolioPage,
  }) => {
    test.setTimeout(TIMEOUT);
    await expect(portfolioHeader.DataNotAvailableTooltip).toBeVisible();
    await expect(
      portfolioHeader.DataNotAvailableTooltipEditSettingsLink,
    ).toBeVisible();
    await portfolioHeader.DataNotAvailableTooltipEditSettingsLink.click();
    await expect(editSettingsTab.RunDisclosureAnalysis).toBeVisible();
    await editPortfolioPage.validateControls();
  });
});
