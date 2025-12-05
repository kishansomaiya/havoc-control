import { ComponentProps, FC } from 'react';
import { Box, Typography } from '@mui/material';

interface SectionProps extends ComponentProps<typeof Box> {
    title: string;
}

export const Section: FC<SectionProps> = ({
    title,
    children,
    sx,
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
                ...sx,
            }}
        >
            <Typography
                variant="overline"
                color="text.secondary"
            >
                {title}
            </Typography>
            {children}
        </Box>
    );
};
