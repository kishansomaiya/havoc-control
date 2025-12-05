import { useMutation } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';

export const useCreateCategoryMutation = () => {
    const { categoriesApi } = useApi();
    const { isError, isPending, mutateAsync } = useMutation({
        mutationFn: async (name: string) =>
            categoriesApi.createCategoryCategoriesPost({
                createCategoryInput: {
                    name,
                },
            }),
    });
    return {
        createCategory: mutateAsync,
        isCategoryCreating: isPending,
        isCategoryCreateError: isError,
    };
};
