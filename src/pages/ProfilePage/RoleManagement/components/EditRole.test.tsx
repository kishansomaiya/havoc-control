import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { TestRoot } from '../../../../testing/TestRoot';
import { EditRole } from './EditRole';
import * as rolesQuery from '../../../../api/queries/rolesQuery';
import * as rolesMutation from '../../../../api/mutations/rolesMutation';
import * as LoadingSpinnerModule from '../../../../components/LoadingSpinner/LoadingSpinner';
import * as RoleFormModule from './RoleForm';
import * as zedToken from '../../../../context/ZedTokenProvider';
import { PermissionValues } from '../../../../types/rolePermissions';
import { ComponentProps } from 'react';
import RoleForm from './RoleForm';

vi.spyOn(LoadingSpinnerModule, 'LoadingSpinner').mockImplementation(
    ({ loading }: { loading: boolean }) =>
        loading ? <div role="progressbar" /> : null
);

vi.spyOn(rolesQuery, 'useRoleQuery').mockReturnValue({
    role: {
        role: { id: '1', name: 'R', description: 'D', isDefault: false },
        roleRelations: [PermissionValues.ROLE_MANAGER],
        members: [],
    },
    isRoleLoading: false,
} as unknown as ReturnType<typeof rolesQuery.useRoleQuery>);

vi.spyOn(rolesMutation, 'useDeleteRoleMutation').mockReturnValue({
    deleteRole: vi.fn(),
    isRoleDeleting: false,
} as unknown as ReturnType<typeof rolesMutation.useDeleteRoleMutation>);
vi.spyOn(rolesMutation, 'useUpdateRoleMutation').mockReturnValue({
    updateRole: vi.fn(),
    isRoleUpdating: false,
} as unknown as ReturnType<typeof rolesMutation.useUpdateRoleMutation>);
vi.spyOn(rolesMutation, 'useUpdateRoleRelationsMutation').mockReturnValue({
    updateRoleRelations: vi.fn(),
    isRoleRelationsUpdating: false,
} as unknown as ReturnType<
    typeof rolesMutation.useUpdateRoleRelationsMutation
>);

vi.spyOn(RoleFormModule, 'default').mockImplementation(
    ({ onFormValidationChange }: ComponentProps<typeof RoleForm>) => {
        onFormValidationChange(true);
        return <div data-testid="role-form" />;
    }
);

vi.spyOn(zedToken, 'useSetZedToken').mockReturnValue({
    handleSetRoleZedToken: vi.fn(),
    handleSetClientZedToken: vi.fn(),
} as unknown as ReturnType<typeof zedToken.useSetZedToken>);

