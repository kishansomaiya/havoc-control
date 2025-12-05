import { WorkIntensity as ApiWorkIntensity } from '../api/openapi/auto-generated';
import { findByValue } from '../utils/types.util';

export type WorkIntensity = keyof typeof ApiWorkIntensity;
export type WorkIntensityValue =
    (typeof ApiWorkIntensity)[keyof typeof ApiWorkIntensity];

export const WORK_INTENSITY_VALUES: (WorkIntensity | null)[] = [
    'n',
    'l',
    'm',
    'h',
    null,
];

const WORK_INTENSITY_TITLES: { [key in WorkIntensity]: string } = {
    n: 'None',
    l: 'Low',
    m: 'Medium',
    h: 'High',
    unknownDefaultOpenApi: 'Unknown',
};

export function workIntensityFromValue(
    workIntensityValue: string
): WorkIntensity | undefined {
    return findByValue(workIntensityValue, ApiWorkIntensity);
}

export function workIntensityValue(
    workIntensity: WorkIntensity
): WorkIntensityValue {
    return ApiWorkIntensity[workIntensity];
}

export function workIntensityTitle(
    workIntensity: WorkIntensity | null
): string {
    if (workIntensity === null) {
        return 'Unknown';
    }
    return WORK_INTENSITY_TITLES[workIntensity];
}
