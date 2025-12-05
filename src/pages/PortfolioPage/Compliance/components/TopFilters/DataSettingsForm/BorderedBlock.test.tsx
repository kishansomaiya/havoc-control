import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { BorderedBlock } from './BorderedBlock';

describe('BorderedBlock', () => {
    it('renders children', () => {
        render(
            <BorderedBlock>
                <div data-testid="child" />
            </BorderedBlock>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
});
