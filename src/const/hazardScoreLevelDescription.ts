import { Score, ScoreLevel } from '../types';
import {
    PerilsOptionsDataVersionEnum,
    ResultSetDataSchema,
} from '../api/openapi/auto-generated';

type HazardFloodScoreLevelDescriptionType = {
    [key in ScoreLevel]: (
        isFractionMetric: boolean,
        dataVersion?: PerilsOptionsDataVersionEnum
    ) => string | undefined;
};

type HazardWindScoreLevelDescriptionType = {
    [key in ScoreLevel]: (
        isSpeedYr: boolean,
        isSpeedAvg: boolean,
        isSpeedMax: boolean,
        dataVersion?: PerilsOptionsDataVersionEnum
    ) => string | undefined;
};

type HazardFireScoreLevelDescriptionType = {
    [key in ScoreLevel]: (
        dataVersion?: PerilsOptionsDataVersionEnum
    ) => string | undefined;
};

type HazardHeatScoreLevelDescriptionType = {
    [key in ScoreLevel]: (
        isExceeding: boolean,
        isWBGT: boolean,
        isCooling: boolean,
        isWaveMax35CMin24C: boolean,
        isWaveMax95Pct: boolean,
        isTempAvg: boolean,
        isTempMax: boolean,
        dataVersion?: PerilsOptionsDataVersionEnum
    ) => string | undefined;
};

type HazardPrecipScoreLevelDescriptionType = {
    [key in ScoreLevel]: (
        isDay: boolean,
        isMonth: boolean,
        isAnnual: boolean,
        dataVersion?: PerilsOptionsDataVersionEnum
    ) => string | undefined;
};

type HazardColdScoreLevelDescriptionType = {
    [key in ScoreLevel]: (
        isBelowC: boolean,
        isHeatingDeg: boolean,
        isWaveAvgNegC: boolean,
        isWaveMin: boolean,
        dataVersion?: PerilsOptionsDataVersionEnum
    ) => string | undefined;
};

type HazardDroughtScoreLevelDescriptionType = {
    [key in ScoreLevel]: (
        isMonthsExtreme: boolean,
        isWaterStress: boolean,
        dataVersion?: PerilsOptionsDataVersionEnum
    ) => string | undefined;
};

type HazardHailScoreLevelDescriptionType = {
    [key in ScoreLevel]: (
        isLargeHail: boolean,
        isSevereTStorm: boolean,
        dataVersion?: PerilsOptionsDataVersionEnum
    ) => string | undefined;
};

const DEFAULT_DESCRIPTION_VALUE = undefined;

