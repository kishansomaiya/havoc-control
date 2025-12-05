import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LocationFinancialMetricsTab } from './LocationFinancialMetricsTab';
import { PerilsOptions } from '../../../api/openapi/auto-generated';
import * as resultSetHook from '../../../hooks/usePortfolioResultSetData';
import * as resultSetsQuery from '../../../api/queries/resultSetsQuery';
import * as TabLoadingIndicatorModule from '../../../components/Tab/TabLoadingIndicator';
import * as TabDataNotAvailableMessageModule from '../../../components/Tab/TabDataNotAvailableMessage';
import * as FiltersFormModule from './components/LocationFinancialMetricsFiltersForm';
import * as ComparisonModule from './components/LocationFinancialMetricsComparison';
import * as GraphModule from './components/LocationFinancialMetricsGraph';

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
        'LocationFinancialMetricsFiltersForm'
    ).mockImplementation((() => (
        <div data-testid="slp-financial-metrics-filters-form" />
    )) as unknown as typeof FiltersFormModule.LocationFinancialMetricsFiltersForm);
    vi.spyOn(
        ComparisonModule,
        'LocationFinancialMetricsComparison'
    ).mockImplementation((() => (
        <div data-testid="slp-financial-metrics-comparison" />
    )) as unknown as typeof ComparisonModule.LocationFinancialMetricsComparison);
    vi.spyOn(GraphModule, 'LocationFinancialMetricsGraph').mockImplementation(
        (() => (
            <div data-testid="slp-financial-metrics-graph" />
        )) as unknown as typeof GraphModule.LocationFinancialMetricsGraph
    );
});

describe('LocationFinancialMetricsTab', () => {
    const renderTab = (entry = '/loc/1?yearTo=2025') =>
        render(
            <MemoryRouter initialEntries={[entry]}>
                <Routes>
                    <Route
                        path="/loc/:locationId"
                        element={<LocationFinancialMetricsTab />}
                    />
                </Routes>
            </MemoryRouter>
        );

    it('renders filters, comparison and graph when data available', () => {
        vi.spyOn(resultSetHook, 'usePortfolioResultSetData').mockReturnValue({
            portfolioId: 'p1' as unknown as ReturnType<
                typeof resultSetHook.usePortfolioResultSetData
            >['portfolioId'],
            resultSet: { id: 'rs' } as unknown as ReturnType<
                typeof resultSetHook.usePortfolioResultSetData
            >['resultSet'],
            isResultSetLoading: false,
            isResultSetError: false,
            resultSetOptions: {
                years: [2020, 2025],
            } as unknown as PerilsOptions,
        });
        vi.spyOn(
            resultSetsQuery,
            'useGetLocationFinancialMetricsDataQuery'
        ).mockReturnValue({
            locationFinancialMetricsData: [
                { year: 2020 },
                { year: 2025 },
            ] as unknown as ReturnType<
                typeof resultSetsQuery.useGetLocationFinancialMetricsDataQuery
            >['locationFinancialMetricsData'],
            isLocationFinancialMetricsDataLoading: false,
            isLocationFinancialMetricsDataError: false,
            locationFinancialMetricsDataLoadingError: null,
        });
        renderTab();
        expect(
            screen.getByTestId('slp-financial-metrics-filters-form')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('slp-financial-metrics-comparison')
        ).toBeInTheDocument();
        expect(
            screen.getAllByTestId('slp-financial-metrics-graph').length
        ).toBeGreaterThan(0);
    });

    it('shows loading indicator when loading', () => {
        vi.spyOn(resultSetHook, 'usePortfolioResultSetData').mockReturnValue({
            portfolioId: 'p1' as unknown as ReturnType<
                typeof resultSetHook.usePortfolioResultSetData
            >['portfolioId'],
            resultSet: undefined,
            isResultSetLoading: true,
            isResultSetError: false,
            resultSetOptions: undefined,
        });
        vi.spyOn(
            resultSetsQuery,
            'useGetLocationFinancialMetricsDataQuery'
        ).mockReturnValue({
            locationFinancialMetricsData: [],
            isLocationFinancialMetricsDataLoading: false,
            isLocationFinancialMetricsDataError: false,
            locationFinancialMetricsDataLoadingError: null,
        });
        render(
            <MemoryRouter initialEntries={['/loc/1']}>
                <Routes>
                    <Route
                        path="/loc/:locationId"
                        element={<LocationFinancialMetricsTab />}
                    />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId('tab-loading')).toBeInTheDocument();
    });

    it('shows data-not-available when missing result set', () => {
        vi.spyOn(resultSetHook, 'usePortfolioResultSetData').mockReturnValue({
            portfolioId: 'p1' as unknown as ReturnType<
                typeof resultSetHook.usePortfolioResultSetData
            >['portfolioId'],
            resultSet: undefined,
            isResultSetLoading: false,
            isResultSetError: true,
            resultSetOptions: undefined,
        });
        vi.spyOn(
            resultSetsQuery,
            'useGetLocationFinancialMetricsDataQuery'
        ).mockReturnValue({
            locationFinancialMetricsData: [],
            isLocationFinancialMetricsDataLoading: false,
            isLocationFinancialMetricsDataError: false,
            locationFinancialMetricsDataLoadingError: null,
        });
        render(
            <MemoryRouter initialEntries={['/loc/1']}>
                <Routes>
                    <Route
                        path="/loc/:locationId"
                        element={<LocationFinancialMetricsTab />}
                    />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId('tab-no-data')).toBeInTheDocument();
    });
});
