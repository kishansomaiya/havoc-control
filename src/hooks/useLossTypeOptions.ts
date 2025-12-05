import { LOSS_TYPE_TITLES } from '../const';
import { useMemo } from 'react';
import { LossType } from '../types';

export const useLossTypeOptions = (): Array<{
    id: LossType;
    title: string;
}> => {
    return useMemo(() => {
        return Object.entries(LOSS_TYPE_TITLES).map(([id, title]) => ({
            id: id as LossType,
            title,
        }));
    }, []);
};
