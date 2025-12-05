import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TabDataNotAvailableMessage } from './TabDataNotAvailableMessage';

describe('TabDataNotAvailableMessage', () => {
    it('renders the message', () => {
        render(<TabDataNotAvailableMessage />);
        const el = screen.getByTestId('tab-data-not-available');
        expect(el).toBeInTheDocument();
        expect(el).toHaveTextContent('Data is not available');
    });
});
