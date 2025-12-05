import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationFinancialMetricsGraph } from './components/LocationFinancialMetricsGraph';
import {
    FinancialMetricViewType,
    LocationFinancialMetricsData,
} from '../../../types';
import * as LineChart from '../../../components/Charts/Line/YearBasedLineChart';
import * as BarChart from '../../../components/Charts/Bar/YearBasedBarChart';
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

describe('LocationFinancialMetricsGraph', () => {
    const years = [2020, 2025];
    const data: LocationFinancialMetricsData[] = [
        Object.assign(new LocationFinancialMetricsData(), { year: 2020 }),
        Object.assign(new LocationFinancialMetricsData(), { year: 2025 }),
    ];

    it('renders TransmissionChannel chart', () => {
        render(
            <LocationFinancialMetricsGraph
                viewType={FinancialMetricViewType.TransmissionChannel}
                yearsRange={years}
                locationFinancialMetrics={data}
            />
        );
        expect(
            screen.getByTestId(
                'slp-financial-metrics-graph-transmission-channel'
            )
        ).toBeInTheDocument();
    });

    it('renders OperationalRisk chart', () => {
        render(
            <LocationFinancialMetricsGraph
                viewType={FinancialMetricViewType.OperationalRisk}
                yearsRange={years}
                locationFinancialMetrics={data}
            />
        );
        expect(
            screen.getByTestId('slp-financial-metrics-graph-operational-risk')
        ).toBeInTheDocument();
    });

    it('renders TechnicalPremium chart', () => {
        render(
            <LocationFinancialMetricsGraph
                viewType={FinancialMetricViewType.TechnicalPremium}
                yearsRange={years}
                locationFinancialMetrics={data}
            />
        );
        expect(
            screen.getByTestId('slp-financial-metrics-graph-technical-premium')
        ).toBeInTheDocument();
    });

    it('renders MarketRisk chart', () => {
        render(
            <LocationFinancialMetricsGraph
                viewType={FinancialMetricViewType.MarketRisk}
                yearsRange={years}
                locationFinancialMetrics={data}
            />
        );
        expect(
            screen.getByTestId('slp-financial-metrics-graph-market-risk')
        ).toBeInTheDocument();
    });
});
