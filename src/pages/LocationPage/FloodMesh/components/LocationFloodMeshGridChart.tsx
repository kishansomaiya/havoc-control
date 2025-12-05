import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { ComponentProps, FC, useMemo } from 'react';
import {
    MeshOptionsDataVersionEnum,
    ResultSetDataSchema,
} from '../../../../api/openapi/auto-generated';
import { ScoreLevel, ScoreLevelCounts } from '../../../../types';
import { useLocationInScoreLevels } from '../../../../hooks/useLocationInScoreLevels';
import { StyledPieChart } from '../../../../components/Charts/Pie/StyledPieChart';
import { ChartLegend } from '../../../../components/Charts/Legend/ChartLegend';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import { SCORE_LEVEL_TITLES } from '../../../../const/scoreLevelTitles';
import { SCORE_LEVEL_COLORS } from '../../../../const';
import { getFloodMeshScoreLevelDescription } from '../../../../const/floodMeshScoreLevelDescription';

const FLOOD_MESH_LEVELS: ScoreLevel[] = [
    ScoreLevel.Lowest,
    ScoreLevel.Low,
    ScoreLevel.Medium,
    ScoreLevel.High,
    ScoreLevel.Highest,
    ScoreLevel.NA,
];

const LEGEND_SERIES = FLOOD_MESH_LEVELS.map((scoreLevel) => ({
    legend: SCORE_LEVEL_TITLES[scoreLevel],
    color: SCORE_LEVEL_COLORS[scoreLevel],
    id: scoreLevel,
}));

interface LocationFloodMeshGridChartProps extends ComponentProps<typeof Box> {
    selectedMetric?: ResultSetDataSchema;
    scoreLevelCounts: ScoreLevelCounts;
    dataVersion?: MeshOptionsDataVersionEnum;
    isFractionMetric: boolean;
}

export const LocationFloodMeshGridChart: FC<
    LocationFloodMeshGridChartProps
> = ({ selectedMetric, scoreLevelCounts, dataVersion, isFractionMetric }) => {
    const { locationInScoreLevels } = useLocationInScoreLevels(
        scoreLevelCounts,
        FLOOD_MESH_LEVELS
    );
    const windowSize = useWindowSize();

    const chartSize = useMemo(
        () => Math.min(220, windowSize.height / 3.2),
        [windowSize]
    );

    const legendSeries = useMemo(() => {
        return LEGEND_SERIES.map((legend) => {
            return {
                ...legend,
                description: getFloodMeshScoreLevelDescription(
                    legend.id,
                    isFractionMetric,
                    dataVersion
                ),
            };
        });
    }, [dataVersion, isFractionMetric]);

    return (
        <Box
            px={4}
            pt={5}
            pb={1}
        >
            <Grid
                container
                spacing={3}
            >
                <Grid xs={4}>
                    <Typography
                        variant="h1"
                        pb={2}
                        data-testid="slp-floodmesh-chart-label"
                    >
                        Flood Mesh
                    </Typography>
                    <Typography
                        variant="body1"
                        color="text.secondary"
                        data-testid="slp-floodmesh-chart-description"
                    >
                        {selectedMetric?.userGuideDefinition ||
                            selectedMetric?.enhancedName}
                    </Typography>
                </Grid>
                <Grid xs={8}>
                    <Box pb={2}>
                        <Typography
                            variant="overline"
                            color="text.secondary"
                            textTransform="uppercase"
                            data-testid="slp-floodmesh-pie-chart-label"
                        >
                            % Flood mesh grid by flood exposure
                        </Typography>
                    </Box>
                    <Box
                        display="flex"
                        justifyContent="center"
                        gap={2}
                        alignItems="center"
                    >
                        <StyledPieChart
                            data={locationInScoreLevels}
                            height={chartSize}
                            arcLabel={({ value }) =>
                                value && value > 3 ? `${value.toFixed(0)}%` : ''
                            }
                            width={chartSize}
                            valueFormatter={({ value }) =>
                                `${value.toFixed(2)}%`
                            }
                        />
                        <Box data-testid="slp-floodmesh-chart-legend">
                            <ChartLegend
                                series={legendSeries}
                                orientation="vertical"
                            />
                        </Box>
                    </Box>
                </Grid>
            </Grid>
        </Box>
    );
};
