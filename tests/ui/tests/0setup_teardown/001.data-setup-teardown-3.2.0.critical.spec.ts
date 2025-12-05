import { setupPortfolio, testDataSetup } from '@utils/dataSetup';
import {TEMP_PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';
import { deleteCreatedPortfolio } from '@utils/dataCleanup';

const config = TEMP_PORTFOLIO_CONFIGS['v3.2.0'];

testDataSetup(
  `Create portfolio with "${config.description}"`,
  async ({
           createPortfolioPage,
           portfolioItem,
           portfolioList,
           portfolioInformation,
         }) => {
    await testDataSetup.step('Setup portfolio', async () => {
      await setupPortfolio(
        config,
        createPortfolioPage,
        portfolioItem,
        portfolioList,
        portfolioInformation,
      );
    });

    await testDataSetup.step('Delete portfolio', async () => {
      await deleteCreatedPortfolio(config, portfolioItem);
    });
  },
);
