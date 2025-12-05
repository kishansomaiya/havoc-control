import { BarChart, StackOrderType } from '@mui/x-charts';
import { ComponentProps, FC, useMemo } from 'react';
import { ScoreLevel } from '../../../../../../types';
import { SCORE_LEVEL_COLORS } from '../../../../../../const';
import { SCORE_LEVEL_TITLES } from '../../../../../../const/scoreLevelTitles';
import { tooltipValueFormatter } from '../../../../../../utils';
import { SeriesValueFormatterContext } from '@mui/x-charts/internals';
import { CustomHazardChartTooltipContent } from './CustomHazardChartTooltip';

type ExcludedProps = 'series';

interface ClimateRelatedHazardChartProps
    extends Omit<ComponentProps<typeof BarChart>, ExcludedProps> {
    years: number[];
    portfolioComplianceData: { [key: string]: string | number }[];
    jupiterMetrics: string[];
    showLocationsCountInTooltip?: boolean;
}

export const ClimateRelatedHazardChart: FC<ClimateRelatedHazardChartProps> = ({
    sx,
    years,
    portfolioComplianceData,
    jupiterMetrics,
    showLocationsCountInTooltip = false,
    ...props
}) => {
    const defaultValues = useMemo(
        () => Array(years.length).fill(0),
        [years.length]
    );

    const calculatedChartData = useMemo<Record<ScoreLevel, number[]>>(() => {
        const resultData: Record<ScoreLevel, number[]> = Object.fromEntries(
            Object.values(ScoreLevel).map((level) => [
                level,
                [...defaultValues],
            ])
        ) as Record<ScoreLevel, number[]>;
        portfolioComplianceData.forEach((locationComplianceDataPerYear) => {
            const year = locationComplianceDataPerYear.year as number;
            const yearIndex = years.indexOf(year);
            if (yearIndex < 0) {
                return;
            }
            jupiterMetrics.forEach((metric: string) => {
                const metricTierValue = locationComplianceDataPerYear[metric];
                const valueIsScoreLevel = Object.values(ScoreLevel).includes(
                    metricTierValue as ScoreLevel
                );
                const metricScoreLevel: ScoreLevel = valueIsScoreLevel
                    ? (metricTierValue as ScoreLevel)
                    : ScoreLevel.NA;
                const prevValue = resultData[metricScoreLevel][yearIndex];
                resultData[metricScoreLevel][yearIndex] = prevValue + 1;
            });
        });

        Object.values(ScoreLevel).forEach((level) => {
            resultData[level] = resultData[level].map(
                (value) => value / (jupiterMetrics.length || 1)
            );
        });

        return resultData;
    }, [portfolioComplianceData, jupiterMetrics, years, defaultValues]);

    const series = useMemo(
        () =>
            Object.values(ScoreLevel)
                .reverse()
                .map((scoreLevel: ScoreLevel) => {
                    return {
                        data: calculatedChartData[scoreLevel].slice(
                            0,
                            years.length
                        ),
                        label: SCORE_LEVEL_TITLES[scoreLevel],
                        id: scoreLevel,
                        stack: 'total',
                        color: SCORE_LEVEL_COLORS[scoreLevel],
                        stackOrder: 'reverse' as StackOrderType,
                        valueFormatter: (
                            value: number | null,
                            context: SeriesValueFormatterContext
                        ): string => {
                            const totalForYear: number = series
                                .map(
                                    ({ data }) =>
                                        data[context.dataIndex ?? 0] || 0
                                )
                                .reduce((acc, curr) => acc + curr, 0);

                            const percentage =
                                totalForYear > 0
                                    ? ((value ?? 0) / totalForYear) * 100
                                    : 0;

                            return tooltipValueFormatter(percentage, 0) + '%';
                        },
                    };
                }),
        [calculatedChartData, years.length]
    );

    return (
        <BarChart
            {...props}
            series={series}
            xAxis={[
                {
                    data: years,
                    scaleType: 'band',
                    valueFormatter: (year, context) =>
                        context.location === 'tick' ? `${year}` : `${year}`,
                },
            ]}
            slotProps={{
                legend: { hidden: true },
            }}
            slots={{
                axisContent: showLocationsCountInTooltip
                    ? CustomHazardChartTooltipContent
                    : undefined,
            }}
            sx={{
                ['& .MuiChartsAxis-directionX .MuiChartsAxis-tickContainer .MuiChartsAxis-tick']:
                    {
                        display: 'none',
                    },
                ['& .MuiChartsAxis-tickContainer .MuiChartsAxis-tickLabel']: {
                    fill: (theme) => theme.palette.text.secondary,
                },
                ['& .MuiChartsAxis-tickContainer .MuiChartsAxis-tick']: {
                    stroke: (theme) => theme.palette.text.secondary,
                },
                ['& .MuiChartsAxis-directionY .MuiChartsAxis-line']: {
                    stroke: (theme) => theme.palette.text.secondary,
                    strokeWidth: 1,
                },
                ['& .MuiChartsAxis-directionX .MuiChartsAxis-line']: {
                    stroke: 'rgba(255, 255, 255, 0.12)',
                    strokeWidth: 0.1,
                },
                ...sx,
            }}
        />
    );
};
