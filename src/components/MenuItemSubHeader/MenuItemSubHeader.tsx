import { ComponentProps, FC } from 'react';
import {
    Box,
    Divider,
    MenuItem,
    Tooltip,
    Typography,
    useTheme,
} from '@mui/material';
import { Info } from 'react-feather';

interface MenuItemSubHeaderProps extends ComponentProps<typeof MenuItem> {
    title: string;
    description?: string;
}

export const MenuItemSubHeader: FC<MenuItemSubHeaderProps> = ({
    title,
    description = '',
    ...props
}) => {
    const theme = useTheme();

    return (
        <MenuItem
            // disabled // Commented disabled prop as it will not allow any mouse event for info-tooltip
            disableRipple
            disableTouchRipple
            {...props}
            sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                padding: 0,
                opacity: '1 !important',
                cursor: 'auto',
                backgroundColor: 'transparent !important',
            }}
            onClick={() => {}} // To avoid attaching click events to Menu sub-headers
        >
            <Box
                display="flex"
                alignItems="center"
                gap={0}
                data-testid="chart-legend-item"
            >
                <Typography
                    variant="overline"
                    sx={{
                        padding: '0.375rem',
                        paddingLeft: '1rem',
                        textTransform: 'uppercase',
                        color: (theme) => theme.palette.text.secondary,
                    }}
                    data-testid="portfolio-details-export-menu-sub-header"
                >
                    {title}
                </Typography>
                {description && (
                    <Tooltip
                        title={description}
                        arrow
                        placement="top"
                        data-testid="menu-sub-header-tooltip"
                    >
                        <Info
                            size="0.8rem"
                            color={theme.palette.text.secondary}
                        />
                    </Tooltip>
                )}
            </Box>
            <Divider
                sx={{
                    width: '100%',
                    borderColor: (theme) => theme.palette.grey['600'],
                }}
            />
        </MenuItem>
    );
};
