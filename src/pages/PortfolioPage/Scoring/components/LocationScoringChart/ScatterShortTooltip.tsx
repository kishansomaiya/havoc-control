import { FC } from 'react';
import { Box, Typography } from '@mui/material';

interface ScatterShortTooltipProps {
    locations: {
        locationId: number;
        locationName: string | null;
    }[];
}

export const ScatterShortTooltip: FC<ScatterShortTooltipProps> = ({
    locations,
}) => {
    return (
        <Box
            onClick={(e) => {
                e.stopPropagation();
            }}
            minWidth="10rem"
            px={1}
        >
            <Box
                display="flex"
                alignItems="start"
                justifyContent="space-between"
                pb={1}
                data-testid="scatter-chart-short-tooltip"
            >
                <Box pr={2}>
                    <Box
                        display="flex"
                        flexDirection="column"
                        pt={1}
                    >
                        {locations.map(({ locationId, locationName }) => (
                            <Typography
                                variant="body2"
                                key={locationId}
                                data-testid="scatter-chart-short-tooltip-text"
                            >
                                Location ID: {locationId}
                                {locationName ? ` (${locationName})` : ''}
                            </Typography>
                        ))}
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};
