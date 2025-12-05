import { render, screen } from '@testing-library/react';
import { PortfolioParamsInfoField } from './PortfolioParamsInfoField';
import { describe, it, expect } from 'vitest';

describe('PortfolioParamsInfoField', () => {
    it('renders with minimal props', () => {
        render(<PortfolioParamsInfoField label="Test Label" />);
        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByText('-')).toBeInTheDocument();
    });

    it('renders with value', () => {
        render(
            <PortfolioParamsInfoField
                label="Test Label"
                value="Test Value"
            />
        );
        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByText('Test Value')).toBeInTheDocument();
    });

    it('renders with numeric value', () => {
        render(
            <PortfolioParamsInfoField
                label="Test Label"
                value={0}
            />
        );
        expect(screen.getByText('Test Label')).toBeInTheDocument();
        expect(screen.getByText('0')).toBeInTheDocument();
    });
});
