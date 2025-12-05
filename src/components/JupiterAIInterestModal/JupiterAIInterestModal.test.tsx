import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { JupiterAIInterestModal } from './JupiterAIInterestModal';

describe('JupiterAIInterestModal', () => {
    it('shows loader until iframe loads, then reveals iframe content area', () => {
        const onClose = () => {};
        render(<JupiterAIInterestModal onClose={onClose} />);

        expect(screen.getByRole('progressbar')).toBeInTheDocument();

        const iframe = screen.getByTitle('AI Interest Form');
        expect(iframe).toHaveAttribute('height', '0');

        fireEvent.load(iframe);
        expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
        expect(iframe).toHaveAttribute('height', '350');
    });
});
