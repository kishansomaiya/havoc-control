import { useQuery } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import { useMemo } from 'react';

export const useClientsQuery = (userId: string | undefined) => {
    const { clientsApi } = useApi();
    const {
        data,
        isLoading: isClientsLoading,
        isError: isClientsError,
        refetch: reFetchClients,
    } = useQuery({
        queryKey: ['clients', userId],
        queryFn: ({ signal }) => {
            if (userId === undefined) {
                return undefined;
            }
            return clientsApi.listClientClientsGet({ userId }, { signal });
        },
        enabled: !!userId,
    });

    const clients = useMemo(() => data?.clients || [], [data]);

    return {
        clients,
        isClientsLoading,
        isClientsError,
        reFetchClients,
    };
};
