import {
    FloodDefenseOptions,
    PerilsResultSetOptions,
    PerilsResultSetOptionsPerilsEnum,
    PerilsResultSetOptionsTypeEnum,
    PerilsResultSetOptionsYearsEnum,
} from '../../api/openapi/auto-generated';
import { DataVersion, Peril, Scenario } from '../../types';

type FloodDefenseFlags = {
    [key in keyof FloodDefenseOptions]: boolean | undefined;
};

export const PERIL_FLOOD_DEFENSE_DISABLED_OPTIONS: {
    [key in DataVersion]: FloodDefenseFlags;
} = {
    [DataVersion.v3_3_0]: {
        zeroOutDefendedLocations: true,
    },
    [DataVersion.v3_2_0]: {
        zeroOutDefendedLocations: true,
    },
    [DataVersion.v3_1_0]: {
        zeroOutDefendedLocations: true,
    },
    [DataVersion.v3_0_0]: {
        zeroOutDefendedLocations: true,
    },
    [DataVersion.v2_6_2]: {
        zeroOutDefendedLocations: false,
    },
};

export const PERILS_YEARS: PerilsResultSetOptionsYearsEnum[] = [
    1995, 2020, 2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060, 2065, 2070,
    2075, 2080, 2085, 2090, 2095, 2100,
];

const DEFAULT_PERILS_YEARS = PERILS_YEARS;

export const ALL_PERILS: PerilsResultSetOptionsPerilsEnum[] = [
    Peril.Wind,
    Peril.Cold,
    Peril.Precipitation,
    Peril.Heat,
    Peril.CombinedFlood,
    Peril.Hail,
    Peril.Drought,
    Peril.Fire,
    Peril.CoastalFlood,
    Peril.FluvialFlood,
    Peril.PluvialFlood,
    Peril.Subsidence,
];

const DEFAULT_PERILS: PerilsResultSetOptionsPerilsEnum[] = [
    Peril.Wind,
    Peril.Cold,
    Peril.Precipitation,
    Peril.Heat,
    Peril.CombinedFlood,
    Peril.Hail,
    Peril.Drought,
    Peril.Fire,
];

export const DISABLED_PERILS: {
    [key in DataVersion]: Peril[];
} = {
    [DataVersion.v3_3_0]: [],
    [DataVersion.v3_2_0]: [Peril.Subsidence],
    [DataVersion.v3_1_0]: [Peril.Subsidence],
    [DataVersion.v3_0_0]: [Peril.Subsidence],
    [DataVersion.v2_6_2]: [
        Peril.CoastalFlood,
        Peril.FluvialFlood,
        Peril.PluvialFlood,
        Peril.Subsidence,
    ],
};

export const DEFAULT_PERIL_RESULT_SET_OPTIONS: {
    [key in DataVersion]: PerilsResultSetOptions;
} = {
    [DataVersion.v3_3_0]: {
        dataVersion: DataVersion.v3_3_0,
        scenarios: [
            Scenario.Baseline,
            Scenario.SSP126,
            Scenario.SSP245,
            Scenario.SSP585,
        ],
        years: [...DEFAULT_PERILS_YEARS],
        perils: [...DEFAULT_PERILS, Peril.Subsidence],
        floodDefense: {
            enabled: true,
            zeroOutDefendedLocations: true,
        },
        type: PerilsResultSetOptionsTypeEnum.perils,
    },
    [DataVersion.v3_2_0]: {
        dataVersion: DataVersion.v3_2_0,
        scenarios: [
            Scenario.Baseline,
            Scenario.SSP126,
            Scenario.SSP245,
            Scenario.SSP585,
        ],
        years: [...DEFAULT_PERILS_YEARS],
        perils: DEFAULT_PERILS,
        floodDefense: {
            enabled: true,
            zeroOutDefendedLocations: true,
        },
        type: PerilsResultSetOptionsTypeEnum.perils,
    },
    [DataVersion.v3_1_0]: {
        dataVersion: DataVersion.v3_1_0,
        scenarios: [
            Scenario.Baseline,
            Scenario.SSP126,
            Scenario.SSP245,
            Scenario.SSP585,
        ],
        years: [...DEFAULT_PERILS_YEARS],
        perils: DEFAULT_PERILS,
        floodDefense: {
            enabled: true,
            zeroOutDefendedLocations: true,
        },
        type: PerilsResultSetOptionsTypeEnum.perils,
    },
    [DataVersion.v3_0_0]: {
        dataVersion: DataVersion.v3_0_0,
        scenarios: [
            Scenario.Baseline,
            Scenario.SSP126,
            Scenario.SSP245,
            Scenario.SSP585,
        ],
        years: [...DEFAULT_PERILS_YEARS],
        perils: DEFAULT_PERILS,
        floodDefense: {
            enabled: true,
            zeroOutDefendedLocations: true,
        },
        type: PerilsResultSetOptionsTypeEnum.perils,
    },
    [DataVersion.v2_6_2]: {
        dataVersion: DataVersion.v2_6_2,
        scenarios: [
            Scenario.Baseline,
            Scenario.SSP126,
            Scenario.SSP245,
            Scenario.SSP585,
        ],
        years: [...DEFAULT_PERILS_YEARS],
        perils: DEFAULT_PERILS,
        floodDefense: {
            enabled: true,
            zeroOutDefendedLocations: true,
        },
        type: PerilsResultSetOptionsTypeEnum.perils,
    },
};