describe('EditRole', () => {
    const renderWithRoute = () =>
        render(
            <TestRoot>
                <MemoryRouter initialEntries={['/roles/1']}>
                    <Routes>
                        <Route
                            path="/roles/:roleId"
                            element={<EditRole />}
                        />
                    </Routes>
                </MemoryRouter>
            </TestRoot>
        );

    it('renders and opens cancel modal', async () => {
        const user = userEvent.setup();
        renderWithRoute();
        await user.click(screen.getByTestId('cancel-button'));
        expect(screen.getByTestId('confirm-modal-title')).toHaveTextContent(
            'Cancel Editing'
        );
    });

    it('opens save modal and delete modal', async () => {
        renderWithRoute();
        // enable save button in this test by not relying on disabled prop (already mocked form validation true)
        // clicking delete should open delete modal
        fireEvent.click(screen.getByTestId('delete-role-button'));
        expect(screen.getByTestId('confirm-modal-title')).toHaveTextContent(
            'Delete Role'
        );
    });

    it('shows loading spinner while role is loading', async () => {
        vi.resetModules();
        vi.doMock('../../../../context/ZedTokenProvider', () => ({
            useSetZedToken: () => ({
                handleSetRoleZedToken: vi.fn(),
                handleSetClientZedToken: vi.fn(),
            }),
            useZedToken: () => ({
                roleZedToken: undefined,
                clientZedToken: undefined,
            }),
        }));
        vi.doMock('../../../../api/queries/rolesQuery', () => ({
            useRoleQuery: () => ({ isRoleLoading: true }),
        }));
        const { EditRole: EditRoleLoading } = await import('./EditRole');
        render(
            <TestRoot>
                <MemoryRouter initialEntries={['/roles/1']}>
                    <Routes>
                        <Route
                            path="/roles/:roleId"
                            element={<EditRoleLoading />}
                        />
                    </Routes>
                </MemoryRouter>
            </TestRoot>
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('disables save button when no changes present', () => {
        renderWithRoute();
        expect(screen.getByTestId('save-button')).toBeDisabled();
    });

    it('disables delete when role is default', async () => {
        vi.resetModules();
        vi.doMock('../../../../context/ZedTokenProvider', () => ({
            useSetZedToken: () => ({
                handleSetRoleZedToken: vi.fn(),
                handleSetClientZedToken: vi.fn(),
            }),
            useZedToken: () => ({
                roleZedToken: undefined,
                clientZedToken: undefined,
            }),
        }));
        vi.doMock('../../../../api/queries/rolesQuery', () => ({
            useRoleQuery: () => ({
                role: {
                    role: {
                        id: '1',
                        name: 'R',
                        description: 'D',
                        isDefault: true,
                    },
                    roleRelations: [PermissionValues.ROLE_MANAGER],
                    members: [],
                },
                isRoleLoading: false,
            }),
        }));
        const { EditRole: EditRoleDefault } = await import('./EditRole');
        render(
            <TestRoot>
                <MemoryRouter initialEntries={['/roles/1']}>
                    <Routes>
                        <Route
                            path="/roles/:roleId"
                            element={<EditRoleDefault />}
                        />
                    </Routes>
                </MemoryRouter>
            </TestRoot>
        );
        expect(screen.getByTestId('delete-role-button')).toBeDisabled();
    });

    it('cancel confirm navigates back and cancel-close keeps modal closed', async () => {
        vi.resetModules();
        const navigateSpy = vi.fn();
        vi.doMock('../../../../context/ZedTokenProvider', () => ({
            useSetZedToken: () => ({
                handleSetRoleZedToken: vi.fn(),
                handleSetClientZedToken: vi.fn(),
            }),
            useZedToken: () => ({
                roleZedToken: undefined,
                clientZedToken: undefined,
            }),
        }));
        vi.doMock('react-router', async () => {
            const mod =
                await vi.importActual<typeof import('react-router')>(
                    'react-router'
                );
            return { ...mod, useNavigate: () => navigateSpy };
        });
        const { EditRole: EditRoleWithNav } = await import('./EditRole');
        const user = userEvent.setup();
        render(
            <TestRoot>
                <MemoryRouter initialEntries={['/roles/1']}>
                    <Routes>
                        <Route
                            path="/roles/:roleId"
                            element={<EditRoleWithNav />}
                        />
                    </Routes>
                </MemoryRouter>
            </TestRoot>
        );
        await user.click(screen.getByTestId('cancel-button'));
        expect(screen.getByTestId('confirm-modal-title')).toHaveTextContent(
            'Cancel Editing'
        );
        await user.click(screen.getByRole('button', { name: 'Yes' }));
        expect(navigateSpy).toHaveBeenCalledWith(-1);

        // Open again and close via cancel label
        await user.click(screen.getByTestId('cancel-button'));
        await user.click(
            screen.getByRole('button', { name: 'No, Take me back' })
        );
        expect(
            screen.queryByTestId('edit-role-cancel-modal')
        ).not.toBeInTheDocument();
    });

    it('delete cancel closes modal; confirm calls mutation and navigates back', async () => {
        vi.resetModules();
        const navigateSpy = vi.fn();
        const deleteSpy = vi.fn().mockResolvedValue(undefined);
        vi.doMock('react-router', async () => {
            const mod =
                await vi.importActual<typeof import('react-router')>(
                    'react-router'
                );
            return { ...mod, useNavigate: () => navigateSpy };
        });
        vi.doMock('../../../../api/queries/rolesQuery', () => ({
            useRoleQuery: () => ({
                role: {
                    role: {
                        id: '1',
                        name: 'R',
                        description: 'D',
                        isDefault: false,
                    },
                    roleRelations: [PermissionValues.ROLE_MANAGER],
                    members: [],
                },
                isRoleLoading: false,
            }),
        }));
        vi.doMock('../../../../api/mutations/rolesMutation', () => ({
            useDeleteRoleMutation: () => ({
                deleteRole: deleteSpy,
                isRoleDeleting: false,
            }),
            useUpdateRoleMutation: () => ({
                updateRole: vi.fn(),
                isRoleUpdating: false,
            }),
            useUpdateRoleRelationsMutation: () => ({
                updateRoleRelations: vi.fn(),
                isRoleRelationsUpdating: false,
            }),
        }));
        const { EditRole: EditRoleWithDelete } = await import('./EditRole');
        const user = userEvent.setup();
        render(
            <TestRoot>
                <MemoryRouter initialEntries={['/roles/1']}>
                    <Routes>
                        <Route
                            path="/roles/:roleId"
                            element={<EditRoleWithDelete />}
                        />
                    </Routes>
                </MemoryRouter>
            </TestRoot>
        );
        // Open and cancel
        fireEvent.click(screen.getByTestId('delete-role-button'));
        expect(screen.getByTestId('confirm-modal-title')).toHaveTextContent(
            'Delete Role'
        );
        await user.click(
            screen.getByRole('button', { name: 'No, Take me back' })
        );
        expect(
            screen.queryByTestId('edit-role-delete-modal')
        ).not.toBeInTheDocument();
        // Open and confirm
        fireEvent.click(screen.getByTestId('delete-role-button'));
        await user.click(screen.getByRole('button', { name: 'Yes' }));
        expect(deleteSpy).toHaveBeenCalled();
        expect(navigateSpy).toHaveBeenCalledWith(-1);
    });
});
