import {
    Box,
    Typography,
    Checkbox,
    InputAdornment,
    OutlinedInput,
    IconButton,
    Button,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
} from '@mui/material';
import styles from '../../ProfilePage.module.css';
import { useNavigate, useParams } from 'react-router';
import { useEffect, useState, useCallback, useMemo } from 'react';
import * as Icon from 'react-feather';
import { ConfirmModal } from '../../../../components/ConfirmModal/ConfirmModal';
import { useUsersQuery } from '../../../../api/queries/usersQuery';
import {
    useRoleQuery,
    useRolesQuery,
} from '../../../../api/queries/rolesQuery';
import { Role } from '../../../../api/openapi/auto-generated-admin';
import { LoadingButton } from '@mui/lab';
import { useUpdateRoleRelationsMutation } from '../../../../api/mutations/rolesMutation';
import { LoadingSpinner } from '../../../../components/LoadingSpinner/LoadingSpinner';
import {
    MAX_LIST_API_LIMIT,
    ROUTES,
    STD_LIST_API_LIMIT,
} from '../../../../const';
import { IUser } from '../../../../types/user';
import { useAuth0 } from '@auth0/auth0-react';
import { Auth0User } from '../../../../types';

export const EditRoleUsers = () => {
    const navigate = useNavigate();
    const { user } = useAuth0();
    const { roleId } = useParams<{ roleId: string }>();
    const tenantId = (user as Auth0User)['custom:jupiter-tenant-id'] ?? '';
    const [isCancelModalOpen, setIsCancelModalOpen] = useState<boolean>(false);
    const [userRole, setUserRole] = useState<Role>();

    const [availableUsers, setAvailableUsers] = useState<IUser[]>([]);
    const [usersInRole, setUsersInRole] = useState<IUser[]>([]);

    const [allAvailableSelected, setAllAvailableSelected] = useState(false);
    const [allRoleSelected, setAllRoleSelected] = useState(false);

    // Search states
    const [availableSearch, setAvailableSearch] = useState('');
    const [roleSearch, setRoleSearch] = useState('');

    const [initialUsersInRole, setInitialUsersInRole] = useState<IUser[]>([]);
    const [hasChanges, setHasChanges] = useState(false);

    const { role, isRoleLoading } = useRoleQuery(roleId);
    const { users, isUsersLoading } = useUsersQuery({
        pageSize: MAX_LIST_API_LIMIT,
        tenantId: user?.['custom:jupiter-tenant-id'],
    });
    const { roles } = useRolesQuery({
        pageSize: STD_LIST_API_LIMIT,
        tenantId: tenantId,
    });
    const { updateRoleRelations, isRoleRelationsUpdating } =
        useUpdateRoleRelationsMutation();

    useEffect(() => {
        setUserRole(role?.role);
    }, [role]);

    const categorizedUsers = useMemo(() => {
        if (!users || !roles) return { usersInRole: [], usersNotInRole: [] };

        const assignedUserIds = new Set<string>();

        // Collect all user IDs assigned to other roles
        roles?.forEach((roleItem) => {
            if (roleItem.role.id !== roleId) {
                roleItem.members?.forEach((memberId) => {
                    assignedUserIds.add(memberId);
                });
            }
        });

        // Here we are categorizing users in a single reduce operation
        return users.reduce(
            (acc, user) => {
                const isInCurrentRole = role?.members?.includes(
                    user.id as string
                );
                const isAssignedToOtherRole =
                    !isInCurrentRole && assignedUserIds.has(user.id as string);

                const modifiedUser: IUser = {
                    ...user,
                    selected: false,
                    disabled: isAssignedToOtherRole, // Disable if assigned to another role
                };

                if (isInCurrentRole) {
                    acc.usersInRole.push(modifiedUser);
                } else {
                    acc.usersNotInRole.push(modifiedUser);
                }

                return acc;
            },
            {
                usersInRole: [] as IUser[],
                usersNotInRole: [] as IUser[],
            }
        );
    }, [users, roles, role, roleId]);

    useEffect(() => {
        const { usersInRole, usersNotInRole } = categorizedUsers;

        // Sort usersNotInRole to move disabled users to the end
        const sortedUsersNotInRole = usersNotInRole.sort(
            (a, b) => Number(a.disabled) - Number(b.disabled)
        );

        setAvailableUsers(sortedUsersNotInRole || []);
        setUsersInRole(usersInRole || []);
        setInitialUsersInRole(usersInRole || []);
    }, [categorizedUsers]);

    useEffect(() => {
        const addedUsers = usersInRole.filter(
            (user) =>
                !initialUsersInRole.some(
                    (initialUser) => initialUser.id === user.id
                )
        );
        const removedUsers = initialUsersInRole.filter(
            (initialUser) =>
                !usersInRole.some((user) => user.id === initialUser.id)
        );

        setHasChanges(addedUsers.length > 0 || removedUsers.length > 0);
    }, [usersInRole, initialUsersInRole]);

    const addMembers = usersInRole
        .filter(
            (user) =>
                !initialUsersInRole.some(
                    (initialUser) => initialUser.id === user.id
                )
        )
        .map((user) => user.id) as string[];

    const removeMembers = initialUsersInRole
        .filter(
            (initialUser) =>
                !usersInRole.some((user) => user.id === initialUser.id)
        )
        .map((user) => user.id) as string[];

    const handleCancel = useCallback(() => {
        setIsCancelModalOpen(true);
    }, []);

    const handleCancelConfirm = useCallback(async () => {
        navigate(
            `${ROUTES.PROFILE_PAGE}/${ROUTES.PROFILE_TABS.ROLE_MANAGEMENT}`
        );
        setIsCancelModalOpen(false);
    }, [navigate]);

    const handleGoBackToEditingRoleUsers = useCallback(() => {
        setIsCancelModalOpen(false);
    }, []);

    // Filter available users based on search
    const filteredAvailableUsers = availableUsers.filter(
        (user) =>
            user?.firstName
                ?.toLowerCase()
                .includes(availableSearch.toLowerCase()) ||
            user?.emailAddress
                ?.toLowerCase()
                .includes(availableSearch.toLowerCase())
    );

    // Filter role users based on search
    const filteredRoleUsers = usersInRole.filter(
        (user) =>
            user?.firstName?.toLowerCase().includes(roleSearch.toLowerCase()) ||
            user?.emailAddress?.toLowerCase().includes(roleSearch.toLowerCase())
    );

    const selectAllAvailableUsersDisabled = useMemo(() => {
        return (
            filteredAvailableUsers.length === 0 ||
            filteredAvailableUsers.every((user) => user.disabled)
        );
    }, [filteredAvailableUsers]);

    // Handle checkbox selection for available users
    const handleAvailableUserSelect = useCallback((userId: string) => {
        setAvailableUsers((prev) =>
            prev.map((user) =>
                user.id === userId
                    ? { ...user, selected: !user.selected }
                    : user
            )
        );
    }, []);

    // Handle checkbox selection for role users
    const handleRoleUserSelect = useCallback((userId: string) => {
        setUsersInRole((prev) =>
            prev.map((user) =>
                user.id === userId
                    ? { ...user, selected: !user.selected }
                    : user
            )
        );
    }, []);

    // Handle "Select All" for available users
    const handleSelectAllAvailable = useCallback(() => {
        if (selectAllAvailableUsersDisabled) {
            return;
        }
        const newSelectAllState = !allAvailableSelected;
        setAllAvailableSelected(newSelectAllState);

        // Update all filtered users to match the select all state
        setAvailableUsers((prev) =>
            prev.map((user) => {
                // Only update users that are currently visible in the filtered list and are not disabled
                if (
                    filteredAvailableUsers.some(
                        (filtered) => filtered.id === user.id
                    ) &&
                    !user.disabled
                ) {
                    return { ...user, selected: newSelectAllState };
                }
                return user;
            })
        );
    }, [
        allAvailableSelected,
        filteredAvailableUsers,
        selectAllAvailableUsersDisabled,
    ]);

    // Handle "Select All" for role users
    const handleSelectAllRole = useCallback(() => {
        if (!filteredRoleUsers.length) {
            return;
        }
        const newSelectAllState = !allRoleSelected;
        setAllRoleSelected(newSelectAllState);

        // Update all filtered users to match the select all state
        setUsersInRole((prev) =>
            prev.map((user) => {
                // Only update users that are currently visible in the filtered list
                if (
                    filteredRoleUsers.some(
                        (filtered) => filtered.id === user.id
                    )
                ) {
                    return { ...user, selected: newSelectAllState };
                }
                return user;
            })
        );
    }, [allRoleSelected, filteredRoleUsers]);

    // Move selected users from available to role
    const moveToRole = useCallback(() => {
        const selectedUsers = availableUsers.filter((user) => user.selected);
        if (selectedUsers.length === 0) return;

        // Add to role users with selected set to true (PREPEND)
        setUsersInRole((prev) => [
            ...selectedUsers.map((user) => ({ ...user, selected: true })), // Ensure selected is true
            ...prev,
        ]);

        // Remove from available users
        setAvailableUsers((prev) => prev.filter((user) => !user.selected));
    }, [availableUsers]);

    // Move selected users from role to available (PREPEND)
    const moveToAvailable = useCallback(() => {
        const selectedUsers = usersInRole.filter((user) => user.selected);
        if (selectedUsers.length === 0) return;

        // Add to available users with selected set to true (PREPEND)
        setAvailableUsers((prev) => [
            ...selectedUsers.map((user) => ({ ...user, selected: true })), // Ensure selected is true
            ...prev,
        ]);

        // Remove from role users
        setUsersInRole((prev) => prev.filter((user) => !user.selected));
    }, [usersInRole]);

    const clearAvailableSearch = useCallback(() => {
        setAvailableSearch('');
    }, []);

    const clearRoleSearch = useCallback(() => {
        setRoleSearch('');
    }, []);

    const handleSubmit = useCallback(async () => {
        await updateRoleRelations({
            id: role?.role.id as string,
            updateRoleRelationsInputBody: {
                addMembers: new Set(addMembers),
                removeMembers: new Set(removeMembers),
            },
        });
        navigate(
            `${ROUTES.PROFILE_PAGE}/${ROUTES.PROFILE_TABS.ROLE_MANAGEMENT}`
        );
    }, [
        addMembers,
        removeMembers,
        role?.role.id,
        updateRoleRelations,
        navigate,
    ]);

    // here checking if all the available users are selected
    useEffect(() => {
        if (
            filteredAvailableUsers.filter((user) => !user.disabled).length === 0
        ) {
            setAllAvailableSelected(false);
            return;
        }

        const allSelected = filteredAvailableUsers
            .filter((user) => !user.disabled)
            .every((user) => user.selected);

        if (!allSelected) {
            setAllAvailableSelected(false);
        }
    }, [filteredAvailableUsers]);

    useEffect(() => {
        if (filteredRoleUsers.length === 0) {
            setAllRoleSelected(false);
            return;
        }

        const allSelected = filteredRoleUsers.every((user) => user.selected);

        if (!allSelected) {
            setAllRoleSelected(false);
        }
    }, [filteredRoleUsers]);

    if (isRoleLoading || isUsersLoading) {
        return <LoadingSpinner loading={isRoleLoading || isUsersLoading} />;
    }

    return (
        <Box
            className={styles.scroll}
            display="flex"
            flexDirection="column"
            alignItems="start"
            flexGrow={1}
            sx={{
                height: 'calc(100vh - 70px)', // Adjust based on your header/footer height
                width: '100%',
            }}
            pt={7.5}
            pb={1.5}
            px={12}
        >
            <Box
                display="flex"
                justifyContent={'space-between'}
                width="100%"
                gap={2}
            >
                <Box>
                    <Typography
                        variant="h2"
                        sx={{
                            lineHeight: '160%',
                            letterSpacing: '0.025rem',
                        }}
                    >
                        {userRole?.name || ''}
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            lineHeight: '160%',
                            letterSpacing: '0.025rem',
                            mb: 1,
                        }}
                    >
                        Add / Edit users
                    </Typography>
                </Box>
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        mt: 2,
                        gap: 2,
                    }}
                >
                    <Button
                        variant="outlined"
                        sx={{ width: '120px' }}
                        onClick={handleCancel}
                        data-testid="cancel-role-users"
                    >
                        Cancel
                    </Button>
                    <LoadingButton
                        variant="contained"
                        color="secondary"
                        sx={{ width: '120px' }}
                        onClick={handleSubmit}
                        disabled={!hasChanges}
                        loading={isRoleRelationsUpdating}
                        data-testid="save-role-users"
                    >
                        Save
                    </LoadingButton>
                </Box>
            </Box>
            <Box
                display="flex"
                flexDirection="column"
                justifyContent="space-between"
                sx={{ height: 'calc(100% - 70px)', width: '100%' }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        // alignItems: 'stretch',
                        width: '100%',
                        overflow: 'hidden',
                        mb: 0.5,
                    }}
                >
                    {/* Left Section - Available Users */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '45%',
                            // maxHeight: 'fit-content',
                        }}
                        gap={1}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                lineHeight: '160%',
                                letterSpacing: '0.025rem',
                            }}
                        >
                            Users available to add to this role
                        </Typography>

                        <Box
                            sx={{
                                border: '1px solid #5B6368',
                                borderRadius: '0.25rem',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 3,
                                // maxHeight: 'fit-content',  // Take full height of parent
                                overflow: 'hidden',
                                flex: 1,
                            }}
                        >
                            {/* Search input */}
                            <Box>
                                <OutlinedInput
                                    fullWidth
                                    placeholder="Search for User"
                                    value={availableSearch}
                                    onChange={(e) =>
                                        setAvailableSearch(e.target.value)
                                    }
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Icon.Search size="1rem" />
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        availableSearch && (
                                            <InputAdornment position="end">
                                                <IconButton
                                                    size="small"
                                                    onClick={
                                                        clearAvailableSearch
                                                    }
                                                    edge="end"
                                                >
                                                    <Icon.X />
                                                </IconButton>
                                            </InputAdornment>
                                        )
                                    }
                                    sx={{ borderRadius: 1 }}
                                    inputProps={{
                                        'data-testid':
                                            'search-available-users-input',
                                    }}
                                />
                            </Box>

                            <ListItem
                                data-testid="select-all-available-users"
                                dense
                                onClick={handleSelectAllAvailable} // Toggle the "Select All" checkbox on click
                                sx={{
                                    '&:hover': {
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.08)',
                                    },
                                    cursor: 'pointer',
                                    ...(selectAllAvailableUsersDisabled
                                        ? {
                                              cursor: 'not-allowed',
                                              opacity: 0.4,
                                          }
                                        : {}),
                                }}
                                aria-disabled={selectAllAvailableUsersDisabled}
                                data-disabled={
                                    selectAllAvailableUsersDisabled
                                        ? 'true'
                                        : 'false'
                                }
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Checkbox
                                        edge="start"
                                        checked={allAvailableSelected}
                                        onChange={handleSelectAllAvailable} // Ensure checkbox toggles
                                        sx={{
                                            color: '#5B6368',
                                            '&.Mui-checked': {
                                                color: '#3f8cff',
                                            },
                                        }}
                                        disabled={
                                            selectAllAvailableUsersDisabled
                                        }
                                        data-testid="select-all-available-users-checkbox"
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Select all users"
                                    primaryTypographyProps={{
                                        variant: 'body1',
                                        color: 'text.primary',
                                        fontWeight: 'medium',
                                    }}
                                />
                            </ListItem>

                            {/* User list */}
                            <List sx={{ overflow: 'auto', flexGrow: 1, py: 0 }}>
                                {filteredAvailableUsers.map((user) => (
                                    <ListItem
                                        key={user.id}
                                        dense
                                        sx={{
                                            '&:hover': {
                                                backgroundColor:
                                                    'rgba(255, 255, 255, 0.08)',
                                            },
                                            cursor: 'pointer',
                                            ...(user.disabled
                                                ? {
                                                      cursor: 'not-allowed',
                                                      opacity: 0.4,
                                                  }
                                                : {}),
                                        }}
                                        onClick={() =>
                                            !user.disabled &&
                                            handleAvailableUserSelect(
                                                user.id as string
                                            )
                                        } // Prevent selection if disabled
                                        data-testid="available-user-item"
                                    >
                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                            <Checkbox
                                                edge="start"
                                                checked={user?.selected}
                                                disabled={user.disabled} // Disable checkbox
                                                sx={{
                                                    color: '#5B6368',
                                                    '&.Mui-checked': {
                                                        color: '#3f8cff',
                                                    },
                                                }}
                                                data-testid="available-user-checkbox"
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={user?.firstName}
                                            secondary={user?.emailAddress}
                                            primaryTypographyProps={{
                                                variant: 'body1',
                                                color: 'text.primary',
                                            }}
                                            secondaryTypographyProps={{
                                                variant: 'body2',
                                                color: 'text.secondary',
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Box>

                    <Box
                        data-testid="move-users-box"
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            width: '10%',
                            overflow: 'hidden',
                            flex: 1,
                            mt: 3.5,
                        }}
                        gap={1}
                    >
                        <Icon.ArrowRight
                            data-testid="move-users-right"
                            onClick={moveToRole}
                            style={{ cursor: 'pointer' }}
                        />
                        <Icon.ArrowLeft
                            data-testid="move-users-left"
                            onClick={moveToAvailable}
                            style={{ cursor: 'pointer' }}
                        />
                    </Box>

                    {/* Right Section - Users in Role */}
                    <Box
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            width: '45%',
                        }}
                        gap={1}
                    >
                        <Typography
                            variant="body1"
                            sx={{
                                lineHeight: '160%',
                                letterSpacing: '0.025rem',
                            }}
                        >
                            Users currently in this role
                        </Typography>

                        <Box
                            sx={{
                                border: '1px solid #5B6368',
                                borderRadius: '0.25rem',
                                display: 'flex',
                                flexDirection: 'column',
                                padding: 3,
                                overflow: 'hidden',
                                flex: 1,
                            }}
                        >
                            {/* Search input */}
                            <Box>
                                <OutlinedInput
                                    fullWidth
                                    placeholder="Search for User"
                                    value={roleSearch}
                                    onChange={(e) =>
                                        setRoleSearch(e.target.value)
                                    }
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <Icon.Search size="1rem" />
                                        </InputAdornment>
                                    }
                                    endAdornment={
                                        roleSearch && (
                                            <InputAdornment position="end">
                                                <Icon.X
                                                    onClick={clearRoleSearch}
                                                />
                                            </InputAdornment>
                                        )
                                    }
                                    sx={{
                                        borderRadius: 1,
                                        '& .MuiOutlinedInput-notchedOutline': {
                                            borderColor: '#5B6368',
                                        },
                                    }}
                                />
                            </Box>

                            <ListItem
                                dense
                                data-testid="selected-all-role-users"
                                onClick={handleSelectAllRole} // Toggle the "Select All" checkbox on click
                                sx={{
                                    '&:hover': {
                                        backgroundColor:
                                            'rgba(255, 255, 255, 0.08)',
                                    },
                                    cursor: 'pointer',
                                    ...(filteredRoleUsers.length === 0
                                        ? {
                                              cursor: 'not-allowed',
                                              opacity: 0.4,
                                          }
                                        : {}),
                                }}
                            >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                    <Checkbox
                                        edge="start"
                                        checked={allRoleSelected}
                                        onChange={handleSelectAllRole} // Ensure checkbox toggles
                                        sx={{
                                            color: '#5B6368',
                                            '&.Mui-checked': {
                                                color: '#3f8cff',
                                            },
                                        }}
                                        disabled={
                                            filteredRoleUsers.length === 0
                                        }
                                    />
                                </ListItemIcon>
                                <ListItemText
                                    primary="Select all users"
                                    primaryTypographyProps={{
                                        variant: 'body1',
                                        color: 'text.primary',
                                        fontWeight: 'medium',
                                    }}
                                />
                            </ListItem>

                            {/* User list */}
                            <List sx={{ overflow: 'auto', flexGrow: 1, py: 0 }}>
                                {filteredRoleUsers.map((user) => (
                                    <ListItem
                                        data-testid="selected-user-item"
                                        key={user.id}
                                        dense
                                        sx={{
                                            '&:hover': {
                                                backgroundColor:
                                                    'rgba(255, 255, 255, 0.08)',
                                            },
                                            cursor: 'pointer',
                                            ...(user.disabled
                                                ? {
                                                      cursor: 'not-allowed',
                                                      opacity: 0.4,
                                                  }
                                                : {}),
                                        }}
                                        onClick={() =>
                                            handleRoleUserSelect(
                                                user.id as string
                                            )
                                        }
                                    >
                                        <ListItemIcon sx={{ minWidth: 36 }}>
                                            <Checkbox
                                                edge="start"
                                                checked={user.selected}
                                                sx={{
                                                    color: '#5B6368',
                                                    '&.Mui-checked': {
                                                        color: '#3f8cff',
                                                    },
                                                }}
                                            />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={user?.firstName}
                                            secondary={user?.emailAddress}
                                            primaryTypographyProps={{
                                                variant: 'body1',
                                                color: 'text.primary',
                                            }}
                                            secondaryTypographyProps={{
                                                variant: 'body2',
                                                color: 'text.secondary',
                                            }}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </Box>
                    </Box>
                </Box>
            </Box>
            {isCancelModalOpen && (
                <ConfirmModal
                    title="Cancel Editing"
                    message="Are you sure you want to cancel editing users for this role? This will discard any changes you have made."
                    onConfirm={handleCancelConfirm}
                    onCancel={handleGoBackToEditingRoleUsers}
                    confirmLabel="Yes"
                    cancelLabel="No, Take me back"
                    data-testid="edit-role-users-cancel-modal"
                />
            )}
        </Box>
    );
};
