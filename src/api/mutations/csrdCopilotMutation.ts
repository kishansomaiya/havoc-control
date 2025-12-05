import { useMutation } from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import {
    DocsAIChatAskChatRequest,
    DocsAIChatFeedbackInput,
} from '../openapi/auto-generated';

export const useChatAskMutation = () => {
    const { chatApi } = useApi();
    const { isError, isPending, mutateAsync } = useMutation({
        mutationFn: async ({
            askParams: docsAIChatAskChatRequest,
        }: {
            askParams: DocsAIChatAskChatRequest;
        }) =>
            chatApi.askChatAskPost({
                docsAIChatAskChatRequest,
            }),
    });
    return {
        askQuestion: mutateAsync,
        isAskingQuestion: isPending,
        isAskQuestionError: isError,
    };
};

export const useChatAddFeedbackMutation = () => {
    const { chatApi } = useApi();
    const { isError, isPending, mutateAsync } = useMutation({
        mutationFn: async ({
            conversationId,
            chatFeedbackInput: docsAIChatFeedbackInput,
        }: {
            conversationId: string;
            chatFeedbackInput: DocsAIChatFeedbackInput;
        }) =>
            chatApi.createFeedbackChatConversationIdFeedbackPost({
                conversationId,
                docsAIChatFeedbackInput,
            }),
    });
    return {
        addFeedback: mutateAsync,
        isAddingFeedback: isPending,
        isAddFeedbackError: isError,
    };
};

export const useChatUpdateFeedbackMutation = () => {
    const { chatApi } = useApi();
    const { isError, isPending, mutateAsync } = useMutation({
        mutationFn: async ({
            conversationId,
            chatFeedbackInput: docsAIChatFeedbackInput,
        }: {
            conversationId: string;
            chatFeedbackInput: DocsAIChatFeedbackInput;
        }) =>
            chatApi.updateFeedbackChatConversationIdFeedbackPut({
                conversationId,
                docsAIChatFeedbackInput,
            }),
    });
    return {
        updateFeedback: mutateAsync,
        isUpdatingFeedback: isPending,
        isAddFeedbackError: isError,
    };
};
