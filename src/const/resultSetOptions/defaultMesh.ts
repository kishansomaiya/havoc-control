import {
    FloodType,
    MeshResultSetOptions,
    MeshResultSetOptionsTypeEnum,
    MeshResultSetOptionsYearsEnum,
} from '../../api/openapi/auto-generated';
import { DataVersion, Peril, Scenario } from '../../types';

export const MESH_YEARS: MeshResultSetOptionsYearsEnum[] = [
    1995, 2020, 2025, 2030, 2035, 2040, 2045, 2050, 2055, 2060, 2065, 2070,
    2075, 2080, 2085, 2090, 2095, 2100,
];

const DEFAULT_MESH_YEARS: MeshResultSetOptionsYearsEnum[] = [
    1995, 2020, 2030, 2040, 2050, 2075, 2100,
];

const DEFAULT_FLOOD_TYPES: FloodType[] = [
    Peril.Wind,
    Peril.Cold,
    Peril.Precipitation,
    Peril.Heat,
    Peril.CombinedFlood,
    Peril.Hail,
    Peril.Drought,
    Peril.Fire,
    Peril.Subsidence,
] as FloodType[];

export const DEFAULT_MESH_RESULT_SET_OPTIONS: {
    [key in DataVersion]: MeshResultSetOptions;
} = {
    [DataVersion.v3_3_0]: {
        dataVersion: DataVersion.v3_3_0,
        scenarios: [
            Scenario.Baseline,
            Scenario.SSP126,
            Scenario.SSP245,
            Scenario.SSP585,
        ],
        years: [...DEFAULT_MESH_YEARS],
        perils: DEFAULT_FLOOD_TYPES,
        floodDefense: {
            enabled: false,
            zeroOutDefendedLocations: false,
        },
        type: MeshResultSetOptionsTypeEnum.mesh,
    },
    [DataVersion.v3_2_0]: {
        dataVersion: DataVersion.v3_2_0,
        scenarios: [
            Scenario.Baseline,
            Scenario.SSP126,
            Scenario.SSP245,
            Scenario.SSP585,
        ],
        years: [...DEFAULT_MESH_YEARS],
        perils: DEFAULT_FLOOD_TYPES,
        floodDefense: {
            enabled: false,
            zeroOutDefendedLocations: false,
        },
        type: MeshResultSetOptionsTypeEnum.mesh,
    },
    [DataVersion.v3_1_0]: {
        dataVersion: DataVersion.v3_1_0,
        scenarios: [
            Scenario.Baseline,
            Scenario.SSP126,
            Scenario.SSP245,
            Scenario.SSP585,
        ],
        years: [...DEFAULT_MESH_YEARS],
        perils: DEFAULT_FLOOD_TYPES,
        floodDefense: {
            enabled: false,
            zeroOutDefendedLocations: false,
        },
        type: MeshResultSetOptionsTypeEnum.mesh,
    },
    [DataVersion.v3_0_0]: {
        dataVersion: DataVersion.v3_0_0,
        scenarios: [
            Scenario.Baseline,
            Scenario.SSP126,
            Scenario.SSP245,
            Scenario.SSP585,
        ],
        years: [...DEFAULT_MESH_YEARS],
        perils: DEFAULT_FLOOD_TYPES,
        floodDefense: {
            enabled: false,
            zeroOutDefendedLocations: false,
        },
        type: MeshResultSetOptionsTypeEnum.mesh,
    },
    [DataVersion.v2_6_2]: {
        dataVersion: DataVersion.v2_6_2,
        scenarios: [
            Scenario.Baseline,
            Scenario.SSP126,
            Scenario.SSP245,
            Scenario.SSP585,
        ],
        years: [...DEFAULT_MESH_YEARS],
        perils: DEFAULT_FLOOD_TYPES,
        floodDefense: {
            enabled: false,
            zeroOutDefendedLocations: false,
        },
        type: MeshResultSetOptionsTypeEnum.mesh,
    },
};
