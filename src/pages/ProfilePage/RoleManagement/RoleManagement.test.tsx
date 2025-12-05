import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { RoleManagement } from './RoleManagement';
import * as rolesQuery from '../../../api/queries/rolesQuery';
import * as zedToken from '../../../context/ZedTokenProvider';
import * as roleItemModule from './components/RoleItem';
import * as reactRouter from 'react-router';

vi.mock('@auth0/auth0-react', () => ({
    useAuth0: () => ({ user: { 'custom:jupiter-tenant-id': 't1' } }),
}));

const mockUseRolesQueryImpl = vi.fn();
vi.spyOn(rolesQuery, 'useRolesQuery').mockImplementation((params?: unknown) =>
    mockUseRolesQueryImpl(params)
);

vi.spyOn(zedToken, 'useZedToken').mockReturnValue({
    token: 'z',
} as unknown as ReturnType<typeof zedToken.useZedToken>);

// Virtuoso is heavy; we provide a small mock below
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
            data?: ReadonlyArray<unknown>;
            itemContent: (index: number, item: unknown) => React.ReactNode;
        }) => (
            <div data-testid="virtuoso-list">
                {(data || []).map((d, i) => (
                    <div key={i}>{itemContent(i, d)}</div>
                ))}
            </div>
        ),
    };
});

vi.spyOn(roleItemModule, 'RoleItem').mockImplementation(
    ({
        roleData,
        onRoleDelete,
    }: {
        roleData: { name: string };
        onRoleDelete: () => void;
    }) => (
        <div>
            <div data-testid="role-item-name">{roleData.name}</div>
            <button
                data-testid="delete-role"
                onClick={onRoleDelete}
            >
                del
            </button>
        </div>
    )
);

const navigateSpy = vi.fn();
vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(navigateSpy);

describe('RoleManagement', () => {
    it('shows loading spinner', () => {
        mockUseRolesQueryImpl.mockReturnValue({ isRolesLoading: true });
        render(
            <MemoryRouter>
                <RoleManagement />
            </MemoryRouter>
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('renders empty state when no roles and Add new role navigates', async () => {
        const user = userEvent.setup();
        mockUseRolesQueryImpl.mockReturnValue({
            roles: [],
            isRolesLoading: false,
        });
        render(
            <MemoryRouter>
                <RoleManagement />
            </MemoryRouter>
        );
        // Empty state branch does not render role-management-page wrapper
        expect(
            screen.getByText(/NO ROLES HAVE BEEN CONFIGURED YET!/i)
        ).toBeInTheDocument();
        await user.click(screen.getByTestId('add-new-role-button'));
        expect(navigateSpy).toHaveBeenCalled();
    });

    it('lists roles, filters, loads more, header Add button navigates, and refetches on delete', async () => {
        const user = userEvent.setup();
        const fetchNextPage = vi.fn();
        const refetchRoles = vi.fn();
        mockUseRolesQueryImpl.mockReturnValue({
            roles: [
                {
                    role: {
                        id: '1',
                        name: 'Admin',
                        description: 'd',
                        isDefault: false,
                    },
                    members: [],
                },
                {
                    role: {
                        id: '2',
                        name: 'User',
                        description: 'd2',
                        isDefault: false,
                    },
                    members: [],
                },
            ],
            hasMoreRoles: true,
            isRolesLoading: false,
            isFetchingNextPage: false,
            fetchNextPage: fetchNextPage,
            refetchRoles,
        });
        render(
            <MemoryRouter>
                <RoleManagement />
            </MemoryRouter>
        );
        expect(
            screen.getAllByTestId('role-item-name').map((n) => n.textContent)
        ).toEqual(['Admin', 'User']);
        await user.type(screen.getByTestId('role-list-search-field'), 'adm');
        expect(
            screen.getAllByTestId('role-item-name').map((n) => n.textContent)
        ).toEqual(['Admin']);
        await user.click(screen.getByTestId('role-list-search-clear-icon'));
        expect(screen.getAllByTestId('role-item-name').length).toBe(2);
        // Header add button
        await user.click(screen.getByTestId('add-new-role-button'));
        expect(navigateSpy).toHaveBeenCalled();
        // Load more
        await user.click(screen.getByRole('button', { name: /Load More/i }));
        expect(fetchNextPage).toHaveBeenCalled();
        // Delete triggers refetch
        await user.click(screen.getAllByTestId('delete-role')[0]);
        expect(refetchRoles).toHaveBeenCalled();
    });
});
