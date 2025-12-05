import { ScoreLevel } from '../../../../../types';
import { SCORE_LEVEL_TITLES } from '../../../../../const/scoreLevelTitles';
import { SCORE_LEVEL_COLORS } from '../../../../../const';
import { Box } from '@mui/material';
import {
    ChartLegend,
    LegendSeries,
} from '../../../../../components/Charts/Legend/ChartLegend';
import { SCORE_LEVEL_TOOLTIPS } from '../../../../../const/scoreLevelTooltips';

const LEGEND_SERIES: LegendSeries[] = [
    ScoreLevel.Lowest,
    ScoreLevel.Low,
    ScoreLevel.Medium,
    ScoreLevel.High,
    ScoreLevel.Highest,
].map((scoreLevel) => ({
    legend: SCORE_LEVEL_TITLES[scoreLevel],
    color: SCORE_LEVEL_COLORS[scoreLevel],
    id: scoreLevel,
    description: SCORE_LEVEL_TOOLTIPS[scoreLevel],
}));

LEGEND_SERIES.push({
    legend: 'Average Score Value',
    node: (
        <svg
            height="100%"
            width="100%"
            style={{
                margin: '1',
            }}
        >
            <path
                id="line-vert"
                d="M 6 0.5 l 00 12"
                stroke="white"
                strokeDasharray="3, 1"
                strokeWidth="1"
            />
            <path
                id="line-horz"
                d="M 0.5 6 l 12 0"
                stroke="white"
                strokeDasharray="3, 1"
                strokeWidth="1"
            />
        </svg>
    ),
    color: 'white',
    id: 'reference-line',
});

export const ScoringChartLegend = () => {
    return (
        <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            pt={2}
        >
            <ChartLegend
                series={LEGEND_SERIES}
                data-testid="scoring-chart-legend"
            />
        </Box>
    );
};
