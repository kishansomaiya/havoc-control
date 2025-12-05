import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import * as utils from '../../../../utils';
import { ImpactsOverTimeChart } from './ImpactsOverTimeChart';
import {
    LocationFinancialMetric,
    PortfolioImpactsLocationData,
} from '../../../../types';
import * as ChartLegendModule from '../../../../components/Charts/Legend/ChartLegend';
import * as YearBasedLineChartModule from '../../../../components/Charts/Line/YearBasedLineChart';
import * as YearBasedBarChartModule from '../../../../components/Charts/Bar/YearBasedBarChart';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(ChartLegendModule, 'ChartLegend').mockImplementation(() => (
        <div data-testid="chart-legend" />
    ));
    vi.spyOn(YearBasedLineChartModule, 'YearBasedLineChart').mockImplementation(
        () => <div data-testid="line-chart" />
    );
    vi.spyOn(YearBasedBarChartModule, 'YearBasedBarChart').mockImplementation(
        () => <div data-testid="bar-chart" />
    );
    vi.spyOn(utils, 'getLocationCurrencyCode').mockReturnValue(
        'USD' as ReturnType<typeof utils.getLocationCurrencyCode>
    );
    vi.spyOn(utils, 'getLocationMetricValueWithoutNA').mockImplementation(
        (data: unknown) => (data as { value: number }).value ?? 0
    );
});

describe('ImpactsOverTimeChart', () => {
    const impactsData = [
        { year: 2020, value: 10 },
        { year: 2025, value: 15 },
    ] as unknown as PortfolioImpactsLocationData[];
    const years = [2020, 2025];

    it('renders line chart and legend', () => {
        render(
            <ImpactsOverTimeChart
                title="T"
                metrics={[LocationFinancialMetric.AverageAnnualLossFlood]}
                impactsData={impactsData}
                yearsRange={years}
            />
        );
        expect(screen.getByTestId('chart-body')).toBeInTheDocument();
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        expect(screen.getByTestId('chart-legend')).toBeInTheDocument();
    });

    it('renders bar chart when isBarChart', () => {
        render(
            <ImpactsOverTimeChart
                title="T"
                metrics={[LocationFinancialMetric.AverageAnnualLossFlood]}
                impactsData={impactsData}
                yearsRange={years}
                isBarChart
            />
        );
        expect(screen.getByTestId('bar-chart')).toBeInTheDocument();
    });
});
