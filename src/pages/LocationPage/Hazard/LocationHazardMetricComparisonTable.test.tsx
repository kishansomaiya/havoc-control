import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationHazardMetricComparisonTable } from './components/LocationHazardMetricComparisonTable';
import { ResultSetDataSchema } from '../../../api/openapi/auto-generated';
import * as ChangeIndicatorModule from '../../../components/Table/ChangeIndicator';

// Replace module mock with a spy providing a minimal presentational stub
beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(ChangeIndicatorModule, 'ChangeIndicator').mockImplementation(
        (() => (
            <div data-testid="change-indicator" />
        )) as unknown as typeof ChangeIndicatorModule.ChangeIndicator
    );
});

const metrics: ResultSetDataSchema[] = [
    {
        id: 'mean_temp',
        enhancedName: 'Mean Temp',
    } as unknown as ResultSetDataSchema,
    {
        id: 'mean_precip',
        enhancedName: 'Mean Precip',
    } as unknown as ResultSetDataSchema,
];

const metricComparisonData = {
    mean_temp: { 2020: 1, 2025: 2 },
    mean_precip: { 2020: 3, 2025: 4 },
} as Record<string, Record<number, number>>;

describe('LocationHazardMetricComparisonTable', () => {
    it('renders header and rows and allows metric selection', async () => {
        const user = userEvent.setup();
        const onMetricIdChange = vi.fn();
        render(
            <LocationHazardMetricComparisonTable
                metrics={metrics}
                selectedMetricId={'mean_temp'}
                yearFrom={2020}
                yearTo={2025}
                onMetricIdChange={onMetricIdChange}
                metricComparisonData={metricComparisonData}
            />
        );
        expect(
            screen.getByTestId('slp-hazard-metrics-table')
        ).toBeInTheDocument();
        const rows = screen.getAllByTestId('table-row');
        expect(rows.length).toBe(2);
        await user.click(rows[1]);
        expect(onMetricIdChange).toHaveBeenCalledWith('mean_precip');
    });
});
