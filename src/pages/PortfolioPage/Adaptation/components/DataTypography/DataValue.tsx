import { Box, Typography } from '@mui/material';
import { FC, ReactNode } from 'react';

export interface DataValueProps {
    children: ReactNode;
    testId?: string;
}

export const DataValue: FC<DataValueProps> = ({ children, testId }) => {
    return (
        <Box data-testid={testId}>
            <Typography
                variant="h2"
                sx={{ fontWeight: 700 }}
                whiteSpace={'nowrap'}
            >
                {children}
            </Typography>
        </Box>
    );
};
