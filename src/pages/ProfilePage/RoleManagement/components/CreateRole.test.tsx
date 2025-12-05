import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import { CreateRole } from './CreateRole';
import RoleForm from './RoleForm';
import * as rolesMutation from '../../../../api/mutations/rolesMutation';
import * as reactRouter from 'react-router';
import * as RoleFormModule from './RoleForm';
import { ComponentProps } from 'react';

vi.mock('@auth0/auth0-react', () => ({
    useAuth0: () => ({ user: { 'custom:jupiter-tenant-id': 't1' } }),
}));

vi.spyOn(rolesMutation, 'useCreateRoleMutation').mockReturnValue({
    createRole: vi.fn().mockResolvedValue({ role: { role: { id: '9' } } }),
    isRoleCreating: false,
} as unknown as ReturnType<typeof rolesMutation.useCreateRoleMutation>);

vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(vi.fn());

vi.spyOn(RoleFormModule, 'default').mockImplementation(
    ({ onFormValidationChange }: ComponentProps<typeof RoleForm>) => {
        onFormValidationChange(true);
        return <div data-testid="role-form" />;
    }
);

describe('CreateRole', () => {
    it('renders header and form; triggers save and cancel modal', async () => {
        const user = userEvent.setup();
        render(
            <MemoryRouter>
                <CreateRole />
            </MemoryRouter>
        );
        expect(screen.getByText('Create New Role')).toBeInTheDocument();
        // Cancel opens modal
        await user.click(screen.getByTestId('cancel-button'));
        expect(screen.getByTestId('confirm-modal-title')).toHaveTextContent(
            'Cancel Role'
        );
        // Save triggers create
        await user.click(screen.getByTestId('save-button'));
    });
});
