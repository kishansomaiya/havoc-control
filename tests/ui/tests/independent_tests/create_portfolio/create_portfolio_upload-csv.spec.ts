import { EditSettings } from '@components/EditSettings';
import { ImportDataTab } from '@components/ImportData';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioList } from '@components/PortfolioList';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { extendedTest, expect } from '@utils/authFixture';
import { waitForContentLoaded } from '@utils/helpers';

const test = extendedTest.extend<{
  createPortfolioPage: CreatePortfolioPage;
  importDataTab: ImportDataTab;
  editSettingsTab: EditSettings;
  portfolioList: PortfolioList;
  portfolioItem: PortfolioItem;
}>({
  createPortfolioPage: async ({ page }, use) => {
    await use(new CreatePortfolioPage(page));
  },
  importDataTab: async ({ page }, use) => {
    await use(new ImportDataTab(page));
  },
  editSettingsTab: async ({ page }, use) => {
    await use(new EditSettings(page));
  },
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
  portfolioItem: async ({ page }, use) => {
    await use(new PortfolioItem(page));
  },
});

test.describe('Create Portfolio > Import Data', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create-portfolio');
  });

  test('Validate default controls', async ({ createPortfolioPage }) => {
    await createPortfolioPage.validateControls();
  });

  test('Verify "Download Template"', async ({ importDataTab }) => {
    await importDataTab.verifyDownloadTemplate();
  });

  test('Navigate to "Edit Settings" page', async ({
    page,
    importDataTab,
    editSettingsTab,
  }) => {
    await importDataTab.uploadLocationsAndNavigateToEditSettingsTab(
      'CSV_3_cities.csv',
    );
    await page.waitForLoadState('load');
    await expect(editSettingsTab.Form).toBeVisible();
  });

  test('Validate "Edit Settings" page controls', async ({
    page,
    importDataTab,
    editSettingsTab,
  }) => {
    await importDataTab.uploadLocationsAndNavigateToEditSettingsTab(
      'CSV_3_cities.csv',
    );
    await page.waitForLoadState('load');
    await editSettingsTab.validateControls();
    await editSettingsTab.validateAnalysisTypes();
  });

  test('Validate controls for "Upload .CSV File"', async ({
    importDataTab,
    page,
  }) => {
    await waitForContentLoaded(page);
    await importDataTab.validateUploadCsvControls();
  });

  test('Verify File upload', async ({ importDataTab }) => {
    // File name you want to upload from the /fixtures folder
    const fileName = 'CSV_3_cities.csv';
    await importDataTab.uploadFile(fileName);
    // Additional checks to ensure the file is uploaded and parsed correctly
    await importDataTab.validateFileInfo(fileName); // Replace 'file.csv' with actual file name as expected in the UI
    await importDataTab.validateSuccessFileUpload();
  });

  test('"Next" button becomes active when file upload validation passed', async ({
    createPortfolioPage,
    importDataTab,
  }) => {
    const fileName = 'CSV_3_cities.csv';
    await importDataTab.uploadFile(fileName);
    await importDataTab.validateFileInfo(fileName);
    await importDataTab.validateSuccessFileUpload();
    await expect(createPortfolioPage.NextButton).toBeVisible();
    const isEnabled = await createPortfolioPage.NextButton.isEnabled();
    expect(isEnabled).toBeTruthy();
  });
});
