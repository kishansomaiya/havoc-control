import { ComponentProps, FC, useCallback, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import type { DefaultizedPieValueType, PieItemIdentifier } from '@mui/x-charts';
import { Score, ScoreLevel, ScoreLevelCounts } from '../../../../types';
import Grid from '@mui/material/Unstable_Grid2';
import { SCORE_LEVEL_COLORS, SCORE_TITLES } from '../../../../const';
import { StyledPieChart } from '../../../../components/Charts/Pie/StyledPieChart';
import { useWindowSize } from '../../../../hooks/useWindowSize';
import {
    PerilsOptionsDataVersionEnum,
    ResultSetDataSchema,
} from '../../../../api/openapi/auto-generated';
import { useLocationInScoreLevels } from '../../../../hooks/useLocationInScoreLevels';
import { SCORE_LEVEL_TITLES } from '../../../../const/scoreLevelTitles';
import { ChartLegend } from '../../../../components/Charts/Legend/ChartLegend';
import { getHazardScoreLevelDescription } from '../../../../const/hazardScoreLevelDescription';

const HAZARD_AREA_LEVELS: ScoreLevel[] = [
    ScoreLevel.Lowest,
    ScoreLevel.Low,
    ScoreLevel.Medium,
    ScoreLevel.High,
    ScoreLevel.Highest,
    ScoreLevel.NA,
];

const LEGEND_SERIES = HAZARD_AREA_LEVELS.map((scoreLevel) => ({
    legend: SCORE_LEVEL_TITLES[scoreLevel],
    color: SCORE_LEVEL_COLORS[scoreLevel],
    id: scoreLevel,
}));

export interface LocationInHazardAreasChartsProps
    extends ComponentProps<typeof Box> {
    score: Score;
    metric: ResultSetDataSchema;
    scoreLevelCounts: ScoreLevelCounts;
    dataVersion?: PerilsOptionsDataVersionEnum;
    selectedScoreLevel?: ScoreLevel | null;
    onFilterByScoreLevel?: (level: ScoreLevel) => void;
}

export const LocationInHazardAreasCharts: FC<
    LocationInHazardAreasChartsProps
> = ({
    score,
    metric,
    scoreLevelCounts,
    dataVersion,
    selectedScoreLevel,
    onFilterByScoreLevel,
    ...props
}) => {
    const { locationInScoreLevels } = useLocationInScoreLevels(
        scoreLevelCounts,
        HAZARD_AREA_LEVELS
    );
    const windowSize = useWindowSize();

    const chartSize = useMemo(
        () => Math.min(220, windowSize.height / 3.6),
        [windowSize]
    );

    const legendSeries = useMemo(() => {
        return LEGEND_SERIES.map((legend) => {
            return {
                ...legend,
                description: getHazardScoreLevelDescription(
                    legend.id,
                    score,
                    metric,
                    dataVersion
                ),
            };
        });
    }, [score, metric, dataVersion]);

    const handlePieChartSlotClick = useCallback(
        (
            _e: React.MouseEvent<SVGPathElement, MouseEvent>,
            _id: PieItemIdentifier,
            item: DefaultizedPieValueType
        ) => {
            if (!onFilterByScoreLevel) {
                return;
            }
            onFilterByScoreLevel(item.level);
        },
        [onFilterByScoreLevel]
    );

    return (
        <Box {...props}>
            <Grid
                container
                spacing={2}
                width="100%"
                data-testid="portfolio-hazard-chart-inner"
            >
                <Grid xs={5}>
                    <Typography
                        variant="h1"
                        gutterBottom
                        data-testid="portfolio-hazard-chart-label"
                    >
                        Hazard Level
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        data-testid="portfolio-hazard-chart-description"
                    >
                        {metric.userGuideDefinition}
                    </Typography>
                </Grid>
                <Grid
                    xs={7}
                    pr={0}
                    data-testid="portfolio-hazard-chart-score"
                >
                    <Box pb={2}>
                        <Typography
                            variant="overline"
                            color="text.secondary"
                            textTransform="uppercase"
                            data-testid="portfolio-hazard-chart-score-label"
                        >
                            % Locations by Hazard Level - {SCORE_TITLES[score]}
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
                            onSlotClick={handlePieChartSlotClick}
                            selectedSlotId={
                                locationInScoreLevels.find(
                                    (locn) => locn.level === selectedScoreLevel
                                )?.id
                            }
                            data-testid="portfolio-hazard-chart-score-pie"
                        />
                        <Box>
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
