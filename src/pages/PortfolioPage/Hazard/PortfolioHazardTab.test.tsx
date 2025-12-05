import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as reactRouter from 'react-router';
import * as dashboardFilter from '../../../context/DashboardFilterProvider';
import * as usePortfolioHazardDataHook from '../../../hooks/usePortfolioHazardData';
import * as resultSetsQuery from '../../../api/queries/resultSetsQuery';
import * as utils from '../../../utils';
import { MemoryRouter } from 'react-router-dom';
import { TestRoot } from '../../../testing/TestRoot';
import * as LocationsHazardMapModule from './components/LocationsHazardMap';
import * as HazardFiltersFormModule from './components/HazardFiltersForm';
import * as LocationInHazardAreasChartsModule from './components/LocationInHazardAreasCharts';
import * as LocationHazardDriversTableModule from './components/LocationHazardDriversTable';
import * as ScoreLevelsMapLegendModule from '../../../components/Map/ScoreLevelsMapLegend';
import * as ScoreSwitcherModule from '../../../components/ScoreSwitcher/ScoreSwitcher';
import * as TabLoadingIndicatorModule from '../../../components/Tab/TabLoadingIndicator';
import * as TabDataNotAvailableMessageModule from '../../../components/Tab/TabDataNotAvailableMessage';
import * as DataNotAvailableModalModule from '../../../components/DataNotAvailableModal/DataNotAvailableModal';

vi.spyOn(reactRouter, 'useOutletContext').mockReturnValue({
    portfolioItem: {},
} as ReturnType<typeof reactRouter.useOutletContext>);

vi.spyOn(dashboardFilter, 'useDashboardFilterContext').mockReturnValue({
    filterLists: {},
} as ReturnType<typeof dashboardFilter.useDashboardFilterContext>);
vi.spyOn(
    dashboardFilter,
    'useDashboardResultSetIdContextUpdate'
).mockReturnValue(vi.fn());

vi.spyOn(usePortfolioHazardDataHook, 'usePortfolioHazardData').mockReturnValue({
    hazardFiltersFormValuesFromUrlSearchParams: {
        yearFrom: 2020,
        yearTo: 2050,
    },
    perilsResultSet: { id: 'rs1' },
    yearTo: 2050,
    isResultSetSchemaLoading: false,
    isResultSetLoading: false,
    resultSetSchema: [{}],
    portfolioId: 'p1',
    HAZARD_SCORES: ['Flood'],
    disabledScores: [],
    selectedScore: 'Flood',
    setSelectedScore: vi.fn(),
    resultSetOptions: { dataVersion: 'v3.2.0' },
    handleFiltersChange: vi.fn(),
    selectedMetric: 'floodDepth',
    isResultSetError: false,
    isResultSetSchemaError: false,
} as unknown as ReturnType<
    typeof usePortfolioHazardDataHook.usePortfolioHazardData
>);

vi.spyOn(resultSetsQuery, 'usePortfolioHazardDataQuery').mockReturnValue({
    portfolioHazardData: [
        { locationId: 1, locationName: 'L1', year: 2020, tier: 2, mean: 1 },
        { locationId: 1, locationName: 'L1', year: 2050, tier: 2, mean: 2 },
    ],
    isPortfolioHazardDataLoading: false,
    isPortfolioHazardDataError: false,
    isPortfolioHazardDataFetched: true,
} as unknown as ReturnType<typeof resultSetsQuery.usePortfolioHazardDataQuery>);

vi.spyOn(utils, 'getDefaultPortfolioPageUrl').mockReturnValue('/');

// Use targeted spies for leaf components to avoid deep renders while keeping modules intact
vi.spyOn(LocationsHazardMapModule, 'LocationsHazardMap').mockImplementation(
    () => <div data-testid="hazard-map" />
);
vi.spyOn(HazardFiltersFormModule, 'HazardFiltersForm').mockImplementation(
    () => <div data-testid="hazard-filters" />
);
vi.spyOn(
    LocationInHazardAreasChartsModule,
    'LocationInHazardAreasCharts'
).mockImplementation(() => <div data-testid="hazard-charts" />);
vi.spyOn(
    LocationHazardDriversTableModule,
    'LocationHazardDriversTable'
).mockImplementation(() => <div data-testid="hazard-table" />);
vi.spyOn(ScoreLevelsMapLegendModule, 'ScoreLevelsMapLegend').mockImplementation(
    () => <div data-testid="hazard-legend" />
);
vi.spyOn(ScoreSwitcherModule, 'ScoreSwitcher').mockImplementation(() => (
    <div data-testid="hazard-switcher" />
));
vi.spyOn(TabLoadingIndicatorModule, 'TabLoadingIndicator').mockImplementation(
    () => <div data-testid="tab-loading-indicator" />
);
vi.spyOn(
    TabDataNotAvailableMessageModule,
    'TabDataNotAvailableMessage'
).mockImplementation(() => <div data-testid="tab-data-not-available" />);
vi.spyOn(
    DataNotAvailableModalModule,
    'DataNotAvailableModal'
).mockImplementation(() => <div data-testid="data-not-available-modal" />);

