import { ComponentProps, FC, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { LocationFinancialMetricsGraphData } from '../LocationFinancialMetricsGraph';
import { LocationFinancialMetric } from '../../../../../types';
import { ChartLegend } from '../../../../../components/Charts/Legend/ChartLegend';
import { YearBasedBarChart } from '../../../../../components/Charts/Bar/YearBasedBarChart';

interface TechnicalPremiumChartProps extends ComponentProps<typeof Box> {
    yearsRange: number[];
    graphData: LocationFinancialMetricsGraphData[];
    yAxisLabel: string;
}

export const TechnicalPremiumChart: FC<TechnicalPremiumChartProps> = ({
    yearsRange,
    graphData,
    yAxisLabel,
    ...props
}) => {
    const series = useMemo(() => {
        return graphData.filter(({ id }) =>
            [LocationFinancialMetric.TechnicalPremium].includes(id)
        );
    }, [graphData]);

    return (
        <Box
            height="100%"
            display="flex"
            flexDirection="column"
            {...props}
            data-testid="slp-financial-metrics-graph-technical-premium"
        >
            <Typography
                variant="overline"
                color="text.secondary"
                data-testid="graph-label"
            >
                Loss by Technical Premium
            </Typography>
            <Box
                flexGrow="1"
                overflow="auto"
                pt={2}
                data-testid="graph-chart"
            >
                {yearsRange?.length > 0 && (
                    <YearBasedBarChart
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
