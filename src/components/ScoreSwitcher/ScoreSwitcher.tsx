import { ComponentProps, FC } from 'react';
import { ButtonGroup } from '@mui/material';
import { Score } from '../../types';
import { ScoreSwitcherItem } from './ScoreSwitcherItem';

export interface ScoreSwitcherProps extends ComponentProps<typeof ButtonGroup> {
    scores: Score[];
    disabledScores?: Score[];
    selectedScore: Score;
    onSelectScore: (selectedScore: Score) => void;
}

export const ScoreSwitcher: FC<ScoreSwitcherProps> = ({
    scores,
    disabledScores = [],
    selectedScore,
    onSelectScore,
    ...props
}) => {
    return (
        <ButtonGroup
            {...props}
            variant="outlined"
            aria-label="Score filter"
            size="small"
            sx={{
                bgcolor: 'background.default',
            }}
            data-testid="score-switcher-tab"
        >
            {scores.map((score) => (
                <ScoreSwitcherItem
                    key={score}
                    score={score}
                    isSelected={selectedScore === score}
                    isDisabled={disabledScores.includes(score)}
                    onSelectScore={onSelectScore}
                    data-testid="score-switcher-item"
                />
            ))}
        </ButtonGroup>
    );
};
