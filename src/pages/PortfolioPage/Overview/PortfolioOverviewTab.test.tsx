import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import * as reactRouter from 'react-router';
import * as resultSetHook from '../../../hooks/usePortfolioResultSetData';
import * as resultSetsQuery from '../../../api/queries/resultSetsQuery';
import * as dashboardFilter from '../../../context/DashboardFilterProvider';
import * as utils from '../../../utils';
import { PortfolioOverviewTab } from './PortfolioOverviewTab';
import { IPortfolioItem } from '../../../types';
import * as LocationsScoreMapModule from './components/LocationsScoreMap';
import * as ScoreSwitcherModule from '../../../components/ScoreSwitcher/ScoreSwitcher';
import * as PortfolioClimateScoreChartsModule from './components/PortfolioClimateScoreCharts';
import * as LocationsScoreTableModule from './components/LocationsScoreTable';
import * as ScoreLevelsMapLegendModule from '../../../components/Map/ScoreLevelsMapLegend';
import * as DataNotAvailableModalModule from '../../../components/DataNotAvailableModal/DataNotAvailableModal';

vi.spyOn(reactRouter, 'useOutletContext').mockReturnValue({
    portfolioItem: {} as unknown as IPortfolioItem,
} as unknown as ReturnType<typeof reactRouter.useOutletContext>);

const mockUsePortfolioResultSetDataImpl = vi.fn();
vi.spyOn(resultSetHook, 'usePortfolioResultSetData').mockImplementation(
    (...args: unknown[]) =>
        mockUsePortfolioResultSetDataImpl(...args) as unknown as ReturnType<
            typeof resultSetHook.usePortfolioResultSetData
        >
);

const mockUseResultSetDataQueryImpl = vi.fn();
vi.spyOn(resultSetsQuery, 'useResultSetDataQuery').mockImplementation(
    (...args: unknown[]) =>
        mockUseResultSetDataQueryImpl(...args) as unknown as ReturnType<
            typeof resultSetsQuery.useResultSetDataQuery
        >
);

vi.spyOn(dashboardFilter, 'useDashboardFilterContext').mockReturnValue({
    filterLists: {},
} as unknown as ReturnType<typeof dashboardFilter.useDashboardFilterContext>);
vi.spyOn(
    dashboardFilter,
    'useDashboardResultSetIdContextUpdate'
).mockReturnValue(vi.fn());
vi.spyOn(utils, 'getDefaultPortfolioPageUrl').mockReturnValue('/');

vi.spyOn(LocationsScoreMapModule, 'LocationsScoreMap').mockImplementation(
    () => <div data-testid="overview-map" />
);
vi.spyOn(ScoreSwitcherModule, 'ScoreSwitcher').mockImplementation(() => (
    <div data-testid="overview-score-switcher" />
));
vi.spyOn(
    PortfolioClimateScoreChartsModule,
    'PortfolioClimateScoreCharts'
).mockImplementation(() => <div data-testid="overview-charts" />);
vi.spyOn(LocationsScoreTableModule, 'LocationsScoreTable').mockImplementation(
    () => <div data-testid="overview-table" />
);
vi.spyOn(ScoreLevelsMapLegendModule, 'ScoreLevelsMapLegend').mockImplementation(
    () => <div data-testid="overview-legend" />
);

vi.spyOn(
    DataNotAvailableModalModule,
    'DataNotAvailableModal'
).mockImplementation(() => <div data-testid="data-not-available-modal" />);

describe('PortfolioOverviewTab', () => {
    it('renders body, map, switcher, legend, charts and table when loaded', () => {
        mockUsePortfolioResultSetDataImpl.mockReturnValue({
            portfolioId: 'p1',
            resultSet: { id: 'rs1' },
            isResultSetLoading: false,
            isResultSetError: false,
            resultSetOptions: { perils: ['All', 'Flood'] },
        });
        mockUseResultSetDataQueryImpl.mockReturnValue({
            resultSetData: [],
            isResultSetDataLoading: false,
            isResultSetDataError: false,
        });
        render(<PortfolioOverviewTab />);
        expect(
            screen.getByTestId('portfolio-overview-body')
        ).toBeInTheDocument();
        expect(screen.getByTestId('overview-map')).toBeInTheDocument();
        expect(
            screen.getByTestId('overview-score-switcher')
        ).toBeInTheDocument();
        expect(screen.getByTestId('overview-legend')).toBeInTheDocument();
        expect(screen.getByTestId('overview-charts')).toBeInTheDocument();
        expect(screen.getByTestId('overview-table')).toBeInTheDocument();
    });

    it('shows loading indicator when result set or data is loading', () => {
        mockUsePortfolioResultSetDataImpl.mockReturnValue({
            portfolioId: 'p1',
            resultSet: { id: 'rs1' },
            isResultSetLoading: true,
            isResultSetError: false,
            resultSetOptions: { perils: ['All'] },
        });
        mockUseResultSetDataQueryImpl.mockReturnValue({
            resultSetData: [],
            isResultSetDataLoading: false,
            isResultSetDataError: false,
        });
        render(<PortfolioOverviewTab />);
        expect(screen.getByTestId('circular-indicator')).toBeInTheDocument();
    });

    it('shows data not available modal when no result set and not loading', () => {
        mockUsePortfolioResultSetDataImpl.mockReturnValue({
            portfolioId: 'p1',
            resultSet: undefined,
            isResultSetLoading: false,
            isResultSetError: false,
            resultSetOptions: { perils: ['All'] },
        });
        mockUseResultSetDataQueryImpl.mockReturnValue({
            resultSetData: [],
            isResultSetDataLoading: false,
            isResultSetDataError: false,
        });
        render(
            <MemoryRouter>
                <PortfolioOverviewTab />
            </MemoryRouter>
        );
        expect(
            screen.getByTestId('data-not-available-modal')
        ).toBeInTheDocument();
    });

    it('shows error message when data error branch', () => {
        mockUsePortfolioResultSetDataImpl.mockReturnValue({
            portfolioId: 'p1',
            resultSet: { id: 'rs1' },
            isResultSetLoading: false,
            isResultSetError: false,
            resultSetOptions: { perils: ['All'] },
        });
        mockUseResultSetDataQueryImpl.mockReturnValue({
            resultSetData: [],
            isResultSetDataLoading: false,
            isResultSetDataError: true,
        });
        render(<PortfolioOverviewTab />);
        expect(
            screen.getByTestId('tab-data-not-available')
        ).toBeInTheDocument();
    });
});
