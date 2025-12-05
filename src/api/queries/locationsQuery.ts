import { useQuery } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import { NO_AVAILABLE_SCORE } from '../../const';
import { useMemo } from 'react';

export const useLocationsQuery = (
    params: {
        limit?: number;
        portfolioId?: string;
    } = {}
) => {
    const { locationsApi } = useApi();
    const {
        data,
        isLoading: isLocationsLoading,
        isError: isLocationsError,
    } = useQuery({
        queryKey: ['locations', params.portfolioId],
        queryFn: ({ signal }) => {
            if (params.portfolioId === undefined) {
                return undefined;
            }
            return locationsApi.listLocationsLocationsGet(params, { signal });
        },
        enabled: !!params.portfolioId,
    });
    // Temporary solution for randomly generated values
    const generateRandomScore = (maxValue?: number) => {
        if (Math.floor(Math.random() * 10) <= 1) {
            return NO_AVAILABLE_SCORE;
        }
        return Math.floor(Math.random() * (maxValue || 100)) + 1;
    };

    const locations = useMemo(
        () =>
            (data?.data || []).map((location) => ({
                ...location,
                scores: {
                    // allPerils related scores
                    AP_overall_score: generateRandomScore(),

                    // cold related scores
                    CD_overall_score: generateRandomScore(23),

                    // combinedFlood related scores
                    FL_overall_score: generateRandomScore(13),

                    // drought related scores
                    DT_overall_score: generateRandomScore(90),

                    // fire related scores
                    FR_overall_score: generateRandomScore(45),

                    // hail related scores
                    HL_overall_score: generateRandomScore(),

                    // heat related scores
                    HT_overall_score: generateRandomScore(38),

                    // precip related scores
                    PR_overall_score: generateRandomScore(50),

                    // wind related scores
                    WS_overall_score: generateRandomScore(9),
                },
            })),
        [data]
    );

    return {
        locations,
        isLocationsLoading,
        isLocationsError,
    };
};