const HAZARD_FLOOD_SCORE_LEVEL_DESCRIPTION: HazardFloodScoreLevelDescriptionType =
    {
        [ScoreLevel.NA]: (): string | undefined => {
            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Lowest]: (
            isFractionMetric: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isFractionMetric) {
                return '0%';
            }

            if (dataVersion === PerilsOptionsDataVersionEnum._262) {
                return '< 0.25 m';
            }

            if (
                dataVersion === PerilsOptionsDataVersionEnum._320 ||
                dataVersion === PerilsOptionsDataVersionEnum._310 ||
                dataVersion === PerilsOptionsDataVersionEnum._300
            ) {
                return '< 0.1 m';
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Low]: (
            isFractionMetric: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isFractionMetric) {
                return '0-25%';
            }

            if (dataVersion === PerilsOptionsDataVersionEnum._262) {
                return '0.25-1.0 m';
            }

            if (
                dataVersion === PerilsOptionsDataVersionEnum._320 ||
                dataVersion === PerilsOptionsDataVersionEnum._310 ||
                dataVersion === PerilsOptionsDataVersionEnum._300
            ) {
                return '0.1 - 0.5 m';
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Medium]: (
            isFractionMetric: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isFractionMetric) {
                return '25-50%';
            }

            if (dataVersion === PerilsOptionsDataVersionEnum._262) {
                return '1.0 - 2.0 m';
            }

            if (
                dataVersion === PerilsOptionsDataVersionEnum._320 ||
                dataVersion === PerilsOptionsDataVersionEnum._310 ||
                dataVersion === PerilsOptionsDataVersionEnum._300
            ) {
                return '0.5 - 1.0 m';
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.High]: (
            isFractionMetric: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isFractionMetric) {
                return '50-75%';
            }

            if (dataVersion === PerilsOptionsDataVersionEnum._262) {
                return '2.0 - 3.0 m';
            }

            if (
                dataVersion === PerilsOptionsDataVersionEnum._320 ||
                dataVersion === PerilsOptionsDataVersionEnum._310 ||
                dataVersion === PerilsOptionsDataVersionEnum._300
            ) {
                return '1.0 - 2.0 m';
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Highest]: (
            isFractionMetric: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isFractionMetric) {
                return '>= 75%';
            }

            if (dataVersion === PerilsOptionsDataVersionEnum._262) {
                return '>= 3.0 m';
            }

            if (
                dataVersion === PerilsOptionsDataVersionEnum._320 ||
                dataVersion === PerilsOptionsDataVersionEnum._310 ||
                dataVersion === PerilsOptionsDataVersionEnum._300
            ) {
                return '>= 2.0 m';
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
    };

const HAZARD_WIND_SCORE_LEVEL_DESCRIPTION: HazardWindScoreLevelDescriptionType =
    {
        [ScoreLevel.NA]: (): string | undefined => {
            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Lowest]: (
            isSpeedYr: boolean,
            isSpeedAvg: boolean,
            isSpeedMax: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isSpeedYr) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '< 119 km/h';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 63 km/h';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSpeedAvg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '< 8 km/h';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSpeedMax) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '< 55 km/h';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Low]: (
            isSpeedYr: boolean,
            isSpeedAvg: boolean,
            isSpeedMax: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isSpeedYr) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '119-154 km/h';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '63-90 km/h';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSpeedAvg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '8-10 km/h';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSpeedMax) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '55-65 km/h';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Medium]: (
            isSpeedYr: boolean,
            isSpeedAvg: boolean,
            isSpeedMax: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isSpeedYr) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '154-178 km/h';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '90-119 km/h';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSpeedAvg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '10-12 km/h';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSpeedMax) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '65-75 km/h';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.High]: (
            isSpeedYr: boolean,
            isSpeedAvg: boolean,
            isSpeedMax: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isSpeedYr) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '178-209 km/h';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '119-178 km/h';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSpeedAvg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '12-14 km/h';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSpeedMax) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '75-85 km/h';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Highest]: (
            isSpeedYr: boolean,
            isSpeedAvg: boolean,
            isSpeedMax: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isSpeedYr) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '>= 209 km/h';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '>= 178 km/h';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSpeedAvg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '>= 14 km/h';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSpeedMax) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '>= 85 km/h';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
    };

