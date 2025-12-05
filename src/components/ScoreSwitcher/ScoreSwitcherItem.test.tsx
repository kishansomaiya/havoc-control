import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScoreSwitcherItem } from './ScoreSwitcherItem';
import { describe, it, expect, vi } from 'vitest';
import { Score } from '../../types';

const onSelectScore = vi.fn();

describe('ScoreSwitcherItem', () => {
    it('renders with minimal props', () => {
        render(
            <ScoreSwitcherItem
                score={Score.All}
                isSelected={false}
                onSelectScore={onSelectScore}
            />
        );
        expect(
            screen.getByRole('button', { name: /All/i })
        ).toBeInTheDocument();
    });

    it('calls onSelectScore when clicked', async () => {
        const user = userEvent.setup();
        render(
            <ScoreSwitcherItem
                score={Score.All}
                isSelected={false}
                onSelectScore={onSelectScore}
            />
        );
        await user.click(screen.getByRole('button', { name: /All/i }));
        expect(onSelectScore).toHaveBeenCalledWith(Score.All);
    });

    it('disables button when isDisabled is true', () => {
        render(
            <ScoreSwitcherItem
                score={Score.All}
                isSelected={false}
                isDisabled={true}
                onSelectScore={onSelectScore}
            />
        );
        expect(screen.getByRole('button', { name: /All/i })).toBeDisabled();
    });
});
