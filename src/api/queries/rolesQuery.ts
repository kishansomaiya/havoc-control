import {
    InfiniteData,
    QueryKey,
    useInfiniteQuery,
    useQuery,
} from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import { useMemo } from 'react';
import {
    ListRolesSortOrderEnum,
    PaginatedRoleResultResponse,
    RoleResponse,
} from '../openapi/auto-generated-admin';
import { useSetZedToken, useZedToken } from '../../context/ZedTokenProvider';

export const useRolesQuery = (
    params: {
        cursor?: string;
        pageSize?: number;
        sortOrder?: ListRolesSortOrderEnum;
        zedToken?: string;
        tenantId?: string;
    } = {}
) => {
    const { roleApi } = useApi();
    const { roleZedToken } = useZedToken();
    const { handleSetRoleZedToken } = useSetZedToken();

    const {
        data,
        isLoading: isRolesLoading,
        isError: isRolesError,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetch: refetchRoles,
        isRefetching: isRolesRefetching,
    } = useInfiniteQuery<
        PaginatedRoleResultResponse | undefined,
        Error,
        InfiniteData<PaginatedRoleResultResponse, string | undefined>,
        QueryKey,
        string | undefined
    >({
        queryKey: ['roles', params.sortOrder, params.pageSize],
        queryFn: async ({ pageParam, signal }) => {
            return await roleApi.listRoles(
                {
                    ...params,
                    cursor: pageParam,
                    zedToken: roleZedToken || undefined,
                },
                { signal }
            );
        },
        getNextPageParam: (lastPage, _allPages) => {
            return lastPage?.hasNextPage && lastPage?.items?.length
                ? lastPage.items.slice(-1)[0].role.id // or .cursor if that's the correct field
                : undefined;
        },
        initialPageParam: undefined,
        enabled: true,
    });

    const { roles, hasMoreRoles } = useMemo(() => {
        if (!data) {
            return {
                roles1: [],
                hasMoreRoles: false,
            };
        }
        const { pages } = data;
        const { items: roles, hasNextPage: hasMoreRoles } = pages.reduce<{
            items: RoleResponse[];
            hasNextPage: boolean;
        }>(
            (acc, currPage) => {
                return {
                    items: [...acc.items, ...currPage.items],
                    hasNextPage: currPage.hasNextPage,
                };
            },
            { items: [], hasNextPage: pages.length > 0 }
        );
        return {
            roles,
            hasMoreRoles,
        };
    }, [data]);

    // Optionally reset zedToken after fetching
    handleSetRoleZedToken(undefined);
    return {
        data,
        roles,
        isRolesLoading,
        isRolesError,
        hasMoreRoles,
        fetchNextPage,
        hasNextPage,
        isFetchingNextPage,
        refetchRoles,
        isRolesRefetching,
    };
};

export const useRoleQuery = (id: string | undefined) => {
    const { roleApi } = useApi();
    const {
        data,
        isLoading: isRoleLoading,
        isError: isRoleError,
        refetch: refetchRole,
    } = useQuery({
        queryKey: ['roles', id],
        queryFn: ({ signal }) => {
            if (id === undefined) {
                return undefined;
            }
            return roleApi.getRole({ id: id }, { signal });
        },
    });

    return {
        role: data,
        isRoleLoading,
        isRoleError,
        refetchRole,
    };
};
