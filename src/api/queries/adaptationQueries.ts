import {
    QueryClient,
    useMutation,
    useQuery,
    useQueryClient,
} from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import {
    AnalysisUpdateSettingsRequest,
    UpdateBulkLocationSettingsBody,
    UpdateIndividualLocationSettingsBody,
} from '../openapi/auto-generated';

export const useGetAdaptationLocationList = (analysisId: string) => {
    const { adaptationApi } = useApi();
    return useQuery({
        enabled: !!analysisId,
        queryKey: [analysisId, 'adaptationLocationList'],
        queryFn: ({ signal }) =>
            adaptationApi.postAdaptationResultSetLocationsAdaptationAnalysisAnalysisIdLocationsAssetAttributesPost(
                {
                    analysisId,
                    locationIdsBody: { customerLocationIds: [] },
                },
                { signal }
            ),
        staleTime: Infinity,
        gcTime: Infinity,
    });
};

export const useGetAdaptationAnalysisSettings = (analysisId: string) => {
    const { adaptationApi } = useApi();
    return useQuery({
        enabled: !!analysisId,
        queryKey: [analysisId, 'adaptationAnalysisSettings'],
        queryFn: ({ signal }) =>
            adaptationApi.getAdaptationAnalysisAdaptationAnalysisAnalysisIdGet(
                {
                    analysisId,
                },
                { signal }
            ),
        retry: 0,
        staleTime: Infinity,
        gcTime: Infinity,
    });
};

const invalidateQueries = (queryClient: QueryClient, analysisId: string) => {
    queryClient
        .invalidateQueries({
            queryKey: [analysisId],
            stale: false,
            exact: false,
        })
        .then(() => {
            queryClient.refetchQueries({
                queryKey: [analysisId, 'adaptationAnalysisSettings'],
                stale: true,
                exact: false,
            });
        });
};

export const usePostAdaptationAnalysisSettings = (analysisId: string) => {
    const { adaptationApi } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (
            analysisUpdateSettingsRequest: AnalysisUpdateSettingsRequest
        ) => {
            return adaptationApi.postAdaptationAnalysisAdaptationAnalysisAnalysisIdPost(
                {
                    analysisId,
                    analysisUpdateSettingsRequest,
                }
            );
        },

        onSuccess: () => {
            invalidateQueries(queryClient, analysisId);
        },
    });
};

export const useFetchAdaptationKpis = (
    analysisId: string,
    customerLocationIds: number[]
) => {
    const { adaptationApi } = useApi();
    return useQuery({
        enabled: !!analysisId,
        queryKey: [analysisId, 'adaptationKpis', ...customerLocationIds],
        queryFn: ({ signal }) =>
            adaptationApi.postAdaptationAnalysisAggregateDataAdaptationAnalysisAnalysisIdAggregateDataPost(
                {
                    analysisId,
                    locationIdsBody: { customerLocationIds },
                },
                { signal }
            ),
        retry: 0,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
    });
};

export const useFetchInvestmentMatrix = (
    analysisId: string,
    customerLocationIds: number[]
) => {
    const { adaptationApi } = useApi();
    return useQuery({
        enabled: !!analysisId,
        queryKey: [
            analysisId,
            'adaptationInvestmentMatrix',
            ...customerLocationIds,
        ],
        queryFn: ({ signal }) =>
            adaptationApi.postAdaptationAnalysisIdLocationsDataAdaptationAnalysisAnalysisIdLocationsAnalysisDataPost(
                {
                    analysisId,
                    locationIdsBody: { customerLocationIds },
                },
                { signal }
            ),
        retry: 0,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
    });
};

export const useBulkUpdateAdaptationSettings = (analysisId: string) => {
    const { adaptationApi } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (
            updateBulkLocationSettingsBody: UpdateBulkLocationSettingsBody
        ) => {
            return adaptationApi.postAdaptationAnalysisLocationBulkAdaptationAnalysisAnalysisIdLocationsBulkPost(
                {
                    analysisId,
                    updateBulkLocationSettingsBody,
                }
            );
        },

        onSuccess: () => {
            invalidateQueries(queryClient, analysisId);
        },
    });
};

export const useFetchAdaptationConsistencyState = (
    analysisId: string,
    customerLocationIds: number[]
) => {
    const { adaptationApi } = useApi();
    return useQuery({
        enabled: !!analysisId,
        queryKey: [
            analysisId,
            'adaptationConsistencyState',
            ...customerLocationIds,
        ],
        queryFn: ({ signal }) =>
            adaptationApi.postAdaptationAnalysisLocationSelectionStrategyStateAdaptationAnalysisAnalysisIdLocationsStrategyStatePost(
                {
                    analysisId,
                    locationIdsBody: { customerLocationIds },
                },
                { signal }
            ),
        retry: 0,
        staleTime: Infinity,
        gcTime: Infinity,
        refetchOnMount: false,
    });
};

export const usePostAdaptationIndividualLocations = (analysisId: string) => {
    const { adaptationApi } = useApi();
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (
            updateIndividualLocationSettingsBody: UpdateIndividualLocationSettingsBody
        ) => {
            return adaptationApi.postAdaptationAnalysisLocationIndividualAdaptationAnalysisAnalysisIdLocationsIndividualPost(
                {
                    analysisId,
                    updateIndividualLocationSettingsBody,
                }
            );
        },

        onSuccess: () => {
            invalidateQueries(queryClient, analysisId);
        },
    });
};
