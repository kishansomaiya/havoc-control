import {
    HazardMetric,
    ImpactType,
    LocationDamageAndLossData,
    LocationFinancialMetric,
    LocationImpactMetric,
    LossType,
    PortfolioImpactsLocationData,
    UnitOfMeasure,
} from '../types';
import { LocationFinancialMetricsData } from '../types';
import { NO_AVAILABLE_SCORE, UNIT_OF_MEASURE_FRACTION_DIGITS } from '../const';
import { ResultSetDataSchema } from '../api/openapi/auto-generated';
import { numberValueFormatter } from './formatter.util';

export const isNumber = (val?: number | string | null) =>
    typeof val === 'number';

const calculateRatio = (
    numerator?: number | null,
    denominator?: number | null
) => {
    return isNumber(denominator) && denominator > 0 && isNumber(numerator)
        ? numerator / denominator
        : undefined;
};

const extractProperty = <T, K extends keyof T>(
    data: T,
    property: K
): T[K] | undefined => {
    return data?.[property];
};

export const convertToPercentage = (val?: number | null) => {
    return isNumber(val) ? val * 100 : val;
};

const LocationImpactValue = {
    [ImpactType.Damage]: {
        [LocationImpactMetric.Flood]: {
            [LossType.Total]: (data: LocationDamageAndLossData) => {
                const initialValue = calculateRatio(
                    data?.FL_avgAnnualLoss_total,
                    data?.totalValue
                );
                return convertToPercentage(initialValue);
            },
            [LossType.Building]: (data: LocationDamageAndLossData) => {
                const initialValue = extractProperty(
                    data,
                    'FL_avgAnnualDamage_building'
                );
                return convertToPercentage(initialValue);
            },
            [LossType.Contents]: (data: LocationDamageAndLossData) => {
                const initialValue = extractProperty(
                    data,
                    'FL_avgAnnualDamage_contents'
                );
                return convertToPercentage(initialValue);
            },
            [LossType.Inventory]: (data: LocationDamageAndLossData) => {
                const initialValue = extractProperty(
                    data,
                    'FL_avgAnnualDamage_inventory'
                );
                return convertToPercentage(initialValue);
            },
            [LossType.Downtime]: (data: LocationDamageAndLossData) => {
                const initialValue = extractProperty(
                    data,
                    'FL_avgAnnualDamage_downtime'
                );
                return convertToPercentage(initialValue);
            },
        },
        [LocationImpactMetric.Wind]: {
            [LossType.Total]: (data: LocationDamageAndLossData) => {
                const initialValue = calculateRatio(
                    data?.WS_avgAnnualLoss_total,
                    data?.totalValue
                );
                return convertToPercentage(initialValue);
            },
            [LossType.Building]: (data: LocationDamageAndLossData) => {
                const initialValue = extractProperty(
                    data,
                    'WS_avgAnnualDamage_building'
                );
                return convertToPercentage(initialValue);
            },
            [LossType.Contents]: (data: LocationDamageAndLossData) => {
                const initialValue = extractProperty(
                    data,
                    'WS_avgAnnualDamage_contents'
                );
                return convertToPercentage(initialValue);
            },
            [LossType.Inventory]: (data: LocationDamageAndLossData) => {
                const initialValue = extractProperty(
                    data,
                    'WS_avgAnnualDamage_inventory'
                );
                return convertToPercentage(initialValue);
            },
            [LossType.Downtime]: (data: LocationDamageAndLossData) => {
                const initialValue = extractProperty(
                    data,
                    'WS_avgAnnualDamage_downtime'
                );
                return convertToPercentage(initialValue);
            },
        },
        [LocationImpactMetric.Wildfire]: {
            [LossType.Total]: (data: LocationDamageAndLossData) => {
                const initialValue = calculateRatio(
                    data?.FR_avgAnnualLoss_total,
                    data?.totalValue
                );
                return convertToPercentage(initialValue);
            },
            [LossType.Building]: (data: LocationDamageAndLossData) => {
                const initialValue = extractProperty(
                    data,
                    'FR_avgAnnualDamage_building'
                );
                return convertToPercentage(initialValue);
            },
            [LossType.Contents]: (data: LocationDamageAndLossData) => {
                const initialValue = extractProperty(
                    data,
                    'FR_avgAnnualDamage_contents'
                );
                return convertToPercentage(initialValue);
            },
            [LossType.Inventory]: (data: LocationDamageAndLossData) => {
                const initialValue = extractProperty(
                    data,
                    'FR_avgAnnualDamage_inventory'
                );
                return convertToPercentage(initialValue);
            },
            [LossType.Downtime]: (data: LocationDamageAndLossData) => {
                const initialValue = extractProperty(
                    data,
                    'FR_avgAnnualDamage_downtime'
                );
                return convertToPercentage(initialValue);
            },
        },
        [LocationImpactMetric.HeatCooling]: {
            [LossType.Total]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'HT_avgAnnualDamage_cooling');
            },
            [LossType.Building]: () => {
                return undefined;
            },
            [LossType.Contents]: () => {
                return undefined;
            },
            [LossType.Inventory]: () => {
                return undefined;
            },
            [LossType.Downtime]: () => {
                return undefined;
            },
        },
        [LocationImpactMetric.HeatProductivity]: {
            [LossType.Total]: (data: LocationDamageAndLossData) => {
                const initialValue = extractProperty(
                    data,
                    'HT_avgAnnualDamage_prod_abs'
                );
                return convertToPercentage(initialValue);
            },
            [LossType.Building]: () => {
                return undefined;
            },
            [LossType.Contents]: () => {
                return undefined;
            },
            [LossType.Inventory]: () => {
                return undefined;
            },
            [LossType.Downtime]: () => {
                return undefined;
            },
        },
        [LocationImpactMetric.Drought]: {
            [LossType.Total]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'DT_shadowPriceOfWater');
            },
            [LossType.Building]: () => {
                return undefined;
            },
            [LossType.Contents]: () => {
                return undefined;
            },
            [LossType.Inventory]: () => {
                return undefined;
            },
            [LossType.Downtime]: () => {
                return undefined;
            },
        },
    },
    [ImpactType.Loss]: {
        [LocationImpactMetric.Flood]: {
            [LossType.Total]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'FL_avgAnnualLoss_total');
            },
            [LossType.Building]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'FL_avgAnnualLoss_building');
            },
            [LossType.Contents]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'FL_avgAnnualLoss_contents');
            },
            [LossType.Inventory]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'FL_avgAnnualLoss_inventory');
            },
            [LossType.Downtime]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'FL_avgAnnualLoss_downtime');
            },
        },
        [LocationImpactMetric.Wind]: {
            [LossType.Total]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'WS_avgAnnualLoss_total');
            },
            [LossType.Building]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'WS_avgAnnualLoss_building');
            },
            [LossType.Contents]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'WS_avgAnnualLoss_contents');
            },
            [LossType.Inventory]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'WS_avgAnnualLoss_inventory');
            },
            [LossType.Downtime]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'WS_avgAnnualLoss_downtime');
            },
        },
        [LocationImpactMetric.Wildfire]: {
            [LossType.Total]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'FR_avgAnnualLoss_total');
            },
            [LossType.Building]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'FR_avgAnnualLoss_building');
            },
            [LossType.Contents]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'FR_avgAnnualLoss_contents');
            },
            [LossType.Inventory]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'FR_avgAnnualLoss_inventory');
            },
            [LossType.Downtime]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'FR_avgAnnualLoss_downtime');
            },
        },
        [LocationImpactMetric.HeatCooling]: {
            [LossType.Total]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'HT_avgAnnualLoss_cooling');
            },
            [LossType.Building]: () => {
                return undefined;
            },
            [LossType.Contents]: () => {
                return undefined;
            },
            [LossType.Inventory]: () => {
                return undefined;
            },
            [LossType.Downtime]: () => {
                return undefined;
            },
        },
        [LocationImpactMetric.HeatProductivity]: {
            [LossType.Total]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'HT_avgAnnualLoss_prod');
            },
            [LossType.Building]: () => {
                return undefined;
            },
            [LossType.Contents]: () => {
                return undefined;
            },
            [LossType.Inventory]: () => {
                return undefined;
            },
            [LossType.Downtime]: () => {
                return undefined;
            },
        },
        [LocationImpactMetric.Drought]: {
            [LossType.Total]: (data: LocationDamageAndLossData) => {
                return extractProperty(data, 'DT_avgAnnualLoss_water');
            },
            [LossType.Building]: () => {
                return undefined;
            },
            [LossType.Contents]: () => {
                return undefined;
            },
            [LossType.Inventory]: () => {
                return undefined;
            },
            [LossType.Downtime]: () => {
                return undefined;
            },
        },
    },
};

