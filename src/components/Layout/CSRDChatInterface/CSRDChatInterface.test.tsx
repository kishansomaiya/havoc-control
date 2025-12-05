import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CSRDChatInterface from './CSRDChatInterface';
import { describe, it, expect } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

const mockConfig = {
    chatHistory: [],
    isChatHistoryLoading: false,
    isMoreChatHistoryLoading: false,
    fetchNextChatHistory: vi.fn(),
    hasMoreHistory: false,
};

vi.mock('../../../api/queries/csrdCopilotQuery', () => ({
    useChatSessionQuery: () => ({
        sessionId: 'test-session',
        isChatSessionLoading: false,
    }),
    useChatHistoryQuery: () => ({
        ...mockConfig,
    }),
}));

const askQuestionMock = vi.fn();
vi.mock('../../../api/mutations/csrdCopilotMutation', () => ({
    useChatAskMutation: () => ({
        askQuestion: askQuestionMock,
        isAskingQuestion: false,
    }),
}));

describe('CSRDChatInterface', () => {
    beforeEach(() => {
        queryClient.clear();
    });

    it('opens chat window when icon is clicked', async () => {
        const user = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <CSRDChatInterface />
            </QueryClientProvider>
        );
        const iconButton = screen.getByTestId('csrd-chat-icon-button');
        await user.click(iconButton);
        expect(screen.getByText('Jupiter Connect')).toBeInTheDocument();
        expect(
            screen.getByTestId('csrd-chat-message-input')
        ).toBeInTheDocument();

        const input = screen.getByTestId('csrd-chat-message-input');
        await user.type(input, 'Hello{enter}');
        expect(
            screen.getByTestId('csrd-chat-message-input')
        ).toBeInTheDocument();

        const closeButton = screen.getByTestId('csrd-chat-close-button');
        await user.click(closeButton);
        expect(screen.queryByText('Jupiter Connect')).not.toBeInTheDocument();
    });

    it('displays welcome message on open', async () => {
        const user = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <CSRDChatInterface />
            </QueryClientProvider>
        );
        const iconButton = screen.getByTestId('csrd-chat-icon-button');
        await user.click(iconButton);

        expect(
            screen.getByTestId('csrd-chat-welcome-message')
        ).toBeInTheDocument();
    });

    it('displays message list', async () => {
        const user = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <CSRDChatInterface />
            </QueryClientProvider>
        );
        const iconButton = screen.getByTestId('csrd-chat-icon-button');
        await user.click(iconButton);
        expect(
            screen.getByTestId('csrd-chat-message-list')
        ).toBeInTheDocument();
    });

    it('disables send when loading states are true', async () => {
        // Case 1: session loading
        vi.doMock('../../../api/queries/csrdCopilotQuery', () => ({
            useChatSessionQuery: () => ({
                sessionId: 's',
                isChatSessionLoading: true,
            }),
            useChatHistoryQuery: () => ({
                ...mockConfig,
                isChatHistoryLoading: false,
                isMoreChatHistoryLoading: false,
            }),
        }));
        const { default: Chat1 } = await import('./CSRDChatInterface');
        const user1 = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <Chat1 />
            </QueryClientProvider>
        );
        await user1.click(screen.getByTestId('csrd-chat-icon-button'));
        const sendBtn1 = document.querySelector(
            '.cs-button--send'
        ) as HTMLButtonElement | null;
        expect(sendBtn1).toBeTruthy();
        expect(sendBtn1?.disabled).toBe(true);

        // Case 2: history loading
        vi.resetModules();
        vi.doMock('../../../api/queries/csrdCopilotQuery', () => ({
            useChatSessionQuery: () => ({
                sessionId: 's',
                isChatSessionLoading: false,
            }),
            useChatHistoryQuery: () => ({
                ...mockConfig,
                isChatHistoryLoading: true,
                isMoreChatHistoryLoading: false,
            }),
        }));
        const { default: Chat2 } = await import('./CSRDChatInterface');
        const user2 = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <Chat2 />
            </QueryClientProvider>
        );
        await user2.click(screen.getByTestId('csrd-chat-icon-button'));
        const sendBtn2 = document.querySelector(
            '.cs-button--send'
        ) as HTMLButtonElement | null;
        expect(sendBtn2).toBeTruthy();
        expect(sendBtn2?.disabled).toBe(true);

        // Case 3: more history loading
        vi.resetModules();
        vi.doMock('../../../api/queries/csrdCopilotQuery', () => ({
            useChatSessionQuery: () => ({
                sessionId: 's',
                isChatSessionLoading: false,
            }),
            useChatHistoryQuery: () => ({
                ...mockConfig,
                isChatHistoryLoading: false,
                isMoreChatHistoryLoading: true,
            }),
        }));
        const { default: Chat3 } = await import('./CSRDChatInterface');
        const user3 = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <Chat3 />
            </QueryClientProvider>
        );
        await user3.click(screen.getByTestId('csrd-chat-icon-button'));
        const sendBtn3 = document.querySelector(
            '.cs-button--send'
        ) as HTMLButtonElement | null;
        expect(sendBtn3).toBeTruthy();
        expect(sendBtn3?.disabled).toBe(true);
    });

    it('disables send when asking question is true', async () => {
        vi.resetModules();
        vi.doMock('../../../api/mutations/csrdCopilotMutation', () => ({
            useChatAskMutation: () => ({
                askQuestion: vi.fn(),
                isAskingQuestion: true,
            }),
        }));
        vi.doMock('../../../api/queries/csrdCopilotQuery', () => ({
            useChatSessionQuery: () => ({
                sessionId: 's',
                isChatSessionLoading: false,
            }),
            useChatHistoryQuery: () => ({
                ...mockConfig,
                isChatHistoryLoading: false,
                isMoreChatHistoryLoading: false,
            }),
        }));
        const { default: Chat } = await import('./CSRDChatInterface');
        render(
            <QueryClientProvider client={queryClient}>
                <Chat />
            </QueryClientProvider>
        );
        await userEvent.click(screen.getByTestId('csrd-chat-icon-button'));
        const sendBtn = document.querySelector(
            '.cs-button--send'
        ) as HTMLButtonElement | null;
        expect(sendBtn).toBeTruthy();
        expect(sendBtn?.disabled).toBe(true);
    });

    it('does not send message when input is empty or whitespace', async () => {
        vi.resetModules();
        const askMock = vi.fn();
        vi.doMock('../../../api/mutations/csrdCopilotMutation', () => ({
            useChatAskMutation: () => ({
                askQuestion: askMock,
                isAskingQuestion: false,
            }),
        }));
        const { default: Chat } = await import('./CSRDChatInterface');
        const user = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <Chat />
            </QueryClientProvider>
        );
        await user.click(screen.getByTestId('csrd-chat-icon-button'));
        const input = screen.getByTestId('csrd-chat-message-input');
        await user.type(input, '   {enter}');
        expect(askMock).not.toHaveBeenCalled();
    });

    it('renders messages from history and shows action palette on last bot message', async () => {
        vi.resetModules();
        const chatHistory = [
            { id: 'c1', question: 'Q1', answer: 'A1', respondedAt: 1 },
            { id: 'c2', question: 'Q2', answer: 'A2', respondedAt: 2 },
        ];
        vi.doMock('../../../api/queries/csrdCopilotQuery', () => ({
            useChatSessionQuery: () => ({
                sessionId: 's',
                isChatSessionLoading: false,
            }),
            useChatHistoryQuery: () => ({
                chatHistory,
                isChatHistoryLoading: false,
                isMoreChatHistoryLoading: false,
                fetchNextChatHistory: vi.fn(),
                hasMoreHistory: false,
            }),
        }));
        vi.doMock('../../../api/mutations/csrdCopilotMutation', () => ({
            useChatAskMutation: () => ({
                askQuestion: vi.fn(),
                isAskingQuestion: false,
            }),
            useChatAddFeedbackMutation: () => ({
                addFeedback: vi.fn(),
                isAddingFeedback: false,
            }),
            useChatUpdateFeedbackMutation: () => ({
                updateFeedback: vi.fn(),
                isUpdatingFeedback: false,
            }),
        }));
        const { default: Chat } = await import('./CSRDChatInterface');
        const user = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <Chat />
            </QueryClientProvider>
        );
        await user.click(screen.getByTestId('csrd-chat-icon-button'));
        // Messages rendered
        expect(
            screen.getAllByTestId('csrd-chat-message').length
        ).toBeGreaterThan(0);
        // Action palette should be present for last bot message
        expect(screen.getByTestId('copy-response-button')).toBeInTheDocument();
    });

    it('invokes fetchNextChatHistory on clicking Load More', async () => {
        vi.resetModules();
        const fetchNextChatHistory = vi.fn();
        vi.doMock('../../../api/queries/csrdCopilotQuery', () => ({
            useChatSessionQuery: () => ({
                sessionId: 's',
                isChatSessionLoading: false,
            }),
            useChatHistoryQuery: () => ({
                chatHistory: [],
                isChatHistoryLoading: false,
                isMoreChatHistoryLoading: false,
                fetchNextChatHistory,
                hasMoreHistory: true,
            }),
        }));
        vi.doMock('../../../api/mutations/csrdCopilotMutation', () => ({
            useChatAskMutation: () => ({
                askQuestion: vi.fn(),
                isAskingQuestion: false,
            }),
            useChatAddFeedbackMutation: () => ({
                addFeedback: vi.fn(),
                isAddingFeedback: false,
            }),
            useChatUpdateFeedbackMutation: () => ({
                updateFeedback: vi.fn(),
                isUpdatingFeedback: false,
            }),
        }));
        const { default: Chat } = await import('./CSRDChatInterface');
        render(
            <QueryClientProvider client={queryClient}>
                <Chat />
            </QueryClientProvider>
        );
        await userEvent.click(screen.getByTestId('csrd-chat-icon-button'));
        const loadMoreBtn = await screen.findByRole('button', {
            name: /Load More|Loading/i,
        });
        await userEvent.click(loadMoreBtn);
        expect(fetchNextChatHistory).toHaveBeenCalled();
    });

    it('renders the load more button when hasMoreHistory is true', async () => {
        mockConfig.hasMoreHistory = true;
        mockConfig.fetchNextChatHistory = vi.fn();

        render(
            <QueryClientProvider client={queryClient}>
                <CSRDChatInterface />
            </QueryClientProvider>
        );

        const iconButton = screen.getByTestId('csrd-chat-icon-button');
        await userEvent.click(iconButton);

        const loadMoreButton = screen.getByTestId('csrd-chat-load-more-button');
        expect(loadMoreButton).toBeInTheDocument();
    });

    it('does not render the load more button when hasMoreHistory is false', async () => {
        mockConfig.hasMoreHistory = false;

        render(
            <QueryClientProvider client={queryClient}>
                <CSRDChatInterface />
            </QueryClientProvider>
        );

        const iconButton = screen.getByTestId('csrd-chat-icon-button');
        await userEvent.click(iconButton);

        expect(
            screen.queryByTestId('csrd-chat-load-more-button')
        ).not.toBeInTheDocument();
    });
});
