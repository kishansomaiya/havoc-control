import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import { Formik } from 'formik';
import RoleForm from './RoleForm';
import { Policy } from './CreateRole';

const defaultPolicies: Policy[] = [
    {
        id: 1,
        title: 'Role Management',
        permissions: [
            { id: 1, label: 'Manager', value: 'role_manager' },
            { id: 2, label: 'No Access', value: 'no_access' },
        ],
        selectedPermission: 'no_access',
    },
];

describe('RoleForm', () => {
    it('renders fields and toggles permission', async () => {
        const user = userEvent.setup();
        render(
            <Formik
                initialValues={{
                    roleName: '',
                    roleDescription: '',
                    rolePermissions: defaultPolicies,
                    setAsDefaultRole: false,
                }}
                onSubmit={() => {}}
            >
                <RoleForm
                    onFormValidationChange={() => {}}
                    isEditable
                    isDefaultRole={false}
                />
            </Formik>
        );
        expect(screen.getByText('ROLE NAME')).toBeInTheDocument();
        expect(screen.getByText('ROLE DESCRIPTION')).toBeInTheDocument();
        expect(screen.getByText('Role Management')).toBeInTheDocument();
        // Toggle accordion by clicking title area
        await user.click(screen.getByText('Role Management'));
        // Change permission to Manager
        await user.click(screen.getByLabelText('Manager'));
        // Toggle default role checkbox via label
        await user.click(screen.getByText('Set as Default Role'));
    });

    it('disables name input when not editable and prevents default role toggle when isDefaultRole', async () => {
        const user = userEvent.setup();
        render(
            <Formik
                initialValues={{
                    roleName: 'X',
                    roleDescription: 'D',
                    rolePermissions: defaultPolicies,
                    setAsDefaultRole: true,
                }}
                onSubmit={() => {}}
            >
                <RoleForm
                    onFormValidationChange={() => {}}
                    isEditable={false}
                    isDefaultRole
                />
            </Formik>
        );
        const nameInput = screen.getByDisplayValue('X') as HTMLInputElement;
        expect(nameInput).toBeDisabled();
        // Clicking label should not toggle when isDefaultRole=true
        await user.click(screen.getByText('Set as Default Role'));
        expect((screen.getByRole('checkbox') as HTMLInputElement).checked).toBe(
            true
        );
    });
});
