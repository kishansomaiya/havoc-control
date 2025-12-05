import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as utils from '../../../../utils';
import { ImpactsMetrics } from './ImpactsMetrics';
import { PortfolioImpactsLocationData } from 'types';
import { MetricInfo } from 'components/MetricInfo/MetricInfo';
import { ComponentProps } from 'react';
import * as MetricInfoModule from '../../../../components/MetricInfo/MetricInfo';

vi.spyOn(MetricInfoModule, 'MetricInfo').mockImplementation(
    (props: ComponentProps<typeof MetricInfo>) => (
        <div data-testid="metrics-info">
            <span>{props.title}</span>
            <span>{props.fromValue}</span>
            <span>{props.toValue}</span>
        </div>
    )
);

vi.spyOn(utils, 'getLocationCurrencyCode').mockReturnValue('USD');
vi.spyOn(utils, 'getLocationMetricValueWithoutNA').mockImplementation(
    (data: unknown) => (data as { value: number }).value ?? 0
);

describe('ImpactsMetrics', () => {
    it('renders metric infos with computed values', () => {
        const impactsData = [
            { year: 2020, value: 10 },
            { year: 2025, value: 15 },
        ] as unknown as PortfolioImpactsLocationData[];
        render(
            <ImpactsMetrics
                yearFrom={2020}
                yearTo={2025}
                impactsData={impactsData}
            />
        );
        expect(screen.getByTestId('metrics')).toBeInTheDocument();
        const items = screen.getAllByTestId('metrics-info');
        expect(items.length).toBeGreaterThan(0);
    });
});
