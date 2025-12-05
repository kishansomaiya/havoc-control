import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MarketRiskChart } from './components/charts/MarketRiskChart';
import * as LineChart from '../../../components/Charts/Line/YearBasedLineChart';
import * as Legend from '../../../components/Charts/Legend/ChartLegend';
beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(LineChart, 'YearBasedLineChart').mockImplementation((({
        yearsRange,
        series,
        yAxisLabel,
    }: {
        yearsRange: number[];
        series: unknown[];
        yAxisLabel: string;
    }) => (
        <div data-testid="line-chart">
            {yearsRange.length}:{series.length}:{yAxisLabel}
        </div>
    )) as unknown as typeof LineChart.YearBasedLineChart);
    vi.spyOn(Legend, 'ChartLegend').mockImplementation((({
        series,
    }: {
        series: unknown[];
    }) => (
        <div data-testid="chart-legend">{series.length}</div>
    )) as unknown as typeof Legend.ChartLegend);
});

describe('MarketRiskChart', () => {
    it('renders with label and legend', () => {
        render(
            <MarketRiskChart
                yearsRange={[2020, 2025]}
                graphData={[]}
                yAxisLabel={'Value (USD)'}
            />
        );
        expect(
            screen.getByTestId('slp-financial-metrics-graph-market-risk')
        ).toBeInTheDocument();
        expect(screen.getByTestId('graph-label')).toHaveTextContent(
            'Loss by Market Risk'
        );
        expect(screen.getByTestId('chart-legend')).toBeInTheDocument();
    });
});
