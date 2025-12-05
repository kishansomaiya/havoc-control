import { ComponentProps, FC, useCallback } from 'react';
import { Button, Tooltip } from '@mui/material';
import { SCORE_TITLES } from '../../const';
import { Score } from '../../types';

export interface ScoreSwitcherItemProps extends ComponentProps<typeof Button> {
    score: Score;
    isSelected: boolean;
    isDisabled?: boolean;
    onSelectScore: (selectedScore: Score) => void;
}

export const ScoreSwitcherItem: FC<ScoreSwitcherItemProps> = ({
    score,
    isSelected,
    isDisabled,
    onSelectScore,
    ...props
}) => {
    const handleClick = useCallback(() => {
        onSelectScore(score);
    }, [score, onSelectScore]);

    return (
        <Tooltip
            title={isDisabled ? 'No data available' : null}
            arrow
        >
            <span>
                <Button
                    {...props}
                    key={score}
                    variant={isSelected ? 'contained' : undefined}
                    onClick={handleClick}
                    disabled={!!isDisabled}
                >
                    {SCORE_TITLES[score]}
                </Button>
            </span>
        </Tooltip>
    );
};
