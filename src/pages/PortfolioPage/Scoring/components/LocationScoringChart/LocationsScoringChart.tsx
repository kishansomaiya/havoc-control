import { Box, Checkbox, FormControlLabel, Typography } from '@mui/material';
import { ComponentProps, FC, useCallback, useMemo, useState } from 'react';
import { LocationScoringData } from '../../../../../api/queries/resultSetsQuery';
import {
    ChartsReferenceLine,
    DefaultizedScatterSeriesType,
    ScatterChart,
    ScatterProps,
} from '@mui/x-charts';
import { getScoreLevelColor } from '../../../../../utils';
import { NO_AVAILABLE_SCORE } from '../../../../../const';
import { CustomScatter } from './CustomScatter';
import { ScoringChartLegend } from './ScoringChartLegend';

interface LocationsScoringChartProps extends ComponentProps<typeof Box> {
    portfolioScoringData: LocationScoringData[];
    onLocationSelected?: (locationId: number | undefined) => void;
}

interface CustomScatterSeriesType extends DefaultizedScatterSeriesType {
    locationsWithSimilarScores?: {
        locationId: number;
        locationName: string | null;
    }[];
}

const REFERENCE_LINE_STYLE = {
    stroke: 'white',
    strokeDasharray: '10 8',
    strokeWidth: '0.125rem',
};

const CHART_LABEL_STYLE = {
    fontSize: '0.75rem',
};

