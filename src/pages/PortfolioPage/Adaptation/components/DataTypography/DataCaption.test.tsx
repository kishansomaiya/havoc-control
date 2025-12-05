import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { DataCaption } from './DataCaption';
import { TestRoot } from '../../../../../testing/TestRoot';

describe('DataCaption', () => {
    const renderComponent = (text: string, testId?: string) =>
        render(
            <TestRoot>
                <DataCaption
                    text={text}
                    testId={testId}
                />
            </TestRoot>
        );

    it('applies data-testid when provided', () => {
        renderComponent('Caption', 'caption-id');
        expect(screen.getByTestId('caption-id')).toHaveTextContent('Caption');
    });
});
