import { ComponentProps, FC, useMemo } from 'react';
import { Box, Typography } from '@mui/material';
import { MuiThemeName } from '../../themes/themes';
import { useAppThemeName } from '../../context/AppThemeProvider';
import { TOP_HEADER_HEIGHT } from '../../const/ui/layout';

export interface TopHeaderSkeletalProps extends ComponentProps<'div'> {}

export const TopHeaderSkeletal: FC<TopHeaderSkeletalProps> = ({
    children,
    ...props
}) => {
    const themeName: MuiThemeName = useAppThemeName();

    const logoSrc: string = useMemo(() => {
        return `/JupiterLogo_${themeName}.svg`;
    }, [themeName]);

    return (
        <div {...props}>
            <Box
                sx={{
                    bgcolor: 'background.header',
                }}
                display="flex"
                px={3}
                py={1}
                alignItems="center"
                justifyContent="space-between"
                minHeight={TOP_HEADER_HEIGHT}
                data-testid="top-header-block"
            >
                <Box
                    display="flex"
                    gap={2}
                    alignItems="center"
                >
                    <img
                        src={logoSrc}
                        width="126"
                        height="30"
                        alt="Jupiter Intelligence"
                        data-testid="top-header-logo-img"
                    />
                    <Typography
                        variant="h4"
                        data-testid="top-header-title"
                    >
                        ClimateScore Global
                    </Typography>
                </Box>
            </Box>
            {children}
        </div>
    );
};
