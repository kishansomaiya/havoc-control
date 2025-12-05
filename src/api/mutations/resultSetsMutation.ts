import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import { UpdateResultSetInput } from '../openapi/auto-generated';
import { useCallback, useRef } from 'react';

export const useUpdateResultSetsMutation = () => {
    const queryClient = useQueryClient();
    const { resultSetsApi } = useApi();
    const abortControllerRef = useRef<AbortController | null>(null);

    const { error, isError, isPending, mutateAsync, reset } = useMutation({
        mutationFn: async ({
            resultSetId,
            resultSet,
        }: {
            resultSetId: string;
            resultSet: UpdateResultSetInput;
        }) => {
            abortControllerRef.current = new AbortController();

            return await resultSetsApi.updateResultSetResultSetsResultSetIdPut(
                {
                    resultSetId,
                    updateResultSetInput: resultSet,
                },
                { signal: abortControllerRef.current.signal }
            );
        },
        onSettled: async (_data, _error) => {
            await queryClient.refetchQueries({
                queryKey: ['portfolios'],
            });
            await queryClient.refetchQueries({
                queryKey: ['resultSets'],
            });
        },
    });

    const cancelUpdateResultSet = useCallback(() => {
        abortControllerRef?.current?.abort();
        reset();
    }, [reset]);

    return {
        updateResultSet: mutateAsync,
        isResultSetUpdating: isPending,
        isResultSetUpdateError: isError,
        updateResultSetError: error,
        cancelUpdateResultSet,
        abortControllerRef,
    };
};
