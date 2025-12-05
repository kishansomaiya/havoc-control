import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ClimateRelatedHazardChart } from './ClimateRelatedHazardChart';
import { ScoreLevel } from '../../../../../../types';
// no direct import of XCharts types needed
import * as CustomTooltipModule from './CustomHazardChartTooltip';

vi.mock('@mui/x-charts', async () => {
    const actual =
        await vi.importActual<typeof import('@mui/x-charts')>('@mui/x-charts');
    return {
        ...actual,
        BarChart: (props: {
            series: { label: string; color: string; data: number[] }[];
            slots?: {
                axisContent?: (props: {
                    axisValue: number;
                    dataIndex: number;
                    series: { label: string; color: string; data: number[] }[];
                }) => JSX.Element;
            };
        }) => (
            <div data-testid="bar-chart">
                <div data-testid="series-count">{props.series.length}</div>
                {props.slots?.axisContent ? (
                    <props.slots.axisContent
                        axisValue={2020}
                        dataIndex={0}
                        series={props.series}
                    />
                ) : null}
            </div>
        ),
    };
});

vi.spyOn(
    CustomTooltipModule,
    'CustomHazardChartTooltipContent'
).mockImplementation(() => <div data-testid="custom-tooltip">tooltip</div>);

vi.mock('../../../../../../const', async () => {
    const orig = await vi.importActual<
        typeof import('../../../../../../const')
    >('../../../../../../const');
    return {
        ...orig,
        SCORE_LEVEL_TITLES: {
            NA: 'NA',
            LOW: 'LOW',
            MEDIUM: 'MEDIUM',
            HIGH: 'HIGH',
            EXTREME: 'EXTREME',
        },
        SCORE_LEVEL_COLORS: {
            NA: '#000',
            LOW: '#111',
            MEDIUM: '#222',
            HIGH: '#333',
            EXTREME: '#444',
        },
    };
});

describe('ClimateRelatedHazardChart', () => {
    it('renders series for all score levels', () => {
        render(
            <ClimateRelatedHazardChart
                years={[2020, 2025]}
                portfolioComplianceData={
                    [
                        {
                            year: 2020,
                            m1: ScoreLevel.NA,
                            m2: ScoreLevel.Low,
                        },
                    ] as {
                        year: number;
                        m1: ScoreLevel;
                        m2: ScoreLevel;
                    }[]
                }
                jupiterMetrics={['m1', 'm2']}
                height={100}
            />
        );
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
        expect(
            Number(screen.getByTestId('series-count').textContent)
        ).toBeGreaterThan(0);
    });

    it('uses custom tooltip when enabled', () => {
        render(
            <ClimateRelatedHazardChart
                years={[2020, 2025]}
                portfolioComplianceData={[]}
                jupiterMetrics={[]}
                height={100}
                showLocationsCountInTooltip
            />
        );
        expect(screen.getByTestId('custom-tooltip')).toBeInTheDocument();
    });
});
