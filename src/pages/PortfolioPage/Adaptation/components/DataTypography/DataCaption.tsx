import { Box, Typography } from '@mui/material';
import { FC } from 'react';

export interface DataCaptionProps {
    text: string;
    testId?: string;
}

export const DataCaption: FC<DataCaptionProps> = ({ text, testId }) => {
    return (
        <Box data-testid={testId}>
            <Typography
                variant="body2"
                color="success.main"
            >
                {text}
            </Typography>
        </Box>
    );
};
