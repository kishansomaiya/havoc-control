import { ScoreLevel } from '../types';
import { SCORE_LEVEL_COLORS } from '../const';

export const getScoreLevel = (value: number): ScoreLevel => {
    if (isNaN(value) || value > 100) {
        return ScoreLevel.NA;
    }

    return value <= 20
        ? ScoreLevel.Lowest
        : value <= 40
          ? ScoreLevel.Low
          : value <= 60
            ? ScoreLevel.Medium
            : value <= 80
              ? ScoreLevel.High
              : ScoreLevel.Highest;
};

export const getScoreLevelColor = (value: number): string => {
    const scoreLevel = getScoreLevel(value);
    if (isNaN(value) || value > 100 || !scoreLevel) {
        return SCORE_LEVEL_COLORS[ScoreLevel.NA];
    }

    return SCORE_LEVEL_COLORS[scoreLevel];
};
