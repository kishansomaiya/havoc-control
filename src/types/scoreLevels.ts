export enum ScoreLevel {
    NA = 'NotAvailable',
    Lowest = 'Lowest',
    Low = 'Low',
    Medium = 'Medium',
    High = 'High',
    Highest = 'Highest',
}

export type ScoreLevelCounts = {
    [key in ScoreLevel]: number;
};
