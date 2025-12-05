import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LocationFloodMeshTab } from './LocationFloodMeshTab';
import {
    MeshOptionsDataVersionEnum,
    MeshOptions,
} from '../../../api/openapi/auto-generated';
import * as floodHook from '../../../hooks/usePortfolioFloodMeshData';
import * as resultSetsQuery from '../../../api/queries/resultSetsQuery';
import * as TabLoadingIndicatorModule from '../../../components/Tab/TabLoadingIndicator';
import * as TabDataNotAvailableMessageModule from '../../../components/Tab/TabDataNotAvailableMessage';
import * as FiltersFormModule from './components/LocationFloodMeshFiltersForm';
import * as MapModule from './components/LocationFloodMeshMap';
import * as MetricsModule from './components/LocationFloodMeshMetricsComparison';
import * as GridChartModule from './components/LocationFloodMeshGridChart';

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(
        TabLoadingIndicatorModule,
        'TabLoadingIndicator'
    ).mockImplementation((() => (
        <div data-testid="tab-loading" />
    )) as unknown as typeof TabLoadingIndicatorModule.TabLoadingIndicator);
    vi.spyOn(
        TabDataNotAvailableMessageModule,
        'TabDataNotAvailableMessage'
    ).mockImplementation((() => (
        <div data-testid="tab-no-data" />
    )) as unknown as typeof TabDataNotAvailableMessageModule.TabDataNotAvailableMessage);
    vi.spyOn(
        FiltersFormModule,
        'LocationFloodMeshFiltersForm'
    ).mockImplementation((() => (
        <div data-testid="slp-floodmesh-filters-form" />
    )) as unknown as typeof FiltersFormModule.LocationFloodMeshFiltersForm);
    vi.spyOn(MapModule, 'LocationFloodMeshMap').mockImplementation((() => (
        <div data-testid="slp-floodmesh-map" />
    )) as unknown as typeof MapModule.LocationFloodMeshMap);
    vi.spyOn(
        MetricsModule,
        'LocationFloodMeshMetricsComparison'
    ).mockImplementation((() => (
        <div data-testid="slp-floodmesh-metrics" />
    )) as unknown as typeof MetricsModule.LocationFloodMeshMetricsComparison);
    vi.spyOn(GridChartModule, 'LocationFloodMeshGridChart').mockImplementation(
        (() => (
            <div data-testid="slp-floodmesh-chart" />
        )) as unknown as typeof GridChartModule.LocationFloodMeshGridChart
    );
});

