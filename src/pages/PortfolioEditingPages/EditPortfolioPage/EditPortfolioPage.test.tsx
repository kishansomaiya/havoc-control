import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { EditPortfolioPage } from './EditPortfolioPage';
import * as reactRouter from 'react-router';
import * as EditSettingsModule from '../components/EditSettings/EditPortfolioSettings';
import * as TabLoadingIndicatorModule from '../../../components/Tab/TabLoadingIndicator';
import * as initialFormValuesHook from '../hooks/useInitialFormValues';
import * as portfolioNameHook from '../hooks/usePortfolioName';
import * as portfolioCategoryHook from '../hooks/usePortfolioCategory';
import * as runDisclosureHook from '../hooks/usePortfolioRunDisclosure';
import * as portfolioDataVersionHook from '../hooks/usePortfolioDataVersion';
import * as portfolioEIVersionHook from '../hooks/usePortfolioEIVersion';
import * as portfoliosQuery from '../../../api/queries/portfoliosQuery';
import * as categoriesQuery from '../../../api/queries/categoriesQuery';
import * as resultSetsQuery from '../../../api/queries/resultSetsQuery';
import * as portfoliosMutation from '../../../api/mutations/portfoliosMutation';
import * as utils from '../../../utils';

const navigateMock = vi.fn();

beforeEach(() => {
    vi.clearAllMocks();
    vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigateMock);
    vi.spyOn(reactRouter, 'useParams').mockReturnValue({
        portfolioId: 'p1',
    } as ReturnType<typeof reactRouter.useParams>);
    vi.spyOn(EditSettingsModule, 'EditPortfolioSettings').mockImplementation(
        (() => (
            <div data-testid="edit-settings" />
        )) as typeof EditSettingsModule.EditPortfolioSettings
    );
    vi.spyOn(
        TabLoadingIndicatorModule,
        'TabLoadingIndicator'
    ).mockImplementation((() => (
        <div data-testid="loading" />
    )) as typeof TabLoadingIndicatorModule.TabLoadingIndicator);
    vi.spyOn(initialFormValuesHook, 'useInitialFormValues').mockReturnValue({
        initialFormValues: {
            name: 'Edit',
            type: 'Scores',
            dataVersion: '3.2.0',
        },
    } as unknown as ReturnType<
        typeof initialFormValuesHook.useInitialFormValues
    >);
    vi.spyOn(portfolioNameHook, 'usePortfolioName').mockReturnValue('EditName');
    vi.spyOn(portfolioCategoryHook, 'usePortfolioCategory').mockReturnValue({
        id: 'cat',
        label: 'Cat',
    } as ReturnType<typeof portfolioCategoryHook.usePortfolioCategory>);
    vi.spyOn(runDisclosureHook, 'usePortfolioRunDisclosure').mockReturnValue(
        false
    );
    vi.spyOn(
        portfolioDataVersionHook,
        'usePortfolioDataVersion'
    ).mockReturnValue(
        'v3_2_0' as ReturnType<
            typeof portfolioDataVersionHook.usePortfolioDataVersion
        >
    );
    vi.spyOn(portfolioEIVersionHook, 'usePortfolioEIVersion').mockReturnValue(
        'v3_2_0' as ReturnType<
            typeof portfolioEIVersionHook.usePortfolioEIVersion
        >
    );
    vi.spyOn(portfoliosQuery, 'usePortfolioQuery').mockReturnValue({
        portfolio: {
            id: 'p1',
            name: 'EditName',
            locationCount: 5,
        } as ReturnType<typeof portfoliosQuery.usePortfolioQuery>['portfolio'],
        isPortfolioLoading: false,
        isPortfolioError: false,
        refetchPortfolio: vi.fn() as ReturnType<
            typeof portfoliosQuery.usePortfolioQuery
        >['refetchPortfolio'],
    });
    vi.spyOn(categoriesQuery, 'useCategoriesQuery').mockReturnValue({
        categories: [],
        isCategoriesLoading: false,
    } as unknown as ReturnType<typeof categoriesQuery.useCategoriesQuery>);
    vi.spyOn(resultSetsQuery, 'useResultSetsQuery').mockReturnValue({
        resultSets: [],
        isResultSetsLoading: false,
        isResultSetsError: false,
        refetchResultSets: vi.fn() as ReturnType<
            typeof resultSetsQuery.useResultSetsQuery
        >['refetchResultSets'],
    } as ReturnType<typeof resultSetsQuery.useResultSetsQuery>);
    vi.spyOn(
        portfoliosMutation,
        'useUpdatePortfolioWithResultSetsMutation'
    ).mockReturnValue({
        updatePortfolio: vi.fn().mockResolvedValue({}),
        cancelUpdatePortfolio: vi.fn(),
        isPortfolioUpdating: false,
    } as unknown as ReturnType<
        typeof portfoliosMutation.useUpdatePortfolioWithResultSetsMutation
    >);
    vi.spyOn(utils, 'formatUnit').mockReturnValue('5 locations');
});

