import { ComponentProps, FC, useMemo } from 'react';
import { Box } from '@mui/material';
import {
    LocationFinancialMetric,
    PortfolioImpactsLocationData,
} from '../../../../types';
import { ChartLegend } from '../../../../components/Charts/Legend/ChartLegend';
import { ImpactsDataWrapper } from './ImpactsDataWrapper';
import { YearBasedLineChart } from '../../../../components/Charts/Line/YearBasedLineChart';
import { YearBasedBarChart } from '../../../../components/Charts/Bar/YearBasedBarChart';
import {
    LOCATION_FINANCIAL_METRIC_COLOR,
    LOCATION_FINANCIAL_METRIC_TITLE,
} from '../../../../const';
import {
    getLocationCurrencyCode,
    getLocationMetricValueWithoutNA,
} from '../../../../utils';

const METRIC_TITLE = {
    ...LOCATION_FINANCIAL_METRIC_TITLE,
    [LocationFinancialMetric.TechnicalPremium]:
        'Technical (Risk-Based Insurance) Premium',
    [LocationFinancialMetric.BenchmarkAssetValue]: 'Benchmark Value',
    [LocationFinancialMetric.ClimateAdjustedAssetValue]:
        'Climate-Adjusted Value',
};

interface ImpactsOverTimeChartProps extends ComponentProps<typeof Box> {
    title: string;
    metrics: LocationFinancialMetric[];
    isBarChart?: boolean;
    isLineWithArea?: boolean;
    useGradient?: boolean;
    impactsData: PortfolioImpactsLocationData[];
    yearsRange: number[];
}

export const ImpactsOverTimeChart: FC<ImpactsOverTimeChartProps> = ({
    title,
    metrics,
    isBarChart = false,
    isLineWithArea = false,
    useGradient = false,
    yearsRange,
    impactsData,
    ...props
}) => {
    const yAxisLabel = useMemo(() => {
        const currencyCode = getLocationCurrencyCode(impactsData[0]) ?? '';

        if (!currencyCode) {
            return 'Value';
        }

        return `Value (${currencyCode})`;
    }, [impactsData]);

    const series = useMemo(() => {
        const graphData: {
            [key: number]: PortfolioImpactsLocationData[];
        } = yearsRange.reduce(
            (result, year) => ({
                ...result,
                [year]: impactsData.filter(
                    (locationData) => locationData.year === year
                ),
            }),
            {}
        );

        return metrics.map((metric) => ({
            id: metric,
            legend: METRIC_TITLE[metric],
            label: METRIC_TITLE[metric],
            data: yearsRange.map((year) =>
                graphData[year].reduce(
                    (sum, locationData) =>
                        sum +
                            Number(
                                getLocationMetricValueWithoutNA(
                                    metric,
                                    locationData
                                )
                            ) || 0,
                    0
                )
            ),
            area: isLineWithArea,
            showMark: false,
            color: LOCATION_FINANCIAL_METRIC_COLOR[metric],
            stack: isLineWithArea || isBarChart ? 'transmission' : undefined,
        }));
    }, [metrics, impactsData, yearsRange, isLineWithArea, isBarChart]);

    const YearBasedChart = useMemo(
        () => (isBarChart ? YearBasedBarChart : YearBasedLineChart),
        [isBarChart]
    );

    return (
        <ImpactsDataWrapper
            title={title}
            {...props}
            data-testid="chart-body"
        >
            <Box
                flexGrow="1"
                overflow="auto"
                pt={2}
                data-testid="chart-graph"
            >
                {yearsRange?.length > 0 && (
                    <YearBasedChart
                        yearsRange={yearsRange}
                        series={series}
                        yAxisLabel={yAxisLabel}
                        showBarLabel={false}
                        useGradient={useGradient}
                    />
                )}
            </Box>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                pt={2}
            >
                <ChartLegend
                    series={series}
                    data-testid="chart-legend"
                />
            </Box>
        </ImpactsDataWrapper>
    );
};