describe('LocationFloodMeshTab', () => {
    const renderTab = (entry = '/loc/1?yearTo=2025') =>
        render(
            <MemoryRouter initialEntries={[entry]}>
                <Routes>
                    <Route
                        path="/loc/:locationId"
                        element={<LocationFloodMeshTab />}
                    />
                </Routes>
            </MemoryRouter>
        );

    it('renders map, filters, metrics and chart when data available', () => {
        vi.spyOn(floodHook, 'usePortfolioFloodMeshData').mockReturnValue({
            floodMeshFiltersFormValuesFromUrlSearchParams:
                {} as unknown as ReturnType<
                    typeof floodHook.usePortfolioFloodMeshData
                >['floodMeshFiltersFormValuesFromUrlSearchParams'],
            floodMeshResultSet: { id: 'flood-rs' } as unknown as ReturnType<
                typeof floodHook.usePortfolioFloodMeshData
            >['floodMeshResultSet'],
            yearTo: 2025,
            yearFrom: 2020,
            isResultSetSchemaLoading: false,
            isResultSetLoading: false,
            resultSetSchema: [{ id: 'm1' }] as unknown as ReturnType<
                typeof floodHook.usePortfolioFloodMeshData
            >['resultSetSchema'],
            resultSetOptions: {
                years: [2020, 2025],
                dataVersion: MeshOptionsDataVersionEnum.unknownDefaultOpenApi,
            } as unknown as MeshOptions,
            handleFiltersChange: vi.fn(),
            isResultSetError: false,
            isResultSetSchemaError: false,
            selectedMetric: {
                id: 'm1',
                userGuideDefinition: 'desc',
            } as unknown as ReturnType<
                typeof floodHook.usePortfolioFloodMeshData
            >['selectedMetric'],
            portfolioId: 'p1' as unknown as ReturnType<
                typeof floodHook.usePortfolioFloodMeshData
            >['portfolioId'],
        });
        vi.spyOn(
            resultSetsQuery,
            'usePortfolioFloodMeshDataQuery'
        ).mockReturnValue({
            portfolioFloodMeshData: [
                {
                    year: 2020,
                    longitude: 1,
                    latitude: 2,
                    mean: 1,
                    tier: 'Low',
                },
                {
                    year: 2025,
                    longitude: 1,
                    latitude: 2,
                    mean: 2,
                    tier: 'Low',
                },
            ] as unknown as ReturnType<
                typeof resultSetsQuery.usePortfolioFloodMeshDataQuery
            >['portfolioFloodMeshData'],
            isPortfolioFloodMeshDataLoading: false,
            isPortfolioFloodMeshDataError: false,
            portfolioFloodMeshDataLoadingError: null,
            isPortfolioFloodMeshDataFetched: true,
        });
        renderTab();
        expect(
            screen.getAllByTestId('slp-floodmesh-map').length
        ).toBeGreaterThan(0);
        expect(
            screen.getByTestId('slp-floodmesh-filters-form')
        ).toBeInTheDocument();
        expect(screen.getByTestId('slp-floodmesh-metrics')).toBeInTheDocument();
        expect(screen.getByTestId('slp-floodmesh-chart')).toBeInTheDocument();
    });

    it('shows loading indicator', () => {
        vi.spyOn(floodHook, 'usePortfolioFloodMeshData').mockReturnValue({
            floodMeshFiltersFormValuesFromUrlSearchParams:
                {} as unknown as ReturnType<
                    typeof floodHook.usePortfolioFloodMeshData
                >['floodMeshFiltersFormValuesFromUrlSearchParams'],
            floodMeshResultSet: undefined,
            yearTo: 2025,
            yearFrom: 2020,
            isResultSetSchemaLoading: true,
            isResultSetLoading: false,
            resultSetSchema: [],
            resultSetOptions: undefined,
            handleFiltersChange: vi.fn(),
            isResultSetError: false,
            isResultSetSchemaError: false,
            selectedMetric: undefined,
            portfolioId: 'p1' as unknown as ReturnType<
                typeof floodHook.usePortfolioFloodMeshData
            >['portfolioId'],
        });
        vi.spyOn(
            resultSetsQuery,
            'usePortfolioFloodMeshDataQuery'
        ).mockReturnValue({
            portfolioFloodMeshData: [],
            isPortfolioFloodMeshDataLoading: false,
            isPortfolioFloodMeshDataError: false,
            portfolioFloodMeshDataLoadingError: null,
            isPortfolioFloodMeshDataFetched: false,
        });
        render(
            <MemoryRouter initialEntries={['/loc/1']}>
                <Routes>
                    <Route
                        path="/loc/:locationId"
                        element={<LocationFloodMeshTab />}
                    />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId('tab-loading')).toBeInTheDocument();
    });

    it('shows data-not-available on errors', () => {
        vi.spyOn(floodHook, 'usePortfolioFloodMeshData').mockReturnValue({
            floodMeshFiltersFormValuesFromUrlSearchParams:
                {} as unknown as ReturnType<
                    typeof floodHook.usePortfolioFloodMeshData
                >['floodMeshFiltersFormValuesFromUrlSearchParams'],
            floodMeshResultSet: undefined,
            yearTo: 2025,
            yearFrom: 2020,
            isResultSetSchemaLoading: false,
            isResultSetLoading: false,
            resultSetSchema: [],
            resultSetOptions: undefined,
            handleFiltersChange: vi.fn(),
            isResultSetError: true,
            isResultSetSchemaError: true,
            selectedMetric: undefined,
            portfolioId: 'p1' as unknown as ReturnType<
                typeof floodHook.usePortfolioFloodMeshData
            >['portfolioId'],
        });
        vi.spyOn(
            resultSetsQuery,
            'usePortfolioFloodMeshDataQuery'
        ).mockReturnValue({
            portfolioFloodMeshData: [],
            isPortfolioFloodMeshDataLoading: false,
            isPortfolioFloodMeshDataError: false,
            portfolioFloodMeshDataLoadingError: null,
            isPortfolioFloodMeshDataFetched: false,
        });
        render(
            <MemoryRouter initialEntries={['/loc/1']}>
                <Routes>
                    <Route
                        path="/loc/:locationId"
                        element={<LocationFloodMeshTab />}
                    />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId('tab-no-data')).toBeInTheDocument();
    });
});