describe('EditPortfolioPage', () => {
    beforeEach(() => {
        navigateMock.mockReset();
    });

    it('renders title and subtitle and edit settings', () => {
        render(<EditPortfolioPage />);
        expect(screen.getByTestId('create-portfolio-title')).toHaveTextContent(
            'Edit EditName'
        );
        expect(
            screen.getByTestId('edit-duplicate-portfolio-locations-qty')
        ).toHaveTextContent('5 locations');
        expect(
            screen.getByTestId('edit-portfolio-edit-settings-tab')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('create-portfolio-save-button')
        ).toBeInTheDocument();
    });

    it('Cancel navigates back', async () => {
        const user = userEvent.setup();
        render(<EditPortfolioPage />);
        await user.click(
            screen.getByTestId('create-edit-portfolio-cancel-button')
        );
        expect(navigateMock).toHaveBeenCalled();
    });

    it('shows loading while portfolio and categories are loading', async () => {
        vi.spyOn(initialFormValuesHook, 'useInitialFormValues').mockReturnValue(
            {
                initialFormValues: undefined,
            } as ReturnType<typeof initialFormValuesHook.useInitialFormValues>
        );
        vi.spyOn(portfoliosQuery, 'usePortfolioQuery').mockReturnValue({
            portfolio: undefined,
            isPortfolioLoading: true,
            isPortfolioError: false,
            refetchPortfolio: vi.fn() as ReturnType<
                typeof portfoliosQuery.usePortfolioQuery
            >['refetchPortfolio'],
        });
        vi.spyOn(categoriesQuery, 'useCategoriesQuery').mockReturnValue({
            categories: [],
            isCategoriesLoading: true,
        } as unknown as ReturnType<typeof categoriesQuery.useCategoriesQuery>);
        vi.spyOn(resultSetsQuery, 'useResultSetsQuery').mockReturnValue({
            resultSets: [],
            isResultSetsLoading: true,
            isResultSetsError: false,
            refetchResultSets: vi.fn() as ReturnType<
                typeof resultSetsQuery.useResultSetsQuery
            >['refetchResultSets'],
        } as ReturnType<typeof resultSetsQuery.useResultSetsQuery>);
        render(<EditPortfolioPage />);
        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('disables save while update mutation in progress', async () => {
        vi.spyOn(
            portfoliosMutation,
            'useUpdatePortfolioWithResultSetsMutation'
        ).mockReturnValue({
            updatePortfolio: vi.fn(),
            cancelUpdatePortfolio: vi.fn(),
            isPortfolioUpdating: true,
        } as unknown as ReturnType<
            typeof portfoliosMutation.useUpdatePortfolioWithResultSetsMutation
        >);
        render(<EditPortfolioPage />);
        expect(
            screen.getByTestId('create-portfolio-save-button')
        ).toBeDisabled();
    });
});
