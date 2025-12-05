import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationFinancialMetricsComparison } from './components/LocationFinancialMetricsComparison';
import { LocationFinancialMetricsData } from '../../../types';
import * as MetricInfoModule from '../../../components/MetricInfo/MetricInfo';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(MetricInfoModule, 'MetricInfo').mockImplementation((({
        title,
        yearFrom,
        yearTo,
    }: {
        title: string;
        yearFrom: number;
        yearTo: number;
    }) => (
        <div data-testid="metric-info">
            {title}:{yearFrom}:{yearTo}
        </div>
    )) as unknown as typeof MetricInfoModule.MetricInfo);
});

describe('LocationFinancialMetricsComparison', () => {
    const fromData = new LocationFinancialMetricsData();
    const toData = new LocationFinancialMetricsData();

    it('renders selected financial metrics with titles and years', () => {
        render(
            <LocationFinancialMetricsComparison
                yearFrom={2020}
                yearTo={2025}
                financialDataFrom={fromData}
                financialDataTo={toData}
            />
        );
        const items = screen.getAllByTestId('metric-info');
        expect(items.length).toBeGreaterThan(0);
        expect(items[0]).toHaveTextContent(':2020:2025');
    });
});
