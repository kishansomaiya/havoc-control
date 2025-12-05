import { Typography } from '@mui/material';

export const TabDataNotAvailableMessage = () => {
    return (
        <Typography
            variant="h2"
            p={3}
            data-testid="tab-data-not-available"
        >
            Data is not available
        </Typography>
    );
};
