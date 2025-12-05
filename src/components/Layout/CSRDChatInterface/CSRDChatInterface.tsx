import { FC, useEffect, useRef, useState } from 'react';
import { isEmpty } from 'lodash';
import styles from './CSRDChatInterface.module.css';
import '@chatscope/chat-ui-kit-styles/dist/default/styles.min.css';
import './CSRDChatInterface.css';
import {
    MainContainer,
    ChatContainer,
    MessageList,
    Message,
    MessageInput,
    TypingIndicator,
    ConversationHeader,
    Avatar,
} from '@chatscope/chat-ui-kit-react';
import { Avatar as MuiAvatar, Box, IconButton, useTheme } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { User, X } from 'react-feather';
import {
    ChatSender,
    ChatMessageInterface,
    MsgListHTMLDivElement,
} from '../../../types';
import { useChatAskMutation } from '../../../api/mutations/csrdCopilotMutation';
import { MuiTypeBackground } from '../../../types/muiTypes';
import { INCOMING_MESSAGE, OUTGOING_MESSAGE } from '../../../const';
import {
    useChatHistoryQuery,
    useChatSessionQuery,
} from '../../../api/queries/csrdCopilotQuery';
import CSRDMessageActionPalette from './CSRDMessageActionPalette';
import {
    DocsAIChatConversationModel,
    DocsAIChatFeedbackModel,
} from '../../../api/openapi/auto-generated';

