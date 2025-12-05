import { ScoreLevel, ScoreLevelCounts } from '../types';
import { useEffect, useState } from 'react';
import { SCORE_LEVEL_TITLES } from '../const/scoreLevelTitles';
import { SCORE_LEVEL_COLORS } from '../const';

interface LocationInScoreLevel {
    level: ScoreLevel;
    value: number;
    label: string;
    color: string;
    id: number;
}

export const useLocationInScoreLevels = (
    scoreLevelCounts: ScoreLevelCounts,
    SCORE_LEVELS: ScoreLevel[]
) => {
    const [locationInScoreLevels, setLocationInScoreLevels] = useState<
        LocationInScoreLevel[]
    >([]);

    useEffect(() => {
        const totalItems = Object.values(scoreLevelCounts).reduce(
            (sum, count) => sum + count,
            0
        );
        const scoreLevelPercentages: ScoreLevelCounts = Object.keys(
            scoreLevelCounts
        ).reduce((acc, key) => {
            const percentage =
                totalItems === 0
                    ? 0
                    : (scoreLevelCounts[key as ScoreLevel] / totalItems) * 100;
            acc[key as ScoreLevel] = percentage;
            return acc;
        }, {} as ScoreLevelCounts);

        setLocationInScoreLevels(
            SCORE_LEVELS.map((scoreLevel, index) => {
                return {
                    level: scoreLevel,
                    value: scoreLevelPercentages[scoreLevel],
                    label: SCORE_LEVEL_TITLES[scoreLevel],
                    id: index + 1,
                    color: SCORE_LEVEL_COLORS[scoreLevel],
                };
            })
        );
    }, [scoreLevelCounts, SCORE_LEVELS]);

    return {
        locationInScoreLevels,
    };
};