const baseHazardData = () => ({
    hazardFiltersFormValuesFromUrlSearchParams: {
        yearFrom: 2020,
        yearTo: 2050,
    },
    perilsResultSet: { id: 'rs1' },
    yearTo: 2050,
    isResultSetSchemaLoading: false,
    isResultSetLoading: false,
    resultSetSchema: [{}],
    portfolioId: 'p1',
    HAZARD_SCORES: ['Flood'],
    disabledScores: [],
    selectedScore: 'Flood',
    setSelectedScore: vi.fn(),
    resultSetOptions: { dataVersion: 'v3.2.0' },
    handleFiltersChange: vi.fn(),
    selectedMetric: 'floodDepth',
    isResultSetError: false,
    isResultSetSchemaError: false,
});

describe('PortfolioHazardTab', () => {
    it('renders map, switcher, legend, filters, chart, and table', async () => {
        const { PortfolioHazardTab } = await import('./PortfolioHazardTab');
        render(
            <TestRoot>
                <MemoryRouter>
                    <PortfolioHazardTab />
                </MemoryRouter>
            </TestRoot>
        );
        expect(screen.getByTestId('portfolio-hazard-body')).toBeInTheDocument();
        expect(screen.getByTestId('hazard-map')).toBeInTheDocument();
        expect(screen.getByTestId('hazard-switcher')).toBeInTheDocument();
        expect(screen.getByTestId('hazard-legend')).toBeInTheDocument();
        expect(screen.getByTestId('hazard-filters')).toBeInTheDocument();
        expect(screen.getByTestId('hazard-charts')).toBeInTheDocument();
        expect(screen.getByTestId('hazard-table')).toBeInTheDocument();
    });

    it('shows loading indicator when any loading flag is true', async () => {
        vi.spyOn(
            usePortfolioHazardDataHook,
            'usePortfolioHazardData'
        ).mockImplementation(
            () =>
                ({
                    ...baseHazardData(),
                    isResultSetSchemaLoading: true,
                    resultSetOptions: { dataVersion: 'v3' },
                    selectedMetric: 'm',
                }) as unknown as ReturnType<
                    typeof usePortfolioHazardDataHook.usePortfolioHazardData
                >
        );
        const { PortfolioHazardTab: HazardTabLoading } = await import(
            './PortfolioHazardTab'
        );
        render(
            <TestRoot>
                <MemoryRouter>
                    <HazardTabLoading />
                </MemoryRouter>
            </TestRoot>
        );
        expect(screen.getByTestId('tab-loading-indicator')).toBeInTheDocument();
    });

    it('shows not available modal when no result set and not loading', async () => {
        vi.spyOn(
            usePortfolioHazardDataHook,
            'usePortfolioHazardData'
        ).mockImplementation(
            () =>
                ({
                    ...baseHazardData(),
                    perilsResultSet: undefined,
                    resultSetSchema: [],
                    resultSetOptions: { dataVersion: 'v3' },
                    selectedMetric: 'm',
                }) as unknown as ReturnType<
                    typeof usePortfolioHazardDataHook.usePortfolioHazardData
                >
        );
        const { PortfolioHazardTab: HazardTabNoRS } = await import(
            './PortfolioHazardTab'
        );
        render(
            <TestRoot>
                <MemoryRouter>
                    <HazardTabNoRS />
                </MemoryRouter>
            </TestRoot>
        );
        // Modal appears after effect; wait for it
        expect(
            await screen.findByTestId('data-not-available-modal')
        ).toBeInTheDocument();
    });

    it('shows data-not-available message when error branch', async () => {
        vi.spyOn(
            usePortfolioHazardDataHook,
            'usePortfolioHazardData'
        ).mockImplementation(
            () =>
                ({
                    ...baseHazardData(),
                    resultSetOptions: { dataVersion: 'v3' },
                    selectedMetric: 'm',
                    isResultSetError: true,
                }) as unknown as ReturnType<
                    typeof usePortfolioHazardDataHook.usePortfolioHazardData
                >
        );
        const { PortfolioHazardTab: HazardTabError } = await import(
            './PortfolioHazardTab'
        );
        render(
            <TestRoot>
                <MemoryRouter>
                    <HazardTabError />
                </MemoryRouter>
            </TestRoot>
        );
        expect(
            screen.getByTestId('tab-data-not-available')
        ).toBeInTheDocument();
    });
});
