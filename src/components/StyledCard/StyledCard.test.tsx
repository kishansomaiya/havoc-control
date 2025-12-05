import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { StyledCard } from './StyledCard';

describe('StyledCard', () => {
    it('renders children', () => {
        render(
            <StyledCard>
                <div data-testid="child">X</div>
            </StyledCard>
        );
        expect(screen.getByTestId('child')).toBeInTheDocument();
    });

    it('calls handleClick when not disabled', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(
            <StyledCard handleClick={onClick}>
                <div>Click me</div>
            </StyledCard>
        );
        await user.click(screen.getByText('Click me'));
        expect(onClick).toHaveBeenCalledTimes(1);
    });

    it('does not call handleClick when disabled', async () => {
        const user = userEvent.setup();
        const onClick = vi.fn();
        render(
            <StyledCard
                handleClick={onClick}
                isDisabled
            >
                <div>Click</div>
            </StyledCard>
        );
        await user.click(screen.getByText('Click'));
        expect(onClick).not.toHaveBeenCalled();
    });

    it('applies hover/selected/disabled styles (smoke tests)', () => {
        const { rerender } = render(
            <StyledCard withHover>
                <div>Hover</div>
            </StyledCard>
        );
        expect(screen.getByText('Hover')).toBeInTheDocument();

        rerender(
            <StyledCard isSelected>
                <div>Selected</div>
            </StyledCard>
        );
        expect(screen.getByText('Selected')).toBeInTheDocument();

        rerender(
            <StyledCard isDisabled>
                <div>Disabled</div>
            </StyledCard>
        );
        expect(screen.getByText('Disabled')).toBeInTheDocument();
    });

    it('shows tooltip when provided (smoke)', async () => {
        render(
            <StyledCard tooltip="Tip here">
                <div>With tip</div>
            </StyledCard>
        );
        // Tooltip content is managed by MUI; smoke check render doesn’t crash
        expect(screen.getByText('With tip')).toBeInTheDocument();
    });
});
