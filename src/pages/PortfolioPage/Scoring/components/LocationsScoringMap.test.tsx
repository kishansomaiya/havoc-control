import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LocationsScoringMap } from './LocationsScoringMap';
import { LocationScoringData } from '../../../../api/queries/resultSetsQuery';
import { ComponentProps } from 'react';
import { PortfolioLocationsMap } from '../../../../components/Map/PortfolioLocationsMap';

vi.mock('../../../../components/Map/PortfolioLocationsMap', () => ({
    PortfolioLocationsMap: (
        props: ComponentProps<typeof PortfolioLocationsMap>
    ) => (
        <div
            data-testid="map"
            onClick={() => props.onLocationSelected?.(1)}
        />
    ),
}));

describe('LocationsScoringMap', () => {
    it('renders map with computed locations', () => {
        render(
            <LocationsScoringMap
                portfolioId="p1"
                portfolioScoringData={
                    [
                        {
                            locationId: 1,
                            latitude: 1,
                            longitude: 2,
                            overallScoreValue: 10,
                        },
                    ] as unknown as LocationScoringData[]
                }
            />
        );
        expect(screen.getByTestId('map')).toBeInTheDocument();
    });
});
