import { extendedTest, expect } from '@utils/authFixture';
import { HomePage } from '@pages/HomePage';
import { PortfolioList } from '@components/PortfolioList';
import { CreatePortfolioPage } from '@pages/CreatePortfolioPage';
import { PortfolioItem } from '@components/PortfolioItem';
import { PortfolioInformation } from '@components/PortfolioInformation';
import { PortfolioSlrModal } from '@components/PortfolioSlrModal';
import { ExportPortfolioMenuDropDown } from '@components/ExportPortfolioMenuDropDown';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import * as fs from 'fs';
import * as path from 'path';
import { ENV } from 'playwright.config';
import { testConfig } from 'testConfig';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

// Get the __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const test = extendedTest.extend<{
  homepage: HomePage;
  portfolioList: PortfolioList;
  createPortfolioPage: CreatePortfolioPage;
  portfolioInformation: PortfolioInformation;
  portfolioItem: PortfolioItem;
  portfolioSlrModal: PortfolioSlrModal;
  exportPortfolioMenuDropDown: ExportPortfolioMenuDropDown;
}>({
  homepage: async ({ page }, use) => {
    await use(new HomePage(page));
  },
  portfolioList: async ({ page }, use) => {
    await use(new PortfolioList(page));
  },
  createPortfolioPage: async ({ page }, use) => {
    await use(new CreatePortfolioPage(page));
  },
  portfolioInformation: async ({ page }, use) => {
    await use(new PortfolioInformation(page));
  },
  portfolioItem: async ({ page }, use) => {
    await use(new PortfolioItem(page));
  },
  portfolioSlrModal: async ({ page }, use) => {
    await use(new PortfolioSlrModal(page));
  },
  exportPortfolioMenuDropDown: async ({ page }, use) => {
    await use(new ExportPortfolioMenuDropDown(page));
  },
});

test.describe('Validate analysis type params', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(testConfig[ENV].appUrl);
  });

  test('Validate analysis type params for Perils, Scores + EI v3.2.0', async ({
    portfolioList,
    portfolioItem,
    portfolioInformation,
  }) => {
    const portfolioName = PORTFOLIO_CONFIGS['v3.2.0'].portfolioName;

    await portfolioList.searchBy(portfolioName);
    await portfolioItem.PortfolioName.click();
    await expect(portfolioInformation.Params).toBeVisible();
    // Load data from JSON file
    const data = JSON.parse(
      fs.readFileSync(
        path.resolve(__dirname, '../../../../fixtures/default_result_set.json'),
        'utf-8',
      ),
    );

    // Define parameters to check from JSON file
    const perilParams = data.perilDataParameters;
    const scoresParams = data.scoresParameters;
    const economicImpactParams = data.economicImpactsParameters;

    // Combine all parameters into a single object
    const allParams = {
      ...perilParams,
      ...scoresParams,
      ...economicImpactParams,
    };

    // Iterate over all params and verify their labels and values
    let index = 0; // Start index to iterate over the labels
    for (const [label, value] of Object.entries(allParams)) {
      await expect(
        portfolioInformation.ParamsDataLabel.nth(index),
      ).toBeVisible();
      await expect(portfolioInformation.ParamsDataLabel.nth(index)).toHaveText(
        label,
      );
      await expect(
        portfolioInformation.ParamsDataValue.nth(index),
      ).toBeVisible();
      await expect(portfolioInformation.ParamsDataValue.nth(index)).toHaveText(
        value as string,
      );
      index++;
    }
  });
});
