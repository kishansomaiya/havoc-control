import { deleteCreatedPortfolio, testDataCleanup } from '@utils/dataCleanup';
import { PORTFOLIO_CONFIGS } from '@lib/portfolio_configs.constants';

const config = PORTFOLIO_CONFIGS['v3.1.0'];
testDataCleanup(
  `Delete portfolio with "${config.portfolioName}" name`,
  async ({ portfolioItem }) => {
    await deleteCreatedPortfolio(config, portfolioItem);
  },
);
