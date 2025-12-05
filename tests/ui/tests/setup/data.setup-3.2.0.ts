// tests/ui/tests/dataSetup.ts
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';
import { testDataSetup, setupPortfolio } from '@utils/dataSetup';

const config = PORTFOLIO_CONFIGS['v3.2.0'];

testDataSetup(
  `Create portfolio with "${config.description}"`,
  async ({
    createPortfolioPage,
    portfolioItem,
    portfolioList,
    portfolioInformation,
  }) => {
    await setupPortfolio(
      config,
      createPortfolioPage,
      portfolioItem,
      portfolioList,
      portfolioInformation,
    );
  },
);
