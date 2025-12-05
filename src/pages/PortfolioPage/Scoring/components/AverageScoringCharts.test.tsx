import { fireEvent, render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as scoringCtx from '../PrortfolioScoringContext';
import * as RiskScoreChartModule from '../../../../components/Charts/RiskScore/RiskScoreChart';
import { AverageScoringCharts } from './AverageScoringCharts';
import { LocationScoringData } from '../../../../api/queries/resultSetsQuery';

vi.spyOn(scoringCtx, 'useScoringLocationId').mockReturnValue(1);
vi.spyOn(RiskScoreChartModule, 'RiskScoreChart').mockImplementation(
    ({ title, value }: { title: string; value: number }) => (
        <div data-testid="risk-score-chart">{`${title}:${value}`}</div>
    )
);

describe('AverageScoringCharts', () => {
    it('renders All Locations title and three charts', () => {
        render(
            <AverageScoringCharts
                portfolioScoringData={
                    [
                        {
                            locationId: 1,
                            locationName: 'Loc A',
                            hazardScoreValue: 10,
                            changeScoreValue: 5,
                            overallScoreValue: 15,
                            latitude: 0,
                            longitude: 0,
                        },
                        {
                            locationId: 2,
                            locationName: 'Loc B',
                            hazardScoreValue: 20,
                            changeScoreValue: 10,
                            overallScoreValue: 30,
                            latitude: 0,
                            longitude: 0,
                        },
                    ] as unknown as LocationScoringData[]
                }
            />
        );
        expect(
            screen.getByTestId('hazard-scores-locations-title')
        ).toHaveTextContent('All Locations');
        expect(screen.getAllByTestId('risk-score-chart')).toHaveLength(3);
    });

    it('renders single location title and close button triggers onClearLocationSelection', () => {
        const onClear = vi.fn();
        render(
            <AverageScoringCharts
                portfolioScoringData={
                    [
                        {
                            locationId: 1,
                            locationName: 'HQ',
                            hazardScoreValue: 10,
                            changeScoreValue: 5,
                            overallScoreValue: 15,
                            latitude: 0,
                            longitude: 0,
                        },
                    ] as unknown as LocationScoringData[]
                }
                onClearLocationSelection={onClear}
            />
        );
        expect(
            screen.getByTestId('hazard-scores-locations-title')
        ).toHaveTextContent('Location - HQ');
        fireEvent.click(screen.getByTestId('location-x-button'));
        expect(onClear).toHaveBeenCalled();
    });
});
