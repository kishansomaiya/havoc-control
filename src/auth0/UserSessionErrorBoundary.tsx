import { FC, ReactNode, useCallback } from 'react';
import { LayoutSkeletal } from '../components/LayoutSkeletal/LayoutSkeletal';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Typography } from '@mui/material';
import { TOP_HEADER_HEIGHT } from '../const/ui/layout';
import { isNil } from 'lodash';
import { useGetUserPermissionsQuery } from '../api/queries/usersQuery';
import { Auth0User } from '../types';

export const UserSessionErrorBoundary: FC<{ children: ReactNode }> = ({
    children,
}) => {
    const { isLoading, user, logout } = useAuth0<Auth0User>();
    const userId = user?.['custom:jupiter-user-id'] ?? '';
    const { userPermissions, isUserPermissionsLoading } =
        useGetUserPermissionsQuery(userId);

    const logoutAndRedirectUser = useCallback(async () => {
        await logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    }, [logout]);

    if (
        !isLoading &&
        !isUserPermissionsLoading &&
        (userPermissions?.length === 0 || isNil(userPermissions))
    ) {
        return (
            <LayoutSkeletal>
                <Box
                    component="div"
                    display="flex"
                    flexDirection="column"
                    justifyContent="center"
                    alignItems="center"
                    gap={1}
                    height={`calc(100vh - ${TOP_HEADER_HEIGHT})`}
                    width="100vw"
                >
                    <Typography variant="h5">
                        {
                            'You do not have necessary permissions, please contact your administrator.'
                        }
                    </Typography>
                    <Typography variant="subtitle2">
                        <span
                            color="inherit"
                            style={{
                                textDecoration: 'underline',
                                cursor: 'pointer',
                            }}
                            onClick={() => {
                                void logoutAndRedirectUser();
                            }}
                        >
                            Click here
                        </span>{' '}
                        to redirect to home.
                    </Typography>
                </Box>
            </LayoutSkeletal>
        );
    }

    return children;
};
