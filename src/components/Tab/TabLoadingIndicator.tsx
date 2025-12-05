import { Backdrop, CircularProgress } from '@mui/material';

export const TabLoadingIndicator = () => {
    return (
        <Backdrop
            sx={{
                color: '#fff',
                zIndex: 3,
                position: 'absolute',
                left: 0,
                top: 0,
                width: '100%',
                height: '100%',
            }}
            open={true}
        >
            <CircularProgress
                color="inherit"
                data-testid="circular-indicator"
            />
        </Backdrop>
    );
};
