import { ComponentProps, FC } from 'react';
import { Box } from '@mui/material';

interface SectionSetProps extends ComponentProps<typeof Box> {}

export const SectionSet: FC<SectionSetProps> = ({ children, ...props }) => {
    return (
        <Box
            {...props}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                justifyContent: 'stretch',
                gap: 3,
            }}
        >
            {children}
        </Box>
    );
};
