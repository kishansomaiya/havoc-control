import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import * as reactRouter from 'react-router';
import { LocationsScoreMap } from './LocationsScoreMap';
import { ComponentProps } from 'react';
import { PortfolioLocationsMap } from 'components/Map/PortfolioLocationsMap';
import { LocationWithScores } from '../PortfolioOverviewTab';
import { Score } from 'types';
import * as PortfolioLocationsMapModule from '../../../../components/Map/PortfolioLocationsMap';
import * as utils from '../../../../utils';

const navigateSpy = vi.fn();

vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigateSpy);

vi.spyOn(
    PortfolioLocationsMapModule,
    'PortfolioLocationsMap'
).mockImplementation((props: ComponentProps<typeof PortfolioLocationsMap>) => (
    <div
        data-testid="map"
        onClick={() => props.onLocationSelected?.(7)}
    />
));

vi.spyOn(utils, 'getSelectedPortfolioLocationUrl').mockImplementation(
    (pid: string, lid: number) => `/p/${pid}/l/${lid}`
);

describe('LocationsScoreMap', () => {
    it('renders and navigates on selection', async () => {
        const user = userEvent.setup();
        render(
            <LocationsScoreMap
                portfolioId="p1"
                selectedScore={'All' as Score}
                locationWithScores={[
                    {
                        locationId: 7,
                        locationName: 'N',
                        latitude: 1,
                        longitude: 2,
                        overallScoreAll: 10,
                    } as unknown as LocationWithScores,
                ]}
            />
        );
        await user.click(screen.getByTestId('map'));
        expect(navigateSpy).toHaveBeenCalledWith('/p/p1/l/7');
    });
});
