import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { TechnicalPremiumChart } from './components/charts/TechnicalPremiumChart';
import * as BarChart from '../../../components/Charts/Bar/YearBasedBarChart';
import * as Legend from '../../../components/Charts/Legend/ChartLegend';
beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(BarChart, 'YearBasedBarChart').mockImplementation((({
        yearsRange,
        series,
        yAxisLabel,
    }: {
        yearsRange: number[];
        series: unknown[];
        yAxisLabel: string;
    }) => (
        <div data-testid="bar-chart">
            {yearsRange.length}:{series.length}:{yAxisLabel}
        </div>
    )) as unknown as typeof BarChart.YearBasedBarChart);
    vi.spyOn(Legend, 'ChartLegend').mockImplementation((({
        series,
    }: {
        series: unknown[];
    }) => (
        <div data-testid="chart-legend">{series.length}</div>
    )) as unknown as typeof Legend.ChartLegend);
});

describe('TechnicalPremiumChart', () => {
    it('renders with label and legend', () => {
        render(
            <TechnicalPremiumChart
                yearsRange={[2020, 2025]}
                graphData={[]}
                yAxisLabel={'Value (USD)'}
            />
        );
        expect(
            screen.getByTestId('slp-financial-metrics-graph-technical-premium')
        ).toBeInTheDocument();
        expect(screen.getByTestId('graph-label')).toHaveTextContent(
            'Loss by Technical Premium'
        );
        expect(screen.getByTestId('chart-legend')).toBeInTheDocument();
    });
});
