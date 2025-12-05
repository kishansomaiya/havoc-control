import { useMutation } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';

export const useCreateClientMutation = () => {
    const { clientsApi } = useApi();
    const { isError, isPending, mutateAsync } = useMutation({
        mutationFn: async (userId: string) =>
            clientsApi.createClientClientsPost({
                userId,
            }),
    });
    return {
        createClient: mutateAsync,
        isClientCreating: isPending,
        isClientCreateError: isError,
    };
};

export const useDeleteClientMutation = () => {
    const { clientsApi } = useApi();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async ({
            userId,
            clientId,
        }: {
            userId: string;
            clientId: string;
        }) => {
            if (userId === undefined || clientId === undefined) {
                return undefined;
            }

            return await clientsApi.deleteClientClientsClientIdDelete({
                userId,
                clientId,
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