export const getLocationImpactValue = (
    impactType: ImpactType,
    metric: LocationImpactMetric,
    lossType: LossType,
    data: LocationDamageAndLossData
): number | undefined | null => {
    return LocationImpactValue[impactType][metric][lossType](data);
};

const LocationFinancialValue = {
    [LocationFinancialMetric.NetOperatingIncome]: (data: {
        EI_netIncome?: number | null;
    }) => {
        return extractProperty(data, 'EI_netIncome');
    },
    [LocationFinancialMetric.TechnicalPremium]: (data: {
        EI_technicalPremium?: number | null;
    }) => {
        return extractProperty(data, 'EI_technicalPremium');
    },
    [LocationFinancialMetric.BenchmarkAssetValue]: (data: {
        EI_benchmarkValue?: number | null;
    }) => {
        return extractProperty(data, 'EI_benchmarkValue');
    },
    [LocationFinancialMetric.ClimateAdjustedAssetValue]: (data: {
        EI_climateAdjValue?: number | null;
    }) => {
        return extractProperty(data, 'EI_climateAdjValue');
    },
    [LocationFinancialMetric.TotalClimateRiskAdjustment]: (data: {
        EI_value?: number | null;
    }) => {
        return extractProperty(data, 'EI_value');
    },
    [LocationFinancialMetric.OperationalExpenses]: (data: {
        EI_overheads?: number | null;
        EI_productivity?: number | null;
    }) => {
        return (
            (extractProperty(data, 'EI_overheads') || 0) +
            (extractProperty(data, 'EI_productivity') || 0)
        );
    },
    [LocationFinancialMetric.OperationalRevenue]: (data: {
        EI_inventory?: number | null;
        EI_downtime?: number | null;
    }) => {
        return (
            (extractProperty(data, 'EI_inventory') || 0) +
            (extractProperty(data, 'EI_downtime') || 0)
        );
    },
    [LocationFinancialMetric.CapitalExpenditures]: (data: {
        EI_building?: number | null;
        EI_contents?: number | null;
    }) => {
        return (
            (extractProperty(data, 'EI_building') || 0) +
            (extractProperty(data, 'EI_contents') || 0)
        );
    },
    [LocationFinancialMetric.CostOfOwnership]: (data: {
        EI_ownershipCost?: number | null;
    }) => {
        return extractProperty(data, 'EI_ownershipCost');
    },
    [LocationFinancialMetric.AverageAnnualLoss]: (data: {
        FL_avgAnnualLoss_total?: number | null;
        WS_avgAnnualLoss_total?: number | null;
        FR_avgAnnualLoss_total?: number | null;
        HT_avgAnnualLoss_total?: number | null;
        DT_avgAnnualLoss_water?: number | null;
    }) => {
        return (
            (extractProperty(data, 'FL_avgAnnualLoss_total') || 0) +
            (extractProperty(data, 'WS_avgAnnualLoss_total') || 0) +
            (extractProperty(data, 'FR_avgAnnualLoss_total') || 0) +
            (extractProperty(data, 'HT_avgAnnualLoss_total') || 0) +
            (extractProperty(data, 'DT_avgAnnualLoss_water') || 0)
        );
    },
    [LocationFinancialMetric.AverageAnnualLossFlood]: (data: {
        FL_avgAnnualLoss_total?: number | null;
    }) => {
        return extractProperty(data, 'FL_avgAnnualLoss_total') || 0;
    },
    [LocationFinancialMetric.AverageAnnualLossWind]: (data: {
        WS_avgAnnualLoss_total?: number | null;
    }) => {
        return extractProperty(data, 'WS_avgAnnualLoss_total') || 0;
    },
    [LocationFinancialMetric.AverageAnnualLossHeat]: (data: {
        HT_avgAnnualLoss_total?: number | null;
    }) => {
        return extractProperty(data, 'HT_avgAnnualLoss_total') || 0;
    },
    [LocationFinancialMetric.AverageAnnualLossWildfire]: (data: {
        FR_avgAnnualLoss_total?: number | null;
    }) => {
        return extractProperty(data, 'FR_avgAnnualLoss_total') || 0;
    },
    [LocationFinancialMetric.AverageAnnualLossDrought]: (data: {
        DT_avgAnnualLoss_water?: number | null;
    }) => {
        return extractProperty(data, 'DT_avgAnnualLoss_water') || 0;
    },
    [LocationFinancialMetric.ProbabilityValueAtRiskWith20YearsReturnPeriod]:
        (data: { PL_AP_loss20yr_total?: number | null }) => {
            return extractProperty(data, 'PL_AP_loss20yr_total') || 0;
        },
    [LocationFinancialMetric.ProbabilityValueAtRiskWith100YearsReturnPeriod]:
        (data: { PL_AP_loss100yr_total?: number | null }) => {
            return extractProperty(data, 'PL_AP_loss100yr_total') || 0;
        },
};

