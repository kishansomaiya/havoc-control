import { LocationFinancialMetric } from '../types';

export const LOCATION_FINANCIAL_METRIC_TITLE = {
    [LocationFinancialMetric.NetOperatingIncome]:
        'Impact on Net Operating Income',
    [LocationFinancialMetric.TechnicalPremium]: 'Technical Premium',
    [LocationFinancialMetric.BenchmarkAssetValue]: 'Benchmark Asset Value',
    [LocationFinancialMetric.ClimateAdjustedAssetValue]:
        'Climate-Adjusted Asset Value',
    [LocationFinancialMetric.TotalClimateRiskAdjustment]:
        'Total Climate Risk Adjustment',
    [LocationFinancialMetric.OperationalExpenses]: 'Operational Expenses',
    [LocationFinancialMetric.OperationalRevenue]: 'Operational Revenue',
    [LocationFinancialMetric.CapitalExpenditures]: 'Capital Expenditures',
    [LocationFinancialMetric.CostOfOwnership]: 'Cost of Ownership',
    [LocationFinancialMetric.AverageAnnualLoss]: 'Average Annual Loss',
    [LocationFinancialMetric.AverageAnnualLossFlood]: 'Flood',
    [LocationFinancialMetric.AverageAnnualLossWind]: 'Wind',
    [LocationFinancialMetric.AverageAnnualLossHeat]: 'Heat',
    [LocationFinancialMetric.AverageAnnualLossWildfire]: 'Wildfire',
    [LocationFinancialMetric.AverageAnnualLossDrought]: 'Drought',
    [LocationFinancialMetric.ProbabilityValueAtRiskWith20YearsReturnPeriod]:
        'PVaR 95% (20yr RP)',
    [LocationFinancialMetric.ProbabilityValueAtRiskWith100YearsReturnPeriod]:
        'PVaR 99% (100yr RP)',
};

export const LOCATION_FINANCIAL_METRIC_DESCRIPTION = {
    [LocationFinancialMetric.NetOperatingIncome]:
        'Total annual decrease in the expected net operating income of the investment asset due to climate risk',
    [LocationFinancialMetric.TechnicalPremium]:
        'Annual increase in the technical premium expense (cost of insurance) due to climate risk',
    [LocationFinancialMetric.BenchmarkAssetValue]:
        'Non-climate risk-adjusted forecasted value of the asset',
    [LocationFinancialMetric.ClimateAdjustedAssetValue]:
        'Climate risk-adjusted value of the asset',
    [LocationFinancialMetric.TotalClimateRiskAdjustment]:
        'Total climate risk adjustment to the value of the asset',
    [LocationFinancialMetric.OperationalExpenses]: 'Operational Expenses',
    [LocationFinancialMetric.OperationalRevenue]: 'Operational Revenue',
    [LocationFinancialMetric.CapitalExpenditures]: 'Capital Expenditures',
    [LocationFinancialMetric.CostOfOwnership]: 'Cost of Ownership',
    [LocationFinancialMetric.AverageAnnualLoss]: 'Average Annual Loss',
    [LocationFinancialMetric.AverageAnnualLossFlood]: 'Flood',
    [LocationFinancialMetric.AverageAnnualLossWind]: 'Wind',
    [LocationFinancialMetric.AverageAnnualLossHeat]: 'Heat',
    [LocationFinancialMetric.AverageAnnualLossWildfire]: 'Wildfire',
    [LocationFinancialMetric.AverageAnnualLossDrought]: 'Drought',
    [LocationFinancialMetric.ProbabilityValueAtRiskWith20YearsReturnPeriod]:
        'PVaR 95% (20yr RP)',
    [LocationFinancialMetric.ProbabilityValueAtRiskWith100YearsReturnPeriod]:
        'PVaR 99% (100yr RP)',
};

export const PORTFOLIO_IMPACTS_METRIC_DESCRIPTION = {
    [LocationFinancialMetric.AverageAnnualLoss]:
        'Sum of average annual losses due to flood, wind, heat, wildfire, and drought for the portfolio',
    [LocationFinancialMetric.TechnicalPremium]:
        'Sum of technical premium (cost of insurance) due to flood, wind, and wildfire for the portfolio',
    [LocationFinancialMetric.BenchmarkAssetValue]:
        'Sum of benchmark (non-climate risk-adjusted) asset values for the portfolio',
    [LocationFinancialMetric.ClimateAdjustedAssetValue]:
        'Sum of climate-adjusted asset values for the portfolio',
    [LocationFinancialMetric.TotalClimateRiskAdjustment]:
        'Sum of climate risk adjustments to the values of the assets for the portfolio',
    [LocationFinancialMetric.NetOperatingIncome]:
        'Impact on Net Operating Income',
    [LocationFinancialMetric.OperationalExpenses]: 'Operational Expenses',
    [LocationFinancialMetric.OperationalRevenue]: 'Operational Revenue',
    [LocationFinancialMetric.CapitalExpenditures]: 'Capital Expenditures',
    [LocationFinancialMetric.CostOfOwnership]: 'Cost of Ownership',
    [LocationFinancialMetric.AverageAnnualLossFlood]: 'Flood',
    [LocationFinancialMetric.AverageAnnualLossWind]: 'Wind',
    [LocationFinancialMetric.AverageAnnualLossHeat]: 'Heat',
    [LocationFinancialMetric.AverageAnnualLossWildfire]: 'Wildfire',
    [LocationFinancialMetric.AverageAnnualLossDrought]: 'Drought',
    [LocationFinancialMetric.ProbabilityValueAtRiskWith20YearsReturnPeriod]:
        'PVaR 95% (20yr RP)',
    [LocationFinancialMetric.ProbabilityValueAtRiskWith100YearsReturnPeriod]:
        'PVaR 99% (100yr RP)',
};

export const LOCATION_FINANCIAL_METRIC_COLOR = {
    [LocationFinancialMetric.NetOperatingIncome]: '#079AED',
    [LocationFinancialMetric.TechnicalPremium]: '#FF6F50',
    [LocationFinancialMetric.BenchmarkAssetValue]: '#F90',
    [LocationFinancialMetric.ClimateAdjustedAssetValue]: '#079AED',
    [LocationFinancialMetric.TotalClimateRiskAdjustment]: '#59BFBD',
    [LocationFinancialMetric.OperationalExpenses]: '#FBD5CD',
    [LocationFinancialMetric.OperationalRevenue]: '#F28B51',
    [LocationFinancialMetric.CapitalExpenditures]: '#079AED',
    [LocationFinancialMetric.CostOfOwnership]: '#FFB74C',
    [LocationFinancialMetric.AverageAnnualLoss]: '#079AED',
    [LocationFinancialMetric.AverageAnnualLossFlood]: '#0068AD',
    [LocationFinancialMetric.AverageAnnualLossWind]: '#59BFBD',
    [LocationFinancialMetric.AverageAnnualLossHeat]: '#DB5138',
    [LocationFinancialMetric.AverageAnnualLossWildfire]: '#FF9900',
    [LocationFinancialMetric.AverageAnnualLossDrought]: '#F7B598',
    [LocationFinancialMetric.ProbabilityValueAtRiskWith20YearsReturnPeriod]:
        '#A868E0',
    [LocationFinancialMetric.ProbabilityValueAtRiskWith100YearsReturnPeriod]:
        '#009FAC',
};
