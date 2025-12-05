import { findByValue } from '../utils/types.util';

const ApiOccupancyScheme = {
    ATC: 'ATC',
    OED: 'OED',
} as const;

export type OccupancyScheme = keyof typeof ApiOccupancyScheme;
export type OccupancySchemeValue =
    (typeof ApiOccupancyScheme)[keyof typeof ApiOccupancyScheme];

export const OCCUPANCY_SCHEME_VALUES: OccupancyScheme[] = ['ATC', 'OED'];

const OCCUPANCY_SCHEME_TITLES: { [key in OccupancyScheme]: string } = {
    ATC: 'ATC',
    OED: 'OED',
};

const OED_OCCUPANCY_CODES: number[] = [
    1000, 1050, 1051, 1052, 1053, 1054, 1055, 1056, 1057, 1058, 1070, 1071,
    1072, 1073, 1100, 1101, 1102, 1103, 1104, 1105, 1106, 1107, 1108, 1109,
    1110, 1111, 1112, 1113, 1114, 1115, 1116, 1117, 1118, 1119, 1120, 1121,
    1122, 1123, 1124, 1150, 1151, 1152, 1153, 1154, 1155, 1156, 1157, 1158,
    1159, 1200, 1201, 1210, 1211, 1212, 1213, 1214, 1215, 1220, 1230, 1231,
    1250, 1251, 1252, 1253, 1254, 1255, 1256, 1300, 1301, 1302, 1303, 1304,
    1305, 1350, 1351, 1352, 2000, 2050, 2051, 2052, 2053, 2054, 2055, 2056,
    2057, 2058, 2100, 2101, 2102, 2103, 2104, 2105, 2106, 2107, 2108, 2109,
    2110, 2111, 2150, 2151, 2152, 2153, 2154, 2155, 2200, 2201, 2202, 2203,
    2204, 2205, 2206, 2207, 2208, 2250, 2251, 2252, 2253, 2300, 2301, 2302,
    2303, 2304, 2305, 2350, 2351, 2352, 2400, 2401, 2402, 2403, 2404, 2450,
    2460, 2461, 2470, 2500, 2505, 2510, 2515, 2520, 2521, 2530, 2531, 2541,
    2542, 2550, 2560, 2600, 2610, 2611, 2612, 2613, 2620, 2650, 2700, 2750,
    2760, 2770, 2780,
];

export function isValidOccupancyCode(
    occupancyScheme: OccupancyScheme,
    occupancyCode: number
): boolean {
    if (occupancyScheme === 'ATC') {
        return occupancyCode >= 0 && occupancyCode <= 39;
    } else if (occupancyScheme === 'OED') {
        return OED_OCCUPANCY_CODES.includes(occupancyCode);
    }
    return false;
}

export function occupancySchemeFromValue(
    occupancySchemeValue: string
): OccupancyScheme | undefined {
    return findByValue(occupancySchemeValue, ApiOccupancyScheme);
}

export function occupancySchemeValue(
    occupancyScheme: OccupancyScheme
): OccupancySchemeValue {
    return ApiOccupancyScheme[occupancyScheme];
}

export function occupancySchemeTitle(occupancyScheme: OccupancyScheme): string {
    return OCCUPANCY_SCHEME_TITLES[occupancyScheme] ?? 'Unknown';
}
