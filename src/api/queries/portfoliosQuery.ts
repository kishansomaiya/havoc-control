import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import {
    ListingMode,
    PortfolioResponse,
    ResultSetType,
} from '../openapi/auto-generated';
import { useMemo } from 'react';

export const usePortfoliosQuery = (
    params: {
        limit?: number;
        startingAfter?: string;
        listingMode?: ListingMode;
        zedToken?: string;
    } = {}
) => {
    const { portfoliosApi } = useApi();
    const {
        data,
        isLoading: isPortfoliosLoading,
        isError: isPortfoliosError,
        refetch: refetchPortfolios,
        fetchNextPage: fetchNextPortfolios,
        isFetchingNextPage: isMorePortfoliosLoading,
    } = useInfiniteQuery({
        initialPageParam: undefined,
        queryKey: ['portfolios', params.listingMode],
        queryFn: ({
            pageParam: curPos,
            signal,
        }: {
            pageParam?: string;
            signal?: AbortSignal;
        }) => {
            return portfoliosApi.listPortfoliosPortfoliosGet(
                { startingAfter: curPos, ...params },
                { signal }
            );
        },
        getNextPageParam: (lastPage) => {
            return lastPage?.hasMore && lastPage?.data?.length
                ? lastPage.data.slice(-1)[0].id
                : undefined;
        },
        enabled: true,
    });

    const { portfolios, hasMorePortfolios } = useMemo(() => {
        if (!data) {
            return {
                portfolios: [],
            };
        }
        const { pages } = data;
        const { data: portfolios, hasMore: hasMorePortfolios } = pages.reduce<{
            data: PortfolioResponse[];
            hasMore: boolean;
        }>(
            (acc, currPage) => {
                return {
                    data: [...acc.data, ...currPage.data],
                    hasMore: currPage.hasMore,
                };
            },
            { data: [], hasMore: pages.length > 0 }
        );
        return {
            portfolios,
            hasMorePortfolios,
        };
    }, [data]);

    return {
        data,
        portfolios,
        hasMorePortfolios,
        fetchNextPortfolios,
        isMorePortfoliosLoading,
        isPortfoliosLoading,
        isPortfoliosError,
        refetchPortfolios,
    };
};

export const usePortfolioQuery = (id: string | undefined) => {
    const { portfoliosApi } = useApi();
    const {
        data,
        isLoading: isPortfolioLoading,
        isError: isPortfolioError,
        refetch: refetchPortfolio,
    } = useQuery({
        enabled: !!id,
        queryKey: ['portfolios', id],
        queryFn: ({ signal }) => {
            if (id === undefined) {
                return undefined;
            }
            return portfoliosApi.retrievePortfolioPortfoliosPortfolioIdGet(
                { portfolioId: id },
                { signal }
            );
        },
    });
    return {
        portfolio: data,
        isPortfolioLoading,
        isPortfolioError,
        refetchPortfolio,
    };
};

export const usePortfolioResultSetsQuery = (
    params: {
        portfolio?: string;
        type?: ResultSetType;
    } = {}
) => {
    const { resultSetsApi } = useApi();
    const {
        data,
        isLoading: isResultSetsLoading,
        isError: isResultSetsError,
        refetch: refetchResultSets,
    } = useQuery({
        queryKey: ['portfolios', params.portfolio, 'resultSets', params.type],
        queryFn: ({ signal }) => {
            return resultSetsApi.listResultSetsResultSetsGet(params, {
                signal,
            });
        },
        enabled: !!params.portfolio,
    });

    const resultSets = useMemo(() => data?.data || [], [data]);

    return {
        resultSets,
        isResultSetsLoading,
        isResultSetsError,
        refetchResultSets,
    };
};

export const usePortfolioSharedUsersQuery = (id: string | undefined) => {
    const { portfoliosApi } = useApi();
    const {
        data,
        isLoading: isPortfolioSharedUsersLoading,
        isError: isPortfolioSharedUsersError,
        refetch: refetchPortfolioSharedUsers,
    } = useQuery({
        queryKey: ['portfolios', id, 'shared-users'],
        queryFn: ({ signal }) => {
            if (id === undefined) {
                return undefined;
            }
            return portfoliosApi.getSharedUsersPortfoliosPortfolioIdSharedUsersGet(
                { portfolioId: id },
                { signal }
            );
        },
    });
    return {
        sharedUsers: data,
        isPortfolioSharedUsersLoading,
        isPortfolioSharedUsersError,
        refetchPortfolioSharedUsers,
    };
};
