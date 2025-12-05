import { Box } from '@mui/material';
import styles from '../../ProfilePage.module.css';
import { useCallback, useMemo, useState } from 'react';
import { FormikProvider, useFormik } from 'formik';
import RoleForm from './RoleForm';
import { ConfirmModal } from '../../../../components/ConfirmModal/ConfirmModal';
import { useNavigate } from 'react-router';
import { RoleHeader } from './RoleHeader';
import { useCreateRoleMutation } from '../../../../api/mutations/rolesMutation';
import { roleFormSchema } from './schema/roleFormSchema';
import { useAuth0 } from '@auth0/auth0-react';
import {
    PermissionLabels,
    PermissionValues,
} from '../../../../types/rolePermissions';
import { ROUTES } from '../../../../const';

interface Permission {
    id: number;
    label: string;
    value: string;
}

export interface Policy {
    id: number;
    title: string;
    permissions: Permission[];
    selectedPermission: string;
    rolePolicyDescription?: string;
}

const defaultRolePolicies: Policy[] = [
    {
        id: 1,
        title: 'Role Management',
        permissions: [
            {
                id: 1,
                label: PermissionLabels.ROLE_MANAGER,
                value: PermissionValues.ROLE_MANAGER,
            },
            {
                id: 2,
                label: PermissionLabels.NO_ACCESS,
                value: PermissionValues.NO_ACCESS,
            },
        ],
        selectedPermission: PermissionValues.NO_ACCESS,
        rolePolicyDescription:
            'Permission that allows users to create, update (including add and remove users to and from), and delete Roles within an organization.',
    },
    {
        id: 2,
        title: 'Portfolio Management',
        permissions: [
            {
                id: 1,
                label: PermissionLabels.ADMINISTRATOR,
                value: PermissionValues.OBJECT_ADMINISTRATOR,
            },
            {
                id: 2,
                label: PermissionLabels.NO_ACCESS,
                value: PermissionValues.NO_ACCESS,
            },
        ],
        selectedPermission: PermissionValues.NO_ACCESS,
        rolePolicyDescription:
            'Permission that enables sharing, “unsharing” and deleting portfolios a user does not own.',
    },
    {
        id: 3,
        title: 'Portfolio Creation',
        permissions: [
            {
                id: 1,
                label: PermissionLabels.CREATOR,
                value: PermissionValues.OBJECT_MANAGER,
            },
            {
                id: 2,
                label: PermissionLabels.READ_ONLY,
                value: PermissionValues.OBJECT_READER,
            },
            {
                id: 3,
                label: PermissionLabels.NO_ACCESS,
                value: PermissionValues.NO_ACCESS,
            },
        ],
        selectedPermission: PermissionValues.NO_ACCESS,
        rolePolicyDescription:
            'Permission that allows users to upload portfolios and modify analysis within portfolios that they own.',
    },
    {
        id: 4,
        title: 'Portfolio Sharing',
        permissions: [
            {
                id: 1,
                label: PermissionLabels.SHARER,
                value: PermissionValues.OBJECT_SHARER,
            },
            // { id: 2, label: 'Standard', value: 'object_sharer' },
            {
                id: 3,
                label: PermissionLabels.NO_ACCESS,
                value: PermissionValues.NO_ACCESS,
            },
        ],
        selectedPermission: PermissionValues.NO_ACCESS,
        rolePolicyDescription:
            'Permission that allows a user to share their portfolio as view-only with other users within their organization.',
    },
];

export const CreateRole = () => {
    const navigate = useNavigate();
    const { user } = useAuth0();
    const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
    const [isEditRoleFormValid, setIsEditRoleFormValid] =
        useState<boolean>(false);
    const { createRole, isRoleCreating } = useCreateRoleMutation();

    const initialFormValues = useMemo(
        () => ({
            roleName: '',
            roleDescription: '',
            rolePermissions: defaultRolePolicies,
            setAsDefaultRole: false,
        }),
        []
    );

    const formik = useFormik({
        initialValues: initialFormValues,
        onSubmit: () => {},
        enableReinitialize: true,
        validationSchema: roleFormSchema,
        validateOnChange: true,
        validateOnBlur: true,
        validateOnMount: true,
    });

    const handleSubmit = useCallback(async () => {
        const response = await createRole({
            enteredRole: {
                name: formik.values.roleName,
                description: formik.values.roleDescription,
                relations: new Set(
                    formik.values.rolePermissions
                        .map((policy) => policy.selectedPermission)
                        .filter(
                            (permission) =>
                                permission !== PermissionValues.NO_ACCESS
                        )
                ),
                members: new Set(),
                isDefault: formik.values.setAsDefaultRole,
                tenantId: user?.['custom:jupiter-tenant-id'],
            },
        });
        if (response) {
            navigate(
                ROUTES.PROFILE_ROLE_EDIT_USERS_PAGE.replace(
                    ':roleId',
                    response.role.role.id.toString()
                )
            );
        }
    }, [navigate, createRole, formik, user]);

    const handleCancel = useCallback(() => {
        setIsCancelModalOpen(true);
    }, []);

    const handleCancelConfirm = useCallback(async () => {
        navigate(-1);
        setIsCancelModalOpen(false);
    }, []);

    const handleGoBackToCreatingRole = useCallback(() => {
        setIsCancelModalOpen(false);
    }, []);

    return (
        <FormikProvider value={formik}>
            <Box
                className={styles.scroll}
                display="flex"
                flexDirection="column"
                alignItems="center"
                py={7.5}
                px={12}
                sx={{ height: '100%' }}
            >
                <RoleHeader
                    title="Create New Role"
                    buttons={[
                        {
                            label: 'Cancel',
                            variant: 'outlined',
                            testId: 'cancel-button',
                            onClick: handleCancel,
                        },
                        {
                            label: 'Save',
                            variant: 'contained',
                            testId: 'save-button',
                            onClick: handleSubmit,
                            color: 'secondary',
                            disabled: !isEditRoleFormValid,
                            isLoading: isRoleCreating,
                        },
                    ]}
                />

                <RoleForm
                    onFormValidationChange={setIsEditRoleFormValid}
                    isEditable
                />

                {isCancelModalOpen && (
                    <ConfirmModal
                        title="Cancel Role"
                        message="Are you sure you want to cancel creating this role? This will discard any changes you have made."
                        onConfirm={handleCancelConfirm}
                        onCancel={handleGoBackToCreatingRole}
                        confirmLabel="Yes"
                        cancelLabel="No, Take me back"
                        data-testid="create-role-cancel-modal"
                    />
                )}
            </Box>
        </FormikProvider>
    );
};