const HAZARD_FIRE_SCORE_LEVEL_DESCRIPTION: HazardFireScoreLevelDescriptionType =
    {
        [ScoreLevel.NA]: (): string | undefined => {
            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Lowest]: (
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            switch (dataVersion) {
                case PerilsOptionsDataVersionEnum._320:
                case PerilsOptionsDataVersionEnum._310:
                    return '< 0.1%';
                case PerilsOptionsDataVersionEnum._300:
                case PerilsOptionsDataVersionEnum._262:
                    return '< 2 fires';
                default:
                    return DEFAULT_DESCRIPTION_VALUE;
            }
        },
        [ScoreLevel.Low]: (
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            switch (dataVersion) {
                case PerilsOptionsDataVersionEnum._320:
                case PerilsOptionsDataVersionEnum._310:
                    return '0.1-0.2%';
                case PerilsOptionsDataVersionEnum._300:
                case PerilsOptionsDataVersionEnum._262:
                    return '2-4 fires';
                default:
                    return DEFAULT_DESCRIPTION_VALUE;
            }
        },
        [ScoreLevel.Medium]: (
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            switch (dataVersion) {
                case PerilsOptionsDataVersionEnum._320:
                case PerilsOptionsDataVersionEnum._310:
                    return '0.2-0.4%';
                case PerilsOptionsDataVersionEnum._300:
                case PerilsOptionsDataVersionEnum._262:
                    return '4-8 fires';
                default:
                    return DEFAULT_DESCRIPTION_VALUE;
            }
        },
        [ScoreLevel.High]: (
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            switch (dataVersion) {
                case PerilsOptionsDataVersionEnum._320:
                case PerilsOptionsDataVersionEnum._310:
                    return '0.4-0.7%';
                case PerilsOptionsDataVersionEnum._300:
                case PerilsOptionsDataVersionEnum._262:
                    return '8-20 fires';
                default:
                    return DEFAULT_DESCRIPTION_VALUE;
            }
        },
        [ScoreLevel.Highest]: (
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            switch (dataVersion) {
                case PerilsOptionsDataVersionEnum._320:
                case PerilsOptionsDataVersionEnum._310:
                    return '>= 0.7%';
                case PerilsOptionsDataVersionEnum._300:
                case PerilsOptionsDataVersionEnum._262:
                    return '>= 20 fires';
                default:
                    return DEFAULT_DESCRIPTION_VALUE;
            }
        },
    };

const HAZARD_HEAT_SCORE_LEVEL_DESCRIPTION: HazardHeatScoreLevelDescriptionType =
    {
        [ScoreLevel.NA]: (): string | undefined => {
            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Lowest]: (
            isExceeding: boolean,
            isWBGT: boolean,
            isCooling: boolean,
            isWaveMax35CMin24C: boolean,
            isWaveMax95Pct: boolean,
            isTempAvg: boolean,
            isTempMax: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isExceeding) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '< 2 days';
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 5 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWBGT) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '< 2 days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 5 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isCooling) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '< 400 degC days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 200 degC days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMax35CMin24C) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 0.5 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMax95Pct) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 1 event';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isTempAvg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '< 10C';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isTempMax) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '< 25C';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Low]: (
            isExceeding: boolean,
            isWBGT: boolean,
            isCooling: boolean,
            isWaveMax35CMin24C: boolean,
            isWaveMax95Pct: boolean,
            isTempAvg: boolean,
            isTempMax: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isExceeding) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '2-10 days';
                    case PerilsOptionsDataVersionEnum._262:
                        return '5-10 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWBGT) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '2-10 days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '5-10 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isCooling) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '400-900 degC days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '200-500 degC days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMax35CMin24C) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '0.5-5 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMax95Pct) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '1-5 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isTempAvg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '10-15C';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isTempMax) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '25-30C';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Medium]: (
            isExceeding: boolean,
            isWBGT: boolean,
            isCooling: boolean,
            isWaveMax35CMin24C: boolean,
            isWaveMax95Pct: boolean,
            isTempAvg: boolean,
            isTempMax: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isExceeding) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '10-30 days';
                    case PerilsOptionsDataVersionEnum._262:
                        return '10-20 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWBGT) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '10-60 days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '10-20 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isCooling) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '900-1800 degC days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '500-1000 degC days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMax35CMin24C) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '5-10 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMax95Pct) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '5-10 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isTempAvg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '15-20C';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isTempMax) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '30-35C';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.High]: (
            isExceeding: boolean,
            isWBGT: boolean,
            isCooling: boolean,
            isWaveMax35CMin24C: boolean,
            isWaveMax95Pct: boolean,
            isTempAvg: boolean,
            isTempMax: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isExceeding) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '30-75 days';
                    case PerilsOptionsDataVersionEnum._262:
                        return '20-30 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWBGT) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '60-150 days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '20-30 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isCooling) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '1800-3000 degC days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '1000-2000 degC days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMax35CMin24C) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '10-40 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMax95Pct) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '10-15 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isTempAvg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '20-25C';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isTempMax) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '35-40C';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Highest]: (
            isExceeding: boolean,
            isWBGT: boolean,
            isCooling: boolean,
            isWaveMax35CMin24C: boolean,
            isWaveMax95Pct: boolean,
            isTempAvg: boolean,
            isTempMax: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isExceeding) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '>= 75 days';
                    case PerilsOptionsDataVersionEnum._262:
                        return '> 30 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWBGT) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '>= 150 days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '> 30 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isCooling) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '>= 3000 degC days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '>= 2000 degC days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMax35CMin24C) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '>= 40 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMax95Pct) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '>= 15 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isTempAvg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '>= 25C';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isTempMax) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '>= 40C';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
    };

