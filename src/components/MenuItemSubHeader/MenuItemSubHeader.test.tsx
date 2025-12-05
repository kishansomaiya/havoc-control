import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MenuItemSubHeader } from './MenuItemSubHeader';

describe('MenuItemSubHeader', () => {
    it('renders title and divider', () => {
        render(<MenuItemSubHeader title="Section" />);
        expect(
            screen.getByTestId('portfolio-details-export-menu-sub-header')
        ).toHaveTextContent('Section');
        expect(screen.getByTestId('chart-legend-item')).toBeInTheDocument();
    });

    it('shows tooltip icon when description provided', () => {
        render(
            <MenuItemSubHeader
                title="Section"
                description="Help text"
            />
        );
        expect(
            screen.getByTestId('menu-sub-header-tooltip')
        ).toBeInTheDocument();
    });
});
