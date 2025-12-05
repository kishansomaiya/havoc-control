import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { ThemeSwitcher } from './ThemeSwitcher';
import { MuiThemeName } from '../../themes/themes';

const useAppThemeName = vi.fn();
const useUpdateThemeName = vi.fn();

vi.mock('../../context/AppThemeProvider', () => {
    return {
        useAppThemeName: () => useAppThemeName(),
        useUpdateThemeName: () => useUpdateThemeName,
    };
});

describe('ThemeSwitcher', () => {
    it('shows labels and toggles from Light to Dark', async () => {
        useAppThemeName.mockReturnValue(MuiThemeName.Light);
        const user = userEvent.setup();

        render(<ThemeSwitcher />);

        expect(
            screen.getByTestId('drop-down-menu-theme-text-light')
        ).toHaveTextContent('Light');
        expect(
            screen.getByTestId('drop-down-menu-theme-text-dark')
        ).toHaveTextContent('Dark');

        await user.click(screen.getByTestId('drop-down-menu-theme-toggle'));
        expect(useUpdateThemeName).toHaveBeenCalledWith(MuiThemeName.Dark);
    });

    it('toggles from Dark to Light', async () => {
        useAppThemeName.mockReturnValue(MuiThemeName.Dark);
        const user = userEvent.setup();

        render(<ThemeSwitcher />);
        await user.click(screen.getByTestId('drop-down-menu-theme-toggle'));
        expect(useUpdateThemeName).toHaveBeenCalledWith(MuiThemeName.Light);
    });
});
