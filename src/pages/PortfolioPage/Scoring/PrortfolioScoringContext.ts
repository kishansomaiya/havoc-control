import { createContext, useContext } from 'react';

export const ScoringLocationIdContext = createContext<number | undefined>(
    undefined
);
export const useScoringLocationId = (): number | undefined => {
    return useContext<number | undefined>(ScoringLocationIdContext);
};
