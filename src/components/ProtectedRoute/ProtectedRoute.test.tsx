import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';

const TestComponent = () => (
    <div data-testid="test-component">Test Component</div>
);

describe('ProtectedRoute', () => {
    it('renders loading spinner when loading', () => {
        render(
            <ProtectedRoute
                isAllowed={false}
                loading={true}
            >
                <TestComponent />
            </ProtectedRoute>
        );
        expect(screen.getByRole('progressbar')).toBeInTheDocument();
    });

    it('redirects when not allowed', () => {
        render(
            <MemoryRouter>
                <ProtectedRoute
                    isAllowed={false}
                    loading={false}
                >
                    <TestComponent />
                </ProtectedRoute>
            </MemoryRouter>
        );
        expect(screen.queryByTestId('test-component')).not.toBeInTheDocument();
    });

    it('renders children when allowed', () => {
        render(
            <MemoryRouter>
                <ProtectedRoute
                    isAllowed={true}
                    loading={false}
                >
                    <TestComponent />
                </ProtectedRoute>
            </MemoryRouter>
        );
        expect(screen.getByTestId('test-component')).toBeInTheDocument();
    });
});
