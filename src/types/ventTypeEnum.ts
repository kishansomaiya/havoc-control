import { VentType as ApiVentType } from '../api/openapi/auto-generated';
import { findByValue } from '../utils/types.util';

export type VentType = keyof typeof ApiVentType;
export type VentTypeValue = (typeof ApiVentType)[keyof typeof ApiVentType];

export const VENT_TYPE_VALUES: (VentType | null)[] = [
    'exposed',
    'nonExposed',
    null,
];

const VENT_TYPE_TITLES: { [key in VentType]: string } = {
    exposed: 'Exposed',
    nonExposed: 'Non Exposed',
    none: 'None',
    unknown: 'Unknown',
    unknownDefaultOpenApi: 'Unknown',
};

export function ventTypeFromValue(ventTypeValue: string): VentType | undefined {
    return findByValue(ventTypeValue, ApiVentType);
}

export function ventTypeValue(ventType: VentType): VentTypeValue {
    return ApiVentType[ventType];
}

export function ventTypeTitle(ventType: VentType | null): string {
    if (ventType === null) {
        return 'Unknown';
    }
    return VENT_TYPE_TITLES[ventType];
}
