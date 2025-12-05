import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TabLoadingIndicator } from './TabLoadingIndicator';

describe('TabLoadingIndicator', () => {
    it('renders a backdrop and circular indicator', () => {
        render(<TabLoadingIndicator />);
        expect(screen.getByTestId('circular-indicator')).toBeInTheDocument();
    });
});
