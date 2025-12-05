import { HazardMetric } from '../types';

export const DEFAULT_METRIC_VALUES: string[] = [
    HazardMetric.DepthOfWaterAt100YearPeriod,
    HazardMetric.MaximumWindSpeedAt100YearPeriod,
    HazardMetric.AnnualFireProbability,
    HazardMetric.DaysPerYearExceeding35C,
    HazardMetric.MaximumDailyPrecipitationAt100YearPeriod,
    HazardMetric.DaysPerYearBelow0C,
    HazardMetric.TotalWaterStress,
    HazardMetric.DaysPerYearLargeHail,
];
