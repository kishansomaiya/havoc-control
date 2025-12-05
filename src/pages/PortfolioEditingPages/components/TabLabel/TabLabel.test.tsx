import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { TabLabel } from './TabLabel';

describe('TabLabel', () => {
    it('renders children and has test id', () => {
        render(
            <TabLabel>
                <span>Child</span>
            </TabLabel>
        );
        const root = screen.getByTestId('create-portfolio-tab');
        expect(root).toBeInTheDocument();
        expect(root).toHaveTextContent('Child');
    });
});
