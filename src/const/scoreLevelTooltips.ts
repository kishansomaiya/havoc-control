import { ScoreLevel } from '../types';

export const SCORE_LEVEL_TOOLTIPS = {
    [ScoreLevel.NA]: '',
    [ScoreLevel.Lowest]: 'Overall Score 0-20',
    [ScoreLevel.Low]: 'Overall Score 20-40',
    [ScoreLevel.Medium]: 'Overall Score 40-60',
    [ScoreLevel.High]: 'Overall Score 60-80',
    [ScoreLevel.Highest]: 'Overall Score 80-100',
};