export const getLocationMetricValue = (
    financialMetric: LocationFinancialMetric,
    data: LocationFinancialMetricsData | PortfolioImpactsLocationData
): number | undefined | null => {
    return LocationFinancialValue[financialMetric](data);
};

export const getLocationMetricValueWithoutNA = (
    financialMetric: LocationFinancialMetric,
    data: LocationFinancialMetricsData | PortfolioImpactsLocationData
): number | undefined | null => {
    const value = getLocationMetricValue(financialMetric, data);

    if (value === NO_AVAILABLE_SCORE) {
        return 0;
    }

    return value;
};

export const getLocationCurrencyCode = (data: {
    valueCurrencyCode?: string;
}): string | undefined => {
    return extractProperty(data, 'valueCurrencyCode');
};

const unitOfMeasureFormatters = {
    [UnitOfMeasure.Percentage]: () => '%',
    [UnitOfMeasure.Kilowatt]: () => 'kWh',
    [UnitOfMeasure.Currency]: (currencyCode?: string) => currencyCode ?? '',
};

const LOCATION_IMPACT_UNIT_OF_MEASURE = {
    [ImpactType.Damage]: {
        [LocationImpactMetric.Flood]: UnitOfMeasure.Percentage,
        [LocationImpactMetric.Wind]: UnitOfMeasure.Percentage,
        [LocationImpactMetric.Wildfire]: UnitOfMeasure.Percentage,
        [LocationImpactMetric.HeatCooling]: UnitOfMeasure.Kilowatt,
        [LocationImpactMetric.HeatProductivity]: UnitOfMeasure.Percentage,
        [LocationImpactMetric.Drought]: UnitOfMeasure.Currency,
    },
    [ImpactType.Loss]: {
        [LocationImpactMetric.Flood]: UnitOfMeasure.Currency,
        [LocationImpactMetric.Wind]: UnitOfMeasure.Currency,
        [LocationImpactMetric.Wildfire]: UnitOfMeasure.Currency,
        [LocationImpactMetric.HeatCooling]: UnitOfMeasure.Currency,
        [LocationImpactMetric.HeatProductivity]: UnitOfMeasure.Currency,
        [LocationImpactMetric.Drought]: UnitOfMeasure.Currency,
    },
};

