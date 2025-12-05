import { ComponentProps, FC } from 'react';
import { Box } from '@mui/material';

interface BlockProps extends ComponentProps<typeof Box> {}

export const BorderedBlock: FC<BlockProps> = ({ children, ...props }) => {
    return (
        <Box
            {...props}
            py={2}
            px={3}
            sx={{
                borderBottom: (theme) =>
                    `0.0625rem solid ${theme.palette.primary.contrastText}`,
            }}
        >
            {children}
        </Box>
    );
};
