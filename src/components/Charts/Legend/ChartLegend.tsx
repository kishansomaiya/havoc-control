import { Box, Tooltip, Typography, useTheme } from '@mui/material';
import { ComponentProps, FC, ReactNode, useMemo } from 'react';
import * as Icon from 'react-feather';

export interface LegendSeries {
    legend: string;
    color: string;
    id: string;
    description?: string;
    node?: ReactNode;
}

interface ChartLegendProps extends ComponentProps<typeof Box> {
    series: LegendSeries[];
    orientation?: 'vertical' | 'horizontal';
}

export const ChartLegend: FC<ChartLegendProps> = ({
    series,
    orientation = 'horizontal',
    ...props
}) => {
    const theme = useTheme();
    const boxDirection = useMemo(
        () => (orientation === 'horizontal' ? 'row' : 'column'),
        [orientation]
    );

    const itemsGap = useMemo(
        () => (orientation === 'horizontal' ? 2.5 : 1),
        [orientation]
    );

    return (
        <Box
            display="flex"
            flexDirection={boxDirection}
            gap={itemsGap}
            {...props}
        >
            {series.map(({ legend, color, id, description, node }) => (
                <Box
                    key={id}
                    display="flex"
                    alignItems="center"
                    gap={1}
                    data-testid="chart-legend-item"
                >
                    {node ? (
                        <Box
                            sx={{
                                width: '1rem',
                                height: '1rem',
                                borderRadius: '0.25rem',
                                overflow: 'hidden',
                                border: '1px solid',
                                borderColor: color,
                            }}
                            data-testid="chart-legend-item-node"
                        >
                            {node}
                        </Box>
                    ) : (
                        <Box
                            sx={{
                                width: '1rem',
                                height: '1rem',
                                background: color,
                                borderRadius: '0.25rem',
                                textIndent: '-20rem',
                                overflow: 'hidden',
                            }}
                            data-testid="chart-legend-item-color"
                        >
                            {legend}
                        </Box>
                    )}
                    <Typography
                        variant="body2"
                        color="text.highlighted"
                        data-testid="chart-legend-item-text"
                    >
                        {legend}
                    </Typography>
                    {description && (
                        <Tooltip
                            title={description}
                            arrow
                            placement="top"
                            data-testid="chart-legend-item-tooltip"
                        >
                            <Icon.Info
                                size="1rem"
                                color={theme.palette.text.secondary}
                            />
                        </Tooltip>
                    )}
                </Box>
            ))}
        </Box>
    );
};