const HAZARD_PRECIP_SCORE_LEVEL_DESCRIPTION: HazardPrecipScoreLevelDescriptionType =
    {
        [ScoreLevel.NA]: (): string | undefined => {
            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Lowest]: (
            isDay: boolean,
            isMonth: boolean,
            isAnnual: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isDay) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '< 150 mm';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 100 mm';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isMonth) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '< 50 mm';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isAnnual) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '< 600 mm';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Low]: (
            isDay: boolean,
            isMonth: boolean,
            isAnnual: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isDay) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '150-200 mm';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '100-150 mm';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isMonth) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '50-75 mm';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isAnnual) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '600-900 mm';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Medium]: (
            isDay: boolean,
            isMonth: boolean,
            isAnnual: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isDay) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '200-250 mm';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '150-200 mm';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isMonth) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '75-100 mm';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isAnnual) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '900-1200 mm';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.High]: (
            isDay: boolean,
            isMonth: boolean,
            isAnnual: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isDay) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '250-325 mm';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '200-250 mm';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isMonth) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '100-125 mm';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isAnnual) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '1200-1500 mm';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Highest]: (
            isDay: boolean,
            isMonth: boolean,
            isAnnual: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isDay) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '>= 325 mm';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '>= 250 mm';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isMonth) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '>= 125 mm';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isAnnual) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                        return '>= 1500 mm';
                    case PerilsOptionsDataVersionEnum._262:
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
    };

const HAZARD_COLD_SCORE_LEVEL_DESCRIPTION: HazardColdScoreLevelDescriptionType =
    {
        [ScoreLevel.NA]: (): string | undefined => {
            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Lowest]: (
            isBelowC: boolean,
            isHeatingDeg: boolean,
            isWaveAvgNegC: boolean,
            isWaveMin: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isBelowC) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 2 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isHeatingDeg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '< 200 degC days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 200 degC days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveAvgNegC) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '<1 event';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMin) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 0.5 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Low]: (
            isBelowC: boolean,
            isHeatingDeg: boolean,
            isWaveAvgNegC: boolean,
            isWaveMin: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isBelowC) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '2-15 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isHeatingDeg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '200-1200 degC days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '200-500 degC days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveAvgNegC) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '1-5 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMin) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '0.5-1 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Medium]: (
            isBelowC: boolean,
            isHeatingDeg: boolean,
            isWaveAvgNegC: boolean,
            isWaveMin: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isBelowC) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '15-60 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isHeatingDeg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '1200-2200 degC days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '500-1000 degC days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveAvgNegC) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '5-15 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMin) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '1-2 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.High]: (
            isBelowC: boolean,
            isHeatingDeg: boolean,
            isWaveAvgNegC: boolean,
            isWaveMin: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isBelowC) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '60-100 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isHeatingDeg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '2200-3200 degC days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '1000-2000 degC days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveAvgNegC) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '15-40 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMin) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '2-3 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Highest]: (
            isBelowC: boolean,
            isHeatingDeg: boolean,
            isWaveAvgNegC: boolean,
            isWaveMin: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isBelowC) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '>= 100 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isHeatingDeg) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '>= 3200 degC days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '>= 2000 degC days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveAvgNegC) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '>= 40 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaveMin) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '>= 3 events';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
    };

