export enum DataVersion {
    v3_3_0 = '3.3.0',
    v3_2_0 = '3.2.0',
    v3_1_0 = '3.1.0',
    v3_0_0 = '3.0.0',
    v2_6_2 = '2.6.2',
}

export function dataVersionFromValue(value: string): DataVersion | undefined {
    return Object.values(DataVersion).includes(value as DataVersion)
        ? (value as DataVersion)
        : undefined;
}
