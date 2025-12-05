import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { LoadingPage } from './LoadingPage';

describe('LoadingPage', () => {
    it('renders a backdrop with circular progress', () => {
        render(<LoadingPage />);
        expect(screen.getByTestId('loading-backdrop')).toBeInTheDocument();
        expect(screen.getByTestId('loading-spinner')).toBeInTheDocument();
    });
});
