import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TopHeaderSkeletal } from './TopHeaderSkeletal';

vi.mock('../../context/AppThemeProvider', () => ({
    useAppThemeName: () => 'light',
}));

describe('TopHeaderSkeletal', () => {
    it('renders static header with correct logo path and title', () => {
        render(<TopHeaderSkeletal />);
        const logo = screen.getByTestId('top-header-logo-img');
        expect(logo).toHaveAttribute('src', '/JupiterLogo_light.svg');
        expect(screen.getByTestId('top-header-title')).toHaveTextContent(
            'ClimateScore Global'
        );
    });
});
