import { ScoreLevel } from '../types';

export const NO_AVAILABLE_SCORE = -9999;

export const SCORE_LEVEL_COLORS = {
    [ScoreLevel.NA]: '#CBD2D5',
    [ScoreLevel.Lowest]: '#2196F3',
    [ScoreLevel.Low]: '#26A69A',
    [ScoreLevel.Medium]: '#FFD699',
    [ScoreLevel.High]: '#FF9900',
    [ScoreLevel.Highest]: '#ED5A07',
};
