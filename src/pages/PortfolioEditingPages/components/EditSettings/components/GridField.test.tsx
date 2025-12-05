import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { GridField } from './GridField';
import { GridFieldSet } from './GridFieldSet';

describe('GridField and GridFieldSet', () => {
    it('renders children', () => {
        render(
            <GridFieldSet>
                <GridField>
                    <div data-testid="grid-child" />
                </GridField>
            </GridFieldSet>
        );
        expect(screen.getByTestId('grid-child')).toBeInTheDocument();
    });
});

describe('GridField/GridFieldSet', () => {
    it('renders children in grid layout', () => {
        render(
            <GridFieldSet>
                <GridField>
                    <div data-testid="child-1">A</div>
                </GridField>
                <GridField>
                    <div data-testid="child-2">B</div>
                </GridField>
            </GridFieldSet>
        );
        expect(screen.getByTestId('child-1')).toHaveTextContent('A');
        expect(screen.getByTestId('child-2')).toHaveTextContent('B');
    });
});
