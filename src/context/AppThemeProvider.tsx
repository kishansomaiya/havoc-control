import { ReactNode, createContext, useContext, useState, FC } from 'react';
import { Theme } from '@mui/material';
import { muiThemes, MuiThemeName } from '../themes/themes';

const defaultThemeName = MuiThemeName.Dark;
const defaultTheme = muiThemes[defaultThemeName];

// Theme Name
export const ThemeNameContext = createContext<MuiThemeName>(defaultThemeName);
export const useAppThemeName = () => {
    return useContext<MuiThemeName>(ThemeNameContext);
};

// MUI Theme
export const MuiThemeContext = createContext<Theme>(defaultTheme);
export const useAppTheme = () => {
    return useContext<Theme>(MuiThemeContext);
};

// Update Theme Name
export const UpdateThemeNameContext = createContext<
    (themeName: MuiThemeName) => void
>(() => {});
export const useUpdateThemeName = () => {
    return useContext<(themeName: MuiThemeName) => void>(
        UpdateThemeNameContext
    );
};

export const AppThemeProvider: FC<{ children: ReactNode }> = ({ children }) => {
    const themeNameStorageKey = 'themeName';
    const savedInStorageThemeName =
        (localStorage.getItem(themeNameStorageKey) as MuiThemeName) ||
        defaultThemeName;
    const [themeName, setThemeName] = useState<MuiThemeName>(
        savedInStorageThemeName
    );
    const [theme, setTheme] = useState<Theme>(
        muiThemes[savedInStorageThemeName]
    );

    const applyThemeName = (themeName: MuiThemeName) => {
        localStorage.setItem(themeNameStorageKey, themeName);
        setThemeName(themeName);
        const newTheme = muiThemes[themeName];
        setTheme(newTheme);
    };

    return (
        <ThemeNameContext.Provider value={themeName}>
            <MuiThemeContext.Provider value={theme}>
                <UpdateThemeNameContext.Provider value={applyThemeName}>
                    {children}
                </UpdateThemeNameContext.Provider>
            </MuiThemeContext.Provider>
        </ThemeNameContext.Provider>
    );
};
