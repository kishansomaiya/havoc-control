import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { LocationImpactMetricComparison } from './components/LocationImpactMetricComparison';
import {
    ImpactType,
    LocationDamageAndLossData,
    LossType,
} from '../../../types';
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

describe('LocationImpactMetricComparison', () => {
    const fromData = new LocationDamageAndLossData();
    const toData = new LocationDamageAndLossData();

    it('renders items for all metrics with titles and years', () => {
        render(
            <LocationImpactMetricComparison
                impactType={ImpactType.Damage}
                lossType={LossType.Total}
                yearFrom={2020}
                yearTo={2025}
                impactDataFrom={fromData}
                impactDataTo={toData}
            />
        );
        const items = screen.getAllByTestId('metric-info');
        expect(items.length).toBeGreaterThan(0);
        expect(items[0]).toHaveTextContent(':2020:2025');
    });
});
