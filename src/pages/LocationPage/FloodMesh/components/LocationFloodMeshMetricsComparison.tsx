import { Box } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { ComponentProps, FC, useMemo } from 'react';
import { MetricInfo } from '../../../../components/MetricInfo/MetricInfo';
import { MetricComparisonType } from '../../../../types';
import {
    FLOOD_MESH_METRIC_DESCRIPTION,
    FLOOD_MESH_METRIC_TITLE,
} from '../../../../const';

interface LocationFloodMeshMetricsComparisonProps
    extends ComponentProps<typeof Box> {
    yearFromValues: number[];
    yearToValues: number[];
    yearFrom: number;
    yearTo: number;
    isFractionMetric: boolean;
}

interface FloodMeshMetricComparison {
    type: MetricComparisonType;
    title: string;
    description: string;
    fromValue?: number;
    toValue?: number;
}

const getAverageValue = (metricValues: number[]): number | undefined =>
    metricValues.length > 0
        ? metricValues.reduce((metricA, metricB) => metricA + metricB) /
          metricValues.length
        : undefined;

const getMaxValue = (metricValues: number[]): number | undefined =>
    metricValues.length > 0 ? Math.max(...metricValues) : undefined;

const getMinValue = (metricValues: number[]): number | undefined =>
    metricValues.length > 0 ? Math.min(...metricValues) : undefined;

const getMetricValueByComparisonType = {
    [MetricComparisonType.Average]: getAverageValue,
    [MetricComparisonType.Max]: getMaxValue,
    [MetricComparisonType.Min]: getMinValue,
};

export const LocationFloodMeshMetricsComparison: FC<
    LocationFloodMeshMetricsComparisonProps
> = ({ yearFromValues, yearToValues, yearFrom, yearTo, isFractionMetric }) => {
    const floodMeshMetricComparisons: FloodMeshMetricComparison[] =
        useMemo(() => {
            return [
                MetricComparisonType.Average,
                MetricComparisonType.Max,
                MetricComparisonType.Min,
            ].map((comparisonType) => {
                return {
                    type: comparisonType,
                    title: FLOOD_MESH_METRIC_TITLE[comparisonType](
                        isFractionMetric
                    ),
                    description:
                        FLOOD_MESH_METRIC_DESCRIPTION[comparisonType](
                            isFractionMetric
                        ),
                    fromValue:
                        getMetricValueByComparisonType[comparisonType](
                            yearFromValues
                        ),
                    toValue:
                        getMetricValueByComparisonType[comparisonType](
                            yearToValues
                        ),
                };
            });
        }, [isFractionMetric, yearFromValues, yearToValues]);

    const fractionDigits = useMemo(
        () => (isFractionMetric ? 0 : 1),
        [isFractionMetric]
    );

    return (
        <Box p={4}>
            <Grid
                container
                spacing={2}
                data-testid="metrics"
            >
                {floodMeshMetricComparisons.map(
                    ({ type, title, description, fromValue, toValue }) => {
                        return (
                            <Grid
                                xs={4}
                                key={type}
                                data-testid="metrics-info"
                            >
                                <MetricInfo
                                    title={title}
                                    yearTo={yearTo}
                                    yearFrom={yearFrom}
                                    tooltip={description}
                                    fromValue={fromValue}
                                    toValue={toValue}
                                    fractionDigits={fractionDigits}
                                />
                            </Grid>
                        );
                    }
                )}
            </Grid>
        </Box>
    );
};
