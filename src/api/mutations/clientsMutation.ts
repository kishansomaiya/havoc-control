import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import { CreateClientInputBody } from '../openapi/auto-generated-admin';
import { useSetZedToken } from '../../context/ZedTokenProvider';

export const useCreateClientMutation = () => {
    const queryClient = useQueryClient();
    const { m2mClient } = useApi();
    const { handleSetClientZedToken } = useSetZedToken();
    const { isError, isPending, mutateAsync } = useMutation({
        mutationFn: async ({
            createClientInput: CreateClientInputBody,
        }: {
            createClientInput: CreateClientInputBody;
        }) => {
            return await m2mClient.createClient({
                createClientInputBody: CreateClientInputBody,
            });
        },
        onSettled: (data) => {
            queryClient.removeQueries({
                queryKey: ['clients'],
            });
            if (data) {
                handleSetClientZedToken(data.client.zedToken);
            }
        },
    });
    return {
        createClient: mutateAsync,
        isClientCreating: isPending,
        isClientCreateError: isError,
    };
};

export const useDeleteClientMutation = () => {
    const queryClient = useQueryClient();
    const { m2mClient } = useApi();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async ({ clientId }: { clientId: string }) => {
            if (clientId === undefined) {
                return undefined;
            }

            return await m2mClient.deleteClient({
                id: clientId,
            });
        },
        onSettled: () => {
            queryClient.removeQueries({
                queryKey: ['clients'],
            });
        },
    });
    return {
        deleteClient: mutateAsync,
        isClientDeleting: isPending,
        isClientDeleteError: isError,
        deleteClientError: error,
    };
};
