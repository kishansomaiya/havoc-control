import { Box } from '@mui/material';
import { ComponentProps, FC, useMemo } from 'react';
import {
    LocationFinancialMetric,
    PortfolioImpactsLocationData,
} from '../../../../types';
import {
    LOCATION_FINANCIAL_METRIC_TITLE,
    PORTFOLIO_IMPACTS_METRIC_DESCRIPTION,
} from '../../../../const';
import { MetricInfo } from '../../../../components/MetricInfo/MetricInfo';
import {
    getLocationCurrencyCode,
    getLocationMetricValueWithoutNA,
} from '../../../../utils';

interface ImpactsMetric {
    title: string;
    tooltip: string;
    fromValue: number;
    toValue: number;
}

const METRICS_TO_COMPARE = [
    LocationFinancialMetric.AverageAnnualLoss,
    LocationFinancialMetric.TechnicalPremium,
    LocationFinancialMetric.BenchmarkAssetValue,
    LocationFinancialMetric.ClimateAdjustedAssetValue,
    LocationFinancialMetric.TotalClimateRiskAdjustment,
];

interface ImpactsMetricsProps extends ComponentProps<typeof Box> {
    yearFrom: number;
    yearTo: number;
    impactsData: PortfolioImpactsLocationData[];
}

export const ImpactsMetrics: FC<ImpactsMetricsProps> = ({
    yearFrom,
    yearTo,
    impactsData,
    ...props
}) => {
    const valueCurrencyCode = useMemo(
        () => getLocationCurrencyCode(impactsData[0]) ?? '',
        [impactsData]
    );

    const portfolioImpactsMetrics: ImpactsMetric[] = useMemo(() => {
        const metricsData: {
            [key in LocationFinancialMetric]: ImpactsMetric;
        } = METRICS_TO_COMPARE.reduce(
            (result, metric) => ({
                ...result,
                [metric]: {
                    title: LOCATION_FINANCIAL_METRIC_TITLE[metric],
                    tooltip: PORTFOLIO_IMPACTS_METRIC_DESCRIPTION[metric],
                    fromValue: 0,
                    toValue: 0,
                },
            }),
            {} as {
                [key in LocationFinancialMetric]: ImpactsMetric;
            }
        );

        impactsData.forEach((locationData) => {
            if (locationData.year === yearFrom) {
                METRICS_TO_COMPARE.forEach((metric) => {
                    metricsData[metric].fromValue +=
                        Number(
                            getLocationMetricValueWithoutNA(
                                metric,
                                locationData
                            )
                        ) || 0;
                });
            }
            if (locationData.year === yearTo) {
                METRICS_TO_COMPARE.forEach((metric) => {
                    metricsData[metric].toValue += Number(
                        getLocationMetricValueWithoutNA(metric, locationData) ||
                            0
                    );
                });
            }
        });

        return Object.values(metricsData);
    }, [impactsData, yearFrom, yearTo]);

    return (
        <Box
            py={3}
            px={4}
            display="flex"
            gap={3}
            {...props}
            data-testid="metrics"
        >
            {portfolioImpactsMetrics.map((metric) => (
                <MetricInfo
                    key={metric.title}
                    flex={1}
                    title={metric.title}
                    yearTo={yearTo}
                    yearFrom={yearFrom}
                    tooltip={metric.tooltip}
                    fromValue={metric.fromValue}
                    toValue={metric.toValue}
                    currencyCode={valueCurrencyCode}
                    data-testid="metrics-info"
                />
            ))}
        </Box>
    );
};
