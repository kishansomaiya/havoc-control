import { createTheme, Theme, ThemeOptions } from '@mui/material';

import { lightThemeOptions } from './lightThemeOptions';
import { darkThemeOptions } from './darkThemeOptions';
import { sharedThemeOptions } from './sharedThemeOptions';

export enum MuiThemeName {
    Light = 'light',
    Dark = 'dark',
}

export const muiThemes: { [key in MuiThemeName]: Theme } = {
    light: createTheme({
        ...sharedThemeOptions,
        ...lightThemeOptions,
    } as ThemeOptions),
    dark: createTheme({
        ...sharedThemeOptions,
        ...darkThemeOptions,
    } as ThemeOptions),
};
