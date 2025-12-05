import { ComponentProps, FC, useCallback } from 'react';
import { Stack, Switch, Typography } from '@mui/material';
import { MuiThemeName } from '../../themes/themes';
import {
    useAppThemeName,
    useUpdateThemeName,
} from '../../context/AppThemeProvider';

export interface ThemeSwitcherProps extends ComponentProps<'div'> {}

export const ThemeSwitcher: FC<ThemeSwitcherProps> = () => {
    const themeName: MuiThemeName = useAppThemeName();
    const setThemeName = useUpdateThemeName();

    const handleToggleTheme = useCallback(() => {
        const newThemeName =
            themeName === MuiThemeName.Light
                ? MuiThemeName.Dark
                : MuiThemeName.Light;
        setThemeName(newThemeName);
    }, [themeName, setThemeName]);

    return (
        <Stack
            direction="row"
            spacing={1}
            alignItems="center"
            data-testid="drop-down-menu-theme-stack"
        >
            <Typography data-testid="drop-down-menu-theme-text-light">
                Light
            </Typography>
            <Switch
                checked={themeName === MuiThemeName.Dark}
                onClick={handleToggleTheme}
                data-testid="drop-down-menu-theme-toggle"
            />
            <Typography data-testid="drop-down-menu-theme-text-dark">
                Dark
            </Typography>
        </Stack>
    );
};