const CSRDChatInterface: FC = () => {
    const theme = useTheme();

    const { askQuestion, isAskingQuestion } = useChatAskMutation();
    const { sessionId, isChatSessionLoading } = useChatSessionQuery();

    const {
        chatHistory,
        isChatHistoryLoading,
        isMoreChatHistoryLoading,
        fetchNextChatHistory,
        hasMoreHistory,
    } = useChatHistoryQuery(sessionId);

    const msgListRef = useRef<MsgListHTMLDivElement | null>(null);
    const msgInputRef = useRef<HTMLDivElement | null>(null);

    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [welcomeMessage] = useState<ChatMessageInterface[]>([
        {
            model: {
                ...INCOMING_MESSAGE,
                message:
                    'Hello! I am Jupiter Connect.\nI can find responses to your questions from our vast documentation.\nHow can I help you?',
            },
        },
    ]);
    const [messages, setMessages] = useState<ChatMessageInterface[]>([]);

    const handleUserMessage = (message: string) => {
        const userMsg: ChatMessageInterface = {
            model: {
                ...OUTGOING_MESSAGE,
                message,
            },
        };
        setMessages((pre) => [...pre, userMsg]);
    };

    const handleBotResponse = (message: DocsAIChatConversationModel) => {
        const { answer, ...otherMsgProps } = message;
        const botMsg: ChatMessageInterface = {
            model: {
                ...INCOMING_MESSAGE,
                message: answer,
            },
            ...message,
        };
        setMessages((pre) => {
            if (!pre.length) {
                return [botMsg];
            }

            const lastMsg = pre.slice(-1)[0];
            if (lastMsg.model.sender === ChatSender.bot) {
                return [...pre, botMsg];
            }

            return [
                ...pre.slice(0, pre.length - 1),
                { ...lastMsg, ...otherMsgProps },
                botMsg,
            ];
        });
    };

    const handleScrollToBottom = () => {
        msgListRef.current?.scrollToBottom('auto');
        msgInputRef.current?.focus();
    };

    const handleSendMessage = async (
        _innerHtml: string,
        textContent: string,
        _innerText: string
    ) => {
        const trimmedContent = textContent.trim();
        if (isEmpty(trimmedContent)) {
            return;
        }
        handleUserMessage(trimmedContent);
        const msgResponse = await askQuestion({
            askParams: {
                question: trimmedContent,
                sessionId,
            },
        });
        handleBotResponse(msgResponse);
    };

    const handleUpdateFeedbackData = ({
        conversationId,
        feedback,
    }: {
        conversationId: string;
        feedback: DocsAIChatFeedbackModel;
    }) => {
        setMessages((pre) => {
            const msgs = pre.reduce<ChatMessageInterface[]>((prevMsgs, msg) => {
                const { id: convoId } = msg;
                const updatedMsg =
                    convoId === conversationId ? { ...msg, feedback } : msg;
                return [...prevMsgs, updatedMsg];
            }, []);
            return msgs;
        });
    };

    useEffect(() => {
        handleScrollToBottom();
    }, []);

    useEffect(() => {
        if (!chatHistory.length) {
            return;
        }
        const msgHistory = chatHistory
            .sort((msg1, msg2) => {
                if (msg1.respondedAt < msg2.respondedAt) {
                    return -1;
                }
                if (msg1.respondedAt > msg2.respondedAt) {
                    return 1;
                }
                return 0;
            })
            .reduce<ChatMessageInterface[]>(
                (prevConversations, conversation) => {
                    const { answer, ...otherProps } = conversation;
                    const botMsg: ChatMessageInterface = {
                        model: {
                            ...INCOMING_MESSAGE,
                            message: answer,
                        },
                        ...conversation,
                    };
                    const userMsg: ChatMessageInterface = {
                        model: {
                            ...OUTGOING_MESSAGE,
                            message: otherProps.question,
                        },
                        ...otherProps,
                    };
                    return [...prevConversations, userMsg, botMsg];
                },
                []
            );
        setMessages(msgHistory);
    }, [chatHistory]);

    return (
        <Box className={styles.root}>
            {isOpen ? (
                <Box className={styles.chatWindow}>
                    <MainContainer
                        style={{
                            borderColor: theme.palette.grey['500'],
                            borderRadius: theme.spacing(1),
                        }}
                    >
                        <ChatContainer>
                            <ConversationHeader
                                style={{
                                    backgroundColor: (
                                        theme.palette
                                            .background as MuiTypeBackground
                                    ).header,
                                    borderColor: theme.palette.grey['500'],
                                }}
                            >
                                <ConversationHeader.Content>
                                    <Box
                                        className={styles.headerContent}
                                        color="text.primary"
                                        data-testid="csrd-chat-header-title"
                                    >
                                        Jupiter Connect
                                    </Box>
                                </ConversationHeader.Content>
                                <ConversationHeader.Actions>
                                    <IconButton
                                        color="primary"
                                        onClick={() => setIsOpen(false)}
                                        data-testid="csrd-chat-close-button"
                                    >
                                        <X size="1.4rem" />
                                    </IconButton>
                                </ConversationHeader.Actions>
                            </ConversationHeader>
                            <MessageList
                                ref={msgListRef}
                                loading={
                                    isChatSessionLoading || isChatHistoryLoading
                                }
                                typingIndicator={
                                    isAskingQuestion ? (
                                        <TypingIndicator
                                            content="Jupiter Connect is typing"
                                            style={{
                                                backgroundColor: 'transparent',
                                                paddingLeft: theme.spacing(2.5),
                                            }}
                                        />
                                    ) : null
                                }
                                style={{
                                    backgroundColor:
                                        theme.palette.background.default,
                                    paddingTop: theme.spacing(1),
                                    paddingBottom: isAskingQuestion
                                        ? theme.spacing(4)
                                        : 'unset',
                                }}
                                data-testid="csrd-chat-message-list"
                            >
                                {hasMoreHistory ? (
                                    <Message
                                        className="custom-message"
                                        model={{
                                            direction: 'incoming',
                                            type: 'custom',
                                            position: 'single',
                                        }}
                                        data-testid="csrd-chat-load-more-button"
                                    >
                                        <Message.CustomContent>
                                            <LoadingButton
                                                variant="text"
                                                color="primary"
                                                disabled={
                                                    isMoreChatHistoryLoading
                                                }
                                                loading={
                                                    isMoreChatHistoryLoading
                                                }
                                                loadingPosition="end"
                                                sx={{
                                                    paddingX: 3,
                                                    textDecoration: 'underline',
                                                    '&:hover': {
                                                        textDecoration:
                                                            'underline',
                                                    },
                                                }}
                                                onClick={() =>
                                                    fetchNextChatHistory()
                                                }
                                            >
                                                <span>
                                                    {isMoreChatHistoryLoading
                                                        ? 'Loading...'
                                                        : 'Load More'}
                                                </span>
                                            </LoadingButton>
                                        </Message.CustomContent>
                                    </Message>
                                ) : (
                                    welcomeMessage.map((message, i) => {
                                        const { model } = message;
                                        return (
                                            <Message
                                                key={i}
                                                model={model}
                                                data-testid="csrd-chat-welcome-message"
                                            >
                                                <Avatar name="bot">
                                                    <MuiAvatar>
                                                        <img
                                                            src="/jupiter_favicon.png"
                                                            width="28"
                                                            height="28"
                                                            alt="Jupiter Intelligence"
                                                        />
                                                    </MuiAvatar>
                                                </Avatar>
                                            </Message>
                                        );
                                    })
                                )}
                                {messages.map((message, idx) => {
                                    const { model, id: conversationId } =
                                        message;
                                    return (
                                        <Message
                                            key={`${model.sender}-${conversationId ?? idx}`}
                                            model={model}
                                            data-testid="csrd-chat-message"
                                        >
                                            <Avatar name="bot">
                                                <MuiAvatar>
                                                    {model.sender ===
                                                    ChatSender.bot ? (
                                                        <img
                                                            src="/jupiter_favicon.png"
                                                            width="28"
                                                            height="28"
                                                            alt="Jupiter Intelligence"
                                                        />
                                                    ) : (
                                                        <User
                                                            size="1.2rem"
                                                            color={
                                                                theme.palette
                                                                    .text
                                                                    .primary
                                                            }
                                                        />
                                                    )}
                                                </MuiAvatar>
                                            </Avatar>
                                            {idx === messages.length - 1 &&
                                            model.sender === ChatSender.bot ? (
                                                <Message.Footer
                                                    style={{
                                                        marginRight: 0,
                                                        marginBottom: 12,
                                                    }}
                                                >
                                                    <CSRDMessageActionPalette
                                                        message={message}
                                                        sendMessage={(
                                                            text: string
                                                        ) =>
                                                            handleSendMessage(
                                                                '',
                                                                text,
                                                                ''
                                                            )
                                                        }
                                                        updateFeedbackData={
                                                            handleUpdateFeedbackData
                                                        }
                                                    />
                                                </Message.Footer>
                                            ) : null}
                                        </Message>
                                    );
                                })}
                            </MessageList>
                            <MessageInput
                                ref={msgInputRef}
                                autoFocus
                                placeholder="Type Message Here..."
                                attachButton={false}
                                disabled={
                                    isChatSessionLoading ||
                                    isChatHistoryLoading ||
                                    isMoreChatHistoryLoading ||
                                    isAskingQuestion
                                }
                                style={{
                                    backgroundColor:
                                        theme.palette.background.default,
                                    borderColor: theme.palette.grey['500'],
                                }}
                                onSend={handleSendMessage}
                                data-testid="csrd-chat-message-input"
                            />
                        </ChatContainer>
                    </MainContainer>
                </Box>
            ) : (
                <Box>
                    <IconButton
                        onClick={() => {
                            setIsOpen(true);
                        }}
                        data-testid="csrd-chat-icon-button"
                    >
                        <MuiAvatar
                            sx={{
                                width: theme.spacing(8),
                                height: theme.spacing(8),
                                backgroundColor: (
                                    theme.palette
                                        .background as MuiTypeBackground
                                ).header,
                            }}
                        >
                            <img
                                src="/jupiter_favicon.png"
                                width={theme.spacing(5.5)}
                                height={theme.spacing(5.5)}
                                alt="Jupiter Intelligence"
                            />
                        </MuiAvatar>
                    </IconButton>
                </Box>
            )}
        </Box>
    );
};

export default CSRDChatInterface;
