import { ComponentProps, FC } from 'react';
import { Grid } from '@mui/material';

interface GridFieldSetProps extends ComponentProps<typeof Grid> {}

export const GridFieldSet: FC<GridFieldSetProps> = ({ children, ...props }) => {
    return (
        <Grid
            {...props}
            container
            spacing={3}
        >
            {children}
        </Grid>
    );
};
