import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationFloodMeshMetricsComparison } from './components/LocationFloodMeshMetricsComparison';
import * as MetricInfoModule from '../../../components/MetricInfo/MetricInfo';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(MetricInfoModule, 'MetricInfo').mockImplementation((({
        yearFrom,
        yearTo,
    }: {
        yearFrom: number;
        yearTo: number;
    }) => (
        <div data-testid="metric-info">
            {yearFrom}:{yearTo}
        </div>
    )) as unknown as typeof MetricInfoModule.MetricInfo);
});

describe('LocationFloodMeshMetricsComparison', () => {
    it('renders three comparison tiles', () => {
        render(
            <LocationFloodMeshMetricsComparison
                yearFromValues={[1, 2, 3]}
                yearToValues={[2, 3, 4]}
                yearFrom={2020}
                yearTo={2025}
                isFractionMetric={false}
            />
        );
        const items = screen.getAllByTestId('metric-info');
        expect(items.length).toBe(3);
        expect(items[0]).toHaveTextContent('2020:2025');
    });
});
