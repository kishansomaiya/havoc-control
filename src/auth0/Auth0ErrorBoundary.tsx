import { FC, ReactNode, useCallback } from 'react';
import { LayoutSkeletal } from '../components/LayoutSkeletal/LayoutSkeletal';
import { useAuth0 } from '@auth0/auth0-react';
import { Box, Typography } from '@mui/material';
import { TOP_HEADER_HEIGHT } from '../const/ui/layout';

export const Auth0ErrorBoundary: FC<{ children: ReactNode }> = ({ children }) => {
    const { error, isLoading, logout } = useAuth0();

    const logoutAndRedirectUser = useCallback(async () => {
        await logout({
            logoutParams: {
                returnTo: window.location.origin,
            },
        });
    }, [logout]);

    if (!isLoading && error?.message) {
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
                        {error?.message ??
                            'Could not login, something went wrong'}
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
