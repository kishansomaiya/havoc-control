import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { DuplicatePortfolioPage } from './DuplicatePortfolioPage';
import * as reactRouter from 'react-router';
import * as EditPortfolioSettingsModule from '../components/EditSettings/EditPortfolioSettings';
import * as TabLoadingIndicatorModule from '../../../components/Tab/TabLoadingIndicator';
import * as initialFormValuesHook from '../hooks/useInitialFormValues';
import * as portfolioNameHook from '../hooks/usePortfolioName';
import * as portfolioCategoryHook from '../hooks/usePortfolioCategory';
import * as runDisclosureHook from '../hooks/usePortfolioRunDisclosure';
import * as dataVersionHook from '../hooks/usePortfolioDataVersion';
import * as eiVersionHook from '../hooks/usePortfolioEIVersion';
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
        portfolioId: '123',
    } as ReturnType<typeof reactRouter.useParams>);

    vi.spyOn(
        EditPortfolioSettingsModule,
        'EditPortfolioSettings'
    ).mockImplementation(() => <div data-testid="edit-settings" />);
    vi.spyOn(
        TabLoadingIndicatorModule,
        'TabLoadingIndicator'
    ).mockImplementation(() => <div data-testid="loading" />);

    vi.spyOn(initialFormValuesHook, 'useInitialFormValues').mockReturnValue({
        initialFormValues: {
            name: 'Dup',
            type: 'Scores',
            dataVersion: '3.2.0',
        },
    } as unknown as ReturnType<
        typeof initialFormValuesHook.useInitialFormValues
    >);
    vi.spyOn(portfolioNameHook, 'usePortfolioName').mockReturnValue('My Port');
    vi.spyOn(portfolioCategoryHook, 'usePortfolioCategory').mockReturnValue({
        id: 'cat',
        label: 'Cat',
    } as ReturnType<typeof portfolioCategoryHook.usePortfolioCategory>);
    vi.spyOn(runDisclosureHook, 'usePortfolioRunDisclosure').mockReturnValue(
        false as ReturnType<typeof runDisclosureHook.usePortfolioRunDisclosure>
    );
    vi.spyOn(dataVersionHook, 'usePortfolioDataVersion').mockReturnValue(
        '3.2.0' as ReturnType<typeof dataVersionHook.usePortfolioDataVersion>
    );
    vi.spyOn(eiVersionHook, 'usePortfolioEIVersion').mockReturnValue(
        '3.2.0' as ReturnType<typeof eiVersionHook.usePortfolioEIVersion>
    );

    vi.spyOn(portfoliosQuery, 'usePortfolioQuery').mockReturnValue({
        portfolio: {
            id: '123',
            name: 'My Port',
            locationCount: 3,
            fileValidation: 'fv',
            file: 'file.csv',
        },
        isPortfolioLoading: false,
    } as ReturnType<typeof portfoliosQuery.usePortfolioQuery>);
    vi.spyOn(categoriesQuery, 'useCategoriesQuery').mockReturnValue({
        categories: [],
        isCategoriesLoading: false,
    } as unknown as ReturnType<typeof categoriesQuery.useCategoriesQuery>);
    vi.spyOn(resultSetsQuery, 'useResultSetsQuery').mockReturnValue({
        resultSets: [],
        isResultSetsLoading: false,
    } as unknown as ReturnType<typeof resultSetsQuery.useResultSetsQuery>);

    vi.spyOn(
        portfoliosMutation,
        'useCreatePortfolioWithResultSetsMutation'
    ).mockReturnValue({
        createPortfolio: vi
            .fn()
            .mockResolvedValue({ name: 'New', locationCount: 3 }),
        cancelCreatePortfolio: vi.fn(),
        isPortfolioCreating: false,
    } as unknown as ReturnType<
        typeof portfoliosMutation.useCreatePortfolioWithResultSetsMutation
    >);

    vi.spyOn(utils, 'formatUnit').mockReturnValue('3 locations');
});

