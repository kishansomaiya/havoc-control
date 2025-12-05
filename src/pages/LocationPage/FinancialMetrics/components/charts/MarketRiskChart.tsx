import { ComponentProps, FC, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { YearBasedLineChart } from '../../../../../components/Charts/Line/YearBasedLineChart';
import { ChartLegend } from '../../../../../components/Charts/Legend/ChartLegend';
import { LocationFinancialMetricsGraphData } from '../LocationFinancialMetricsGraph';
import { LocationFinancialMetric } from '../../../../../types';

interface MarketRiskChartProps extends ComponentProps<typeof Box> {
    yearsRange: number[];
    graphData: LocationFinancialMetricsGraphData[];
    yAxisLabel: string;
}

export const MarketRiskChart: FC<MarketRiskChartProps> = ({
    yearsRange,
    graphData,
    yAxisLabel,
    ...props
}) => {
    const series = useMemo(() => {
        return graphData.filter(({ id }) =>
            [
                LocationFinancialMetric.BenchmarkAssetValue,
                LocationFinancialMetric.ClimateAdjustedAssetValue,
            ].includes(id)
        );
    }, [graphData]);

    return (
        <Box
            height="100%"
            display="flex"
            flexDirection="column"
            {...props}
            data-testid="slp-financial-metrics-graph-market-risk"
        >
            <Typography
                variant="overline"
                color="text.secondary"
                data-testid="graph-label"
            >
                Loss by Market Risk
            </Typography>
            <Box
                flexGrow="1"
                overflow="auto"
                pt={2}
                data-testid="graph-chart"
            >
                {yearsRange?.length > 0 && (
                    <YearBasedLineChart
                        yearsRange={yearsRange}
                        series={series}
                        yAxisLabel={yAxisLabel}
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
        </Box>
    );
};
