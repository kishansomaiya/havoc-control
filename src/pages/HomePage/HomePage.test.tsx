import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { vi, beforeEach, describe, it } from 'vitest';
import { QueryClient } from '@tanstack/react-query';
import { HomePage } from './HomePage';
import { TestRoot } from '../../testing/TestRoot';
import * as portfoliosQuery from '../../api/queries/portfoliosQuery';
import * as categoriesQuery from '../../api/queries/categoriesQuery';
import * as PortfolioMapModule from './components/PortfolioMap';
import * as PortfolioExportMenuModule from './components/PortfolioExportMenu';
import * as heap from '../../heap-analytics';
import * as formatMessageModule from '../../localization/useFormatMessage';
import * as userContextModule from '../../context/UserContextProvider';
import * as analysisNoticeModule from '../../context/AnalysisDataNoticeProvider';
import * as reactRouter from 'react-router';

// Mutable state for hook mocks
let mockPortfoliosState = {
    portfolios: [] as unknown[],
    hasMorePortfolios: false,
    isPortfoliosLoading: false,
    isMorePortfoliosLoading: false,
    fetchNextPortfolios: vi.fn(),
    refetchPortfolios: vi.fn(),
};
let mockResultSetsState = {
    resultSets: [] as unknown[],
    isResultSetsLoading: false,
    refetchResultSets: vi.fn(),
};
let mockCategoriesState = {
    categories: [] as unknown[],
    isCategoriesLoading: false,
};

// Use targeted spies for hooks rather than broad module mocks
// Reason: control portfolios data via mutable test state while letting real HomePage logic run
vi.spyOn(portfoliosQuery, 'usePortfoliosQuery').mockImplementation(
    () =>
        mockPortfoliosState as unknown as ReturnType<
            typeof portfoliosQuery.usePortfoliosQuery
        >
);
// Reason: control result sets loading/state without replacing the whole module
vi.spyOn(portfoliosQuery, 'usePortfolioResultSetsQuery').mockImplementation(
    () =>
        mockResultSetsState as unknown as ReturnType<
            typeof portfoliosQuery.usePortfolioResultSetsQuery
        >
);
// Reason: simulate categories loading/data to drive loading and header UI branches
vi.spyOn(categoriesQuery, 'useCategoriesQuery').mockImplementation(
    () =>
        mockCategoriesState as unknown as ReturnType<
            typeof categoriesQuery.useCategoriesQuery
        >
);

// Top-level mocks (persist across module resets)

// Reason: stub heavy child map; its rendering is not under test here
vi.spyOn(PortfolioMapModule, 'PortfolioMap').mockImplementation(() => (
    <div data-testid="portfolio-map" />
));
// Reason: stub export menu to avoid unrelated menu logic in HomePage tests
vi.spyOn(PortfolioExportMenuModule, 'PortfolioExportMenu').mockImplementation(
    () => <div data-testid="portfolio-export" />
);

vi.mock('react-virtuoso', () => ({
    Virtuoso: ({
        data,
        itemContent,
    }: {
        data: unknown[];
        itemContent: (index: number, item: unknown) => JSX.Element;
    }) => (
        <div data-testid="virtuoso">
            {data.map((item, index) => (
                <div key={index}>{itemContent(index, item)}</div>
            ))}
        </div>
    ),
    Components: {},
    ListProps: {},
}));

// Use real LoadingSpinner; HomePage already tags details spinner with
// data-testid="portfolio-details-loading-spinner"

vi.mock(
    '../../components/PortfolioCategoriesTab/PortfolioCategoriesTab',
    () => ({
        __esModule: true,
        default: (props: { currentPortfolioCategory?: unknown }) => (
            <div
                data-testid="portfolio-categories-tab"
                data-current={props.currentPortfolioCategory as string}
            />
        ),
    })
);

// Reason: provide minimal heap analytics API to avoid side effects and allow navigation tracking assertions
vi.spyOn(heap, 'default', 'get').mockReturnValue({
    initializeHeap: vi.fn(),
    loginToHeap: vi.fn(),
    logoutFromHeap: vi.fn(),
    identifyUserInHeap: vi.fn(),
    trackCustomEvent: vi.fn(),
    isHeapInitialized: vi.fn(() => true),
} as unknown as typeof heap.default);

// Reason: simplify i18n by returning identity formatter, keeping types of useFormatMessage
vi.spyOn(formatMessageModule, 'useFormatMessage').mockImplementation(
    () =>
        ((id: string) => id) as ReturnType<
            typeof formatMessageModule.useFormatMessage
        >
);