export const LocationsScoringChart: FC<LocationsScoringChartProps> = ({
    portfolioScoringData,
    onLocationSelected,
}) => {
    const [showLocationId, setShowLocationId] = useState<boolean>(false);

    const scoringDataWithoutNAScores = useMemo(() => {
        return portfolioScoringData.map(
            ({ hazardScoreValue, changeScoreValue, ...otherProps }) => {
                return {
                    hazardScoreValue:
                        hazardScoreValue === NO_AVAILABLE_SCORE
                            ? 0
                            : hazardScoreValue,
                    changeScoreValue:
                        changeScoreValue === NO_AVAILABLE_SCORE
                            ? 0
                            : changeScoreValue,
                    ...otherProps,
                };
            }
        );
    }, [portfolioScoringData]);

    const averageHazardScoreValue = useMemo(() => {
        const scoringDataWithoutNAScores = portfolioScoringData.filter(
            ({ hazardScoreValue }) => hazardScoreValue !== NO_AVAILABLE_SCORE
        );

        if (!scoringDataWithoutNAScores.length) {
            return 0;
        }

        return (
            scoringDataWithoutNAScores.reduce(
                (total, score) => total + score.hazardScoreValue,
                0
            ) / scoringDataWithoutNAScores.length
        );
    }, [portfolioScoringData]);

    const averageChangeScoreValue = useMemo(() => {
        const scoringDataWithoutNAScores = portfolioScoringData.filter(
            ({ changeScoreValue }) => changeScoreValue !== NO_AVAILABLE_SCORE
        );

        if (!scoringDataWithoutNAScores.length) {
            return 0;
        }

        return (
            scoringDataWithoutNAScores.reduce(
                (total, score) => total + score.changeScoreValue,
                0
            ) / scoringDataWithoutNAScores.length
        );
    }, [portfolioScoringData]);

    const allXAxisValuesAreTheSame = useMemo(() => {
        return scoringDataWithoutNAScores.every(
            ({ hazardScoreValue }) =>
                hazardScoreValue === averageHazardScoreValue
        );
    }, [scoringDataWithoutNAScores, averageHazardScoreValue]);

    const xAxisMinMaxValues = useMemo<{ min?: number; max?: number }>(() => {
        if (!allXAxisValuesAreTheSame) {
            return {
                min: undefined,
                max: undefined,
            };
        }

        const delta =
            averageHazardScoreValue !== 0
                ? Math.abs(averageHazardScoreValue / 2)
                : 1;
        return {
            min: averageHazardScoreValue - delta,
            max: averageHazardScoreValue + delta,
        };
    }, [allXAxisValuesAreTheSame, averageHazardScoreValue]);

    const allYAxisValuesAreTheSame = useMemo(() => {
        return scoringDataWithoutNAScores.every(
            ({ changeScoreValue }) =>
                changeScoreValue === averageChangeScoreValue
        );
    }, [scoringDataWithoutNAScores, averageChangeScoreValue]);

    const yAxisMinMaxValues = useMemo<{ min?: number; max?: number }>(() => {
        if (!allYAxisValuesAreTheSame) {
            return {
                min: undefined,
                max: undefined,
            };
        }

        const delta =
            averageChangeScoreValue !== 0
                ? Math.abs(averageChangeScoreValue / 2)
                : 1;
        return {
            min: averageChangeScoreValue - delta,
            max: averageChangeScoreValue + delta,
        };
    }, [allYAxisValuesAreTheSame, averageChangeScoreValue]);

    const chartSeries = useMemo(() => {
        return scoringDataWithoutNAScores.map(
            ({
                locationId,
                locationName,
                hazardScoreValue,
                changeScoreValue,
                overallScoreValue,
            }) => {
                const locationsWithSimilarScores = scoringDataWithoutNAScores
                    .filter((scoreData) => {
                        return (
                            scoreData.hazardScoreValue === hazardScoreValue &&
                            scoreData.changeScoreValue === changeScoreValue
                        );
                    })
                    .map((scoreData) => ({
                        locationId: scoreData.locationId,
                        locationName: scoreData.locationName,
                    }))
                    .sort((locAId, locBId) => (locAId > locBId ? 1 : -1));
                return {
                    label: locationName || `Location#${locationId}`,
                    data: [
                        {
                            x: hazardScoreValue,
                            y: changeScoreValue,
                            id: locationId,
                        },
                    ],
                    color: getScoreLevelColor(overallScoreValue),
                    id: locationId.toString(),
                    locationsWithSimilarScores,
                };
            }
        );
    }, [scoringDataWithoutNAScores]);

    const scatterSlotsProp = useCallback(
        (scatterProps: ScatterProps) => {
            const series = scatterProps.series as CustomScatterSeriesType;
            const locations: {
                locationId: number;
                locationName: string | null;
            }[] = series.locationsWithSimilarScores || [];

            const hazardScoreValue = scatterProps.series.data[0].x;
            const xPos = scatterProps.xScale(hazardScoreValue);

            const changeScoreValue = scatterProps.series.data[0].y;
            const yPos = scatterProps.yScale(changeScoreValue);

            return (
                <CustomScatter
                    xPos={xPos}
                    yPos={yPos}
                    color={scatterProps.color}
                    showLocationId={showLocationId}
                    locations={locations}
                    hazardScoreValue={hazardScoreValue}
                    changeScoreValue={changeScoreValue}
                    onLocationSelected={onLocationSelected}
                />
            );
        },
        [showLocationId, onLocationSelected]
    );

    const toggleShowLocationId = useCallback(() => {
        setShowLocationId(!showLocationId);
    }, [setShowLocationId, showLocationId]);

    return (
        <Box
            width="100%"
            height="100%"
            display="flex"
            flexDirection="column"
            data-testid="locations-scoring-chart"
        >
            <Box
                display="flex"
                flexDirection="row"
                alignItems="center"
                justifyContent="space-between"
                pb={2}
            >
                <Typography
                    variant="overline"
                    color="text.secondary"
                    data-testid="locations-scoring-chart-label"
                >
                    2020-2050 Change Score
                </Typography>
                <FormControlLabel
                    control={
                        <Checkbox
                            onChange={toggleShowLocationId}
                            checked={showLocationId}
                            color="secondary"
                            data-testid="show-locations-checkbox"
                        />
                    }
                    label="Show Location ID"
                    data-testid="show-locations"
                />
            </Box>
            <Box
                flexGrow="1"
                overflow="auto"
                data-testid="scatter-chart"
            >
                <ScatterChart
                    series={chartSeries}
                    slotProps={{
                        legend: {
                            hidden: true,
                        },
                    }}
                    disableVoronoi={true}
                    margin={{
                        left: 60,
                        top: 10,
                        right: 10,
                        bottom: 40,
                    }}
                    grid={{ vertical: true, horizontal: true }}
                    slots={{
                        scatter: scatterSlotsProp,
                    }}
                    xAxis={[
                        {
                            label: 'Present Day Hazard Score',
                            labelStyle: CHART_LABEL_STYLE,
                            min: xAxisMinMaxValues.min,
                            max: xAxisMinMaxValues.max,
                        },
                    ]}
                    yAxis={[
                        {
                            label: '2020-2050 Change Score',
                            labelStyle: CHART_LABEL_STYLE,
                            min: yAxisMinMaxValues.min,
                            max: yAxisMinMaxValues.max,
                        },
                    ]}
                    sx={{
                        [`& .MuiMarkElement-root`]: {
                            fill: (theme) => theme.palette.common.white,
                        },
                        ['& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel']:
                            {
                                fill: (theme) => theme.palette.text.secondary,
                            },
                        ['& .MuiChartsAxis-tickContainer .MuiChartsAxis-tick']:
                            {
                                stroke: (theme) => theme.palette.text.secondary,
                            },
                        ['& .MuiChartsAxis-root .MuiChartsAxis-line']: {
                            stroke: (theme) => theme.palette.text.secondary,
                        },
                        ['.MuiChartsAxis-directionY .MuiChartsAxis-label']: {
                            transform: 'translateX(-1.375rem)',
                            fill: (theme) => theme.palette.text.secondary,
                        },
                        ['.MuiChartsAxis-directionX .MuiChartsAxis-label']: {
                            fontSize: '0.75rem',
                            fill: (theme) => theme.palette.text.secondary,
                        },
                    }}
                >
                    <ChartsReferenceLine
                        x={averageHazardScoreValue}
                        lineStyle={REFERENCE_LINE_STYLE}
                    />
                    <ChartsReferenceLine
                        y={averageChangeScoreValue}
                        lineStyle={REFERENCE_LINE_STYLE}
                    />
                </ScatterChart>
            </Box>
            <ScoringChartLegend />
        </Box>
    );
};
