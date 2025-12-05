import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { YearLineChart } from './YearLineChart';
import type { LineSeriesType } from '@mui/x-charts';
import type { ReactNode } from 'react';

type MockLineChartProps = {
    children?: ReactNode;
    xAxis?: Array<{
        min?: number;
        max?: number;
        tickMinStep?: number;
        tickMaxStep?: number;
        valueFormatter: (v: number) => string;
    }>;
    yAxis?: Array<{
        label?: string;
        valueFormatter?: (v: number) => string;
    }>;
    slotProps?: { legend?: { hidden?: boolean } };
};

const store: { lastProps: MockLineChartProps | null } = { lastProps: null };

vi.mock('@mui/x-charts', () => ({
    LineChart: (props: MockLineChartProps) => {
        store.lastProps = props;
        return <div data-testid="mock-line-chart">{props.children}</div>;
    },
}));

describe('YearLineChart', () => {
    beforeEach(() => {
        store.lastProps = null;
    });

    it('does not render when yearsRange length mismatches first series data length', () => {
        render(
            <YearLineChart
                yearsRange={[2020, 2021]}
                series={[{ id: 's1', data: [1] } as LineSeriesType]}
            />
        );
        expect(screen.queryByTestId('mock-line-chart')).not.toBeInTheDocument();
    });

    it('renders LineChart and exposes legend when slotProps.legend.hidden=false', () => {
        render(
            <YearLineChart
                yearsRange={[2020, 2021]}
                series={[{ id: 's1', data: [1, 2] } as LineSeriesType]}
            />
        );
        expect(screen.getByTestId('mock-line-chart')).toBeInTheDocument();
        expect(store.lastProps?.slotProps?.legend?.hidden).toBe(false);
    });

    it('sets xAxis tick step and respects xMin/xMax overrides', () => {
        render(
            <YearLineChart
                yearsRange={[2020, 2021, 2022, 2023, 2024]}
                xMin={2019}
                xMax={2030}
                series={[{ id: 's1', data: [1, 2, 3, 4, 5] } as LineSeriesType]}
            />
        );
        const xAxis = store.lastProps?.xAxis?.[0];
        expect(xAxis).toBeTruthy();
        expect(xAxis?.min).toBe(2019);
        expect(xAxis?.max).toBe(2030);
        expect(xAxis?.tickMinStep).toBe(5);
        expect(xAxis?.tickMaxStep).toBe(5);
        expect(xAxis?.valueFormatter(2020)).toBe('2020');
    });

    it('applies yAxis label and formatter', () => {
        render(
            <YearLineChart
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
