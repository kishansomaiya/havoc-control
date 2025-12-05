import {
    ComponentProps,
    FC,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from 'react';
import { BarChart, BarItem, BarLabelContext } from '@mui/x-charts';
import { numberValueFormatter } from '../../../utils';

interface YearBasedBarChartProps extends ComponentProps<typeof BarChart> {
    yearsRange: number[];
    yAxisLabel?: string;
    showBarLabel?: boolean;
}

type bandScaleType = 'band';
const MIN_BAR_HEIGHT = 10;

export const YearBasedBarChart: FC<YearBasedBarChartProps> = ({
    yearsRange,
    sx,
    series,
    yAxisLabel,
    showBarLabel = true,
    ...props
}) => {
    const [years, setYears] = useState<Date[]>([]);

    useEffect(() => {
        setYears(yearsRange.map((year) => new Date(year, 0, 1)));
    }, [setYears, yearsRange]);

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
                scaleType: 'band' as bandScaleType,
                tickLabelStyle: {
                    fontSize: '0.6875rem',
                },
                valueFormatter: (date: Date) =>
                    yearsRange.includes(date.getFullYear())
                        ? date.getFullYear().toString()
                        : '',
                categoryGapRatio: 0.35,
                barGapRatio: 0.35,
            },
        ];
    }, [yearsRange, years]);

    const yAxis = useMemo(() => {
        return [
            {
                max: allValuesAreEqual
                    ? ((series.length && series[0].data?.[0]) || 0.8) * 1.25
                    : undefined,
                min: 0,
                label: yAxisLabel,
                valueFormatter: (value: number) =>
                    numberValueFormatter({ value, withDecimal: false }),
            },
        ];
    }, [allValuesAreEqual, series, yAxisLabel]);

    const getBarLabel = useCallback(
        (item: BarItem, context: BarLabelContext) => {
            if (context.bar.height < MIN_BAR_HEIGHT || !showBarLabel) {
                return '';
            }
            return numberValueFormatter({ value: item.value || 0 });
        },
        [showBarLabel]
    );

    return (
        <BarChart
            {...props}
            grid={{ horizontal: true }}
            slotProps={{
                legend: {
                    hidden: true,
                },
            }}
            barLabel={getBarLabel}
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
                ['& .MuiChartsAxis-root .MuiChartsAxis-Bar']: {
                    stroke: (theme) => theme.palette.text.secondary,
                },
                ['.MuiChartsAxis-tickContainer > line']: {
                    display: 'none',
                },
                ['.MuiBarLabel-root']: {
                    fill: '#242424',
                },
                ['.MuiChartsAxis-directionY .MuiChartsAxis-label']: {
                    transform: 'translateX(-1.375rem)',
                    fill: (theme) => theme.palette.text.secondary,
                },
                ...sx,
            }}
        />
    );
};
