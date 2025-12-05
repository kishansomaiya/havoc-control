import { Backdrop, Box, CircularProgress } from '@mui/material';
import styles from './LoadingPage.module.css';

export const LoadingPage = () => {
    return (
        <Box className={styles.root}>
            <Backdrop
                open={true}
                data-testid="loading-backdrop"
            >
                <CircularProgress
                    color="inherit"
                    data-testid="loading-spinner"
                />
            </Backdrop>
        </Box>
    );
};
