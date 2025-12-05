import { Box, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import styles from '../../ProfilePage.module.css';
import { LoadingButton } from '@mui/lab';
import { useCallback } from 'react';
import { useNavigate } from 'react-router';
import { ROUTES } from '../../../../const';

export const EmptyRolesState = () => {
    const theme = useTheme();
    const navigate = useNavigate();
    const handleCreateRole = useCallback(() => {
        navigate(ROUTES.PROFILE_ROLE_CREATE_PAGE);
    }, [navigate]);

    return (
        <Box
            className={styles.noScroll}
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            flexGrow={1}
        >
            <Typography
                variant="h6"
                data-testid="empty-state-message"
                gutterBottom
                sx={{ letterSpacing: 1.05 }}
            >
                NO ROLES HAVE BEEN CONFIGURED YET!
            </Typography>
            <Typography
                variant="body2"
                data-testid="empty-state-message-description"
                color={'grey.400'}
                sx={{ maxWidth: theme.spacing(62.5), textAlign: 'center' }}
            >
                Role management allows you to assign specific permissions to
                groups of users, ensuring the right people have access to the
                right features. Click "Add New Role" to get started.
            </Typography>
            <LoadingButton
                color="secondary"
                variant="contained"
                loadingPosition="center"
                data-testid="add-new-role-button"
                onClick={handleCreateRole}
                sx={{ mt: 3 }}
            >
                <span>Add new role</span>
            </LoadingButton>
        </Box>
    );
};
