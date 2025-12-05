import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { PortfolioMap } from './PortfolioMap';
import { IPortfolioItem } from '../../../types';
import * as locationsQuery from '../../../api/queries/locationsQuery';
import * as mapModule from '../../../components/Map/PortfolioLocationsMap';

let isLoading = false;

beforeEach(() => {
    // Spy to stub the locations query hook and control loading/data states
    vi.spyOn(locationsQuery, 'useLocationsQuery').mockImplementation(
        () =>
            ({
                locations: [],
                isLocationsLoading: isLoading,
                isLocationsError: false,
            }) as unknown as ReturnType<typeof locationsQuery.useLocationsQuery>
    );

    // Spy to replace the heavy map component with a lightweight test double
    vi.spyOn(mapModule, 'PortfolioLocationsMap').mockImplementation(
        ({ locations }: { locations: unknown[] }) => (
            <div data-testid="mock-portfolio-locations-map">
                {locations.length}
            </div>
        )
    );
});

describe('PortfolioMap', () => {
    const portfolio = { id: 'p1' } as unknown as IPortfolioItem;

    it('renders map with locations', () => {
        isLoading = false;
        render(<PortfolioMap portfolio={portfolio} />);
        expect(
            screen.getByTestId('mock-portfolio-locations-map')
        ).toBeInTheDocument();
    });

    it('shows loading overlay when locations are loading', () => {
        isLoading = true;
        render(<PortfolioMap portfolio={portfolio} />);
        expect(
            screen.getByTestId('portfolio-item-map-progress-icon')
        ).toBeInTheDocument();
        isLoading = false;
    });
});
