import { Grid, Typography } from '@mui/material';
import { FC, Fragment } from 'react';

interface InfoGridProps {
    infoList: Array<{ key: string; value: string }>;
}

export const InfoGrid: FC<InfoGridProps> = ({ infoList }: InfoGridProps) => {
    return (
        <Grid
            container
            rowSpacing={1}
            columnSpacing={2}
        >
            {infoList.map(({ key, value }, index) => (
                <Fragment key={`${key}-${index}`}>
                    <Grid
                        item
                        xs={4.4}
                    >
                        <Typography
                            variant="body1"
                            color="text.secondary"
                        >
                            {key}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        xs={7.6}
                    >
                        <Typography variant="body1">{value}</Typography>
                    </Grid>
                </Fragment>
            ))}
        </Grid>
    );
};
