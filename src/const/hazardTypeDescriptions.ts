import { HazardType } from '../types';

export const HAZARD_TYPE_DESCRIPTIONS = {
    [HazardType.Current]: 'Measures the absolute level of hazard for 2020',
    [HazardType.Change]:
        'Measures the level of change between the years 2050 and 2020',
    [HazardType.Overall]:
        'Combines the hazard and change scores and benchmarks this value against a global weighted average of the scores in populated areas',
};
