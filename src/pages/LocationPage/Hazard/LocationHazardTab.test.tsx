import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LocationHazardTab } from './LocationHazardTab';
import { ResultSetDataSchema } from '../../../api/openapi/auto-generated';
import * as hazardHook from '../../../hooks/usePortfolioHazardData';
import * as resultSetsQuery from '../../../api/queries/resultSetsQuery';
import * as TabLoadingIndicatorModule from '../../../components/Tab/TabLoadingIndicator';
import * as TabDataNotAvailableMessageModule from '../../../components/Tab/TabDataNotAvailableMessage';
import * as FiltersFormModule from './components/LocationHazardFiltersForm';
import * as MetricComparisonModule from './components/LocationHazardMetricComparisonTable';
import * as ValuesOverTimeModule from './components/LocationHazardValuesOverTimeGraph';

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
    vi.spyOn(FiltersFormModule, 'LocationHazardFiltersForm').mockImplementation(
        (() => (
            <div data-testid="slp-hazard-filters" />
        )) as unknown as typeof FiltersFormModule.LocationHazardFiltersForm
    );
    vi.spyOn(
        MetricComparisonModule,
        'LocationHazardMetricComparisonTable'
    ).mockImplementation((() => (
        <div data-testid="slp-hazard-metrics" />
    )) as unknown as typeof MetricComparisonModule.LocationHazardMetricComparisonTable);
    vi.spyOn(
        ValuesOverTimeModule,
        'LocationHazardValuesOverTimeGraph'
    ).mockImplementation((() => (
        <div data-testid="slp-hazard-chart" />
    )) as unknown as typeof ValuesOverTimeModule.LocationHazardValuesOverTimeGraph);
});

