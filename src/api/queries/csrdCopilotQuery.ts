import {
    InfiniteData,
    QueryKey,
    useInfiniteQuery,
    useQuery,
} from '@tanstack/react-query';
import { useApi } from '../helpers/useApiHook';
import { useMemo } from 'react';
import {
    DocsAIChatConversationModel,
    ListDocsAIChatConversationResponse,
} from '../openapi/auto-generated';

export const useChatHistoryQuery = (sessionId: string | undefined) => {
    const { chatApi } = useApi();
    const {
        data,
        isLoading: isChatHistoryLoading,
        isError: isChatHistoryError,
        refetch: reFetchChatHistory,
        fetchNextPage: fetchNextChatHistory,
        isFetchingNextPage: isMoreChatHistoryLoading,
    } = useInfiniteQuery<
        ListDocsAIChatConversationResponse | undefined,
        Error,
        InfiniteData<ListDocsAIChatConversationResponse, string | undefined>,
        QueryKey,
        string | undefined
    >({
        initialPageParam: undefined,
        queryKey: ['chat', sessionId, 'history'],
        queryFn: ({
            pageParam: curPos,
            signal,
        }: {
            pageParam?: string;
            signal?: AbortSignal;
        }) => {
            if (sessionId === undefined) {
                return undefined;
            }
            return chatApi.listChatHistoryChatHistoryGet(
                { limit: 10, startingAfter: curPos, sessionId },
                { signal }
            );
        },
        getNextPageParam: (lastPage, _allPages) => {
            return lastPage?.hasMore && lastPage?.data?.length
                ? lastPage.data.slice(-1)[0].id
                : undefined;
        },
        enabled: !!sessionId,
    });

    const { chatHistory, hasMoreHistory } = useMemo(() => {
        if (!data) {
            return {
                chatHistory: [],
                hasMoreHistory: false,
            };
        }
        const { pages } = data;
        const { history: chatHistory, hasMore: hasMoreHistory } = pages.reduce<{
            history: DocsAIChatConversationModel[];
            hasMore: boolean;
        }>(
            (acc, currPage) => {
                const { history } = acc;
                const { data, hasMore } = currPage;
                return { history: [...history, ...data], hasMore };
            },
            { history: [], hasMore: pages.length > 0 }
        );
        return {
            chatHistory,
            hasMoreHistory,
        };
    }, [data]);

    return {
        data,
        chatHistory,
        hasMoreHistory,
        isChatHistoryLoading,
        isMoreChatHistoryLoading,
        isChatHistoryError,
        fetchNextChatHistory,
        reFetchChatHistory,

    };
};

export const useChatSessionQuery = () => {
    const { chatApi } = useApi();
    const {
        data,
        isLoading: isChatSessionLoading,
        isError: isChatSessionError,
        refetch: reFetchChatSession,
    } = useQuery({
        queryKey: ['chat', 'session-id'],
        queryFn: ({ signal }) => {
            return chatApi.getSessionChatSessionGet({ signal });
        },
    });

    const sessionId = useMemo(() => data?.id ?? undefined, [data]);

    return {
        sessionId,
        isChatSessionLoading,
        isChatSessionError,
        reFetchChatSession,
    };
};
