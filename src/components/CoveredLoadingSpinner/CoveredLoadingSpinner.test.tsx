import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { CoveredLoadingSpinner } from './CoveredLoadingSpinner';

// Mock the LoadingSpinner component
vi.mock('../LoadingSpinner/LoadingSpinner', () => ({
    LoadingSpinner: ({
        loading,
        testId,
    }: {
        loading: boolean;
        testId: string;
    }) => (
        <div
            data-testid={testId}
            data-loading={loading}
        >
            Loading Spinner Mock
        </div>
    ),
}));

describe('CoveredLoadingSpinner', () => {
    const defaultProps = {
        isLoading: false,
        testId: 'test-spinner',
    };

    const childContent = <div data-testid="child-content">Child Content</div>;

    it('renders children when not loading', () => {
        render(
            <CoveredLoadingSpinner {...defaultProps}>
                {childContent}
            </CoveredLoadingSpinner>
        );

        expect(screen.getByTestId('child-content')).toBeInTheDocument();
        expect(screen.queryByTestId('test-spinner')).not.toBeInTheDocument();
    });

    it('renders LoadingSpinner with overlay when loading', () => {
        render(
            <CoveredLoadingSpinner
                {...defaultProps}
                isLoading={true}
            >
                {childContent}
            </CoveredLoadingSpinner>
        );

        const spinner = screen.getByTestId('test-spinner');
        expect(spinner).toBeInTheDocument();
        expect(spinner).toHaveAttribute('data-loading', 'true');
    });

    it('renders both children and spinner when loading', () => {
        render(
            <CoveredLoadingSpinner
                {...defaultProps}
                isLoading={true}
            >
                {childContent}
            </CoveredLoadingSpinner>
        );

        expect(screen.getByTestId('child-content')).toBeInTheDocument();
        expect(screen.getByTestId('test-spinner')).toBeInTheDocument();
    });

    it('passes correct testId to LoadingSpinner', () => {
        const customTestId = 'custom-spinner-id';

        render(
            <CoveredLoadingSpinner
                {...defaultProps}
                isLoading={true}
                testId={customTestId}
            >
                {childContent}
            </CoveredLoadingSpinner>
        );

        expect(screen.getByTestId(customTestId)).toBeInTheDocument();
    });

    it('renders with proper container structure', () => {
        const { container } = render(
            <CoveredLoadingSpinner
                {...defaultProps}
                isLoading={true}
            >
                {childContent}
            </CoveredLoadingSpinner>
        );

        // Check main container has relative positioning
        const mainContainer = container.firstChild as HTMLElement;
        expect(mainContainer).toHaveStyle({
            position: 'relative',
            width: '100%',
            height: '100%',
        });
    });

    it('renders overlay with correct styling when loading', () => {
        render(
            <CoveredLoadingSpinner
                {...defaultProps}
                isLoading={true}
            >
                {childContent}
            </CoveredLoadingSpinner>
        );

        const overlay = screen.getByTestId('test-spinner-cover');

        expect(overlay).toHaveStyle({
            position: 'absolute',
            top: '0px',
            left: '0px',
            right: '0px',
            bottom: '0px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: '1',
            backgroundColor: 'rgba(36,36,36, 0.65)',
        });
    });

    it('handles multiple children correctly', () => {
        const multipleChildren = (
            <>
                <div data-testid="child-1">Child 1</div>
                <div data-testid="child-2">Child 2</div>
            </>
        );

        render(
            <CoveredLoadingSpinner
                {...defaultProps}
                isLoading={false}
            >
                {multipleChildren}
            </CoveredLoadingSpinner>
        );

        expect(screen.getByTestId('child-1')).toBeInTheDocument();
        expect(screen.getByTestId('child-2')).toBeInTheDocument();
    });

    it('toggles spinner visibility based on isLoading prop changes', () => {
        const { rerender } = render(
            <CoveredLoadingSpinner
                {...defaultProps}
                isLoading={false}
            >
                {childContent}
            </CoveredLoadingSpinner>
        );

        expect(screen.queryByTestId('test-spinner')).not.toBeInTheDocument();

        rerender(
            <CoveredLoadingSpinner
                {...defaultProps}
                isLoading={true}
            >
                {childContent}
            </CoveredLoadingSpinner>
        );

        expect(screen.getByTestId('test-spinner')).toBeInTheDocument();

        rerender(
            <CoveredLoadingSpinner
                {...defaultProps}
                isLoading={false}
            >
                {childContent}
            </CoveredLoadingSpinner>
        );

        expect(screen.queryByTestId('test-spinner')).not.toBeInTheDocument();
    });
});