describe('LocationHazardTab', () => {
    const renderTab = (entry = '/loc/1?yearTo=2025') =>
        render(
            <MemoryRouter initialEntries={[entry]}>
                <Routes>
                    <Route
                        path="/loc/:locationId"
                        element={<LocationHazardTab />}
                    />
                </Routes>
            </MemoryRouter>
        );

    it('renders score switcher area, filters, metrics and chart', () => {
        vi.spyOn(hazardHook, 'usePortfolioHazardData').mockReturnValue({
            hazardFiltersFormValuesFromUrlSearchParams: {
                scenario: 'SSP245',
            } as unknown as ReturnType<
                typeof hazardHook.usePortfolioHazardData
            >['hazardFiltersFormValuesFromUrlSearchParams'],
            perilsResultSet: { id: 'perils' } as unknown as ReturnType<
                typeof hazardHook.usePortfolioHazardData
            >['perilsResultSet'],
            yearTo: 2025,
            yearFrom: 2020,
            isResultSetSchemaLoading: false,
            isResultSetLoading: false,
            resultSetSchema: [
                { id: 'mean_temp', enhancedName: 'Mean Temp' },
            ] as unknown as ResultSetDataSchema[],
            HAZARD_SCORES: ['Flood', 'Wind'] as unknown as ReturnType<
                typeof hazardHook.usePortfolioHazardData
            >['HAZARD_SCORES'],
            disabledScores: [],
            selectedScore: 'Flood' as unknown as ReturnType<
                typeof hazardHook.usePortfolioHazardData
            >['selectedScore'],
            setSelectedScore: vi.fn(),
            resultSetOptions: { years: [2020, 2025] } as unknown as ReturnType<
                typeof hazardHook.usePortfolioHazardData
            >['resultSetOptions'],
            handleFiltersChange: vi.fn(),
            isResultSetError: false,
            isResultSetSchemaError: false,
            selectedMetric: {
                id: 'mean_temp',
                enhancedName: 'Mean Temp',
            } as unknown as ReturnType<
                typeof hazardHook.usePortfolioHazardData
            >['selectedMetric'],
            portfolioId: 'p1' as unknown as ReturnType<
                typeof hazardHook.usePortfolioHazardData
            >['portfolioId'],
        });
        vi.spyOn(
            resultSetsQuery,
            'useGetLocationHazardDataQuery'
        ).mockReturnValue({
            locationHazardData: [
                { locationId: 1, year: 2020, mean_temp: 1 },
                { locationId: 1, year: 2025, mean_temp: 2 },
            ] as unknown as ReturnType<
                typeof resultSetsQuery.useGetLocationHazardDataQuery
            >['locationHazardData'],
            isLocationHazardDataLoading: false,
            isLocationHazardDataError: false,
            locationHazardDataLoadingError: null,
        });
        renderTab();
        expect(
            screen.getByTestId('slp-hazard-score-switcher')
        ).toBeInTheDocument();
        expect(
            screen.getAllByTestId('slp-hazard-filters').length
        ).toBeGreaterThan(0);
        expect(screen.getByTestId('slp-hazard-metrics')).toBeInTheDocument();
        expect(
            screen.getAllByTestId('slp-hazard-chart').length
        ).toBeGreaterThan(0);
    });

    it('shows loading indicator', () => {
        vi.spyOn(hazardHook, 'usePortfolioHazardData').mockReturnValue({
            hazardFiltersFormValuesFromUrlSearchParams:
                {} as unknown as ReturnType<
                    typeof hazardHook.usePortfolioHazardData
                >['hazardFiltersFormValuesFromUrlSearchParams'],
            perilsResultSet: undefined,
            yearTo: 2025,
            yearFrom: 2020,
            isResultSetSchemaLoading: true,
            isResultSetLoading: false,
            resultSetSchema: [],
            HAZARD_SCORES: [] as unknown as ReturnType<
                typeof hazardHook.usePortfolioHazardData
            >['HAZARD_SCORES'],
            disabledScores: [],
            selectedScore: 'Flood' as unknown as ReturnType<
                typeof hazardHook.usePortfolioHazardData
            >['selectedScore'],
            setSelectedScore: vi.fn(),
            resultSetOptions: undefined,
            handleFiltersChange: vi.fn(),
            isResultSetError: false,
            isResultSetSchemaError: false,
            selectedMetric: undefined,
            portfolioId: 'p1' as unknown as ReturnType<
                typeof hazardHook.usePortfolioHazardData
            >['portfolioId'],
        });
        vi.spyOn(
            resultSetsQuery,
            'useGetLocationHazardDataQuery'
        ).mockReturnValue({
            locationHazardData: [],
            isLocationHazardDataLoading: false,
            isLocationHazardDataError: false,
            locationHazardDataLoadingError: null,
        });
        renderTab('/loc/1');
        expect(screen.getByTestId('tab-loading')).toBeInTheDocument();
    });

    it('shows data-not-available message', () => {
        vi.spyOn(hazardHook, 'usePortfolioHazardData').mockReturnValue({
            hazardFiltersFormValuesFromUrlSearchParams:
                {} as unknown as ReturnType<
                    typeof hazardHook.usePortfolioHazardData
                >['hazardFiltersFormValuesFromUrlSearchParams'],
            perilsResultSet: undefined,
            yearTo: 2025,
            yearFrom: 2020,
            isResultSetSchemaLoading: false,
            isResultSetLoading: false,
            resultSetSchema: [],
            HAZARD_SCORES: [] as unknown as ReturnType<
                typeof hazardHook.usePortfolioHazardData
            >['HAZARD_SCORES'],
            disabledScores: [],
            selectedScore: 'Flood' as unknown as ReturnType<
                typeof hazardHook.usePortfolioHazardData
            >['selectedScore'],
            setSelectedScore: vi.fn(),
            resultSetOptions: undefined,
            handleFiltersChange: vi.fn(),
            isResultSetError: true,
            isResultSetSchemaError: true,
            selectedMetric: undefined,
            portfolioId: 'p1' as unknown as ReturnType<
                typeof hazardHook.usePortfolioHazardData
            >['portfolioId'],
        });
        vi.spyOn(
            resultSetsQuery,
            'useGetLocationHazardDataQuery'
        ).mockReturnValue({
            locationHazardData: [],
            isLocationHazardDataLoading: false,
            isLocationHazardDataError: false,
            locationHazardDataLoadingError: null,
        });
        renderTab('/loc/1');
        expect(screen.getByTestId('tab-no-data')).toBeInTheDocument();
    });
});
