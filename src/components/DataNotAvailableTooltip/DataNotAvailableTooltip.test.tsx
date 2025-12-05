import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { DataNotAvailableTooltip } from './DataNotAvailableTooltip';

describe('DataNotAvailableTooltip', () => {
    it('renders title, description and link with portfolio id', () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/p/123' }]}>
                <Routes>
                    <Route
                        path="/p/:portfolioId"
                        element={<DataNotAvailableTooltip />}
                    />
                </Routes>
            </MemoryRouter>
        );
        expect(
            screen.getByTestId('data-not-available-tooltip-title')
        ).toHaveTextContent('Data Not Available');
        expect(
            screen.getByTestId('data-not-available-tooltip-description')
        ).toBeInTheDocument();
        const link = screen.getByTestId(
            'data-not-available-tooltip-edit-settings-link'
        );
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).toContain('123');
    });

    it('renders link without portfolio id when param missing', () => {
        render(
            <MemoryRouter initialEntries={[{ pathname: '/p' }]}>
                <Routes>
                    <Route
                        path="/p"
                        element={<DataNotAvailableTooltip />}
                    />
                </Routes>
            </MemoryRouter>
        );
        const link = screen.getByTestId(
            'data-not-available-tooltip-edit-settings-link'
        );
        expect(link).toHaveAttribute('href');
        expect(link.getAttribute('href')).toContain('edit-portfolio');
    });
});
