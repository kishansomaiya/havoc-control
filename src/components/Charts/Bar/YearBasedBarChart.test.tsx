import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YearBasedBarChart } from './YearBasedBarChart';
import type { BarLabelContext, BarItem } from '@mui/x-charts';
import type { ReactNode } from 'react';

type MockBarChartProps = {
    children?: ReactNode;
    xAxis?: Array<{
        scaleType?: 'band';
        valueFormatter: (d: Date) => string;
    }>;
    yAxis?: Array<{
        max?: number;
    }>;
    barLabel?: (item: BarItem, context: BarLabelContext) => string;
};

const store: { lastProps: MockBarChartProps | null } = { lastProps: null };

vi.mock('@mui/x-charts', () => ({
    BarChart: (props: MockBarChartProps) => {
        store.lastProps = props;
        return <div data-testid="mock-bar-chart" />;
    },
}));

describe('YearBasedBarChart', () => {
    beforeEach(() => {
        store.lastProps = null;
    });

    it('renders and sets xAxis to band scale with year labels', () => {
        render(
            <YearBasedBarChart
                yearsRange={[2020, 2021]}
                series={[{ id: 's1', data: [10, 20] }] as unknown as []}
            />
        );
        expect(screen.getByTestId('mock-bar-chart')).toBeInTheDocument();
        const xAxis = store.lastProps?.xAxis?.[0];
        expect(xAxis).toBeTruthy();
        expect(xAxis?.scaleType).toBe('band');
        const date = new Date(2020, 0, 1);
        expect(xAxis?.valueFormatter(date)).toBe('2020');
    });

    it('computes yAxis max when all values equal; otherwise undefined', () => {
        render(
            <YearBasedBarChart
                yearsRange={[2020, 2021]}
                series={[{ id: 's1', data: [10, 10] }] as unknown as []}
            />
        );
        expect(store.lastProps?.yAxis?.[0]?.max).toBeCloseTo(12.5);

        render(
            <YearBasedBarChart
                yearsRange={[2020, 2021]}
                series={[{ id: 's1', data: [10, 20] }] as unknown as []}
            />
        );
        expect(store.lastProps?.yAxis?.[0]?.max).toBeUndefined();
    });

    it('returns empty string for bar label when bar too small or showBarLabel=false', () => {
        render(
            <YearBasedBarChart
                yearsRange={[2020]}
                series={[{ id: 's1', data: [10] }] as unknown as []}
                showBarLabel={false}
            />
        );
        const fn = store.lastProps?.barLabel as (
            item: BarItem,
            context: BarLabelContext
        ) => string;
        expect(
            fn(
                { value: 10 } as BarItem,
                { bar: { height: 5 } } as BarLabelContext
            )
        ).toBe('');
        expect(
            fn(
                { value: 10 } as BarItem,
                { bar: { height: 100 } } as BarLabelContext
            )
        ).toBe('');
    });

    it('formats bar label for sufficient height', () => {
        render(
            <YearBasedBarChart
                yearsRange={[2020]}
                series={[{ id: 's1', data: [1000] }] as unknown as []}
            />
        );
        const fn = store.lastProps?.barLabel as (
            item: BarItem,
            context: BarLabelContext
        ) => string;
        expect(
            fn(
                { value: 1000 } as BarItem,
                { bar: { height: 100 } } as BarLabelContext
            )
        ).toBeTypeOf('string');
    });
});
