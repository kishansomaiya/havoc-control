import { findByValue } from '../utils/types.util';

const ApiBasementCode = {
    unknown: 0,
    notPresent: 1,
    present: 2,
} as const;

export type BasementCode = keyof typeof ApiBasementCode;
export type BasementCodeValue =
    (typeof ApiBasementCode)[keyof typeof ApiBasementCode];

export const BASEMENT_CODE_VALUES: BasementCode[] = [
    'unknown',
    'notPresent',
    'present',
];

const BASEMENT_CODE_TITLES: { [key in BasementCode]: string } = {
    unknown: '0 - Unknown',
    notPresent: '1 - Not Present',
    present: '2 - Present',
};

export function basementCodeFromValue(
    basementCodeValue: number
): BasementCode | undefined {
    return findByValue(basementCodeValue, ApiBasementCode);
}

export function basementCodeValue(
    basementCode: BasementCode
): BasementCodeValue {
    return ApiBasementCode[basementCode];
}

export function basementCodeTitle(basementCode: BasementCode): string {
    return BASEMENT_CODE_TITLES[basementCode] ?? 'Unknown';
}
