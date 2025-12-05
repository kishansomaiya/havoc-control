import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationDamageAndLossGraph } from './components/LocationDamageAndLossGraph';
import {
    ImpactType,
    LossType,
    LocationImpactGroup,
    LocationImpactMetric,
} from '../../../types';
import * as impactGroupHook from '../../../hooks/useImpactGroupOptions';
import * as utils from '../../../utils';
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
        <div data-testid="chart-legend">legend-{series.length}</div>
    )) as unknown as typeof Legend.ChartLegend);
});

vi.spyOn(impactGroupHook, 'useImpactGroupOptions').mockReturnValue([
    { id: LocationImpactGroup.Acute, title: 'Acute' },
    { id: LocationImpactGroup.Chronic, title: 'Chronic' },
]);
vi.spyOn(utils, 'getLocationImpactUnitOfMeasure').mockReturnValue(
    'percentage' as unknown as ReturnType<
        typeof utils.getLocationImpactUnitOfMeasure
    >
);
vi.spyOn(utils, 'tooltipValueFormatter').mockImplementation(
    (v: number) => `${v}`
);

describe('LocationDamageAndLossGraph', () => {
    const yearsRange = [2020, 2025];
    const graphData = Object.values(LocationImpactMetric).map((metric) => ({
        id: metric as LocationImpactMetric,
        legend: `${metric}`,
        data: [1, 2],
    }));

    it('renders chart with correct label for Damage', () => {
        render(
            <LocationDamageAndLossGraph
                yearsRange={yearsRange}
                graphData={graphData}
                impactType={ImpactType.Damage}
                lossType={LossType.Total}
                currencyCode="USD"
            />
        );
        // Label shows "% Damage" because unit not set
        expect(screen.getByTestId('line-chart')).toHaveTextContent('% Damage');
    });

    it('disables Chronic button when non-Total lossType and renders checkboxes', async () => {
        const user = userEvent.setup();
        render(
            <LocationDamageAndLossGraph
                yearsRange={yearsRange}
                graphData={graphData}
                impactType={ImpactType.Damage}
                lossType={LossType.Inventory}
                currencyCode=""
            />
        );
        const chronic = screen.getAllByTestId(
            'slp-damage-loss-graph-button'
        )[1];
        expect(chronic).toBeDisabled();
        const acute = screen.getAllByTestId('slp-damage-loss-graph-button')[0];
        await user.click(acute);
        expect(
            screen.getByTestId('slp-damage-loss-graph-checkboxes')
        ).toBeInTheDocument();
    });
});
