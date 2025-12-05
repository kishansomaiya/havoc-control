import { RoofCover as ApiRoofCover } from '../api/openapi/auto-generated';
import { findByValue } from '../utils/types.util';

export type RoofCover = keyof typeof ApiRoofCover;
export type RoofCoverValue = (typeof ApiRoofCover)[keyof typeof ApiRoofCover];

export const ROOF_COVER_VALUES: (RoofCover | null)[] = ['wood', 'other', null];

const ROOF_COVER_TITLES: { [key in RoofCover]: string } = {
    wood: 'Wood',
    other: 'Other',
    unknown: 'Unknown',
    unknownDefaultOpenApi: 'Unknown',
};

export function roofCoverFromValue(
    roofCoverValue: string
): RoofCover | undefined {
    return findByValue(roofCoverValue, ApiRoofCover);
}

export function roofCoverValue(roofCover: RoofCover): RoofCoverValue {
    return ApiRoofCover[roofCover];
}

export function roofCoverTitle(roofCover: RoofCover | null): string {
    if (roofCover === null) {
        return 'Unknown';
    }
    return ROOF_COVER_TITLES[roofCover];
}
