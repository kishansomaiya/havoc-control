import { useQuery } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import { useMemo } from 'react';
import { useSetZedToken, useZedToken } from '../../context/ZedTokenProvider';

export const useClientsQuery = (userId: string | undefined) => {
    const { m2mClient } = useApi();
    const { clientZedToken } = useZedToken();
    const { handleSetClientZedToken } = useSetZedToken();

    // Step 1: Fetch client IDs
    const {
        data,
        isLoading: isClientsLoading,
        isError: isClientsError,
        refetch: reFetchClients,
    } = useQuery({
        queryKey: ['clients', userId],
        queryFn: ({ signal }) => {
            return m2mClient.listClient(
                {
                    zedToken: clientZedToken || undefined,
                    userId,
                },
                { signal }
            );
        },
        enabled: !!userId,
    });

    const clientsIds = useMemo(
        () => data?.items?.map((client) => client.id) || [],
        [data]
    );

    // Step 2: Fetch full client details based on IDs
    const { data: clientsDetailsData } = useQuery({
        queryKey: ['clientsDetails', clientsIds],
        queryFn: async ({ signal }) => {
            if (clientsIds.length === 0) {
                return undefined;
            }
            const responses = await Promise.all(
                clientsIds.map((id) =>
                    m2mClient.getClientCredentials({ id }, { signal })
                )
            );

            // Extract the relevant data from each response
            return responses.map((response, index) => ({
                ...response,
                id: clientsIds[index], // Add the respective client ID
            }));
        },
        enabled: clientsIds.length > 0,
    });
    handleSetClientZedToken(undefined);

    return {
        clientsDetailsData,
        isClientsLoading,
        isClientsError,
        reFetchClients,
    };
};
