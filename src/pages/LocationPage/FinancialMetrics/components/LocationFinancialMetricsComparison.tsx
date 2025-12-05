import { ComponentProps, FC, useMemo } from 'react';
import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import {
    LocationFinancialMetric,
    LocationFinancialMetricsData,
} from '../../../../types';
import { MetricInfo } from '../../../../components/MetricInfo/MetricInfo';
import {
    LOCATION_FINANCIAL_METRIC_DESCRIPTION,
    LOCATION_FINANCIAL_METRIC_TITLE,
} from '../../../../const';
import {
    getLocationCurrencyCode,
    getLocationMetricValue,
} from '../../../../utils';

interface LocationFinancialMetricsComparisonProps
    extends ComponentProps<typeof Box> {
    yearFrom: number;
    yearTo: number;
    financialDataFrom: LocationFinancialMetricsData;
    financialDataTo: LocationFinancialMetricsData;
}

const METRICS_TO_COMPARE = [
    LocationFinancialMetric.NetOperatingIncome,
    LocationFinancialMetric.TechnicalPremium,
    LocationFinancialMetric.BenchmarkAssetValue,
    LocationFinancialMetric.ClimateAdjustedAssetValue,
    LocationFinancialMetric.TotalClimateRiskAdjustment,
];

export const LocationFinancialMetricsComparison: FC<
    LocationFinancialMetricsComparisonProps
> = ({ yearFrom, yearTo, financialDataFrom, financialDataTo, ...props }) => {
    const currencyCode = useMemo(() => {
        return getLocationCurrencyCode(financialDataFrom);
    }, [financialDataFrom]);

    return (
        <Box {...props}>
            <Grid
                container
                spacing={4}
                data-testid="metrics"
            >
                {METRICS_TO_COMPARE.map((metric) => (
                    <Grid
                        key={metric}
                        xs={2.4}
                        data-testid="metrics-info"
                    >
                        <MetricInfo
                            title={LOCATION_FINANCIAL_METRIC_TITLE[metric]}
                            yearTo={yearTo}
                            yearFrom={yearFrom}
                            tooltip={
                                LOCATION_FINANCIAL_METRIC_DESCRIPTION[metric]
                            }
                            fromValue={getLocationMetricValue(
                                metric,
                                financialDataFrom
                            )}
                            toValue={getLocationMetricValue(
                                metric,
                                financialDataTo
                            )}
                            currencyCode={currencyCode}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};
