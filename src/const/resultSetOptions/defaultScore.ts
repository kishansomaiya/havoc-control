import {
    ScoresResultSetOptions,
    ScoresResultSetOptionsTypeEnum,
} from '../../api/openapi/auto-generated';
import { BenchmarkLevel, DataVersion, Score } from '../../types';

export const DEFAULT_SCORE_RESULT_SET_OPTIONS: {
    [key in DataVersion]: ScoresResultSetOptions;
} = {
    [DataVersion.v3_3_0]: {
        dataVersion: DataVersion.v3_3_0,
        includeBenchmarks: true,
        perils: [
            Score.All,
            Score.Cold,
            Score.Flood,
            Score.Drought,
            Score.Fire,
            Score.Hail,
            Score.Heat,
            Score.Precipitation,
            Score.Wind,
            Score.Subsidence,
        ],
        benchmarkLevels: [BenchmarkLevel.Country, BenchmarkLevel.Admin1],
        type: ScoresResultSetOptionsTypeEnum.scores,
    },
    [DataVersion.v3_2_0]: {
        dataVersion: DataVersion.v3_2_0,
        includeBenchmarks: true,
        perils: [
            Score.All,
            Score.Cold,
            Score.Flood,
            Score.Drought,
            Score.Fire,
            Score.Hail,
            Score.Heat,
            Score.Precipitation,
            Score.Wind,
        ],
        benchmarkLevels: [BenchmarkLevel.Country, BenchmarkLevel.Admin1],
        type: ScoresResultSetOptionsTypeEnum.scores,
    },
    [DataVersion.v3_1_0]: {
        dataVersion: DataVersion.v3_1_0,
        includeBenchmarks: true,
        perils: [
            Score.All,
            Score.Cold,
            Score.Flood,
            Score.Drought,
            Score.Fire,
            Score.Hail,
            Score.Heat,
            Score.Precipitation,
            Score.Wind,
        ],
        benchmarkLevels: [BenchmarkLevel.Country, BenchmarkLevel.Admin1],
        type: ScoresResultSetOptionsTypeEnum.scores,
    },
    [DataVersion.v3_0_0]: {
        dataVersion: DataVersion.v3_0_0,
        perils: [
            Score.All,
            Score.Cold,
            Score.Flood,
            Score.Drought,
            Score.Fire,
            Score.Hail,
            Score.Heat,
            Score.Precipitation,
            Score.Wind,
        ],
        benchmarkLevels: [BenchmarkLevel.Country, BenchmarkLevel.Admin1],
        type: ScoresResultSetOptionsTypeEnum.scores,
    },
    [DataVersion.v2_6_2]: {
        dataVersion: DataVersion.v2_6_2,
        perils: [
            Score.All,
            Score.Cold,
            Score.Flood,
            Score.Drought,
            Score.Fire,
            Score.Hail,
            Score.Heat,
            Score.Precipitation,
            Score.Wind,
        ],
        benchmarkLevels: [BenchmarkLevel.Country, BenchmarkLevel.Admin1],
        type: ScoresResultSetOptionsTypeEnum.scores,
    },
};
