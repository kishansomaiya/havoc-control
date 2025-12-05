import {
    Box,
    IconButton,
    InputAdornment,
    List,
    OutlinedInput,
    useTheme,
} from '@mui/material';
import { forwardRef, PropsWithChildren, useCallback, useMemo } from 'react';
import { useFormik } from 'formik';
import * as Icon from 'react-feather';
import styles from '../ProfilePage.module.css';
import { EmptyRolesState } from './components/EmptyRolesState';
import { Virtuoso, Components, ListProps } from 'react-virtuoso';
import { RoleItem } from './components/RoleItem';
import { Outlet, useNavigate } from 'react-router';
import { LoadingButton } from '@mui/lab';
import { ROUTES, STD_LIST_API_LIMIT } from '../../../const';
import { useRolesQuery } from '../../../api/queries/rolesQuery';
import { RoleResponse } from '../../../api/openapi/auto-generated-admin';
import { LoadingSpinner } from '../../../components/LoadingSpinner/LoadingSpinner';
import { isNil } from 'lodash';
import { Auth0User } from '../../../types';
import { useAuth0 } from '@auth0/auth0-react';

const initialFormValues = {
    search: '',
};

const roleListComponents: Components<RoleResponse> = {
    List: forwardRef<HTMLDivElement, PropsWithChildren<ListProps>>(
        ({ children, ...props }, ref) => (
            <div
                ref={ref}
                {...props}
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    ...props.style,
                }}
            >
                {children}
            </div>
        )
    ),
};

export const RoleManagement = () => {
    const theme = useTheme();
    const { user } = useAuth0<Auth0User>();
    const tenantId = user?.['custom:jupiter-tenant-id'] ?? '';
    const navigate = useNavigate();
    const {
        roles,
        hasMoreRoles,
        isRolesLoading,
        isFetchingNextPage,
        fetchNextPage: fetchNextPageRoles,
        refetchRoles,
    } = useRolesQuery({ pageSize: STD_LIST_API_LIMIT, tenantId: tenantId });

    const formik = useFormik({
        initialValues: initialFormValues,
        onSubmit: () => {},
        enableReinitialize: true,
    });

    const { setFieldValue } = formik;

    const handleClearSearch = useCallback(() => {
        setFieldValue('search', '');
    }, [setFieldValue]);

    const filteredRoles = useMemo(
        () =>
            roles?.filter(
                (role) =>
                    !formik.values.search ||
                    role.role.name
                        ?.toLowerCase()
                        .includes(formik.values.search.toLowerCase()) ||
                    role.role.description
                        ?.toLowerCase()
                        .includes(formik.values.search.toLowerCase())
            ),
        [roles, formik.values.search]
    );

    const handleCreateRole = useCallback(() => {
        navigate(ROUTES.PROFILE_ROLE_CREATE_PAGE);
    }, [navigate]);

    const handleRoleDelete = useCallback(async () => {
        await refetchRoles();
    }, [refetchRoles]);

    if (isRolesLoading) {
        return <LoadingSpinner loading={isRolesLoading} />;
    }

    if (roles?.length === 0 || isNil(roles)) {
        return <EmptyRolesState />;
    }

    return (
        <Box
            className={styles.noScroll}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="start"
            flexGrow={1}
            py={7.5}
            px={12}
        >
            <Box
                pb={2}
                display="flex"
                justifyContent="space-between"
                alignItems="center"
                sx={{ width: '100%' }}
            >
                <form
                    onSubmit={formik.handleSubmit}
                    style={{ width: '50%' }}
                >
                    <OutlinedInput
                        id="search"
                        data-testid="role-list-search-field"
                        name="search"
                        placeholder="Search"
                        startAdornment={
                            <>
                                <InputAdornment position="start">
                                    <Icon.Search
                                        aria-label="Search"
                                        size="1rem"
                                        data-testid="role-list-search-icon"
                                    />
                                </InputAdornment>
                            </>
                        }
                        endAdornment={
                            <>
                                <InputAdornment position="end">
                                    <IconButton
                                        size="small"
                                        data-testid="role-list-search-clear-icon"
                                        onClick={handleClearSearch}
                                    >
                                        <Icon.X
                                            aria-label="Clear"
                                            size="1rem"
                                        />
                                    </IconButton>
                                </InputAdornment>
                            </>
                        }
                        value={formik.values.search}
                        onChange={formik.handleChange}
                        error={
                            formik.touched.search &&
                            Boolean(formik.errors.search)
                        }
                        fullWidth
                    />
                </form>
                <LoadingButton
                    color="secondary"
                    variant="contained"
                    loadingPosition="center"
                    data-testid="add-new-role-button"
                    onClick={handleCreateRole}
                >
                    <span>{'Add new role'}</span>
                </LoadingButton>
            </Box>
            <List
                style={{
                    width: '100%',
                    padding: 0,
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '1rem',
                    overflow: 'auto',
                }}
            >
                <Virtuoso
                    style={{ height: '100%' }}
                    data={filteredRoles}
                    components={roleListComponents}
                    data-testid="role-list"
                    itemContent={(index, roleData) => (
                        <>
                            <RoleItem
                                key={roleData.role.id}
                                roleData={roleData.role}
                                userCount={roleData.members?.length || 0}
                                searchText={formik.values.search}
                                onRoleDelete={handleRoleDelete}
                            />
                            {index === (filteredRoles?.length ?? 0) - 1 &&
                                hasMoreRoles && (
                                    <Box
                                        sx={{
                                            flex: 1,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            marginTop: theme.spacing(2),
                                        }}
                                    >
                                        <LoadingButton
                                            variant="text"
                                            color="primary"
                                            disabled={isFetchingNextPage}
                                            loading={isFetchingNextPage}
                                            loadingPosition="end"
                                            sx={{
                                                width: 'fit-content',
                                                alignSelf: 'center',
                                                paddingX: 3,
                                                textDecoration: 'underline',
                                                '&:hover': {
                                                    textDecoration: 'underline',
                                                },
                                            }}
                                            onClick={() => {
                                                fetchNextPageRoles();
                                            }}
                                            data-testid="load-more-roles-button"
                                        >
                                            <span>
                                                {isFetchingNextPage
                                                    ? 'Loading...'
                                                    : 'Load More'}
                                            </span>
                                        </LoadingButton>
                                    </Box>
                                )}
                        </>
                    )}
                />
            </List>
            <Outlet />
        </Box>
    );
};
