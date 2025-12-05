import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import PortfolioSharing from './PortfolioSharing';
import * as reactRouter from 'react-router';
import * as portfolioItemModule from '../../HomePage/components/PortfolioItem';
import * as userContext from '../../../context/UserContextProvider';
import * as portfoliosQuery from '../../../api/queries/portfoliosQuery';
import * as categoriesQuery from '../../../api/queries/categoriesQuery';
import * as usersQuery from '../../../api/queries/usersQuery';
import * as portfoliosMutation from '../../../api/mutations/portfoliosMutation';
import * as HomePageModule from '../../HomePage/HomePage';
import * as confirmModalModule from '../../../components/ConfirmModal/ConfirmModal';

const navigateSpy = vi.fn();
vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigateSpy);

vi.mock('@auth0/auth0-react', () => ({
    useAuth0: () => ({
        user: {
            'custom:jupiter-tenant-id': 't1',
            'custom:jupiter-user-id': 'u1',
        },
    }),
}));

vi.spyOn(portfolioItemModule, 'PortfolioItem').mockImplementation(
    (props: React.ComponentProps<typeof portfolioItemModule.PortfolioItem>) => (
        <div data-testid={`portfolio-item-${props.portfolio?.id ?? ''}`}>
            <button onClick={() => props.onPortfolioSelect(props.portfolio)}>
                {props.portfolio?.name ?? ''}
            </button>
            <span data-testid="selected">
                {props.isSelected ? 'selected' : 'not-selected'}
            </span>
        </div>
    )
);

// Virtuoso: use a small mock to avoid heavy virtualization
vi.mock('react-virtuoso', async () => {
    const actual =
        await vi.importActual<typeof import('react-virtuoso')>(
            'react-virtuoso'
        );
    return {
        ...actual,
        Virtuoso: ({
            data,
            itemContent,
        }: {
            data: Array<{ id: string }>;
            itemContent: (i: number, p: { id: string }) => JSX.Element;
        }) => (
            <div data-testid="portfolio-list">
                {(data || []).map((p, i) => (
                    <div key={p.id}>{itemContent(i, p)}</div>
                ))}
            </div>
        ),
    };
});

vi.spyOn(userContext, 'useUserContext').mockReturnValue({
    isPortfolioCreator: true,
    isPortfolioAdministrator: true,
    isPortfolioSharingEnabled: true,
    hasPortfolioAccessPermissions: true,
} as unknown as ReturnType<typeof userContext.useUserContext>);

const mockUsePortfoliosQueryImpl = vi.fn();
const mockUsePortfolioSharedUsersQueryImpl = vi.fn();
const mockUseCategoriesQueryImpl = vi.fn();
const mockUseUsersQueryImpl = vi.fn();
const shareSpy = vi.fn();
const unshareSpy = vi.fn();

vi.spyOn(portfoliosQuery, 'usePortfoliosQuery').mockImplementation(
    (...args: unknown[]) => mockUsePortfoliosQueryImpl(...args)
);
vi.spyOn(portfoliosQuery, 'usePortfolioSharedUsersQuery').mockImplementation(
    (...args: unknown[]) => mockUsePortfolioSharedUsersQueryImpl(...args)
);

vi.spyOn(categoriesQuery, 'useCategoriesQuery').mockImplementation(
    (...args: unknown[]) => mockUseCategoriesQueryImpl(...args)
);

vi.spyOn(usersQuery, 'useUsersQuery').mockImplementation((...args: unknown[]) =>
    mockUseUsersQueryImpl(...args)
);

vi.spyOn(portfoliosMutation, 'useSharePortfolioMutation').mockReturnValue({
    sharePortfolio: shareSpy,
    isPortfolioShareLoading: false,
} as unknown as ReturnType<
    typeof portfoliosMutation.useSharePortfolioMutation
>);
vi.spyOn(portfoliosMutation, 'useUnsharePortfolioMutation').mockReturnValue({
    unsharePortfolio: unshareSpy,
    isPortfolioUnshareLoading: false,
} as unknown as ReturnType<
    typeof portfoliosMutation.useUnsharePortfolioMutation
>);

vi.spyOn(HomePageModule, 'portfolioListComponents', 'get').mockReturnValue({});

// Simplify ConfirmModal rendering and expose confirm button
vi.spyOn(confirmModalModule, 'ConfirmModal').mockImplementation(
    (props: React.ComponentProps<typeof confirmModalModule.ConfirmModal>) => (
        <div>
            <div>{props.title}</div>
            <button onClick={props.onConfirm!}>Yes</button>
        </div>
    )
);

