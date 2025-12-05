import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { LayoutSkeletal } from './LayoutSkeletal';

vi.mock('../../context/AppThemeProvider', () => ({
    useAppTheme: () => ({
        palette: {
            mode: 'dark',
            primary: { main: '#1976d2', contrastText: '#fff' },
            background: { default: '#121212', paper: '#1d1d1d' },
            text: { primary: '#fff', secondary: '#b0bec5', disabled: '#666' },
            grey: { '400': '#bdbdbd', '500': '#9e9e9e' },
            divider: '#424242',
            common: { black: '#000', white: '#fff' },
            error: {
                main: '#d32f2f',
                light: '#e57373',
                dark: '#b71c1c',
                contrastText: '#fff',
            },
            warning: {
                main: '#ed6c02',
                light: '#ffb74d',
                dark: '#e65100',
                contrastText: '#fff',
            },
            info: {
                main: '#1976d2',
                light: '#64b5f6',
                dark: '#0d47a1',
                contrastText: '#fff',
            },
            success: {
                main: '#2e7d32',
                light: '#81c784',
                dark: '#1b5e20',
                contrastText: '#fff',
            },
        },
        typography: { fontWeightBold: 700 },
    }),
}));

vi.mock('./TopHeaderSkeletal', () => ({
    TopHeaderSkeletal: () => <div data-testid="top-header-skeletal" />,
}));

describe('LayoutSkeletal', () => {
    it('renders theme baseline and skeletal header with children', () => {
        render(
            <LayoutSkeletal>
                <div data-testid="child" />
            </LayoutSkeletal>
        );
        expect(screen.getByTestId('top-header-skeletal')).toBeInTheDocument();
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
});
