import { AnalysisType } from '../types/analysisTypeEnum';

export const ANALYSIS_TYPE_TITLE = {
    [AnalysisType.PerilsAndScores]: 'Perils and Scores',
    [AnalysisType.PerilsScoresAndEconomicImpact]:
        'Perils, Scores, and Economic Impact',
    [AnalysisType.Custom]: 'Custom',
};

export const ANALYSIS_TYPE_DESCRIPTION = {
    [AnalysisType.PerilsAndScores]:
        'Jupiter hazard data metrics with scores that translate those hazards into a number from 0-100. For those only interested in climate hazard.',
    [AnalysisType.PerilsScoresAndEconomicImpact]:
        'Jupiter hazard metrics and scores with quantification of damage, loss, and economic impact. For those who want to calculate the financial impact of climate hazard.',
    [AnalysisType.Custom]:
        'Choose the analysis settings and outputs you want. Note: Depending on what is selected, some visuals and reports may not be available.',
};

export const ANALYSIS_TYPE_ITEMS = Object.values(AnalysisType).map((type) => ({
    type,
    title: ANALYSIS_TYPE_TITLE[type],
    description: ANALYSIS_TYPE_DESCRIPTION[type],
}));
