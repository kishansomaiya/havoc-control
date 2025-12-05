import { useQuery } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import { ListCategoriesCategoriesGetRequest } from '../openapi/auto-generated';
import { useMemo } from 'react';

export const useCategoriesQuery = (
    params: ListCategoriesCategoriesGetRequest = {}
) => {
    const { categoriesApi } = useApi();
    const {
        data,
        isLoading: isCategoriesLoading,
        isError: isCategoriesError,
        refetch: reFetchCategories,
    } = useQuery({
        queryKey: ['categories'],
        queryFn: ({ signal }) =>
            categoriesApi.listCategoriesCategoriesGet(params, { signal }),
    });

    const categories = useMemo(() => data?.data || [], [data]);

    return {
        categories,
        isCategoriesLoading,
        isCategoriesError,
        reFetchCategories,
    };
};
