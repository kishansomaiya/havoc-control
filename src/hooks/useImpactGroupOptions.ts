import { LOCATION_IMPACT_GROUP_TITLE } from '../const';
import { useMemo } from 'react';
import { LocationImpactGroup } from '../types';

export const useImpactGroupOptions = (): Array<{
    id: LocationImpactGroup;
    title: string;
}> => {
    return useMemo(() => {
        return Object.entries(LOCATION_IMPACT_GROUP_TITLE).map(
            ([id, title]) => ({
                id: id as LocationImpactGroup,
                title,
            })
        );
    }, []);
};
