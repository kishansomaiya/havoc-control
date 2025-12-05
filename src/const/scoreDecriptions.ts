import { Score } from '../types';

export const SCORE_DESCRIPTIONS = {
    [Score.All]:
        'Risk of damage, disruption, and hazards to health and safety due to a combination of extreme weather events including cold, flood, drought, fire, hail, heat, precipitation, and wind',
    [Score.Cold]:
        'Score uses the mean hazard values for the number of days per year below 0°C and the number of Heating Degree Days per year',
    [Score.Flood]:
        'Score uses the mean hazard values for the 200-year return period flood depth and the mean fraction of the land within the 90m grid cell with 200-year return period flooding',
    [Score.Drought]:
        'Score uses the mean value for the annual water stress (ratio of human water demand to water supply) for local and upstream watersheds',
    [Score.Fire]:
        'Score uses the mean value for the annual probability of a major wildfire either originating or propagating into the 90m cell the asset is located within',
    [Score.Hail]:
        'Score uses the mean hazard value for the number of days per year where large hail is possible (note: Overall score for hail is not available due to large uncertainty surrounding hail patterns under a changing climate)',
    [Score.Heat]:
        'Score uses the mean hazard values for the number of days per year exceeding 35°C, number of days per year the Wet Bulb Globe temperature exceeds 32°C, and the number of Cooling Degree Days per year',
    [Score.Precipitation]:
        'Score uses the mean hazard value for the 100-year return period maximum daily total water equivalent precipitation',
    [Score.Wind]:
        'Score uses the mean hazard value for the 100-year return period maximum 1-minute sustained wind speed',
    [Score.Subsidence]:
        'Score uses the mean value for the annual probability of shrink-swell subsidence sufficient to cause structure damage in the cell the asset is located within',
};
