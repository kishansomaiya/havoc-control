import { ComponentProps, FC, useMemo } from 'react';
import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import { Gauge, gaugeClasses } from '@mui/x-charts';
import { getScoreLevel, getScoreLevelColor } from '../../../utils';
import { ScoreLevel } from '../../../types';
import * as Icon from 'react-feather';
import { SCORE_LEVEL_TITLES } from '../../../const/scoreLevelTitles';

export interface RiskScoreChartProps extends ComponentProps<typeof Box> {
    title: string;
    description?: string;
    value: number;
    size?: 'small' | 'medium' | 'large';
    valuePrefix?: string;
    valueSuffix?: string;
    showScoreLevel?: boolean;
    scoreValueFormatter?: (value: number | null) => string;
}

export const RiskScoreChart: FC<RiskScoreChartProps> = ({
    children,
    title,
    description,
    value,
    size = 'medium',
    showScoreLevel = true,
    valuePrefix = '',
    valueSuffix = '',
    scoreValueFormatter = (value: number | null) => (value || '').toString(),
    ...props
}) => {
    const theme = useTheme();

    const valueFontSize = useMemo(() => {
        return size === 'large' ? 48 : 24;
    }, [size]);

    const headerVariant = useMemo(() => {
        return size === 'large' ? 'h4' : 'h6';
    }, [size]);

    const chartSize = useMemo(() => {
        return size === 'small' ? 90 : size === 'medium' ? 130 : 196;
    }, [size]);

    const scoreLevel: ScoreLevel = useMemo(() => {
        return getScoreLevel(value);
    }, [value]);

    const arcColor: string = useMemo(() => {
        return getScoreLevelColor(value);
    }, [value]);

    return (
        <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            {...props}
            data-testid="risk-score-small-charts-item-block"
        >
            <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                mb={-1}
                gap={0.5}
                data-testid="risk-score-small-charts-item-title"
            >
                <Typography
                    variant={headerVariant}
                    fontWeight="bold"
                >
                    {title}
                </Typography>
                {description && (
                    <Tooltip
                        title={description}
                        arrow
                        placement="top"
                    >
                        <Box
                            mr={-1}
                            display="flex"
                            zIndex={1}
                            data-testid="risk-score-small-charts-item-tooltip"
                        >
                            <Icon.Info
                                size="0.875rem"
                                color={theme.palette.text.secondary}
                                data-testid="risk-score-small-charts-item-tooltip-icon"
                            />
                        </Box>
                    </Tooltip>
                )}
            </Box>
            <Gauge
                width={chartSize}
                height={chartSize / 2}
                value={value}
                valueMin={value < 0 ? value : 0}
                valueMax={99}
                startAngle={-90}
                endAngle={90}
                innerRadius="86%"
                sx={{
                    [`& .${gaugeClasses.valueText}`]: {
                        fontSize: valueFontSize,
                        fontWeight: 'bold',
                        transform: `translate(0, -${valueFontSize / 2}px)`,
                        color: 'text.accent',
                    },
                    [`& .${gaugeClasses.valueArc}`]: {
                        fill: arcColor,
                    },
                }}
                text={({ value }) =>
                    `${valuePrefix}${scoreValueFormatter(value)}${valueSuffix}`
                }
                data-testid="risk-score-small-charts-item-value"
            />
            {showScoreLevel && (
                <Typography
                    variant="body2"
                    mt={-1}
                    color="text.secondary"
                    data-testid="risk-score-small-charts-item-score-level"
                >
                    {SCORE_LEVEL_TITLES[scoreLevel]}
                </Typography>
            )}
            {children}
        </Box>
    );
};
