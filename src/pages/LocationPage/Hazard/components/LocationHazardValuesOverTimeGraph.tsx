import { Box, Typography } from '@mui/material';
import {
    ComponentProps,
    FC,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { ResultSetDataSchema } from '../../../../api/openapi/auto-generated';
import { NO_AVAILABLE_SCORE } from '../../../../const';
import { YearBasedLineChart } from '../../../../components/Charts/Line/YearBasedLineChart';
import { ChartLegend } from '../../../../components/Charts/Legend/ChartLegend';
import {
    getFormattedByUnitOfMeasureHazardValue,
    getHazardUnitOfMeasure,
} from '../../../../utils';
import { UnitOfMeasure } from '../../../../types';

type GraphData = Record<string, Record<number, number | undefined>>;

interface SeriesConfig {
    data: number[];
    color: string;
    id: string;
    showMark: boolean;
    legend: string;
}

const initialSeriesConfigs: SeriesConfig[] = [
    {
        data: [],
        color: '#0AB490',
        id: 'upper',
        showMark: false,
        legend: 'Upper (95th)',
    },
    {
        data: [],
        color: '#2EAEE2',
        id: 'mean',
        showMark: true,
        legend: 'Mean',
    },
    {
        data: [],
        color: '#FF6F50',
        id: 'lower',
        showMark: false,
        legend: 'Lower (5th)',
    },
];

interface LocationHazardValuesOverTimeGraphProps
    extends ComponentProps<typeof Box> {
    yearsRange: number[];
    metric: ResultSetDataSchema;
    graphData: GraphData;
}

export const LocationHazardValuesOverTimeGraph: FC<
    LocationHazardValuesOverTimeGraphProps
> = ({ yearsRange, metric, graphData, ...props }) => {
    const [series, setSeries] = useState<SeriesConfig[]>(initialSeriesConfigs);

    const metricUnitOfMeasure = useMemo(
        () => getHazardUnitOfMeasure(metric),
        [metric]
    );

    const valueFormatter = useCallback(
        (value: number) =>
            getFormattedByUnitOfMeasureHazardValue(value, metricUnitOfMeasure),
        [metricUnitOfMeasure]
    );

    useEffect(() => {
        if (!yearsRange || !graphData) {
            setSeries(initialSeriesConfigs);
            return;
        }
        const seriesWithUpdatedData = initialSeriesConfigs.map(
            (seriesConfig) => {
                const data = yearsRange.map((year) => {
                    const metricValue = graphData?.[seriesConfig.id][year];
                    return !metricValue || metricValue === NO_AVAILABLE_SCORE
                        ? 0
                        : metricValue;
                });
                return {
                    ...seriesConfig,
                    label: seriesConfig.legend,
                    data,
                    valueFormatter,
                };
            }
        );
        setSeries(seriesWithUpdatedData);
    }, [yearsRange, setSeries, graphData, valueFormatter]);

    return (
        <Box
            height="100%"
            display="flex"
            flexDirection="column"
            {...props}
        >
            <Typography
                variant="overline"
                color="text.secondary"
                data-testid="slp-hazard-chart-label"
            >
                Hazard Values Over Time
            </Typography>
            <Typography
                variant="caption"
                color="text.highlighted"
                data-testid="slp-hazard-chart-description"
            >
                {metric.enhancedName}
            </Typography>
            <Box
                flexGrow="1"
                overflow="auto"
                pt={2}
                data-testid="slp-hazard-chart-graph"
            >
                {yearsRange?.length > 0 &&
                    yearsRange.length === series[0].data.length && (
                        <YearBasedLineChart
                            yearsRange={yearsRange}
                            series={series}
                            sx={{
                                '.MuiLineElement-series-upper': {
                                    strokeDasharray: '10 8',
                                },
                                '.MuiLineElement-series-lower': {
                                    strokeDasharray: '10 8',
                                },
                            }}
                            yAxisLabel={
                                metricUnitOfMeasure === UnitOfMeasure.Percentage
                                    ? 'Value (%)'
                                    : 'Value'
                            }
                            yAxisValueFormatter={valueFormatter}
                        />
                    )}
            </Box>
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                pt={2}
                data-testid="slp-hazard-chart-legend"
            >
                <ChartLegend series={series} />
            </Box>
        </Box>
    );
};
