import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import * as reactRouter from 'react-router';
import * as usePortfolioComplianceDataHook from '../../../hooks/usePortfolioComplianceData';
import * as resultSetsQuery from '../../../api/queries/resultSetsQuery';
import * as utils from '../../../utils';
import { PortfolioComplianceTab } from './PortfolioComplianceTab';
import { ALL_CLIMATE_RELATED_CATEGORY_VALUE } from '../../../const';
import { IPortfolioItem } from '../../../types';
import * as TabLoadingIndicatorModule from '../../../components/Tab/TabLoadingIndicator';
import * as TabDataNotAvailableMessageModule from '../../../components/Tab/TabDataNotAvailableMessage';
import * as DataNotAvailableModalModule from '../../../components/DataNotAvailableModal/DataNotAvailableModal';
import * as ComplianceDataSettingsContextModule from './context/ComplienceDataSettingsContext';
import * as ComplianceFilterFormModule from './components/TopFilters/ComplianceFilterForm';
import * as AllCategoriesComplianceViewModule from './components/AllCategories/AllCategoriesComplianceView';
import * as SingleCategoryComplianceViewModule from './components/SingleCategory/SingleCategoryComplianceView';

vi.spyOn(reactRouter, 'useOutletContext').mockReturnValue({
    portfolioItem: { id: 'p1' } as IPortfolioItem,
} as ReturnType<typeof reactRouter.useOutletContext>);

const usePortfolioComplianceDataSpy = vi
    .spyOn(usePortfolioComplianceDataHook, 'usePortfolioComplianceData')
    .mockReturnValue({
        complianceResultSet: { id: 'rs1' } as ReturnType<
            typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
        >['complianceResultSet'],
        resultSetMetadata: {
            meta1: {
                metrics: [
                    { name: 'm1', tierName: 't1' },
                    { name: 'm2', tierName: 't2' },
                ],
                overviewMetrics: ['om1'],
            },
        } as unknown as ReturnType<
            typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
        >['resultSetMetadata'],
        isLoading: false,
        hasLoadingError: false,
        resultSetOptions: {
            perilsOptions: {},
        } as ReturnType<
            typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
        >['resultSetOptions'],
        handleFiltersChange: vi.fn() as ReturnType<
            typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
        >['handleFiltersChange'],
        selectedCategory: ALL_CLIMATE_RELATED_CATEGORY_VALUE as ReturnType<
            typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
        >['selectedCategory'],
        filterFormValues: {
            scenario: 'baseline',
            years: [2020],
        } as ReturnType<
            typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
        >['filterFormValues'],
    });

vi.spyOn(resultSetsQuery, 'usePortfolioComplianceDataQuery').mockReturnValue({
    isPortfolioComplianceDataLoading: false,
    portfolioComplianceData: { data: [] },
} as unknown as ReturnType<
    typeof resultSetsQuery.usePortfolioComplianceDataQuery
>);

vi.spyOn(TabLoadingIndicatorModule, 'TabLoadingIndicator').mockImplementation(
    () => <div data-testid="loading" />
);
vi.spyOn(
    TabDataNotAvailableMessageModule,
    'TabDataNotAvailableMessage'
).mockImplementation(() => <div data-testid="dna" />);
vi.spyOn(
    DataNotAvailableModalModule,
    'DataNotAvailableModal'
).mockImplementation((props: { onClose: () => void }) => (
    <div
        data-testid="dna-modal"
        onClick={props.onClose}
    />
));
vi.spyOn(
    ComplianceDataSettingsContextModule,
    'ComplianceDataSettingsProvider'
).mockImplementation((props: { children: React.ReactNode }) => (
    <div data-testid="provider">{props.children}</div>
));
vi.spyOn(
    ComplianceFilterFormModule,
    'ComplianceFiltersForm'
).mockImplementation(() => <div data-testid="filters" />);
vi.spyOn(
    AllCategoriesComplianceViewModule,
    'AllCategoriesComplianceView'
).mockImplementation(() => <div data-testid="all-view" />);
vi.spyOn(
    SingleCategoryComplianceViewModule,
    'SingleCategoryComplianceView'
).mockImplementation(() => <div data-testid="single-view" />);

vi.spyOn(utils, 'getDefaultPortfolioPageUrl').mockReturnValue(
    '/portfolio/p1' as ReturnType<typeof utils.getDefaultPortfolioPageUrl>
);

describe('PortfolioComplianceTab', () => {
    it('renders filters and all-categories view when data loaded', () => {
        render(<PortfolioComplianceTab />);
        expect(screen.getByTestId('compliance-body')).toBeInTheDocument();
        expect(screen.getByTestId('filters')).toBeInTheDocument();
        expect(screen.getByTestId('all-view')).toBeInTheDocument();
    });

    it('shows single-category view when selectedCategory is not ALL', async () => {
        usePortfolioComplianceDataSpy.mockReturnValueOnce({
            complianceResultSet: { id: 'rs1' } as ReturnType<
                typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
            >['complianceResultSet'],
            resultSetMetadata: {
                meta1: { metrics: [], overviewMetrics: [] },
            } as unknown as ReturnType<
                typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
            >['resultSetMetadata'],
            isLoading: false,
            hasLoadingError: false,
            resultSetOptions: {
                perilsOptions: {},
            } as ReturnType<
                typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
            >['resultSetOptions'],
            handleFiltersChange: vi.fn() as ReturnType<
                typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
            >['handleFiltersChange'],
            selectedCategory: 'SomeCategory' as ReturnType<
                typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
            >['selectedCategory'],
            filterFormValues: {
                scenario: 'baseline',
                years: [2020],
            } as ReturnType<
                typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
            >['filterFormValues'],
        });
        render(<PortfolioComplianceTab />);
        expect(screen.getByTestId('single-view')).toBeInTheDocument();
    });

    it('shows DNA message and modal when error/no result set', async () => {
        usePortfolioComplianceDataSpy.mockReturnValue({
            complianceResultSet: undefined as ReturnType<
                typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
            >['complianceResultSet'],
            resultSetMetadata: {} as ReturnType<
                typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
            >['resultSetMetadata'],
            isLoading: false,
            hasLoadingError: true,
            resultSetOptions: undefined as ReturnType<
                typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
            >['resultSetOptions'],
            handleFiltersChange: vi.fn() as ReturnType<
                typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
            >['handleFiltersChange'],
            selectedCategory: ALL_CLIMATE_RELATED_CATEGORY_VALUE as ReturnType<
                typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
            >['selectedCategory'],
            filterFormValues: {
                scenario: 'baseline',
                years: [2020],
            } as ReturnType<
                typeof usePortfolioComplianceDataHook.usePortfolioComplianceData
            >['filterFormValues'],
        });
        render(<PortfolioComplianceTab />);
        expect(screen.getByTestId('dna')).toBeInTheDocument();
        expect(screen.getByTestId('dna-modal')).toBeInTheDocument();
    });
});
