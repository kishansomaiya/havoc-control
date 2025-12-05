import { HazardType, Score } from '../types';

export const SCORE_OVERALL_FIELDS = {
    [Score.All]: 'AP_overall_score',
    [Score.Cold]: 'CD_overall_score',
    [Score.Flood]: 'FL_overall_score',
    [Score.Drought]: 'DT_overall_score',
    [Score.Fire]: 'FR_overall_score',
    [Score.Hail]: 'HL_overall_score',
    [Score.Heat]: 'HT_overall_score',
    [Score.Precipitation]: 'PR_overall_score',
    [Score.Wind]: 'WS_overall_score',
    [Score.Subsidence]: 'SD_overall_pctCountry',
};

export const SCORE_CHANGE_FIELDS = {
    [Score.All]: 'AP_change_score',
    [Score.Cold]: 'CD_change_score',
    [Score.Flood]: 'FL_change_score',
    [Score.Drought]: 'DT_change_score',
    [Score.Fire]: 'FR_change_score',
    [Score.Hail]: 'HL_change_score',
    [Score.Heat]: 'HT_change_score',
    [Score.Precipitation]: 'PR_change_score',
    [Score.Wind]: 'WS_change_score',
    [Score.Subsidence]: 'SD_change_pctCountry',
};

export const SCORE_HAZARD_FIELDS = {
    [Score.All]: 'AP_hazard_score',
    [Score.Cold]: 'CD_hazard_score',
    [Score.Flood]: 'FL_hazard_score',
    [Score.Drought]: 'DT_hazard_score',
    [Score.Fire]: 'FR_hazard_score',
    [Score.Hail]: 'HL_hazard_score',
    [Score.Heat]: 'HT_hazard_score',
    [Score.Precipitation]: 'PR_hazard_score',
    [Score.Wind]: 'WS_hazard_score',
    [Score.Subsidence]: 'SD_hazard_pctCountry',
};

export const SCORE_HAZARD_ORDER_BY_FIELDS = {
    [HazardType.Current]: SCORE_HAZARD_FIELDS,
    [HazardType.Change]: SCORE_CHANGE_FIELDS,
    [HazardType.Overall]: SCORE_OVERALL_FIELDS,
};
