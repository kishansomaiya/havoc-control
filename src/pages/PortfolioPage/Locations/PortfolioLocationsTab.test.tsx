import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as locationsQuery from '../../../api/queries/locationsQuery';
import * as reactRouter from 'react-router';
import * as reactRouterDom from 'react-router-dom';
import * as dashboardFilter from '../../../context/DashboardFilterProvider';
import * as utils from '../../../utils';
import { PortfolioLocationsTab } from './PortfolioLocationsTab';
import { IPortfolioItem } from '../../../types';
import * as PortfolioLocationsMapModule from '../../../components/Map/PortfolioLocationsMap';
import * as LocationsListModule from './components/LocationsList';

vi.spyOn(locationsQuery, 'useLocationsQuery').mockReturnValue({
    locations: [{ id: 1, geometry: { latitude: 1, longitude: 2 } }],
    isLocationsLoading: false,
} as unknown as ReturnType<typeof locationsQuery.useLocationsQuery>);

vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(vi.fn());
vi.spyOn(reactRouter, 'useOutletContext').mockReturnValue({
    portfolioItem: {} as unknown as IPortfolioItem,
} as unknown as ReturnType<typeof reactRouter.useOutletContext>);
vi.spyOn(reactRouter, 'useParams').mockReturnValue({
    portfolioId: 'p1',
} as unknown as ReturnType<typeof reactRouter.useParams>);

vi.spyOn(reactRouterDom, 'useSearchParams').mockReturnValue([
    new URLSearchParams(),
] as unknown as ReturnType<typeof reactRouterDom.useSearchParams>);

vi.spyOn(
    PortfolioLocationsMapModule,
    'PortfolioLocationsMap'
).mockImplementation(() => <div data-testid="map" />);

vi.spyOn(
    dashboardFilter,
    'useDashboardResultSetIdContextUpdate'
).mockReturnValue(vi.fn());

vi.spyOn(utils, 'getPerilsResultSet').mockReturnValue(
    true as unknown as ReturnType<typeof utils.getPerilsResultSet>
);
vi.spyOn(utils, 'getFloodResultSet').mockReturnValue(
    false as unknown as ReturnType<typeof utils.getFloodResultSet>
);

vi.spyOn(LocationsListModule, 'LocationsList').mockImplementation(() => (
    <div data-testid="list" />
));

describe('PortfolioLocationsTab', () => {
    it('renders map and list when data loaded', () => {
        render(<PortfolioLocationsTab />);
        expect(
            screen.getByTestId('portfolio-locations-body')
        ).toBeInTheDocument();
        expect(screen.getByTestId('map')).toBeInTheDocument();
        expect(screen.getByTestId('list')).toBeInTheDocument();
    });
});
