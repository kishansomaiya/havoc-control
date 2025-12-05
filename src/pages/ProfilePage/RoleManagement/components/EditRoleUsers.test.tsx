import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { EditRoleUsers } from './EditRoleUsers';
import * as reactRouter from 'react-router';
import * as confirmModalModule from '../../../../components/ConfirmModal/ConfirmModal';
import * as loadingSpinnerModule from '../../../../components/LoadingSpinner/LoadingSpinner';
import * as rolesQuery from '../../../../api/queries/rolesQuery';
import * as usersQuery from '../../../../api/queries/usersQuery';
import * as rolesMutation from '../../../../api/mutations/rolesMutation';

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

// Feather icons are SVGs without roles/testids; expose buttons for clickability in tests
vi.mock('react-feather', () => ({
    ArrowRight: ({ onClick }: { onClick: () => void }) => (
        <button
            data-testid="arrow-right"
            onClick={onClick}
        />
    ),
    ArrowLeft: ({ onClick }: { onClick: () => void }) => (
        <button
            data-testid="arrow-left"
            onClick={onClick}
        />
    ),
    Search: () => <span data-testid="icon-search" />,
    X: ({ onClick }: { onClick?: () => void }) => (
        <button
            data-testid="icon-x"
            onClick={onClick}
        />
    ),
}));

// Mock modal to render predictable controls
vi.spyOn(confirmModalModule, 'ConfirmModal').mockImplementation(
    (props: React.ComponentProps<typeof confirmModalModule.ConfirmModal>) => (
        <div>
            <div data-testid="confirm-modal-title">{props.title}</div>
            <button onClick={props.onConfirm!}>Yes</button>
            {props.onCancel ? (
                <button onClick={props.onCancel}>No, Take me back</button>
            ) : null}
        </div>
    )
);

// Ensure LoadingSpinner renders an accessible progressbar role when loading
vi.spyOn(loadingSpinnerModule, 'LoadingSpinner').mockImplementation(
    ({ loading }: { loading: boolean }) =>
        loading ? <div role="progressbar" /> : null
);

const mockUseRoleQueryImpl = vi.fn();
const mockUseRolesQueryImpl = vi.fn();
const mockUseUsersQueryImpl = vi.fn();

vi.spyOn(rolesQuery, 'useRoleQuery').mockImplementation((...args: unknown[]) =>
    mockUseRoleQueryImpl(...args)
);
vi.spyOn(rolesQuery, 'useRolesQuery').mockImplementation((...args: unknown[]) =>
    mockUseRolesQueryImpl(...args)
);

vi.spyOn(usersQuery, 'useUsersQuery').mockImplementation((...args: unknown[]) =>
    mockUseUsersQueryImpl(...args)
);

const updateRoleRelationsSpy = vi.fn();
vi.spyOn(rolesMutation, 'useUpdateRoleRelationsMutation').mockReturnValue({
    updateRoleRelations: updateRoleRelationsSpy,
    isRoleRelationsUpdating: false,
} as unknown as ReturnType<
    typeof rolesMutation.useUpdateRoleRelationsMutation
>);

describe('EditRoleUsers', () => {
    const renderWithRoute = () =>
        render(
            <MemoryRouter initialEntries={['/roles/1/users']}>
                <Routes>
                    <Route
                        path="/roles/:roleId/users"
                        element={<EditRoleUsers />}
                    />
                </Routes>
            </MemoryRouter>
        );

    beforeEach(() => {
        navigateSpy.mockReset();
        updateRoleRelationsSpy.mockReset();

        // Default: loaded state with one user in role, one in other role (disabled), one free
        mockUseRoleQueryImpl.mockReturnValue({
            role: { role: { id: '1', name: 'R' }, members: ['u2'] },
            isRoleLoading: false,
        });
        mockUseRolesQueryImpl.mockReturnValue({
            roles: [
                { role: { id: '1' }, members: ['u2'] },
                { role: { id: '2' }, members: ['u3'] }, // makes u3 disabled in available list
            ],
            isRolesLoading: false,
        });
        mockUseUsersQueryImpl.mockReturnValue({
            users: [
                { id: 'u2', firstName: 'Alice', emailAddress: 'a@x.com' },
                { id: 'u3', firstName: 'Bob', emailAddress: 'b@x.com' },
                { id: 'u4', firstName: 'Cara', emailAddress: 'c@x.com' },
            ],
            isUsersLoading: false,
        });
    });

    it('shows loading spinner when loading', () => {
        // Force all queries into loading state so the spinner branch renders
        mockUseRoleQueryImpl.mockReset();
        mockUseUsersQueryImpl.mockReset();
        mockUseRolesQueryImpl.mockReset();

        mockUseRoleQueryImpl.mockReturnValue({ isRoleLoading: true });
        mockUseUsersQueryImpl.mockReturnValue({
            users: [],
            isUsersLoading: true,
        });
        mockUseRolesQueryImpl.mockReturnValue({
            roles: [],
            isRolesLoading: false,
        });

        renderWithRoute();
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('selects all available (skipping disabled), moves to role and saves', async () => {
        const user = userEvent.setup();
        renderWithRoute();

        // Select all available users
        await user.click(screen.getAllByText('Select all users')[0]);

        // Move selected to role
        await user.click(screen.getByTestId('arrow-right'));

        // Save should be enabled now, trigger update
        const save = screen.getByRole('button', { name: 'Save' });
        expect(save).toBeEnabled();
        await user.click(save);

        expect(updateRoleRelationsSpy).toHaveBeenCalledTimes(1);
        const payload = updateRoleRelationsSpy.mock.calls[0][0];
        expect(payload.id).toBe('1');
        expect(
            Array.from(payload.updateRoleRelationsInputBody.addMembers)
        ).toEqual(['u4']);
        expect(
            Array.from(payload.updateRoleRelationsInputBody.removeMembers)
        ).toEqual([]);
    });

    it('moves back to available and disables save when no changes', async () => {
        const user = userEvent.setup();
        renderWithRoute();

        // Move one to role first
        await user.click(screen.getAllByText('Select all users')[0]);
        await user.click(screen.getByTestId('arrow-right'));

        // Then move back
        await user.click(screen.getByTestId('arrow-left'));

        const save = screen.getByRole('button', { name: 'Save' });
        expect(save).toBeDisabled();
    });

    it('filters available by search and clears using the clear icon', async () => {
        const user = userEvent.setup();
        renderWithRoute();

        const search = screen.getAllByPlaceholderText('Search for User')[0];
        await user.type(search, 'car');
        expect((search as HTMLInputElement).value).toBe('car');

        // Clear via end adornment icon
        await user.click(screen.getAllByTestId('icon-x')[0]);
        expect((search as HTMLInputElement).value).toBe('');
    });

    it('opens cancel modal and confirms navigation', async () => {
        const user = userEvent.setup();
        renderWithRoute();

        await user.click(screen.getByRole('button', { name: 'Cancel' }));
        expect(screen.getByTestId('confirm-modal-title')).toHaveTextContent(
            'Cancel Editing'
        );

        await user.click(screen.getByText('Yes'));
        expect(navigateSpy).toHaveBeenCalled();
    });
});