describe('DuplicatePortfolioPage', () => {
    beforeEach(() => {
        navigateMock.mockReset();
    });

    it('shows title and subtitle when loaded', () => {
        render(<DuplicatePortfolioPage />);
        expect(screen.getByTestId('create-portfolio-title')).toHaveTextContent(
            'Duplicate My Port'
        );
        expect(
            screen.getByTestId('edit-duplicate-portfolio-locations-qty')
        ).toHaveTextContent('3 locations');
        expect(
            screen.getByTestId('duplicate-portfolio-edit-settings')
        ).toBeInTheDocument();
        expect(
            screen.getByTestId('duplicate-portfolio-create-button')
        ).toBeInTheDocument();
    });

    it('Cancel navigates back', async () => {
        const user = userEvent.setup();
        render(<DuplicatePortfolioPage />);
        await user.click(
            screen.getByTestId('create-edit-portfolio-cancel-button')
        );
        expect(navigateMock).toHaveBeenCalled();
    });

    it('shows loading when initial values are not ready', async () => {
        vi.resetModules();
        // Note: dynamic doMock is retained here to alter behavior for a specific scenario
        // where the component is imported after mocks. Spying cannot change already-imported
        // module state per ESM semantics; doMock ensures this test remains isolated.
        vi.doMock('react-router', async () => {
            const mod =
                await vi.importActual<typeof import('react-router')>(
                    'react-router'
                );
            return {
                ...mod,
                useNavigate: () => navigateMock,
                useParams: () => ({ portfolioId: '123' }),
            };
        });
        vi.doMock('../../../components/Tab/TabLoadingIndicator', () => ({
            TabLoadingIndicator: () => <div data-testid="loading" />,
        }));
        vi.doMock('../hooks/useInitialFormValues', () => ({
            useInitialFormValues: () => ({ initialFormValues: undefined }),
        }));
        vi.doMock('../../../api/queries/categoriesQuery', () => ({
            useCategoriesQuery: () => ({
                categories: [],
                isCategoriesLoading: true,
            }),
        }));
        vi.doMock('../../../api/queries/resultSetsQuery', () => ({
            useResultSetsQuery: () => ({
                resultSets: [],
                isResultSetsLoading: true,
            }),
        }));
        vi.doMock('../../../api/mutations/portfoliosMutation', () => ({
            useCreatePortfolioWithResultSetsMutation: () => ({
                createPortfolio: vi.fn(),
                cancelCreatePortfolio: vi.fn(),
                isPortfolioCreating: false,
            }),
        }));
        vi.doMock('../../../api/queries/portfoliosQuery', () => ({
            usePortfolioQuery: () => ({
                portfolio: undefined,
                isPortfolioLoading: true,
            }),
        }));
        const Comp = (await import('./DuplicatePortfolioPage'))
            .DuplicatePortfolioPage;
        render(<Comp />);
        expect(screen.getByTestId('loading')).toBeInTheDocument();
    });

    it('does not create when invalid or loading branches block submission', async () => {
        vi.resetModules();
        const createSpy = vi.fn();
        vi.doMock('../../../api/mutations/portfoliosMutation', () => ({
            useCreatePortfolioWithResultSetsMutation: () => ({
                createPortfolio: createSpy,
                cancelCreatePortfolio: vi.fn(),
                isPortfolioCreating: false,
            }),
        }));
        vi.doMock('../../../api/queries/portfoliosQuery', () => ({
            usePortfolioQuery: () => ({
                portfolio: undefined,
                isPortfolioLoading: true,
            }),
        }));
        const Comp = (await import('./DuplicatePortfolioPage'))
            .DuplicatePortfolioPage;
        render(<Comp />);
        expect(screen.getByTestId('loading')).toBeInTheDocument();
        expect(createSpy).not.toHaveBeenCalled();
    });
});
