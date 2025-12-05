import { ComponentProps, FC } from 'react';
import { useParams } from 'react-router';
import { Box, Link, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { ROUTES } from '../../const';

interface DataNotAvailableTooltipProps extends ComponentProps<typeof Box> {}

export const DataNotAvailableTooltip: FC<DataNotAvailableTooltipProps> = ({
    ...props
}) => {
    const { portfolioId } = useParams();

    return (
        <Box 
            {...props}
            data-testid="data-not-available-tooltip"
        >
            <Typography
                variant="body2"
                color="text.accent"
                sx={{
                    fontWeight: 700,
                }}
                data-testid="data-not-available-tooltip-title"
            >
                Data Not Available
            </Typography>
            <Typography
                variant="body2"
                color="text.accent"
                data-testid="data-not-available-tooltip-description"
            >
                To generate the required data for this analysis, go to Home &gt;
                Edit Portfolio &gt;&nbsp;
                <Link
                    component={RouterLink}
                    to={ROUTES.EDIT_PORTFOLIO_PAGE.replace(
                        ':portfolioId',
                        portfolioId || ''
                    )}
                    variant="body2"
                    className="MuiLink-secondary"
                    color="secondary"
                    data-testid="data-not-available-tooltip-edit-settings-link"
                >
                    Edit Settings & Analysis
                </Link>
            </Typography>
        </Box>
    );
};
