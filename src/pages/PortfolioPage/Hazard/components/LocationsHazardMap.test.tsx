import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import * as reactRouter from 'react-router';
import * as utils from '../../../../utils';
import { LocationsHazardMap } from './LocationsHazardMap';
import { ComponentProps } from 'react';
import { PortfolioLocationsMap } from 'components/Map/PortfolioLocationsMap';
import { LocationHazardData } from 'api/queries/resultSetsQuery';
import * as PortfolioLocationsMapModule from '../../../../components/Map/PortfolioLocationsMap';

const navigateSpy = vi.fn();

vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigateSpy);

vi.spyOn(
    PortfolioLocationsMapModule,
    'PortfolioLocationsMap'
).mockImplementation((props: ComponentProps<typeof PortfolioLocationsMap>) => (
    <div
        data-testid="map"
        onClick={() => props.onLocationSelected?.(5)}
    />
));

vi.spyOn(utils, 'getSelectedPortfolioLocationUrl').mockImplementation(
    (pid: string, lid: number) => `/p/${pid}/l/${lid}`
);

describe('LocationsHazardMap', () => {
    it('renders and navigates on location select', async () => {
        const user = userEvent.setup();
        render(
            <LocationsHazardMap
                portfolioId="p1"
                portfolioHazardData={
                    [
                        {
                            locationId: 5,
                            locationName: 'N',
                            tier: 'NA',
                            year: 2025,
                            mean: 1,
                            latitude: 1,
                            longitude: 1,
                        },
                    ] as unknown as LocationHazardData[]
                }
                yearTo={2025}
            />
        );
        await user.click(screen.getByTestId('map'));
        expect(navigateSpy).toHaveBeenCalledWith('/p/p1/l/5');
    });
});
