import { EditSettings } from '@components/EditSettings';
import { ImportDataTab } from '@components/ImportData';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioList } from '@components/PortfolioList';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { extendedTest, expect } from '@utils/authFixture';

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

test.describe('Validate Enter Latitudes and Longitudes functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create-portfolio');
  });

  test('Validate controls for "Enter Latitudes and Longitudes" type', async ({
    importDataTab,
  }) => {
    await importDataTab.selectEnterLatLongType();
    await importDataTab.validateEnterLatLongControls();
  });

  test('Add location coordinates manually', async ({ importDataTab }) => {
    const coordinates = '40.7506644,-74.0030164';

    await importDataTab.selectEnterLatLongType();
    await importDataTab.setCoordinates(coordinates);
  });

  test('"Next" button becomes active when at least one location is added', async ({
    createPortfolioPage,
    importDataTab,
  }) => {
    const coordinates = '40.7506644,-74.0030164';
    await importDataTab.selectEnterLatLongType();
    await importDataTab.setCoordinates(coordinates);
    await expect(createPortfolioPage.NextButton).toBeVisible();
    const isEnabled = await createPortfolioPage.NextButton.isEnabled();
    expect(isEnabled).toBeTruthy();
  });

  test.skip('Delete added location(chip)', async ({ importDataTab }) => {
    const coordinates = '40.7506644,-74.0030164';
    await importDataTab.selectEnterLatLongType();
    await importDataTab.setCoordinates(coordinates);
    await importDataTab.deleteChipByCoordinates(coordinates);
  });
});
