import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { DataLabel } from './DataLabel';
import { TestRoot } from '../../../../../testing/TestRoot';

describe('DataLabel', () => {
    it('renders label text', () => {
        render(
            <TestRoot>
                <DataLabel text="Total NPV" />
            </TestRoot>
        );
        expect(screen.getByText('Total NPV')).toBeInTheDocument();
    });

    it('renders with data-testid when provided', () => {
        render(
            <TestRoot>
                <DataLabel
                    text="Avg Asset"
                    testId="label-id"
                />
            </TestRoot>
        );
        expect(screen.getByTestId('label-id')).toBeInTheDocument();
    });

    it('renders children content', () => {
        render(
            <TestRoot>
                <DataLabel text="Top Performer">
                    <div>Child Content</div>
                </DataLabel>
            </TestRoot>
        );
        expect(screen.getByText('Child Content')).toBeInTheDocument();
    });

    it('exposes tooltip info via accessible label', async () => {
        render(
            <TestRoot>
                <DataLabel
                    text="Has Info"
                    info="More info"
                    testId="label-info"
                />
            </TestRoot>
        );

        expect(screen.getByLabelText('More info')).toBeInTheDocument();
    });
});
