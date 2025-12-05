import { useQuery } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import { useMemo } from 'react';

export const useDoc360TokenQuery = (id: string | undefined) => {
    const { userApi } = useApi();
    const {
        data,
        isLoading: isDoc360TokenLoading,
        isError: isDoc360TokenError,
        refetch: reFetchDoc360Token,
    } = useQuery({
        queryKey: ['doc360', id, 'token'],
        queryFn: ({ signal }) => {
            if (id === undefined) {
                return undefined;
            }
            return userApi.getDoc360Token({ id }, { signal });
        },
        enabled: !!id,
    });

    const token = useMemo(() => data?.token || '', [data]);

    return {
        token,
        isDoc360TokenLoading,
        isDoc360TokenError,
        reFetchDoc360Token,
    };
};
