import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { describe, it, expect, vi } from 'vitest';
import * as reactRouter from 'react-router';
import * as resultSetHook from '../../../hooks/usePortfolioResultSetData';
import * as resultSetsQuery from '../../../api/queries/resultSetsQuery';
import * as dashboardFilter from '../../../context/DashboardFilterProvider';
import * as utils from '../../../utils';
import { PortfolioScoringTab } from './PortfolioScoringTab';
import { IPortfolioItem } from '../../../types';
import {
    ResultSetResponse,
    ScoresResultSetOptions,
} from 'api/openapi/auto-generated';
import * as ScoringFiltersFormModule from './components/ScoringFiltersForm';
import * as LocationsScoringChartModule from './components/LocationScoringChart/LocationsScoringChart';
import * as AverageScoringChartsModule from './components/AverageScoringCharts';
import * as LocationsScoringMapModule from './components/LocationsScoringMap';

vi.spyOn(reactRouter, 'useOutletContext').mockReturnValue({
    portfolioItem: {} as IPortfolioItem,
});
vi.spyOn(resultSetHook, 'usePortfolioResultSetData').mockReturnValue({
    portfolioId: 'p1',
    resultSet: { id: 'rs1' } as ResultSetResponse,
    isResultSetLoading: false,
    isResultSetError: false,
    resultSetOptions: {
        perils: ['All', 'Flood'],
        type: 'scores',
    } as unknown as ScoresResultSetOptions,
} as ReturnType<typeof resultSetHook.usePortfolioResultSetData>);
vi.spyOn(resultSetsQuery, 'usePortfolioScoringDataQuery').mockReturnValue({
    portfolioScoringData: [
        {
            locationId: 1,
            locationName: 'A',
            latitude: 1,
            longitude: 2,
            hazardScoreValue: 10,
            changeScoreValue: 5,
            overallScoreValue: 15,
        },
    ],
    isPortfolioScoringDataLoading: false,
    isPortfolioScoringDataError: false,
} as ReturnType<typeof resultSetsQuery.usePortfolioScoringDataQuery>);
vi.spyOn(dashboardFilter, 'useDashboardFilterContext').mockReturnValue({
    filterLists: {},
} as ReturnType<typeof dashboardFilter.useDashboardFilterContext>);
vi.spyOn(
    dashboardFilter,
    'useDashboardResultSetIdContextUpdate'
).mockReturnValue(vi.fn());
vi.spyOn(utils, 'getDefaultPortfolioPageUrl').mockReturnValue('/');
vi.spyOn(ScoringFiltersFormModule, 'ScoringFiltersForm').mockImplementation(
    () => <div data-testid="scoring-filters" />
);
vi.spyOn(
    LocationsScoringChartModule,
    'LocationsScoringChart'
).mockImplementation(() => <div data-testid="scoring-loc-chart" />);
vi.spyOn(AverageScoringChartsModule, 'AverageScoringCharts').mockImplementation(
    () => <div data-testid="scoring-avg-charts" />
);
vi.spyOn(LocationsScoringMapModule, 'LocationsScoringMap').mockImplementation(
    () => <div data-testid="scoring-map" />
);

describe('PortfolioScoringTab', () => {
    it('renders filters, charts and map when loaded', () => {
        render(
            <MemoryRouter>
                <PortfolioScoringTab />
            </MemoryRouter>
        );
        expect(screen.getByTestId('scoring-body')).toBeInTheDocument();
        expect(screen.getByTestId('scoring-filters')).toBeInTheDocument();
        expect(screen.getByTestId('scoring-chart')).toBeInTheDocument();
        expect(screen.getByTestId('scoring-avg-charts')).toBeInTheDocument();
        expect(screen.getByTestId('scoring-map')).toBeInTheDocument();
    });
});
