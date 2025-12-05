import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as useWindowSizeHook from '../../../../hooks/useWindowSize';
import { PortfolioClimateScoreCharts } from './PortfolioClimateScoreCharts';
import { LocationWithScores } from '../PortfolioOverviewTab';

vi.spyOn(useWindowSizeHook, 'useWindowSize').mockReturnValue({
    width: 1200,
    height: 900,
} as ReturnType<typeof useWindowSizeHook.useWindowSize>);

// Keep vi.mock: external component has typed props; provide minimal stub
vi.mock('../../../../components/Charts/RiskScore/RiskScoreChart', async () => {
    const actual = await vi.importActual<
        typeof import('../../../../components/Charts/RiskScore/RiskScoreChart')
    >('../../../../components/Charts/RiskScore/RiskScoreChart');
    return {
        ...actual,
        RiskScoreChart: (props: { 'data-testid'?: string }) => (
            <div data-testid={props['data-testid'] || 'risk-chart'} />
        ),
    };
});

describe('PortfolioClimateScoreCharts', () => {
    it('renders header, description and charts', () => {
        render(
            <PortfolioClimateScoreCharts
                locationWithScores={[
                    {
                        locationId: 1,
                        overallScoreAll: 10,
                    } as unknown as LocationWithScores,
                ]}
                dataVersion={'3.2.0'}
            />
        );
        expect(
            screen.getByTestId('portfolio-overview-climate-score-chart-header')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-overview-climate-risk-score-chart')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId(
                'portfolio-overview-climate-risk-score-small-charts'
            )
        ).toBeInTheDocument();
    });
});
