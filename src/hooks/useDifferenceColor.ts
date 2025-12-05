import { useMemo } from 'react';

export const useDifferenceColor = (differenceValue?: number | null) => {
    return useMemo(() => {
        if (!differenceValue && differenceValue !== 0) {
            return 'inherit';
        }
        return differenceValue >= 0
            ? 'success.main'
            : differenceValue < 0
              ? 'error.light'
              : 'inherit';
    }, [differenceValue]);
};
