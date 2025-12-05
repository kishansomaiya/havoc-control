import { ComponentProps, FC, useMemo } from 'react';
import { LineChart } from '@mui/x-charts';
import { buildSvgGradientStyleSX, numberValueFormatter } from '../../../utils';
import { SvgGradientStyles } from '../SvgGradientStyles/SvgGradientStyles';

const xAxisPaddingInYears = 2;
const tickStep = 5;

type YearBasedLineChartProps = ComponentProps<typeof LineChart> & {
    yearsRange: number[];
    yAxisLabel?: string;
    useGradient?: boolean;
    yAxisValueFormatter?: (value: number) => string;
    xAxisPadding?: number;
    xMax?: number;
    xMin?: number;
};

export const YearLineChart: FC<YearBasedLineChartProps> = ({
    yearsRange,
    sx,
    series,
    yAxisLabel,
    xMax,
    xMin,
    xAxisPadding = xAxisPaddingInYears,
    yAxisValueFormatter = (value: number) =>
        numberValueFormatter({ value, withDecimal: false }),
    useGradient = false,
    ...props
}) => {
    const xAxis = useMemo(() => {
        const paddedMax =
            yearsRange.length > 0
                ? yearsRange[yearsRange.length - 1] + xAxisPadding
                : undefined;
        const paddedMin =
            yearsRange.length > 0 ? yearsRange[0] + xAxisPadding : undefined;

        return [
            {
                id: 'Years',
                data: yearsRange,
                tickLabelStyle: {
                    fontSize: '0.6875rem',
                },
                tickMinStep: tickStep,
                tickMaxStep: tickStep,
                tickNumber: yearsRange.length,
                valueFormatter: (date: number) => date.toString(),
                max: xMax ?? paddedMax,
                min: xMin ?? paddedMin,
            },
        ];
    }, [yearsRange, xAxisPadding, xMin, xMax]);

    const yAxis = useMemo(() => {
        return [
            {
                label: yAxisLabel,
                valueFormatter: yAxisValueFormatter,
            },
        ];
    }, [yAxisLabel, yAxisValueFormatter]);

    if (series.length > 0 && yearsRange?.length !== series[0]?.data?.length) {
        return;
    }

    return (
        <LineChart
            {...props}
            grid={{ horizontal: true }}
            slotProps={{
                legend: {
                    hidden: false,
                    position: {
                        vertical: 'bottom',
                        horizontal: 'middle',
                    },
                },
            }}
            xAxis={xAxis}
            series={series || []}
            margin={{
                left: 40,
                top: 10,
                right: 15,
                bottom: 80,
            }}
            yAxis={yAxis}
            sx={{
                [`& .MuiMarkElement-root`]: {
                    fill: (theme) => theme.palette.common.white,
                },
                ['& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel']: {
                    fill: (theme) => theme.palette.text.secondary,
                },
                ['& .MuiChartsAxis-tickContainer .MuiChartsAxis-tick']: {
                    stroke: (theme) => theme.palette.text.secondary,
                },
                ['& .MuiChartsAxis-root .MuiChartsAxis-line']: {
                    stroke: (theme) => theme.palette.text.secondary,
                },
                ['.MuiChartsAxis-tickContainer > line']: {
                    display: 'none',
                },
                ['.MuiChartsAxis-tickContainer > line:has(+ text)']: {
                    display: 'inline',
                },
                ['.MuiChartsAxis-directionY .MuiChartsAxis-label']: {
                    transform: 'translateX(-1.375rem)',
                    fill: (theme) => theme.palette.text.secondary,
                },
                ...(useGradient ? buildSvgGradientStyleSX(series) : {}),
                ...sx,
            }}
        >
            {useGradient && <SvgGradientStyles series={series} />}
        </LineChart>
    );
};