describe('PortfolioSharing', () => {
    const renderWithRoute = (path = '/profile/portfolio-sharing') =>
        render(
            <MemoryRouter initialEntries={[path]}>
                <Routes>
                    <Route
                        path="/profile/portfolio-sharing"
                        element={<PortfolioSharing />}
                    />
                    <Route
                        path="/profile/portfolio-sharing/:portfolioId"
                        element={<PortfolioSharing />}
                    />
                </Routes>
            </MemoryRouter>
        );

    beforeEach(() => {
        navigateSpy.mockReset();
        shareSpy.mockReset();
        unshareSpy.mockReset();

        mockUseCategoriesQueryImpl.mockReturnValue({
            categories: [],
            isCategoriesLoading: false,
        });
        mockUsePortfoliosQueryImpl.mockReturnValue({
            portfolios: [
                { id: 'p1', name: 'Alpha', category: '', createdAt: 1 },
                { id: 'p2', name: 'Beta', category: '', createdAt: 2 },
            ],
            hasMorePortfolios: true,
            isPortfoliosLoading: false,
            isMorePortfoliosLoading: false,
            fetchNextPortfolios: vi.fn(),
            refetchPortfolios: vi.fn(),
        });
        mockUsePortfolioSharedUsersQueryImpl.mockReturnValue({
            sharedUsers: ['u2'],
            isPortfolioSharedUsersLoading: false,
            refetchPortfolioSharedUsers: vi.fn(),
        });
        mockUseUsersQueryImpl.mockReturnValue({
            users: [
                { id: 'u1', firstName: 'Self', emailAddress: 'me@x.com' },
                { id: 'u2', firstName: 'Alice', emailAddress: 'a@x.com' },
                { id: 'u3', firstName: 'Bob', emailAddress: 'b@x.com' },
            ],
            isUsersLoading: false,
            refetchUsers: vi.fn(),
        });
    });

    it('renders loading spinner when categories loading', () => {
        mockUseCategoriesQueryImpl.mockReset();
        mockUseCategoriesQueryImpl.mockReturnValue({
            isCategoriesLoading: true,
        });
        renderWithRoute();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('lists portfolios, supports searching, selects a portfolio and toggles users, enabling Save', async () => {
        const user = userEvent.setup();
        renderWithRoute();

        const list = screen.getByTestId('portfolio-list');
        expect(within(list).getByText('Beta')).toBeInTheDocument();

        const searchWrapper = screen.getByTestId('portfolio-list-search-field');
        const searchInput = within(searchWrapper).getByRole('textbox');
        await user.type(searchInput, 'alp');
        expect((searchInput as HTMLInputElement).value).toBe('alp');
        // Clear search
        await user.click(
            screen.getByTestId('portfolio-list-search-clear-icon')
        );
        expect((searchInput as HTMLInputElement).value).toBe('');

        await user.click(within(list).getByText('Beta'));

        await user.click(screen.getByText('Bob'));

        const save = screen.getByRole('button', { name: 'Save' });
        expect(save).toBeEnabled();
    });

    it('saves added and removed users via respective mutations and shows success modal', async () => {
        const user = userEvent.setup();
        renderWithRoute();

        await user.click(screen.getByText('Beta'));

        await user.click(screen.getByText('Alice'));
        await user.click(screen.getByText('Bob'));

        await user.click(screen.getByRole('button', { name: 'Save' }));

        expect(shareSpy).toHaveBeenCalledTimes(1);
        expect(unshareSpy).toHaveBeenCalledTimes(1);

        await screen.findByText('Success!');
        await user.click(screen.getByText('Yes'));
    });

    it('saves only added users via share mutation', async () => {
        const user = userEvent.setup();
        renderWithRoute();
        await user.click(screen.getByText('Beta'));
        await user.click(screen.getByText('Bob'));
        await user.click(screen.getByRole('button', { name: 'Save' }));
        expect(shareSpy).toHaveBeenCalledTimes(1);
        expect(unshareSpy).not.toHaveBeenCalled();
    });

    it('saves only removed users via unshare mutation', async () => {
        const user = userEvent.setup();
        renderWithRoute();
        await user.click(screen.getByText('Beta'));
        await user.click(screen.getByText('Alice'));
        await user.click(screen.getByRole('button', { name: 'Save' }));
        expect(unshareSpy).toHaveBeenCalledTimes(1);
        expect(shareSpy).not.toHaveBeenCalled();
    });

    it('cancel navigates back', async () => {
        const user = userEvent.setup();
        renderWithRoute();
        await user.click(screen.getByText('Beta'));
        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(navigateSpy).toHaveBeenCalled();
    });

    it('shows empty state when no portfolios and not loading', () => {
        mockUsePortfoliosQueryImpl.mockReset();
        mockUsePortfoliosQueryImpl.mockReturnValue({
            portfolios: [],
            isPortfoliosLoading: false,
            hasMorePortfolios: false,
            refetchPortfolios: vi.fn(),
            fetchNextPortfolios: vi.fn(),
        });
        renderWithRoute();
        expect(screen.getAllByTestId('No-data-available')).toHaveLength(2);
    });

    it('shows users spinner branch and excludes self from list', async () => {
        const user = userEvent.setup();
        mockUsePortfolioSharedUsersQueryImpl.mockReturnValueOnce({
            sharedUsers: [],
            isPortfolioSharedUsersLoading: true,
            refetchPortfolioSharedUsers: vi.fn(),
        });
        renderWithRoute();
        await user.click(screen.getByText('Beta'));
        expect(screen.queryByText('Self')).not.toBeInTheDocument();
    });

    it('shows Load More loading state when fetching more portfolios', () => {
        const fetchNextPortfolios = vi.fn();
        mockUsePortfoliosQueryImpl.mockReset();
        mockUsePortfoliosQueryImpl.mockReturnValue({
            portfolios: [
                { id: 'p1', name: 'Alpha', category: '', createdAt: 1 },
                { id: 'p2', name: 'Beta', category: '', createdAt: 2 },
            ],
            hasMorePortfolios: true,
            isPortfoliosLoading: false,
            isMorePortfoliosLoading: true,
            fetchNextPortfolios,
            refetchPortfolios: vi.fn(),
        });
        renderWithRoute();
        const loadMore = screen.getByRole('button', { name: /Loading.../i });
        expect(loadMore).toBeDisabled();
    });
});
