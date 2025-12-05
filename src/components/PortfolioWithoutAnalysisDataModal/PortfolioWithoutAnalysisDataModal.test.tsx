import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { PortfolioWithoutAnalysisDataModal } from './PortfolioWithoutAnalysisDataModal';
import { describe, it, expect, vi } from 'vitest';

describe('PortfolioWithoutAnalysisDataModal', () => {
    it('renders with minimal props', () => {
        const onClose = vi.fn();
        render(<PortfolioWithoutAnalysisDataModal onClose={onClose} />);
        expect(screen.getByTestId('no-analysis-data-text')).toBeInTheDocument();
    });

    it('toggles checkbox and calls onClose', async () => {
        const user = userEvent.setup();
        const onClose = vi.fn();
        render(<PortfolioWithoutAnalysisDataModal onClose={onClose} />);
        const checkbox = screen.getByTestId('dont-display-checkbox');
        await user.click(checkbox);
        expect(checkbox.querySelector('input') as Element).toBeChecked();
        await user.click(screen.getByText('Close'));
        expect(onClose).toHaveBeenCalled();
    });
});
