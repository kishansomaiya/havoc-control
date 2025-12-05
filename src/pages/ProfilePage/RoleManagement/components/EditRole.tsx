import { Box } from '@mui/material';
import styles from '../../ProfilePage.module.css';
import { useNavigate, useParams } from 'react-router';
import { FormikProvider, useFormik } from 'formik';
import { useCallback, useMemo, useState } from 'react';
import RoleForm from './RoleForm';
import { ConfirmModal } from '../../../../components/ConfirmModal/ConfirmModal';
import { RoleHeader } from './RoleHeader';
import { useRoleQuery } from '../../../../api/queries/rolesQuery';
import {
    useDeleteRoleMutation,
    useUpdateRoleMutation,
    useUpdateRoleRelationsMutation,
} from '../../../../api/mutations/rolesMutation';
import { roleFormSchema } from './schema/roleFormSchema';
import { LoadingSpinner } from '../../../../components/LoadingSpinner/LoadingSpinner';
import { ROUTES } from '../../../../const';
import {
    PermissionLabels,
    PermissionValues,
} from '../../../../types/rolePermissions';

export const EditRole = () => {
    const navigate = useNavigate();
    const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
    const [isSaveModalOpen, setIsSaveModalOpen] = useState<boolean>(false);
    const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpen] =
        useState<boolean>(false);
    const [isEditRoleFormValid, setIsEditRoleFormValid] =
        useState<boolean>(false);
    const [isSaving, setIsSaving] = useState<boolean>(false);

    const { roleId } = useParams<{ roleId: string }>();

    const { deleteRole, isRoleDeleting } = useDeleteRoleMutation();

    const { role, isRoleLoading } = useRoleQuery(roleId);
    const { updateRole, isRoleUpdating } = useUpdateRoleMutation();
    const { updateRoleRelations, isRoleRelationsUpdating } =
        useUpdateRoleRelationsMutation();

    const initialRelations = useMemo(() => role?.roleRelations || [], [role]);

    // Map API response to rolePermissions structure
    const mapPermissionsToRolePermissions = useCallback(() => {
        const apiPermissions = role?.roleRelations || []; // API response permissions
        const rolePermissions = [
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
                selectedPermission: apiPermissions.includes(
                    PermissionValues.ROLE_MANAGER
                )
                    ? PermissionValues.ROLE_MANAGER
                    : PermissionValues.NO_ACCESS,
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
                selectedPermission: apiPermissions.includes(
                    PermissionValues.OBJECT_ADMINISTRATOR
                )
                    ? PermissionValues.OBJECT_ADMINISTRATOR
                    : PermissionValues.NO_ACCESS,
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
                selectedPermission: apiPermissions.includes(
                    PermissionValues.OBJECT_MANAGER
                )
                    ? PermissionValues.OBJECT_MANAGER
                    : apiPermissions.includes(PermissionValues.OBJECT_READER)
                      ? PermissionValues.OBJECT_READER
                      : PermissionValues.NO_ACCESS,
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
                selectedPermission: apiPermissions.includes(
                    PermissionValues.OBJECT_SHARER
                )
                    ? PermissionValues.OBJECT_SHARER
                    : PermissionValues.NO_ACCESS,
                rolePolicyDescription:
                    'Permission that allows a user to share their portfolio as view-only with other users within their organization.',
            },
        ];
        return rolePermissions;
    }, [role]);

    const initialFormValues = useMemo(
        () => ({
            roleName: role?.role.name || '',
            roleDescription: role?.role.description || '',
            rolePermissions: mapPermissionsToRolePermissions(),
            setAsDefaultRole: role?.role.isDefault || false,
        }),
        [role, mapPermissionsToRolePermissions]
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

    const isRoleDescriptionChanged =
        role?.role.description !== formik.values.roleDescription;

    const isRolePermissionsChanged =
        JSON.stringify(
            formik.values.rolePermissions
                .map((permission) => permission.selectedPermission)
                .filter(
                    (permission) => permission !== PermissionValues.NO_ACCESS
                )
                .sort()
        ) !== JSON.stringify(role?.roleRelations?.sort());

    const isSetAsDefaultRoleChanged =
        !!role?.role.isDefault !== formik.values.setAsDefaultRole;

    const calculateRelationsChanges = useCallback(() => {
        const updatedRelations = formik.values.rolePermissions
            .filter(
                (permission) =>
                    permission.selectedPermission !== PermissionValues.NO_ACCESS
            )
            .map((permission) => permission.selectedPermission);

        const addRelations = updatedRelations.filter(
            (relation) => !initialRelations.includes(relation)
        );
        const removeRelations = initialRelations.filter(
            (relation) =>
                !updatedRelations.includes(relation as PermissionValues)
        );

        return { addRelations, removeRelations };
    }, [formik.values.rolePermissions, initialRelations]);

    const handleCancel = useCallback(() => {
        setIsCancelModalOpen(true);
    }, []);

    const handleSave = useCallback(() => {
        setIsSaveModalOpen(true);
    }, []);

    const handleDeleteRole = useCallback(async () => {
        setIsDeleteRoleModalOpen(true);
    }, []);

    const handleCancelConfirm = useCallback(async () => {
        setIsCancelModalOpen(false);
        navigate(-1);
    }, []);

    const handleGoBackToCreatingRole = useCallback(() => {
        setIsCancelModalOpen(false);
    }, []);

    const handleSaveConfirm = useCallback(async () => {
        setIsSaving(true);

        try {
            // Collect updates for the role
            const roleUpdates: Record<string, any> = {};
            if (isRoleDescriptionChanged) {
                roleUpdates.description = formik.values.roleDescription;
            }
            if (isSetAsDefaultRoleChanged) {
                roleUpdates.isDefault = formik.values.setAsDefaultRole;
            }

            // Update role if needed
            if (Object.keys(roleUpdates).length > 0) {
                await updateRole({
                    id: role?.role.id as string,
                    updatedDescription: roleUpdates,
                });
            }

            // Update role relations if needed
            if (isRolePermissionsChanged) {
                const { addRelations, removeRelations } =
                    calculateRelationsChanges();
                await updateRoleRelations({
                    id: role?.role.id as string,
                    updateRoleRelationsInputBody: {
                        addRelations: new Set(addRelations),
                        removeRelations: new Set(removeRelations),
                    },
                });
            }

            setIsSaveModalOpen(false);
            navigate(
                `${ROUTES.PROFILE_PAGE}/${ROUTES.PROFILE_TABS.ROLE_MANAGEMENT}`
            );
        } catch (error) {
            console.error('Error saving role:', error);
        } finally {
            setIsSaving(false);
        }
    }, [
        navigate,
        formik,
        isRoleDescriptionChanged,
        isRolePermissionsChanged,
        isSetAsDefaultRoleChanged,
        calculateRelationsChanges,
        updateRole,
        updateRoleRelations,
        role,
    ]);

    const handleSaveCancel = useCallback(() => {
        setIsSaveModalOpen(false);
    }, []);

    const handleDeleteRoleConfirm = useCallback(async () => {
        await deleteRole(role?.role.id as string);
        setIsDeleteRoleModalOpen(false);
        navigate(-1);
    }, [role, deleteRole, navigate]);

    const handleDeleteRoleCancel = useCallback(() => {
        setIsDeleteRoleModalOpen(false);
    }, []);

    if (isRoleLoading && !isSaving) {
        return <LoadingSpinner loading={isRoleLoading} />;
    }

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
                    title="Edit Role"
                    buttons={[
                        {
                            label: 'Cancel',
                            variant: 'outlined',
                            testId: 'cancel-button',
                            onClick: handleCancel,
                        },
                        {
                            label: 'Delete Role',
                            variant: 'outlined',
                            testId: 'delete-role-button',
                            btnStyles: {
                                textWrap: 'nowrap',
                            },
                            onClick: handleDeleteRole,
                            disabled: role?.role.isDefault,
                            tooltip: role?.role.isDefault
                                ? 'You cannot delete a default role. To delete this role first set another role as default'
                                : undefined,
                        },
                        {
                            label: 'Save',
                            variant: 'contained',
                            testId: 'save-button',
                            onClick: handleSave,
                            color: 'secondary',
                            disabled:
                                !(
                                    isRoleDescriptionChanged ||
                                    isRolePermissionsChanged ||
                                    isSetAsDefaultRoleChanged
                                ) ||
                                isRoleUpdating ||
                                isRoleRelationsUpdating ||
                                !isEditRoleFormValid,
                        },
                    ]}
                />

                <RoleForm
                    onFormValidationChange={setIsEditRoleFormValid}
                    isDefaultRole={!!role?.role.isDefault}
                />

                {isCancelModalOpen && (
                    <ConfirmModal
                        title="Cancel Editing"
                        message="Are you sure you want to cancel editing this role? This will discard any changes you have made."
                        onConfirm={handleCancelConfirm}
                        onCancel={handleGoBackToCreatingRole}
                        confirmLabel="Yes"
                        cancelLabel="No, Take me back"
                        data-testid="edit-role-cancel-modal"
                    />
                )}

                {isSaveModalOpen && (
                    <ConfirmModal
                        title="Overwrite Existing Permissions"
                        message="Saving these changes will overwrite existing role permissions. Are you sure you want to continue?"
                        onConfirm={handleSaveConfirm}
                        onCancel={handleSaveCancel}
                        confirmLabel="Yes"
                        cancelLabel="No, Take me back"
                        isLoading={isSaving}
                        isDisabled={isSaving}
                        data-testid="edit-role-save-modal"
                    />
                )}

                {isDeleteRoleModalOpen && (
                    <ConfirmModal
                        title="Delete Role"
                        message="Are you sure you want to delete this role? This action cannot be undone. (Note: If there are any users currently associated to this role, they will move to an “unassigned” state until they are assigned to another role.)"
                        onConfirm={handleDeleteRoleConfirm}
                        onCancel={handleDeleteRoleCancel}
                        confirmLabel="Yes"
                        cancelLabel="No, Take me back"
                        isLoading={isRoleDeleting}
                        isDisabled={isRoleDeleting}
                        data-testid="edit-role-delete-modal"
                    />
                )}
            </Box>
        </FormikProvider>
    );
};
