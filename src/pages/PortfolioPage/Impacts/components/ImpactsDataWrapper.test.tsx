import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { ImpactsDataWrapper } from './ImpactsDataWrapper';

describe('ImpactsDataWrapper', () => {
    it('renders title and children', () => {
        render(
            <ImpactsDataWrapper title="T">
                <div data-testid="child" />
            </ImpactsDataWrapper>
        );
        expect(screen.getByTestId('chart-title')).toHaveTextContent('T');
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });
});
