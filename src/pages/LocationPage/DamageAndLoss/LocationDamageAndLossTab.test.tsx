import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { LocationDamageAndLossTab } from './LocationDamageAndLossTab';
import { PerilsOptions } from '../../../api/openapi/auto-generated';
import * as impactHook from '../../../hooks/useImpactTypeOptions';
import { ImpactType } from '../../../types';
import * as resultSetHook from '../../../hooks/usePortfolioResultSetData';
import * as resultSetsQuery from '../../../api/queries/resultSetsQuery';
import * as TabLoadingIndicatorModule from '../../../components/Tab/TabLoadingIndicator';
import * as TabDataNotAvailableMessageModule from '../../../components/Tab/TabDataNotAvailableMessage';
import * as FiltersFormModule from './components/LocationDamageAndLossFiltersForm';
import * as ComparisonModule from './components/LocationImpactMetricComparison';
import * as GraphModule from './components/LocationDamageAndLossGraph';

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
        'LocationDamageAndLossFiltersForm'
    ).mockImplementation((() => (
        <div data-testid="slp-damage-loss-filters-form" />
    )) as unknown as typeof FiltersFormModule.LocationDamageAndLossFiltersForm);
    vi.spyOn(
        ComparisonModule,
        'LocationImpactMetricComparison'
    ).mockImplementation((() => (
        <div data-testid="slp-damage-loss-comparison" />
    )) as unknown as typeof ComparisonModule.LocationImpactMetricComparison);
    vi.spyOn(GraphModule, 'LocationDamageAndLossGraph').mockImplementation(
        (() => (
            <div data-testid="slp-damage-loss-graph" />
        )) as unknown as typeof GraphModule.LocationDamageAndLossGraph
    );
});

describe('LocationDamageAndLossTab', () => {
    const renderTab = () =>
        render(
            <MemoryRouter initialEntries={['/loc/1?yearTo=2025']}>
                <Routes>
                    <Route
                        path="/loc/:locationId"
                        element={<LocationDamageAndLossTab />}
                    />
                </Routes>
            </MemoryRouter>
        );

    it('renders filters, comparison and graph sections when data available', () => {
        vi.spyOn(impactHook, 'useImpactTypeOptions').mockReturnValue([
            { id: ImpactType.Damage, title: 'Damage' },
            { id: ImpactType.Loss, title: 'Loss' },
        ]);
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
            'useGetLocationDamageAndLossDataQuery'
        ).mockReturnValue({
            locationDamageAndLossData: [
                { year: 2020 },
                { year: 2025 },
            ] as unknown as ReturnType<
                typeof resultSetsQuery.useGetLocationDamageAndLossDataQuery
            >['locationDamageAndLossData'],
            isLocationDamageAndLossDataLoading: false,
            isLocationDamageAndLossDataError: false,
            locationDamageAndLossDataLoadingError: null,
        });
        renderTab();
        expect(
            screen.getByTestId('slp-damage-loss-filters-form')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('slp-damage-loss-comparison')
        ).toBeInTheDocument();
        expect(screen.getByTestId('slp-damage-loss-graph')).toBeInTheDocument();
    });

    it('shows loading indicator when loading', () => {
        vi.spyOn(impactHook, 'useImpactTypeOptions').mockReturnValue([
            { id: ImpactType.Damage, title: 'Damage' },
            { id: ImpactType.Loss, title: 'Loss' },
        ]);
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
            'useGetLocationDamageAndLossDataQuery'
        ).mockReturnValue({
            locationDamageAndLossData: [],
            isLocationDamageAndLossDataLoading: false,
            isLocationDamageAndLossDataError: false,
            locationDamageAndLossDataLoadingError: null,
        });
        render(
            <MemoryRouter initialEntries={['/loc/1']}>
                <Routes>
                    <Route
                        path="/loc/:locationId"
                        element={<LocationDamageAndLossTab />}
                    />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId('tab-loading')).toBeInTheDocument();
    });

    it('shows data-not-available message when result set missing', () => {
        vi.spyOn(impactHook, 'useImpactTypeOptions').mockReturnValue([
            { id: ImpactType.Damage, title: 'Damage' },
            { id: ImpactType.Loss, title: 'Loss' },
        ]);
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
            'useGetLocationDamageAndLossDataQuery'
        ).mockReturnValue({
            locationDamageAndLossData: [],
            isLocationDamageAndLossDataLoading: false,
            isLocationDamageAndLossDataError: false,
            locationDamageAndLossDataLoadingError: null,
        });
        render(
            <MemoryRouter initialEntries={['/loc/1']}>
                <Routes>
                    <Route
                        path="/loc/:locationId"
                        element={<LocationDamageAndLossTab />}
                    />
                </Routes>
            </MemoryRouter>
        );
        expect(screen.getByTestId('tab-no-data')).toBeInTheDocument();
    });
});
