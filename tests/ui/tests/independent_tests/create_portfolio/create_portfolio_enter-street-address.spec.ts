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

test.describe('Validate Enter Street Address functionality', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/create-portfolio');
  });
  test('Validate controls for "Enter Street Address" type ', async ({
    importDataTab,
  }) => {
    await importDataTab.selectEnterStreetAddressType();
    await importDataTab.validateEnterStreetAddressControls();
  });

  test('Add address manually', async ({ importDataTab }) => {
    const address = 'California';
    await importDataTab.selectEnterStreetAddressType();
    await importDataTab.setAddresses(address);
    await importDataTab.deleteChipByAddress(address);
  });

  test('Street address field should not accept empty values', async ({
    importDataTab,
  }) => {
    await importDataTab.selectEnterStreetAddressType();
    await importDataTab.EnterStreetAddressInputField.fill('');
    await importDataTab.EnterStreetAddressInputEnterIcon.click();
    await expect(
      importDataTab.EnterStreetAddressFormHelpTextInvalidLocation,
    ).toBeVisible();
  });

  test('"Validate button becomes active when street address is  added', async ({
    createPortfolioPage,
    importDataTab,
  }) => {
    await importDataTab.selectEnterStreetAddressType();
    await importDataTab.setAddresses('California');
    await expect(createPortfolioPage.NextButton).toBeVisible();
    expect(createPortfolioPage.NextButton.isEnabled()).toBeTruthy();
  });

  test('Delete added address(chip)', async ({ importDataTab }) => {
    const address = 'California';
    await importDataTab.selectEnterStreetAddressType();
    await importDataTab.setAddresses(address);
    await importDataTab.deleteChipByAddress(address);
  });
});
