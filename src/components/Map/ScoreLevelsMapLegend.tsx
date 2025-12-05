import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { SCORE_LEVEL_COLORS } from '../../const';
import { ScoreLevel } from '../../types';
import { ComponentProps, FC } from 'react';

const ScoreLevelColorValues = Object.values(SCORE_LEVEL_COLORS).filter(
    (value) => value !== SCORE_LEVEL_COLORS[ScoreLevel.NA]
);

interface ScoreLevelsMapLegendProps extends ComponentProps<typeof Box> {
    title?: string;
    lowestLabel?: string;
    highestLabel?: string;
    colors?: string[];
}

export const ScoreLevelsMapLegend: FC<ScoreLevelsMapLegendProps> = ({
    title = 'Hazard Exposure',
    lowestLabel = ScoreLevel.Lowest,
    highestLabel = ScoreLevel.Highest,
    colors = ScoreLevelColorValues,
    ...props
}) => {
    return (
        <Box
            sx={{
                bgcolor: 'background.default',
                borderRadius: '0.25rem',
                ...props.sx,
            }}
            px={3}
            py={2}
            {...props}
            data-testid="score-levels-map-legend"
        >
            <Typography
                variant="overline"
                pb={1}
                mb={0}
                color="text.secondary"
                textTransform="uppercase"
                paragraph
                data-testid="score-levels-map-legend-title"
            >
                {title}
            </Typography>
            <Grid
                container
                gap={0.5}
                justifyContent="space-between"
                pb={0.5}
                data-testid="score-levels-map-legend-values"
            >
                {colors.map((color) => (
                    <Grid
                        key={color}
                        flexGrow={1}
                        py={0.25}
                        sx={{ background: color }}
                        data-testid="score-levels-map-legend-value"
                    />
                ))}
            </Grid>
            <Box
                justifyContent="space-between"
                display="flex"
            >
                {lowestLabel ? (
                    <Typography
                        variant="overline"
                        textTransform="none"
                        data-testid="score-levels-map-legend-score-level-lowest"
                    >
                        {lowestLabel}
                    </Typography>
                ) : null}

                {highestLabel ? (
                    <Typography
                        variant="overline"
                        textTransform="none"
                        data-testid="score-levels-map-legend-score-level-highest"
                    >
                        {highestLabel}
                    </Typography>
                ) : null}
            </Box>
        </Box>
    );
};
