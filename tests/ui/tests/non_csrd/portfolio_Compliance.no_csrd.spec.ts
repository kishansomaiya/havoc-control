import { test as baseTest, expect } from '@playwright/test';
import { LoginPage } from '@pages/LoginPage';
import { HomePage } from '@pages/HomePage';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioList } from '@components/PortfolioList';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { Header } from '@components/Header';
import { waitForContentLoaded } from '@utils/helpers';
import { ImportDataTab } from '@components/ImportData';
import { EditSettings } from '@components/EditSettings';
import { PortfolioHeader } from '@components/PortfolioHeader';
import { PortfolioItemMenuDropDown } from '@components/PortfolioItemMenuDropDown';
import { EditPortfolioPage } from '@pages/EditPortfolioPage';
import { testConfig } from 'testConfig';

const test = baseTest.extend<{
  loginPage: LoginPage;
  homePage: HomePage;
  createPortfolioPage: CreatePortfolioPage;
  importDataTab: ImportDataTab;
  editSettingsTab: EditSettings;
  portfolioList: PortfolioList;
  portfolioItem: PortfolioItem;
  portfolioInformation: PortfolioInformation;
  header: Header;
  portfolioHeader: PortfolioHeader;
  portfolioItemMenuDropDown: PortfolioItemMenuDropDown;
  editPortfolioPage: EditPortfolioPage;
}>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  homePage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  createPortfolioPage: async ({ page }, use) => {
    await use(new CreatePortfolioPage(page));
  },
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
  portfolioItem: async ({ page }, use) => {
    await use(new PortfolioItem(page));
  },
  portfolioInformation: async ({ page }, use) => {
    await use(new PortfolioInformation(page));
  },
  header: async ({ page }, use) => {
    await use(new Header(page));
  },
  importDataTab: async ({ page }, use) => {
    await use(new ImportDataTab(page));
  },
  editSettingsTab: async ({ page }, use) => {
    await use(new EditSettings(page));
  },
  portfolioHeader: async ({ page }, use) => {
    await use(new PortfolioHeader(page));
  },
  portfolioItemMenuDropDown: async ({ page }, use) => {
    await use(new PortfolioItemMenuDropDown(page));
  },
  editPortfolioPage: async ({ page }, use) => {
    await use(new EditPortfolioPage(page));
  },
});

const portfolioName = 'Auto-P_S_EI_v3.2.0';

test.describe('Portfolio: COMPLIANCE - Disabled for No CSRD User', () => {
  test.beforeEach(async ({ page, loginPage, homePage, header }) => {
    await homePage.navigateByURL();
    await loginPage.loginToApplication(
      testConfig.dev.noCsrDUsername,
      testConfig.dev.noCsrDPassword,
    );
    await header.validateHeaderControls();
    await waitForContentLoaded(page);
  });

  test('Validate "Run Disclosure Analysis" checkbox is not visible', async ({
    page,
    createPortfolioPage,
    importDataTab,
    editSettingsTab,
  }) => {
    await createPortfolioPage.navigateByURL();
    await waitForContentLoaded(page);
    await createPortfolioPage.validateControls();
    await importDataTab.uploadLocationsAndNavigateToEditSettingsTab(
      'CSV_3_cities.csv',
    );
    await page.waitForLoadState('load');
    await editSettingsTab.validateControls();

    // checking if the "Run Disclosure Analysis" checkbox is not visible
    await expect(editSettingsTab.RunDisclosureAnalysis).not.toBeVisible();
  });

  test('Validate "Run Disclosure Analysis" checkbox is not visible in the Edit Portfolio page', async ({
    page,
    createPortfolioPage,
    portfolioList,
    portfolioItem,
    portfolioItemMenuDropDown,
    editPortfolioPage,
    editSettingsTab,
  }) => {
    test.setTimeout(120000);
    // Ensure portfolio exists (search and create if needed)
    await portfolioList.searchBy(portfolioName);
    const isPortfolioVisible = await portfolioItem.PortfolioName.isVisible();
    if (!isPortfolioVisible) {
      await createPortfolioPage.createPortfolio_PerilsScoresEconomicImpact(
        'CSV_3_cities.csv',
        '3.2.0',
        'Cat-Auto-P_S_EI_v3.2.0',
        portfolioName,
      );
    }
    await portfolioList.searchBy(portfolioName);
    await expect(portfolioItem.PortfolioName).toBeVisible();
    await portfolioItem.clickOnMenu();
    await expect(portfolioItemMenuDropDown.EditSettings).toBeVisible();
    await portfolioItemMenuDropDown.EditSettings.click();
    await page.waitForLoadState('load');
    await expect(
      portfolioItemMenuDropDown.editPortfolioPage.Title,
    ).toBeVisible();
    await expect(
      page.getByTestId('change-analysis-type-checkbox'),
    ).toBeVisible();
    await expect(editPortfolioPage.ChangeAnalysisTypeCheckBox).toBeVisible();
    await expect(
      editPortfolioPage.ChangeAnalysisTypeCheckBox,
    ).not.toBeChecked();
    await editPortfolioPage.ChangeAnalysisTypeCheckBox.click();
    await expect(editPortfolioPage.ChangeAnalysisTypeCheckBox).toBeChecked();
    await expect(editSettingsTab.RunDisclosureAnalysis).not.toBeVisible();
  });

  test('Validate compliance tab is disabled for user without CSRD in the Portfolio Overview page', async ({
    page,
    portfolioList,
    portfolioItem,
    portfolioInformation,
    portfolioHeader,
  }) => {
    await portfolioList.searchBy(portfolioName);
    test.setTimeout(100000); // Extend the test timeout to 10 minutes since we need to wait until the result sets are completed1 minute
    await portfolioItem.PortfolioName.click();
    await portfolioInformation.waitForResultSet();
    await portfolioInformation.clickOnLaunchButton();
    await expect(portfolioHeader.ComplianceTab).toBeVisible();
    await portfolioHeader.ComplianceTab.hover();
    await expect(page.getByRole('tooltip')).toContainText(
      'This functionality is unavailable with your current subscription. Please contact our support team if you would like to access the Compliance tab.',
    );
  });
});
