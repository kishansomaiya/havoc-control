import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import { useCallback, useRef } from 'react';
import {
    CreateRoleInputBody,
    UpdateRoleInputBody,
} from '../openapi/auto-generated-admin';
import { useAddAlert } from '../../context/AlertProvider';
import { useSetZedToken } from '../../context/ZedTokenProvider';

export const useCreateRoleMutation = () => {
    const queryClient = useQueryClient();
    const { roleApi } = useApi();
    const { handleSetRoleZedToken } = useSetZedToken();
    const addAlert = useAddAlert();
    const abortControllerRef = useRef<AbortController | null>(null);

    const { error, isError, isPending, mutateAsync, reset } = useMutation({
        mutationFn: async ({
            enteredRole: createRoleInputBody,
        }: {
            enteredRole: CreateRoleInputBody;
        }) => {
            try {
                abortControllerRef.current = new AbortController();

                const createRoleApiResponse = await roleApi.createRole(
                    {
                        createRoleInputBody,
                    },
                    { signal: abortControllerRef.current.signal }
                );

                return createRoleApiResponse;
            } catch (error) {
                addAlert(
                    'Encountered an error while creating the new role. Please try again.',
                    'error'
                );
            }
        },
        onSettled: (data) => {
            queryClient.removeQueries({
                queryKey: ['roles'],
            });
            addAlert(
                `Role "${data?.role.role.name}" created successfully, you can assign users now.`,
                'success'
            );
            if (data) {
                handleSetRoleZedToken(data.role.role.zedToken);
            }
        },
    });

    const cancelCreateRole = useCallback(() => {
        abortControllerRef?.current?.abort();
        reset();
    }, [reset]);

    return {
        createRole: mutateAsync,
        isRoleCreating: isPending,
        isRoleCreateError: isError,
        roleCreateError: error,
        cancelCreateRole,
        abortControllerRef,
    };
};

export const useDeleteRoleMutation = () => {
    const queryClient = useQueryClient();
    const { roleApi } = useApi();
    const { error, isError, isPending, mutateAsync } = useMutation({
        mutationFn: async (id: string) => {
            if (id === undefined) {
                return undefined;
            }
            return await roleApi.deleteRole({
                id: id,
            });
        },
        onSettled: () => {
            queryClient.removeQueries({
                queryKey: ['roles'],
            });
        },
    });
    return {
        deleteRole: mutateAsync,
        isRoleDeleting: isPending,
        isRoleDeleteError: isError,
        deleteRoleError: error,
    };
};

export const useUpdateRoleMutation = () => {
    const queryClient = useQueryClient();
    const { roleApi } = useApi();
    const { handleSetRoleZedToken } = useSetZedToken();
    const addAlert = useAddAlert();
    const abortControllerRef = useRef<AbortController | null>(null);
    const { error, isError, isPending, mutateAsync, reset } = useMutation({
        mutationFn: async ({
            updatedDescription: updateRoleInputBody,
            id,
        }: {
            updatedDescription: Omit<UpdateRoleInputBody, '$schema'>;
            id: string;
        }) => {
            try {
                abortControllerRef.current = new AbortController();

                const updateRoleApiResponse = await roleApi.updateRole(
                    {
                        id: id,
                        updateRoleInputBody,
                    },
                    { signal: abortControllerRef.current.signal }
                );
                return updateRoleApiResponse;
            } catch (error) {
                addAlert(
                    'Encountered an error while updating the role description. Please try again.',
                    'error'
                );
            }
        },
        onSettled: (data) => {
            queryClient.removeQueries({
                queryKey: ['roles'],
            });
            if (data) {
                handleSetRoleZedToken(data.role.role.zedToken);
            }
        },
    });
    const cancelUpdateRole = useCallback(() => {
        abortControllerRef?.current?.abort();
        reset();
    }, [reset]);

    return {
        updateRole: mutateAsync,
        isRoleUpdating: isPending,
        isRoleUpdateError: isError,
        roleUpdateError: error,
        cancelUpdateRole,
        abortControllerRef,
    };
};

export const useUpdateRoleRelationsMutation = () => {
    const queryClient = useQueryClient();
    const { roleApi } = useApi();
    const { handleSetRoleZedToken } = useSetZedToken();
    const addAlert = useAddAlert();
    const abortControllerRef = useRef<AbortController | null>(null);
    const { error, isError, isPending, mutateAsync, reset } = useMutation({
        mutationFn: async ({
            id,
            updateRoleRelationsInputBody,
        }: {
            id: string;
            updateRoleRelationsInputBody: {
                addMembers?: Set<string>;
                addRelations?: Set<string>;
                removeMembers?: Set<string>;
                removeRelations?: Set<string>;
            };
        }) => {
            try {
                abortControllerRef.current = new AbortController();

                const updateRoleRelationsApiResponse =
                    await roleApi.updateRoleRelations(
                        {
                            id: id,
                            updateRoleRelationsInputBody,
                        },
                        { signal: abortControllerRef.current.signal }
                    );
                return updateRoleRelationsApiResponse;
            } catch (error) {
                addAlert(
                    'Encountered an error while updating the role. Please try again.',
                    'error'
                );
            }
        },
        onSettled: (data) => {
            queryClient.removeQueries({
                queryKey: ['roles'],
            });
            if (data) {
                handleSetRoleZedToken(data.role.role.zedToken);
            }
        },
    });
    const cancelUpdateRoleRelations = useCallback(() => {
        abortControllerRef?.current?.abort();
        reset();
    }, [reset]);

    return {
        updateRoleRelations: mutateAsync,
        isRoleRelationsUpdating: isPending,
        isRoleRelationsUpdateError: isError,
        roleRelationsUpdateError: error,
        cancelUpdateRoleRelations,
        abortControllerRef,
    };
};
