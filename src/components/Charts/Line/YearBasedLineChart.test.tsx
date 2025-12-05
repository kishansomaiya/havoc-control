import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YearBasedLineChart } from './YearBasedLineChart';
import type { LineSeriesType } from '@mui/x-charts';
import type { ReactNode } from 'react';

type MockLineChartProps = {
    children?: ReactNode;
    xAxis?: Array<{
        scaleType?: 'time';
        valueFormatter: (d: Date) => string;
        min?: Date;
        max?: Date;
        tickMinStep?: number;
        tickMaxStep?: number;
        tickLabelInterval?: (d: Date) => boolean;
        tickNumber?: number;
    }>;
    yAxis?: Array<{
        max?: number;
        min?: number;
        label?: string;
        valueFormatter?: (v: number) => string;
    }>;
    slotProps?: { legend?: { hidden?: boolean } };
    series?: LineSeriesType[];
};

const store: { lastProps: MockLineChartProps | null } = { lastProps: null };

vi.mock('@mui/x-charts', () => ({
    LineChart: (props: MockLineChartProps) => {
        store.lastProps = props;
        return <div data-testid="mock-line-chart">{props.children}</div>;
    },
}));

describe('YearBasedLineChart', () => {
    beforeEach(() => {
        store.lastProps = null;
    });

    it('does not render when yearsRange length mismatches first series data length', () => {
        render(
            <YearBasedLineChart
                yearsRange={[2020, 2021]}
                series={[{ id: 's1', data: [1] } as LineSeriesType]}
            />
        );
        expect(screen.queryByTestId('mock-line-chart')).not.toBeInTheDocument();
    });

    it('renders LineChart with gradient child when useGradient is true', () => {
        render(
            <YearBasedLineChart
                yearsRange={[2020, 2021]}
                series={[
                    { id: 's1', data: [1, 2], color: '#111' } as LineSeriesType,
                ]}
                useGradient
            />
        );
        expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
        expect(document.querySelector('defs')).toBeTruthy();
    });

    it('computes yAxis max when all series values are equal; otherwise undefined', () => {
        render(
            <YearBasedLineChart
                yearsRange={[2020, 2021]}
                series={[{ id: 's1', data: [10, 10] } as LineSeriesType]}
            />
        );
        expect(store.lastProps?.yAxis?.[0]?.max).toBeCloseTo(12.5);

        render(
            <YearBasedLineChart
                yearsRange={[2020, 2021]}
                series={[{ id: 's1', data: [10, 20] } as LineSeriesType]}
            />
        );
        expect(store.lastProps?.yAxis?.[0]?.max).toBeUndefined();
    });

    it('sets xAxis time scale and formats only labeled years', () => {
        render(
            <YearBasedLineChart
                yearsRange={[2020, 2025]}
                series={[{ id: 's1', data: [1, 2] } as LineSeriesType]}
            />
        );
        const xAxis = store.lastProps?.xAxis?.[0];
        expect(xAxis).toBeTruthy();
        expect(xAxis?.scaleType).toBe('time');

        const inRange = new Date(2020, 0, 1);
        const outOfRange = new Date(2022, 0, 1);
        expect(xAxis?.valueFormatter(inRange)).toBe('2020');
        expect(xAxis?.valueFormatter(outOfRange)).toBe('');
    });

    it('applies yAxis label and formatter', () => {
        render(
            <YearBasedLineChart
                yearsRange={[2020]}
                series={[{ id: 's1', data: [3] } as LineSeriesType]}
                yAxisLabel="Y Label"
            />
        );
        const yAxis = store.lastProps?.yAxis?.[0];
        expect(yAxis).toBeTruthy();
        expect(yAxis?.label).toBe('Y Label');
        expect(typeof yAxis?.valueFormatter).toBe('function');
        expect(yAxis?.valueFormatter?.(5)).toBeTypeOf('string');
    });
});
