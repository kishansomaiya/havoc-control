import {
    ComponentProps,
    MouseEvent,
    FC,
    useCallback,
    useState,
    useMemo,
} from 'react';
import { StyledCard } from '../../../../components/StyledCard/StyledCard';
import { Box, Chip, Menu, MenuItem, Typography, useTheme } from '@mui/material';
import * as Icon from 'react-feather';
import { highlightsMatches } from '../../../../utils';
import { getUserCountLabel } from '../../../../utils/Role.util';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../../const';
import { Role } from '../../../../api/openapi/auto-generated-admin';
import {
    useDeleteRoleMutation,
    useUpdateRoleMutation,
} from '../../../../api/mutations/rolesMutation';
import { ConfirmModal } from '../../../../components/ConfirmModal/ConfirmModal';

interface RoleItemProps extends ComponentProps<'div'> {
    roleData: Role;
    userCount?: number;
    // onRoleSelect: (role: UserRole) => void;
    // onRoleDelete: () => void;
    // isSelected: boolean;
    searchText?: string;
    onRoleDelete: () => Promise<void>;
}

export const RoleItem: FC<RoleItemProps> = ({
    roleData,
    userCount,
    searchText,
    onRoleDelete,
}) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const [menuAnchorEl, setMenuAnchorEl] = useState<null | SVGElement>(null);
    const [isDeleteRoleModalOpen, setIsDeleteRoleModalOpen] =
        useState<boolean>(false);
    const isMenuOpen = useMemo(() => Boolean(menuAnchorEl), [menuAnchorEl]);

    const { updateRole } = useUpdateRoleMutation();
    const { deleteRole, isRoleDeleting } = useDeleteRoleMutation();

    const handleOpenMenu = useCallback((event: MouseEvent<SVGElement>) => {
        setMenuAnchorEl(event.currentTarget);
    }, []);

    const handleCloseMenu = useCallback(() => {
        setMenuAnchorEl(null);
    }, []);

    const handleEditRole = useCallback(() => {
        navigate(
            ROUTES.PROFILE_ROLE_EDIT_PAGE.replace(
                ':roleId',
                roleData.id.toString()
            )
        );
    }, [navigate, roleData]);

    const handleEditRoleUsers = useCallback(() => {
        navigate(
            ROUTES.PROFILE_ROLE_EDIT_USERS_PAGE.replace(
                ':roleId',
                roleData.id.toString()
            )
        );
    }, [navigate, roleData]);

    const handleMakeDefaultRole = useCallback(async () => {
        await updateRole({
            id: roleData.id as string,
            updatedDescription: {
                isDefault: true,
            },
        });
        setMenuAnchorEl(null);
    }, [updateRole, roleData]);

    const handleDeleteRole = useCallback(async () => {
        setIsDeleteRoleModalOpen(true);
    }, []);

    const handleDeleteRoleConfirm = useCallback(async () => {
        await deleteRole(roleData.id);
        await onRoleDelete();
        setIsDeleteRoleModalOpen(false);
        setMenuAnchorEl(null);
    }, [roleData, deleteRole, onRoleDelete]);

    const handleDeleteRoleCancel = useCallback(() => {
        setIsDeleteRoleModalOpen(false);
    }, []);

    return (
        <StyledCard
            // handleClick={handleClick}
            // isSelected={isSelected}
            // isDisabled={isDisabled}
            style={{
                minHeight: '4.3125rem',
            }}
            data-testid="role-item"
        >
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="center"
                alignItems="flex-start"
                gap={0.5}
                alignSelf="stretch"
                flex={1}
                data-testid="role-item-info"
            >
                <Typography
                    variant="h4"
                    data-testid="role-item-name"
                >
                    {highlightsMatches(
                        roleData.name,
                        searchText,
                        theme.palette.secondary.main
                    )}
                </Typography>
                <Typography
                    variant="body2"
                    color={'text.secondary'}
                    data-testid="role-item-description"
                >
                    {roleData.description}
                </Typography>
            </Box>
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                gap={1.5}
            >
                {roleData.isDefault && (
                    <Chip
                        label="Default Role"
                        sx={{
                            height: theme.spacing(2.25),
                        }}
                    />
                )}
                <Typography
                    variant="body2"
                    color={'text.secondary'}
                    data-testid="role-item-user-count"
                >
                    {getUserCountLabel(userCount)}
                </Typography>
                <Icon.MoreVertical
                    size="1.25rem"
                    onClick={handleOpenMenu}
                    data-testid="role-item-menu-icon"
                />
                <Menu
                    id="basic-menu"
                    anchorEl={menuAnchorEl}
                    open={isMenuOpen}
                    onClose={handleCloseMenu}
                    data-testid="role-item-menu"
                >
                    <MenuItem
                        onClick={handleEditRole}
                        data-testid="view-edit-role-item"
                    >
                        View / Edit Role
                    </MenuItem>
                    <MenuItem
                        onClick={handleEditRoleUsers}
                        data-testid="view-edit-users-item"
                    >
                        View / Edit Users
                    </MenuItem>
                    <MenuItem
                        onClick={handleMakeDefaultRole}
                        data-testid="make-default-role-item"
                        disabled={roleData.isDefault}
                    >
                        Set as Default Role
                    </MenuItem>
                    <MenuItem
                        onClick={handleDeleteRole}
                        data-testid="delete-role-item"
                        disabled={roleData.isDefault}
                    >
                        Delete
                    </MenuItem>
                </Menu>
            </Box>

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
        </StyledCard>
    );
};
