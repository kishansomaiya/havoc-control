import { ComponentProps, FC } from 'react';
import { Grid } from '@mui/material';

interface GridFieldProps extends ComponentProps<typeof Grid> {}

export const GridField: FC<GridFieldProps> = ({ children, ...props }) => {
    return (
        <Grid
            {...props}
            item
            xs={12}
            sm={6}
            md={3}
        >
            {children}
        </Grid>
    );
};
