import { ComponentProps, FC, useMemo } from 'react';
import { LineChart } from '@mui/x-charts';
import { buildSvgGradientStyleSX, numberValueFormatter } from '../../../utils';
import { SvgGradientStyles } from '../SvgGradientStyles/SvgGradientStyles';

const xAxisPaddingInYears = 2;
const fiveYearsInMilliseconds = 3600 * 1000 * 24 * 365 * 5;

interface YearBasedLineChartProps extends ComponentProps<typeof LineChart> {
    yearsRange: number[];
    yAxisLabel?: string;
    useGradient?: boolean;
    yAxisValueFormatter?: (value: number) => string;
    xAxisPadding?: number;
}

type timeScaleType = 'time';

export const YearBasedLineChart: FC<YearBasedLineChartProps> = ({
    yearsRange,
    sx,
    series,
    yAxisLabel,
    xAxisPadding = xAxisPaddingInYears,
    yAxisValueFormatter = (value: number) =>
        numberValueFormatter({ value, withDecimal: false }),
    useGradient = false,
    ...props
}) => {
    const years = useMemo(
        () => yearsRange.map((year) => new Date(year, 0, 1)),
        [yearsRange]
    );

    const allValuesAreEqual = useMemo<boolean>(() => {
        const uniqueValue =
            (series.length && series[0].data?.length && series[0].data[0]) || 0;
        return series.every((seriesConfig) => {
            return (
                (seriesConfig?.data || []).every(
                    (value) => !value || value === seriesConfig?.data?.[0]
                ) && seriesConfig?.data?.[0] === uniqueValue
            );
        });
    }, [series]);

    const xAxis = useMemo(() => {
        return [
            {
                id: 'Years',
                data: years,
                scaleType: 'time' as timeScaleType,
                tickLabelStyle: {
                    fontSize: '0.6875rem',
                },
                tickMinStep: fiveYearsInMilliseconds,
                tickMaxStep: fiveYearsInMilliseconds,
                tickLabelInterval: (value: Date) => {
                    return yearsRange.includes(value.getFullYear());
                },
                tickNumber: years.length,
                valueFormatter: (date: Date) =>
                    yearsRange.includes(date.getFullYear())
                        ? date.getFullYear().toString()
                        : '',
                max: new Date(
                    yearsRange[yearsRange.length - 1] + xAxisPadding,
                    0,
                    1
                ),
                min: new Date(yearsRange[0] - xAxisPadding, 0, 1),
            },
        ];
    }, [yearsRange, years, xAxisPadding]);

    const yAxis = useMemo(() => {
        return [
            {
                max: allValuesAreEqual
                    ? ((series.length && series[0].data?.[0]) || 0.8) * 1.25
                    : undefined,
                min: 0,
                label: yAxisLabel,
                valueFormatter: yAxisValueFormatter,
            },
        ];
    }, [allValuesAreEqual, series, yAxisLabel, yAxisValueFormatter]);

    if (series.length > 0 && years?.length !== series[0]?.data?.length) {
        return;
    }

    return (
        <LineChart
            {...props}
            grid={{ horizontal: true }}
            slotProps={{
                legend: {
                    hidden: true,
                },
            }}
            xAxis={xAxis}
            series={series || []}
            margin={{
                left: 60,
                top: 10,
                right: 10,
                bottom: 20,
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
