import { ComponentProps, FC, ReactNode } from 'react';
import { Box } from '@mui/material';

interface SubSectionProps extends ComponentProps<typeof Box> {
    heading: ReactNode;
}

export const SubSection: FC<SubSectionProps> = ({
    heading,
    children,
    ...props
}) => {
    return (
        <Box
            {...props}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                width: '100%',
                gap: 3,
            }}
        >
            {heading}
            <Box sx={{ paddingLeft: 4, width: '100%' }}>{children}</Box>
        </Box>
    );
};
