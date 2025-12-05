import { Box } from '@mui/material';
import { ComponentProps, FC } from 'react';

interface TabLabelProps extends ComponentProps<typeof Box> {}

export const TabLabel: FC<TabLabelProps> = ({ children, ...props }) => {
    return (
        <Box
            {...props}
            display="flex"
            alignItems="center"
            flexDirection="row"
            height="1.5rem"
            data-testid="create-portfolio-tab"
        >
            {children}
        </Box>
    );
};
