import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { KPICard, KPICardProps } from './KPICard';
import { PropsWithChildren } from 'react';

describe('KPICard', () => {
    const testId = 'test-kpi';
    const title = 'Total Revenue';
    const childrenContent = '1,234.56';

    const defaultProps: PropsWithChildren<KPICardProps> = {
        testId,
        title,
        children: childrenContent,
    };

    const renderComponent = (
        props: Partial<PropsWithChildren<KPICardProps>> = {}
    ) => {
        return render(
            <KPICard
                {...defaultProps}
                {...props}
            />
        );
    };

    it('should render the title and children correctly', () => {
        renderComponent();

        // Check for title
        const titleElement = screen.getByTestId(`${testId}-title`);
        expect(titleElement).toBeInTheDocument();
        expect(titleElement).toHaveTextContent(title);

        // Check for children content
        const childrenElement = screen.getByTestId(`${testId}-children`);
        expect(childrenElement).toBeInTheDocument();
        expect(childrenElement).toHaveTextContent(childrenContent);

        // Check that the main content wrapper is present
        expect(screen.getByTestId(`${testId}-content`)).toBeInTheDocument();
    });

    it('should not render the left symbol when it is not provided', () => {
        renderComponent();

        // Use queryByTestId to check for absence, as it returns null if not found
        const leftSymbolElement = screen.queryByTestId(`${testId}-left-symbol`);
        expect(leftSymbolElement).not.toBeInTheDocument();
    });

    it('should render the left symbol when it is provided', () => {
        const leftSymbol = '$';
        renderComponent({ leftSymbol });

        // Check for the left symbol
        const leftSymbolElement = screen.getByTestId(`${testId}-left-symbol`);
        expect(leftSymbolElement).toBeInTheDocument();
        expect(leftSymbolElement).toHaveTextContent('$');

        // Also ensure title and children are still rendered correctly
        expect(screen.getByTestId(`${testId}-title`)).toHaveTextContent(title);
        expect(screen.getByTestId(`${testId}-children`)).toHaveTextContent(
            childrenContent
        );
    });
});
