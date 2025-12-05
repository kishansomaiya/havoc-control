import {
    ChartsTooltipPaper,
    ChartsTooltipTable,
    ChartsTooltipRow,
    ChartsTooltipCell,
    ChartsTooltipMark,
    ChartsAxisContentProps,
} from '@mui/x-charts';
import { Box, Typography } from '@mui/material';
import { tooltipValueFormatter } from '../../../../../../utils';

const customValueFormatter = (value?: number | null): string => {
    return value ? tooltipValueFormatter(value, 1) : '0';
};

const customPercentageValueFormatter = (
    value: number | null,
    index: number,
    series: Array<{ data: (number | null)[] }>
): string => {
    const totalForYear = series
        .map(({ data }) => data[index ?? 0] || 0)
        .reduce((acc, curr) => acc + curr, 0);

    const percentage =
        totalForYear > 0 ? ((value ?? 0) / totalForYear) * 100 : 0;

    return tooltipValueFormatter(percentage, 0);
};

// Replicating the same structure as in original MUI ChartsAxisTooltipContent but with customization
// https://github.com/mui/mui-x/blob/master/packages/x-charts/src/ChartsTooltip/ChartsAxisTooltipContent.tsx
export const CustomHazardChartTooltipContent = (
    props: ChartsAxisContentProps
) => {
    const { dataIndex } = props;
    const series = props.series as Array<{
        label?: string;
        color?: string;
        data: (number | null)[];
    }>;
    const axisValue = props.axisValue as number;

    return (
        <ChartsTooltipPaper
            data-testid="chart-tooltip"
            sx={{ margin: 1.5 }}
        >
            <ChartsTooltipTable>
                <thead>
                    <ChartsTooltipRow>
                        <ChartsTooltipCell colSpan={3}>
                            <Typography data-testid="chart-tooltip-year">
                                {axisValue}
                            </Typography>
                        </ChartsTooltipCell>
                    </ChartsTooltipRow>
                </thead>
                <tbody>
                    {series.map((item) => {
                        return (
                            <ChartsTooltipRow
                                key={item?.color}
                                data-testid="chart-tooltip-score"
                            >
                                <ChartsTooltipCell className="MuiChartsTooltip-markCell">
                                    <ChartsTooltipMark
                                        data-testid="chart-tooltip-score-color"
                                        color={item?.color || '#000'}
                                    />
                                </ChartsTooltipCell>
                                <ChartsTooltipCell className="MuiChartsTooltip-labelCell">
                                    <Typography data-testid="chart-tooltip-score-label">
                                        {item?.label as string}
                                    </Typography>
                                </ChartsTooltipCell>
                                <ChartsTooltipCell className="MuiChartsTooltip-valueCell">
                                    <Box
                                        display="flex"
                                        justifyContent="space-between"
                                        gap={2.5}
                                    >
                                        <Typography data-testid="chart-tooltip-score-value">
                                            {customValueFormatter(
                                                item.data[dataIndex || 0]
                                            )}
                                        </Typography>
                                        <Typography
                                            data-testid="chart-tooltip-score-percentage"
                                            color="text.secondary"
                                        >
                                            {customPercentageValueFormatter(
                                                item.data[dataIndex || 0],
                                                dataIndex || 0,
                                                series
                                            )}
                                            %
                                        </Typography>
                                    </Box>
                                </ChartsTooltipCell>
                            </ChartsTooltipRow>
                        );
                    })}
                </tbody>
            </ChartsTooltipTable>
        </ChartsTooltipPaper>
    );
};
