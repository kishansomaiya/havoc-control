import { Box, CircularProgress } from '@mui/material';
import styles from '../../pages/HomePage/HomePage.module.css';

export interface LoadingSpinnerProps {
    loading: boolean;
    color?: 'inherit' | 'primary' | 'secondary'; // Optional color prop
    size?: number; // Optional size prop
    testId?: string;
    minSize?: boolean;
}

export const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({
    loading,
    color = 'inherit',
    size = 40,
    testId = 'loading-spinner',
    minSize = false,
}) => {
    if (!loading) {
        return null;
    }

    return (
        <Box
            data-testid={testId}
            className={styles.root}
            sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: minSize ? 'min-content' : undefined,
                height: minSize ? 'min-content' : undefined,
            }}
        >
            <CircularProgress
                color={color}
                size={size}
            />
        </Box>
    );
};
