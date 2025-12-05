import { useQuery } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import { useMemo } from 'react';

export const useUsersQuery = (
    params: {
        cursor?: string;
        pageSize?: number;
        zedToken?: string;
        tenantId?: string;
    } = {}
) => {
    const { userApi } = useApi();

    const {
        data,
        isLoading: isUsersLoading,
        isError: isUsersError,
        refetch: refetchUsers,
    } = useQuery({
        queryKey: ['users', params.tenantId],
        queryFn: ({ signal }) => userApi.listUsers(params, { signal }),
        enabled: !!params.tenantId,
    });

    const users = useMemo(() => data?.items, [data]);
    return {
        users,
        isUsersLoading,
        isUsersError,
        refetchUsers,
    };
};

export const useGetUserPermissionsQuery = (userId: string) => {
    const { userApi } = useApi();

    const {
        data,
        isLoading: isUserPermissionsLoading,
        isError: isUserPermissionsError,
        refetch: refetchUserPermissions,
    } = useQuery({
        enabled: !!userId,
        queryKey: ['userPermissions', userId],
        queryFn: ({ signal }) =>
            userApi.getUserPermissions({ id: userId }, { signal }),
    });

    const userPermissions = useMemo(() => data?.permissions, [data]);

    return {
        userPermissions,
        isUserPermissionsLoading,
        isUserPermissionsError,
        refetchUserPermissions,
    };
};
