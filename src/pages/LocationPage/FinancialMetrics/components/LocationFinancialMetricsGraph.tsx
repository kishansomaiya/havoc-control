import {
    FinancialMetricViewType,
    LocationFinancialMetric,
    LocationFinancialMetricsData,
} from '../../../../types';
import { FC, useMemo } from 'react';
import { TransmissionChannelChart } from './charts/TransmissionChannelChart';
import { OperationalRiskChart } from './charts/OperationalRiskChart';
import { TechnicalPremiumChart } from './charts/TechnicalPremiumChart';
import { MarketRiskChart } from './charts/MarketRiskChart';
import {
    LOCATION_FINANCIAL_METRIC_COLOR,
    LOCATION_FINANCIAL_METRIC_TITLE,
} from '../../../../const';
import {
    getLocationCurrencyCode,
    getLocationMetricValue,
    tooltipValueFormatter,
} from '../../../../utils';

export interface LocationFinancialMetricsGraphData {
    id: LocationFinancialMetric;
    legend: string;
    label: string;
    data: number[];
    showMark: boolean;
    color: string;
}

interface LocationFinancialMetricsGraphProps {
    viewType: FinancialMetricViewType;
    yearsRange: number[];
    locationFinancialMetrics: LocationFinancialMetricsData[];
}

const GRAPH_METRICS = [
    LocationFinancialMetric.NetOperatingIncome,
    LocationFinancialMetric.TechnicalPremium,
    LocationFinancialMetric.BenchmarkAssetValue,
    LocationFinancialMetric.ClimateAdjustedAssetValue,
    LocationFinancialMetric.TotalClimateRiskAdjustment,
    LocationFinancialMetric.OperationalExpenses,
    LocationFinancialMetric.OperationalRevenue,
    LocationFinancialMetric.CapitalExpenditures,
    LocationFinancialMetric.CostOfOwnership,
];

export const LocationFinancialMetricsGraph: FC<
    LocationFinancialMetricsGraphProps
> = ({ viewType, yearsRange, locationFinancialMetrics }) => {
    const graphData = useMemo(() => {
        return GRAPH_METRICS.map((metric) => {
            return {
                id: metric,
                legend: LOCATION_FINANCIAL_METRIC_TITLE[metric],
                label: LOCATION_FINANCIAL_METRIC_TITLE[metric],
                data: yearsRange.map((graphYear) => {
                    const financialMetricAtYear =
                        locationFinancialMetrics.find(
                            ({ year }) => year === graphYear
                        ) || new LocationFinancialMetricsData();
                    return (
                        getLocationMetricValue(metric, financialMetricAtYear) ||
                        0
                    );
                }),
                showMark: true,
                color: LOCATION_FINANCIAL_METRIC_COLOR[metric],
                valueFormatter: tooltipValueFormatter,
            };
        });
    }, [locationFinancialMetrics, yearsRange]);

    const yAxisLabel = useMemo(() => {
        const currencyCode =
            getLocationCurrencyCode(locationFinancialMetrics[0]) ?? '';

        if (!currencyCode) {
            return 'Value';
        }

        return `Value (${currencyCode})`;
    }, [locationFinancialMetrics]);

    switch (viewType) {
        case FinancialMetricViewType.TransmissionChannel:
            return (
                <TransmissionChannelChart
                    yearsRange={yearsRange}
                    graphData={graphData}
                    yAxisLabel={yAxisLabel}
                />
            );
        case FinancialMetricViewType.OperationalRisk:
            return (
                <OperationalRiskChart
                    yearsRange={yearsRange}
                    graphData={graphData}
                    yAxisLabel={yAxisLabel}
                />
            );
        case FinancialMetricViewType.TechnicalPremium:
            return (
                <TechnicalPremiumChart
                    yearsRange={yearsRange}
                    graphData={graphData}
                    yAxisLabel={yAxisLabel}
                />
            );
        case FinancialMetricViewType.MarketRisk:
            return (
                <MarketRiskChart
                    yearsRange={yearsRange}
                    graphData={graphData}
                    yAxisLabel={yAxisLabel}
                />
            );
    }
};