const HAZARD_DROUGHT_SCORE_LEVEL_DESCRIPTION: HazardDroughtScoreLevelDescriptionType =
    {
        [ScoreLevel.NA]: (): string | undefined => {
            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Lowest]: (
            isMonthsExtreme: boolean,
            isWaterStress: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isMonthsExtreme) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 0.1 months';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaterStress) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                        return '< 0.1 months';
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 0.2 months';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Low]: (
            isMonthsExtreme: boolean,
            isWaterStress: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isMonthsExtreme) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '0.1-0.25 months';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaterStress) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                        return '0.1-0.2 months';
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '0.2-0.4 months';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Medium]: (
            isMonthsExtreme: boolean,
            isWaterStress: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isMonthsExtreme) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '0.25-0.5 months';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaterStress) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                        return '0.2-0.4 months';
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '0.4-0.6 months';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.High]: (
            isMonthsExtreme: boolean,
            isWaterStress: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isMonthsExtreme) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '0.5-1.0 months';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaterStress) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                        return '0.4-0.8 months';
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '0.6-0.8 months';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Highest]: (
            isMonthsExtreme: boolean,
            isWaterStress: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isMonthsExtreme) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '>= 1.0 month';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isWaterStress) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '>= 0.8 months';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
    };

const HAZARD_HAIL_SCORE_LEVEL_DESCRIPTION: HazardHailScoreLevelDescriptionType =
    {
        [ScoreLevel.NA]: (): string | undefined => {
            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Lowest]: (
            isLargeHail: boolean,
            isSevereTStorm: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isLargeHail) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '< 0.1 days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 0.2 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSevereTStorm) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '< 5 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Low]: (
            isLargeHail: boolean,
            isSevereTStorm: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isLargeHail) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '0.1-0.35 days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '0.2-1.0 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSevereTStorm) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '5-10 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Medium]: (
            isLargeHail: boolean,
            isSevereTStorm: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isLargeHail) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '0.35-1 days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '1-2 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSevereTStorm) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '10-20 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.High]: (
            isLargeHail: boolean,
            isSevereTStorm: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isLargeHail) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '1-2 days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '2-3 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSevereTStorm) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '20-30 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
        [ScoreLevel.Highest]: (
            isLargeHail: boolean,
            isSevereTStorm: boolean,
            dataVersion?: PerilsOptionsDataVersionEnum
        ): string | undefined => {
            if (isLargeHail) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                        return '>= 2 days';
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '> 3 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }
            if (isSevereTStorm) {
                switch (dataVersion) {
                    case PerilsOptionsDataVersionEnum._320:
                    case PerilsOptionsDataVersionEnum._310:
                    case PerilsOptionsDataVersionEnum._300:
                    case PerilsOptionsDataVersionEnum._262:
                        return '>= 30 days';
                    default:
                        return DEFAULT_DESCRIPTION_VALUE;
                }
            }

            return DEFAULT_DESCRIPTION_VALUE;
        },
    };

