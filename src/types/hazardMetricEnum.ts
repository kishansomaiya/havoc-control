export enum HazardMetric {
    DepthOfWaterAt100YearPeriod = 'FL_depth100yr_mean',
    MaximumWindSpeedAt100YearPeriod = 'WS_windSpeed100yr_mean',
    AnnualFireProbability = 'FR_annualFireProbability_mean',
    DaysPerYearExceeding35C = 'HT_daysExceeding35C_mean',
    MaximumDailyPrecipitationAt100YearPeriod = 'PR_oneDayPrecip100yr_mean',
    DaysPerYearBelow0C = 'CD_daysBelow0C_mean',
    TotalWaterStress = 'DT_totalWaterStress_mean',
    DaysPerYearLargeHail = 'HL_daysLargeHailPossible_mean',
}
