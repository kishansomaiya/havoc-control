
export type PortfolioConfig = {
  fileName: string;
  dataSetVersion: string;
  portfolioName: string;
  categoryName: string;
  createMethod: string;
  description: string;
}

export const PORTFOLIO_CONFIGS = {
  'v3.0.0': {
    fileName: 'CSV_3_cities.csv',
    dataSetVersion: '3.0.0',
    portfolioName: 'Persistent-Auto-P_S_EI_v3.0.0',
    categoryName: 'Persistent-Cat-Auto-P_S_EI_v3.0.0',
    createMethod: 'createPortfolio_PerilsScoresEconomicImpact',
    description: 'Perils, Scores & EI v.3.0.0',
  },
  'v3.1.0': {
    fileName: 'CSV_3_cities.csv',
    dataSetVersion: '3.1.0',
    portfolioName: 'Persistent-Auto-P_S_EI_v3.1.0',
    categoryName: 'Persistent-Cat-Auto-P_S_EI_v3.1.0',
    createMethod: 'createPortfolio_PerilsScoresEconomicImpact',
    description: 'Perils, Scores & EI v.3.1.0',
  },
  'v3.2.0': {
    fileName: 'CSV_3_cities.csv',
    dataSetVersion: '3.2.0',
    portfolioName: 'Persistent-Auto-P_S_D_EI_v3.2.0',
    categoryName: 'Persistent-Cat-Auto-P_S_D_EI_v3.2.0',
    createMethod: 'createPortfolio_PerilsScoresEconomicImpactDisclosure',
    description: 'Perils, Scores + EI + Disclosure v.3.2.0',
  },
};


export const TEMP_PORTFOLIO_CONFIGS = {
  'v3.0.0': {
    fileName: 'CSV_3_cities.csv',
    dataSetVersion: '3.0.0',
    portfolioName: 'Temp-Auto-P_S_EI_v3.0.0',
    categoryName: 'Temp-Cat-Auto-P_S_EI_v3.0.0',
    createMethod: 'createPortfolio_PerilsScoresEconomicImpact',
    description: 'Perils, Scores & EI v.3.0.0',
  },
  'v3.1.0': {
    fileName: 'CSV_3_cities.csv',
    dataSetVersion: '3.1.0',
    portfolioName: 'Temp-Auto-P_S_EI_v3.1.0',
    categoryName: 'Temp-Cat-Auto-P_S_EI_v3.1.0',
    createMethod: 'createPortfolio_PerilsScoresEconomicImpact',
    description: 'Perils, Scores & EI v.3.1.0',
  },
  'v3.2.0': {
    fileName: 'CSV_3_cities.csv',
    dataSetVersion: '3.2.0',
    portfolioName: 'Temp-Auto-P_S_D_EI_v3.2.0',
    categoryName: 'Temp-Cat-Auto-P_S_D_EI_v3.2.0',
    createMethod: 'createPortfolio_PerilsScoresEconomicImpactDisclosure',
    description: 'Perils, Scores + EI + Disclosure v.3.2.0',
  },
}