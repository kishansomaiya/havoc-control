import { useFlags } from 'flagsmith/react';
import camelCase from 'lodash/camelCase';
import mapKeys from 'lodash/mapKeys';
import { featureFlags, FeatureFlags } from './featureFlags';
import { mapValues } from 'lodash';

export function useFeatureFlags<T extends FeatureFlags>(flags: T | T[]) {
    const flagsArr = Array.isArray(flags) ? flags : [flags];
    const mappedFlags = flagsArr.map((flag) => featureFlags[flag]);

    const flagState = useFlags(mappedFlags);

    return mapValues(
        mapKeys(flagState, (_, key) => camelCase(key)),
        (val) => val?.enabled ?? false
    ) as Record<T, boolean>;
}
