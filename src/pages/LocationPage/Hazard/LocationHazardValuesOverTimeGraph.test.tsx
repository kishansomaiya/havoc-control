import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationHazardValuesOverTimeGraph } from './components/LocationHazardValuesOverTimeGraph';
import { ResultSetDataSchema } from '../../../api/openapi/auto-generated';
import * as utils from '../../../utils';
import * as LineChart from '../../../components/Charts/Line/YearBasedLineChart';
import * as Legend from '../../../components/Charts/Legend/ChartLegend';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(utils, 'getHazardUnitOfMeasure').mockReturnValue(undefined);
    vi.spyOn(
        utils,
        'getFormattedByUnitOfMeasureHazardValue'
    ).mockImplementation((v: number | null | undefined) => `${v}`);
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

describe('LocationHazardValuesOverTimeGraph', () => {
    const years = [2020, 2025];
    const metric = {
        id: 'mean_temp',
        enhancedName: 'Mean Temp',
    } as unknown as ResultSetDataSchema;
    const graphData = {
        mean: { 2020: 1, 2025: 2 },
        upper: { 2020: 3, 2025: 4 },
        lower: { 2020: 0, 2025: 0 },
    } as Record<string, Record<number, number>>;

    it('renders graph and legend when years and data provided', () => {
        render(
            <LocationHazardValuesOverTimeGraph
                yearsRange={years}
                metric={metric}
                graphData={graphData}
            />
        );
        expect(
            screen.getByTestId('slp-hazard-chart-label')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('slp-hazard-chart-description')
        ).toHaveTextContent('Mean Temp');
        expect(screen.getByTestId('line-chart')).toBeInTheDocument();
        expect(screen.getByTestId('chart-legend')).toBeInTheDocument();
    });
});
