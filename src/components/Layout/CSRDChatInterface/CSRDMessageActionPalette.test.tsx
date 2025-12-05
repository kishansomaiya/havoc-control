import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import CSRDMessageActionPalette from './CSRDMessageActionPalette';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ChatMessageInterface } from '../../../types';

const queryClient = new QueryClient();

const message: ChatMessageInterface = {
    id: '1',
    question: 'Test question',
    feedback: {
        id: '1',
        feedback: 'Good',
        thumbAction: 1,
        customerId: '1',
        userId: '1',
        conversationId: '1',
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: '1',
        updatedBy: '1',
    },
    model: {
        message: 'Test message',
        direction: 'outgoing',
        position: 'single',
    },
};
const sendMessage = vi.fn();
const updateFeedbackData = vi.fn();

const addFeedbackMock = vi.fn();
const updateFeedbackMock = vi.fn();

vi.mock('../../../api/mutations/csrdCopilotMutation', () => ({
    useChatAddFeedbackMutation: () => ({
        addFeedback: addFeedbackMock,
        isAddingFeedback: false,
    }),
    useChatUpdateFeedbackMutation: () => ({
        updateFeedback: updateFeedbackMock,
        isUpdatingFeedback: false,
    }),
}));

vi.mock('../../../utils', () => ({
    copyTextToClipboard: vi.fn(),
}));

describe('CSRDMessageActionPalette', () => {
    beforeEach(() => {
        sendMessage.mockClear();
        updateFeedbackData.mockClear();
        addFeedbackMock.mockReset();
        updateFeedbackMock.mockReset();
    });

    it('renders all action buttons', () => {
        render(
            <QueryClientProvider client={queryClient}>
                <CSRDMessageActionPalette
                    message={message}
                    sendMessage={sendMessage}
                    updateFeedbackData={updateFeedbackData}
                />
            </QueryClientProvider>
        );
        expect(screen.getByTestId('copy-response-button')).toBeInTheDocument();
        expect(screen.getByTestId('thumbs-up-button')).toBeInTheDocument();
        expect(screen.getByTestId('thumbs-down-button')).toBeInTheDocument();
        expect(screen.getByTestId('message-square-button')).toBeInTheDocument();
        expect(
            screen.getByTestId('regenerate-response-button')
        ).toBeInTheDocument();
    });

    it('calls sendMessage when regenerate is clicked', async () => {
        const user = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <CSRDMessageActionPalette
                    message={message}
                    sendMessage={sendMessage}
                    updateFeedbackData={updateFeedbackData}
                />
            </QueryClientProvider>
        );
        const regenerateButton = screen.getByTestId(
            'regenerate-response-button'
        );
        await user.click(regenerateButton);
        expect(sendMessage).toHaveBeenCalledWith('Test question');
    });

    it('opens comment in view mode when feedback exists', async () => {
        const user = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <CSRDMessageActionPalette
                    message={message}
                    sendMessage={sendMessage}
                    updateFeedbackData={updateFeedbackData}
                />
            </QueryClientProvider>
        );
        const messageSquareButton = screen.getByTestId('message-square-button');
        await user.click(messageSquareButton);
        const inputView = screen.getByPlaceholderText('Enter Feedback...');
        expect(inputView).toHaveValue(message.feedback?.feedback ?? '');
    });

    it('adds feedback when none exists and supports reset', async () => {
        const user = userEvent.setup();
        const msgNoFeedback: ChatMessageInterface = {
            ...message,
            feedback: undefined,
        };
        render(
            <QueryClientProvider client={queryClient}>
                <CSRDMessageActionPalette
                    message={msgNoFeedback}
                    sendMessage={sendMessage}
                    updateFeedbackData={updateFeedbackData}
                />
            </QueryClientProvider>
        );
        // Open comment (should be edit mode as no feedback)
        await user.click(screen.getByTestId('message-square-button'));
        // Reset should hide when initial feedback empty
        const resetBtn = screen.getByTestId('reset-feedback-button');
        await user.click(resetBtn);
        expect(
            screen.queryByPlaceholderText('Enter Feedback...')
        ).not.toBeInTheDocument();

        // Open again and save new feedback
        await user.click(screen.getByTestId('message-square-button'));
        const input2 = screen.getByPlaceholderText('Enter Feedback...');
        await user.type(input2, 'New feedback');
        addFeedbackMock.mockResolvedValue({
            feedback: { id: '2', feedback: 'New feedback', thumbAction: 1 },
        });
        await user.click(screen.getByTestId('save-feedback-button'));
        await waitFor(() => expect(addFeedbackMock).toHaveBeenCalled());
    });

    it('thumb buttons respect guard rails and copy works', async () => {
        const user = userEvent.setup();
        render(
            <QueryClientProvider client={queryClient}>
                <CSRDMessageActionPalette
                    message={message}
                    sendMessage={sendMessage}
                    updateFeedbackData={updateFeedbackData}
                />
            </QueryClientProvider>
        );
        // Thumbs up already selected (1) should not trigger update
        await user.click(screen.getByTestId('thumbs-up-button'));
        expect(updateFeedbackMock).not.toHaveBeenCalled();
        // Thumbs down should trigger update
        updateFeedbackMock.mockResolvedValue({
            feedback: { id: '1', feedback: 'Good', thumbAction: -1 },
        });
        await user.click(screen.getByTestId('thumbs-down-button'));
        await waitFor(() => expect(updateFeedbackData).toHaveBeenCalled());

        // Copy
        await user.click(screen.getByTestId('copy-response-button'));
        const utils = await import('../../../utils');
        expect(utils.copyTextToClipboard).toHaveBeenCalled();
    });
});
