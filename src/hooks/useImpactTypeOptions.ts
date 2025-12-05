import { IMPACT_TYPE_TITLES } from '../const';
import { useMemo } from 'react';
import { ImpactType } from '../types';

export const useImpactTypeOptions = (): Array<{
    id: ImpactType;
    title: string;
}> => {
    return useMemo(() => {
        return Object.entries(IMPACT_TYPE_TITLES).map(([id, title]) => ({
            id: id as ImpactType,
            title,
        }));
    }, []);
};
