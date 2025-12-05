import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ScoreSwitcher } from './ScoreSwitcher';
import { describe, it, expect, vi } from 'vitest';
import { Score } from '../../types';

const scores: Score[] = [
    Score.All,
    Score.Cold,
    Score.Flood,
    Score.Drought,
    Score.Fire,
    Score.Hail,
    Score.Heat,
    Score.Precipitation,
    Score.Wind,
];
const disabledScores: Score[] = [
    Score.Cold,
    Score.Flood,
    Score.Drought,
    Score.Fire,
    Score.Hail,
    Score.Heat,
    Score.Precipitation,
    Score.Wind,
];
const onSelectScore = vi.fn();

describe('ScoreSwitcher', () => {
    it('renders with minimal props', () => {
        render(
            <ScoreSwitcher
                scores={scores}
                selectedScore={Score.All}
                onSelectScore={onSelectScore}
            />
        );
        expect(screen.getByTestId('score-switcher-tab')).toBeInTheDocument();
    });

    it('selects a score when clicked', async () => {
        const user = userEvent.setup();
        render(
            <ScoreSwitcher
                scores={scores}
                selectedScore={Score.All}
                onSelectScore={onSelectScore}
            />
        );
        await user.click(screen.getByText('Cold'));
        expect(onSelectScore).toHaveBeenCalledWith(Score.Cold);
    });

    it('disables a score when in disabledScores', () => {
        render(
            <ScoreSwitcher
                scores={scores}
                disabledScores={disabledScores}
                selectedScore={Score.All}
                onSelectScore={onSelectScore}
            />
        );
        expect(screen.getByText('Cold')).toBeDisabled();
    });
});
