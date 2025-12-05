import { FC, ComponentProps } from 'react';
import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

interface ImpactsDataWrapperProps extends ComponentProps<typeof Box> {
    title: string;
}

export const ImpactsDataWrapper: FC<ImpactsDataWrapperProps> = ({
    title,
    children,
    ...props
}) => {
    return (
        <Grid xs={6}>
            <Box
                flex={1}
                py={3}
                px={4}
                display="flex"
                flexDirection="column"
                height="17rem"
                boxSizing="content-box"
                {...props}
            >
                <Typography
                    variant="overline"
                    data-testid="chart-title"
                >
                    {title}
                </Typography>

                {children}
            </Box>
        </Grid>
    );
};
