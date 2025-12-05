import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { RoleItem } from './RoleItem';
import { Role } from '../../../../api/openapi/auto-generated-admin';
import { StyledCard } from '../../../../components/StyledCard/StyledCard';
import * as StyledCardModule from '../../../../components/StyledCard/StyledCard';
import { ComponentProps } from 'react';
import * as rolesMutation from '../../../../api/mutations/rolesMutation';
import * as reactRouter from 'react-router';

vi.spyOn(StyledCardModule, 'StyledCard').mockImplementation(
    ({ children }: ComponentProps<typeof StyledCard>) => <div>{children}</div>
);

vi.spyOn(rolesMutation, 'useUpdateRoleMutation').mockReturnValue({
    updateRole: vi.fn(),
} as unknown as ReturnType<typeof rolesMutation.useUpdateRoleMutation>);
vi.spyOn(rolesMutation, 'useDeleteRoleMutation').mockReturnValue({
    deleteRole: vi.fn(),
    isRoleDeleting: false,
} as unknown as ReturnType<typeof rolesMutation.useDeleteRoleMutation>);

vi.spyOn(reactRouter, 'useNavigate').mockReturnValue(vi.fn());

describe('RoleItem', () => {
    const baseRole: Role = {
        id: '1',
        name: 'Analyst',
        description: 'desc',
        isDefault: false,
    } as Role;

    it('renders role info and opens menu', async () => {
        const user = userEvent.setup();
        render(
            <RoleItem
                roleData={baseRole}
                userCount={3}
                onRoleDelete={vi.fn()}
            />
        );
        expect(screen.getByTestId('role-item-name')).toHaveTextContent(
            'Analyst'
        );
        // open menu
        await user.click(screen.getByTestId('role-item-menu-icon'));
        expect(screen.getByTestId('role-item-menu')).toBeInTheDocument();
    });

    it('disables default role actions and shows chip', async () => {
        const user = userEvent.setup();
        const defaultRole = { ...baseRole, isDefault: true } as Role;
        render(
            <RoleItem
                roleData={defaultRole}
                userCount={0}
                onRoleDelete={vi.fn()}
            />
        );
        await user.click(screen.getByTestId('role-item-menu-icon'));
        // last two menu items should be disabled when default
        expect(screen.getByTestId('make-default-role-item')).toHaveAttribute(
            'aria-disabled',
            'true'
        );
        expect(screen.getByTestId('delete-role-item')).toHaveAttribute(
            'aria-disabled',
            'true'
        );
    });
});