// Reason: supply stable permission flags to exercise conditional UI without mocking the provider module
vi.spyOn(userContextModule, 'useUserContext').mockReturnValue({
    isPortfolioCreator: true,
    isPortfolioAdministrator: true,
    isPortfolioSharingEnabled: true,
    hasPortfolioAccessPermissions: true,
} as unknown as ReturnType<typeof userContextModule.useUserContext>);

// Reason: force notice as visible/hidden in tests without replacing the provider
vi.spyOn(analysisNoticeModule, 'useAnalysisDataNotice').mockReturnValue(
    true as unknown as ReturnType<
        typeof analysisNoticeModule.useAnalysisDataNotice
    >
);

const navigateMock = vi.fn();
vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigateMock);

const renderWithProviders = (ui: JSX.Element) => {
    const client = new QueryClient({
        defaultOptions: {
            queries: { retry: false, gcTime: 0, staleTime: 0 },
            mutations: { retry: false },
        },
    });
    return render(
        <TestRoot queryClient={client}>
            <MemoryRouter>{ui}</MemoryRouter>
        </TestRoot>
    );
};

describe('HomePage', () => {
    beforeEach(() => {
        vi.useRealTimers();
        navigateMock.mockReset();
        mockPortfoliosState = {
            portfolios: [],
            hasMorePortfolios: false,
            isPortfoliosLoading: false,
            isMorePortfoliosLoading: false,
            fetchNextPortfolios: vi.fn(),
            refetchPortfolios: vi.fn(),
        };
        mockResultSetsState = {
            resultSets: [],
            isResultSetsLoading: false,
            refetchResultSets: vi.fn(),
        };
        mockCategoriesState = {
            categories: [],
            isCategoriesLoading: false,
        };

        // Reason: re-apply per test so latest mutable state is used by the hook
        vi.spyOn(portfoliosQuery, 'usePortfoliosQuery').mockImplementation(
            () =>
                mockPortfoliosState as unknown as ReturnType<
                    typeof portfoliosQuery.usePortfoliosQuery
                >
        );
        // Reason: re-apply per test for result sets state changes (e.g., toggling loading)
        vi.spyOn(
            portfoliosQuery,
            'usePortfolioResultSetsQuery'
        ).mockImplementation(
            () =>
                mockResultSetsState as unknown as ReturnType<
                    typeof portfoliosQuery.usePortfolioResultSetsQuery
                >
        );
        // Reason: re-apply per test to control categories loading vs data
        vi.spyOn(categoriesQuery, 'useCategoriesQuery').mockImplementation(
            () =>
                mockCategoriesState as unknown as ReturnType<
                    typeof categoriesQuery.useCategoriesQuery
                >
        );

        // Reason: stub heavy child component per test (no WebGL/maps in JSDOM)
        vi.spyOn(PortfolioMapModule, 'PortfolioMap').mockImplementation(() => (
            <div data-testid="portfolio-map" />
        ));
        // Reason: stub export menu per test to keep focus on HomePage behavior
        vi.spyOn(
            PortfolioExportMenuModule,
            'PortfolioExportMenu'
        ).mockImplementation(() => <div data-testid="portfolio-export" />);

        // Reason: provide noop analytics implementation per test
        vi.spyOn(heap, 'default', 'get').mockReturnValue({
            initializeHeap: vi.fn(),
            loginToHeap: vi.fn(),
            logoutFromHeap: vi.fn(),
            identifyUserInHeap: vi.fn(),
            trackCustomEvent: vi.fn(),
            isHeapInitialized: vi.fn(() => true),
        } as unknown as typeof heap.default);

        // Reason: return simple formatter per test to avoid needing Intl in hooks
        vi.spyOn(formatMessageModule, 'useFormatMessage').mockImplementation(
            () =>
                ((id: string) => id) as ReturnType<
                    typeof formatMessageModule.useFormatMessage
                >
        );

        // Reason: keep permission flags deterministic across tests
        vi.spyOn(userContextModule, 'useUserContext').mockReturnValue({
            isPortfolioCreator: true,
            isPortfolioAdministrator: true,
            isPortfolioSharingEnabled: true,
            hasPortfolioAccessPermissions: true,
        } as unknown as ReturnType<typeof userContextModule.useUserContext>);

        // Reason: force analysis notice value for modal visibility logic
        vi.spyOn(analysisNoticeModule, 'useAnalysisDataNotice').mockReturnValue(
            true as unknown as ReturnType<
                typeof analysisNoticeModule.useAnalysisDataNotice
            >
        );

        // Reason: capture navigation calls to assert routing without affecting history
        vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigateMock);
    });

    it('renders header and zero results state', async () => {
        const { unmount } = renderWithProviders(<HomePage />);
        expect(
            screen.getByTestId('portfolio-list-your-portfolios-title')
        ).toHaveTextContent('Your Portfolios');
        expect(
            screen.getByTestId('portfolio-list-results-qty')
        ).toHaveTextContent('Showing 0 Results');
        expect(
            screen.getByTestId('create-portfolio-button')
        ).toBeInTheDocument();
        unmount();
    });

    it('shows spinner while categories load', async () => {
        mockCategoriesState = { categories: [], isCategoriesLoading: true };
        const { unmount } = renderWithProviders(<HomePage />);
        expect(
            screen.getAllByTestId('portfolio-list-circular-progress').length
        ).toBeGreaterThan(0);
        unmount();
    });

    it('auto-selects first valid portfolio; Launch disabled when pending', async () => {
        mockPortfoliosState.portfolios = [
            {
                id: '1',
                name: 'A',
                category: null,
                createdAt: new Date('2020-01-01'),
                pipelines: [
                    {
                        createdAt: new Date('2020-01-02'),
                        status: 'pending',
                    },
                ],
                locationCount: 2,
            },
        ];
        const { unmount } = renderWithProviders(<HomePage />);
        expect(screen.getByTestId('portfolio-details')).toBeInTheDocument();
        expect(
            screen.getByTestId('portfolio-details-launch-button')
        ).toBeDisabled();
        unmount();
    });

    it('Launch enabled for completed pipeline; navigates and load more fetches', async () => {
        const fetchNext = vi.fn();
        mockPortfoliosState = {
            ...mockPortfoliosState,
            portfolios: [
                {
                    id: '1',
                    name: 'A',
                    category: null,
                    createdAt: new Date('2020-01-01'),
                    pipelines: [
                        {
                            createdAt: new Date('2020-01-02'),
                            status: 'completed',
                        },
                    ],
                    locationCount: 2,
                },
            ],
            hasMorePortfolios: true,
            fetchNextPortfolios: fetchNext,
        };
        const { unmount } = renderWithProviders(<HomePage />);
        const launch = screen.getByTestId('portfolio-details-launch-button');
        expect(launch).toBeEnabled();
        fireEvent.click(launch);
        expect(navigateMock).toHaveBeenCalled();
        expect(
            screen.getByText('home.portfolios.load_more')
        ).toBeInTheDocument();
        fireEvent.click(screen.getByText('home.portfolios.load_more'));
        expect(fetchNext).toHaveBeenCalled();
        unmount();
    });

    it('shows modal when pipelines missing and notice is not hidden', async () => {
        mockPortfoliosState.portfolios = [
            {
                id: '1',
                name: 'A',
                category: null,
                createdAt: new Date(),
                pipelines: [],
                locationCount: 0,
            },
        ];
        const { unmount } = renderWithProviders(<HomePage />);
        expect(screen.getByTestId('portfolio-details')).toBeInTheDocument();
        unmount();
    });

    it('filters by search and clears via clear icon', async () => {
        mockPortfoliosState.portfolios = [
            {
                id: '1',
                name: 'Alpha',
                category: null,
                createdAt: new Date(),
                pipelines: [],
                locationCount: 0,
            },
            {
                id: '2',
                name: 'Beta',
                category: null,
                createdAt: new Date(),
                pipelines: [],
                locationCount: 0,
            },
        ];
        const { unmount } = renderWithProviders(<HomePage />);
        expect(
            screen.getByTestId('portfolio-list-results-qty')
        ).toHaveTextContent('2');
        const input = screen.getByPlaceholderText(
            'search_bar.search'
        ) as HTMLInputElement;
        fireEvent.change(input, { target: { value: 'Alpha' } });
        expect(
            screen.getByTestId('portfolio-list-results-qty')
        ).toHaveTextContent('1');
        fireEvent.click(screen.getByTestId('portfolio-list-search-clear-icon'));
        expect(
            screen.getByTestId('portfolio-list-results-qty')
        ).toHaveTextContent('2');
        unmount();
    });

    it('shows result-set loading spinner on details pane when selected and loading', async () => {
        mockPortfoliosState.portfolios = [
            {
                id: '1',
                name: 'A',
                category: null,
                createdAt: new Date('2020-01-01'),
                pipelines: [
                    {
                        createdAt: new Date('2020-01-02'),
                        status: 'completed',
                    },
                ],
                locationCount: 0,
            },
        ];
        // Start in loading state; select a portfolio by clicking the item to show details pane
        mockResultSetsState.isResultSetsLoading = true;
        const { unmount } = renderWithProviders(<HomePage />);
        expect(
            screen.getByTestId('portfolio-list-results-qty')
        ).toBeInTheDocument();
        fireEvent.click(screen.getByTestId('portfolio-item-info'));
        expect(
            screen.getByTestId('portfolio-details-loading-spinner')
        ).toBeInTheDocument();
        unmount();
    });
});
