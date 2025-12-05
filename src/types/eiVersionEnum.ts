import { DataVersion } from './dataVersionEnum';

export enum EIVersion {
    v3_3_0 = '3.3.0',
    v3_2_0 = '3.2.0',
    v3_1_2 = '3.1.2',
    v3_1_1 = '3.1.1',
    v3_1_0 = '3.1.0',
    v3_0_0 = '3.0.0',
    v2_6_2 = '2.6.2',
}

export function eiVersionFromValue(value: string): EIVersion | undefined {
    return Object.values(EIVersion).includes(value as EIVersion)
        ? (value as EIVersion)
        : undefined;
}

export const EI_VERSIONS_BY_DATA_VERSION = {
    [DataVersion.v3_3_0]: [EIVersion.v3_3_0],
    [DataVersion.v3_2_0]: [EIVersion.v3_2_0],
    [DataVersion.v3_1_0]: [EIVersion.v3_1_2, EIVersion.v3_1_0],
    [DataVersion.v3_0_0]: [EIVersion.v3_0_0],
    [DataVersion.v2_6_2]: [EIVersion.v2_6_2],
};

export const EI_VERSIONS_BY_DATA_VERSION_CUST = {
    ...EI_VERSIONS_BY_DATA_VERSION,
    [DataVersion.v3_1_0]: [EIVersion.v3_1_1, EIVersion.v3_1_0],
};

export const getEIToDataVersionMap = (hasEI_3_1_1: boolean = false) =>
    hasEI_3_1_1
        ? EI_VERSIONS_BY_DATA_VERSION_CUST
        : EI_VERSIONS_BY_DATA_VERSION;