export const getHazardScoreLevelDescription = (
    scoreLevel: ScoreLevel,
    score: Score,
    selectedMetric: ResultSetDataSchema,
    dataVersion?: PerilsOptionsDataVersionEnum
): string | undefined => {
    switch (score) {
        case Score.Flood: {
            const isFractionMetric =
                selectedMetric?.id.toLowerCase().includes('fraction') ?? false;
            return HAZARD_FLOOD_SCORE_LEVEL_DESCRIPTION[scoreLevel](
                isFractionMetric,
                dataVersion
            );
        }
        case Score.Wind: {
            const speedYrRegex = /(speed)([0-9]{2,})(yr)/g;
            const isSpeedYr =
                selectedMetric &&
                speedYrRegex.test(selectedMetric.id.toLowerCase());
            const isSpeedAvg =
                selectedMetric?.id.toLowerCase().includes('speedavg') ?? false;
            const isSpeedMax =
                selectedMetric?.id.toLowerCase().includes('speedmax') ?? false;
            return HAZARD_WIND_SCORE_LEVEL_DESCRIPTION[scoreLevel](
                isSpeedYr,
                isSpeedAvg,
                isSpeedMax,
                dataVersion
            );
        }
        case Score.Fire: {
            return HAZARD_FIRE_SCORE_LEVEL_DESCRIPTION[scoreLevel](dataVersion);
        }
        case Score.Heat: {
            const isExceeding =
                selectedMetric?.id.toLowerCase().includes('exceeding') ?? false;
            const isWBGT =
                selectedMetric?.id.toLowerCase().includes('wbgt') ?? false;
            const isCooling =
                selectedMetric?.id.toLowerCase().includes('cooling') ?? false;
            const isWaveMax35CMin24C =
                selectedMetric?.id.toLowerCase().includes('wavemax35cmin24c') ??
                false;
            const isWaveMax95Pct =
                selectedMetric?.id.toLowerCase().includes('wavemax95pct') ??
                false;
            const isTempAvg =
                selectedMetric?.id.toLowerCase().includes('temperatureavg') ??
                false;
            const isTempMax =
                selectedMetric?.id.toLowerCase().includes('temperaturemax') ??
                false;
            return HAZARD_HEAT_SCORE_LEVEL_DESCRIPTION[scoreLevel](
                isExceeding,
                isWBGT,
                isCooling,
                isWaveMax35CMin24C,
                isWaveMax95Pct,
                isTempAvg,
                isTempMax,
                dataVersion
            );
        }
        case Score.Precipitation: {
            const precipMonthRegex =
                /(precip)(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)/g;
            const isDay =
                selectedMetric?.id.toLowerCase().includes('oneday') ?? false;
            const isMonth =
                selectedMetric &&
                precipMonthRegex.test(selectedMetric.id.toLowerCase());
            const isAnnual =
                selectedMetric?.id.toLowerCase().includes('annual') ?? false;
            return HAZARD_PRECIP_SCORE_LEVEL_DESCRIPTION[scoreLevel](
                isDay,
                isMonth,
                isAnnual,
                dataVersion
            );
        }
        case Score.Cold: {
            const isBelowC =
                selectedMetric?.id.toLowerCase().includes('below') ?? false;
            const isHeatingDeg =
                selectedMetric?.id.toLowerCase().includes('heatingdegree') ??
                false;
            const isWaveAvgNegC =
                selectedMetric?.id.toLowerCase().includes('waveavgneg') ??
                false;
            const isWaveMin =
                selectedMetric?.id.toLowerCase().includes('wavemin') ?? false;
            return HAZARD_COLD_SCORE_LEVEL_DESCRIPTION[scoreLevel](
                isBelowC,
                isHeatingDeg,
                isWaveAvgNegC,
                isWaveMin,
                dataVersion
            );
        }
        case Score.Drought: {
            const isMonthsExtreme =
                selectedMetric?.id.toLowerCase().includes('monthsextreme') ??
                false;
            const isWaterStress =
                selectedMetric?.id.toLowerCase().includes('waterstress') ??
                false;
            return HAZARD_DROUGHT_SCORE_LEVEL_DESCRIPTION[scoreLevel](
                isMonthsExtreme,
                isWaterStress,
                dataVersion
            );
        }
        case Score.Hail: {
            const isLargeHail =
                selectedMetric?.id.toLowerCase().includes('largehail') ?? false;
            const isSevereTStorm =
                selectedMetric?.id.toLowerCase().includes('severetstorm') ??
                false;
            return HAZARD_HAIL_SCORE_LEVEL_DESCRIPTION[scoreLevel](
                isLargeHail,
                isSevereTStorm,
                dataVersion
            );
        }
        default: {
            break;
        }
    }
    return '';
};
