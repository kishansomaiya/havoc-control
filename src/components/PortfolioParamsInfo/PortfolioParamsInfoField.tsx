import { ComponentProps, FC } from 'react';
import { Box, Typography } from '@mui/material';

interface PortfolioParamsInfoProps extends ComponentProps<'div'> {
    label: string;
    value?: string | number;
}

export const PortfolioParamsInfoField: FC<PortfolioParamsInfoProps> = ({
    label,
    value,
}) => {
    return (
        <Box
            display="flex"
            alignItems="flex-start"
            alignSelf="stretch"
            gap={1}
        >
            <Box
                display="flex"
                flex={2}
            >
                <Typography
                    variant="caption"
                    color="text.secondary"
                    data-testid="portfolio-details-params-data-label"
                >
                    {label}
                </Typography>
            </Box>
            <Box
                display="flex"
                flex={3}
            >
                <Typography
                    variant="body2"
                    color="grey.300"
                    data-testid="portfolio-details-params-data-value"
                >
                    {value || value === 0 ? value : '-'}
                </Typography>
            </Box>
        </Box>
    );
};
