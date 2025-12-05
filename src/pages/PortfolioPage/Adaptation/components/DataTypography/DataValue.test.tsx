import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataValue } from './DataValue';
import { TestRoot } from '../../../../../testing/TestRoot';

describe('DataValue', () => {
    const renderComponent = (content: string, testId?: string) =>
        render(
            <TestRoot>
                <DataValue testId={testId}>{content}</DataValue>
            </TestRoot>
        );

    it('renders children text', () => {
        renderComponent('123');
        expect(screen.getByText('123')).toBeInTheDocument();
    });

    it('applies data-testid when provided', () => {
        renderComponent('999', 'metric-value-test');
        expect(screen.getByTestId('metric-value-test')).toBeInTheDocument();
    });
});
