import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as reactRouter from 'react-router';
import * as usePortfolioImpactsDataHook from '../../../hooks/usePortfolioImpactsData';
import * as resultSetsQuery from '../../../api/queries/resultSetsQuery';
import * as dashboardFilter from '../../../context/DashboardFilterProvider';
import * as utils from '../../../utils';
import { PortfolioImpactsTab } from './PortfolioImpactsTab';
import { IPortfolioItem } from '../../../types';
import * as ImpactsFiltersFormModule from './components/ImpactsFiltersForm';
import * as ImpactsMetricsModule from './components/ImpactsMetrics';
import * as ImpactsOverTimeChartModule from './components/ImpactsOverTimeChart';
import * as ImpactsByLocationTableModule from './components/ImpactsByLocationTable';
import { TestRoot } from '../../../testing/TestRoot';

vi.spyOn(reactRouter, 'useOutletContext').mockReturnValue({
    portfolioItem: {} as IPortfolioItem,
} as ReturnType<typeof reactRouter.useOutletContext>);

vi.spyOn(
    usePortfolioImpactsDataHook,
    'usePortfolioImpactsData'
).mockReturnValue({
    impactsFiltersFormValuesFromUrlSearchParams: { scenario: 'S' },
    perilsResultSet: { id: 'rs1' },
    eiResultSet: { id: 'ei1' },
    portfolioFinancialResultSet: { id: 'fin1' },
    yearFrom: 2020,
    yearTo: 2025,
    scenario: 'S',
    isResultSetLoading: false,
    portfolioId: 'p1',
    resultSetOptions: { years: [2020, 2025] },
    handleFiltersChange: vi.fn(),
    isResultSetError: false,
} as unknown as ReturnType<
    typeof usePortfolioImpactsDataHook.usePortfolioImpactsData
>);

vi.spyOn(resultSetsQuery, 'usePortfolioImpactsDataQuery').mockReturnValue({
    portfolioImpactsData: [
        { year: 2020, value: 10 },
        { year: 2025, value: 15 },
    ],
    isPortfolioImpactsDataLoading: false,
    isPortfolioImpactsDataError: false,
} as unknown as ReturnType<
    typeof resultSetsQuery.usePortfolioImpactsDataQuery
>);

vi.spyOn(dashboardFilter, 'useDashboardFilterContext').mockReturnValue({
    filterLists: {},
} as unknown as ReturnType<typeof dashboardFilter.useDashboardFilterContext>);
vi.spyOn(
    dashboardFilter,
    'useDashboardResultSetIdContextUpdate'
).mockReturnValue(vi.fn());

vi.spyOn(utils, 'getDefaultPortfolioPageUrl').mockReturnValue('/');

vi.spyOn(ImpactsFiltersFormModule, 'ImpactsFiltersForm').mockImplementation(
    () => <div data-testid="filters" />
);
vi.spyOn(ImpactsMetricsModule, 'ImpactsMetrics').mockImplementation(() => (
    <div data-testid="metrics" />
));
vi.spyOn(ImpactsOverTimeChartModule, 'ImpactsOverTimeChart').mockImplementation(
    () => <div data-testid="chart" />
);
vi.spyOn(
    ImpactsByLocationTableModule,
    'ImpactsByLocationTable'
).mockImplementation(() => <div data-testid="loc-table" />);

describe('PortfolioImpactsTab', () => {
    it('renders filters, metrics, charts and table when data loaded', () => {
        render(
            <TestRoot>
                <PortfolioImpactsTab />
            </TestRoot>
        );
        expect(
            screen.getByTestId('portfolio-impacts-body')
        ).toBeInTheDocument();
        expect(screen.getByTestId('filters')).toBeInTheDocument();
        expect(screen.getByTestId('metrics')).toBeInTheDocument();
        expect(screen.getAllByTestId('chart').length).toBeGreaterThan(0);
        expect(screen.getByTestId('loc-table')).toBeInTheDocument();
    });
});