export const getLocationImpactUnitOfMeasure = ({
    impactType,
    locationImpactMetric,
}: {
    impactType: ImpactType;
    locationImpactMetric: LocationImpactMetric;
}): UnitOfMeasure => {
    return LOCATION_IMPACT_UNIT_OF_MEASURE[impactType][locationImpactMetric];
};

export const getLocationImpactUnitOfMeasureCode = ({
    valueCurrencyCode,
    impactType,
    locationImpactMetric,
}: {
    valueCurrencyCode?: string;
    impactType: ImpactType;
    locationImpactMetric: LocationImpactMetric;
}): string => {
    const unitOfMeasure = getLocationImpactUnitOfMeasure({
        impactType,
        locationImpactMetric,
    });
    return unitOfMeasureFormatters[unitOfMeasure](valueCurrencyCode);
};

export const getHazardUnitOfMeasure = (
    hazardMetric: ResultSetDataSchema | undefined
): UnitOfMeasure | undefined => {
    if (!hazardMetric) {
        return undefined;
    }

    if (hazardMetric.id === HazardMetric.AnnualFireProbability) {
        return UnitOfMeasure.Percentage;
    }

    return undefined;
};

export const getFormattedByUnitOfMeasureHazardValue = (
    value: number | null | undefined,
    unitOfMeasure?: UnitOfMeasure
): string => {
    if (value === NO_AVAILABLE_SCORE || !isNumber(value)) {
        return '-';
    }

    const fractionDigits =
        unitOfMeasure && UNIT_OF_MEASURE_FRACTION_DIGITS[unitOfMeasure];
    return `${numberValueFormatter({
        value:
            unitOfMeasure === UnitOfMeasure.Percentage
                ? convertToPercentage(value)!
                : value,
        withDecimal: unitOfMeasure === UnitOfMeasure.Percentage,
        fractionDigits,
    })}${unitOfMeasure ? unitOfMeasureFormatters[unitOfMeasure]() : ''}`;
};
