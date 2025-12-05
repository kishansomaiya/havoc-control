import { FC, useMemo, useState } from 'react';
import { isEmpty } from 'lodash';
import {
    Box,
    IconButton,
    useTheme,
    TextField,
    InputAdornment,
    Divider,
    CircularProgress,
} from '@mui/material';
import {
    Check,
    Copy,
    Edit2,
    MessageSquare,
    Repeat,
    ThumbsDown,
    ThumbsUp,
    X,
} from 'react-feather';
import {
    ChatMessageInterface,
    CommentState,
    CSRDCommentData,
} from '../../../types';
import {
    useChatAddFeedbackMutation,
    useChatUpdateFeedbackMutation,
} from '../../../api/mutations/csrdCopilotMutation';
import { MuiTypeBackground } from '../../../types/muiTypes';
import { copyTextToClipboard } from '../../../utils';
import {
    DocsAIChatFeedbackInputThumbActionEnum,
    DocsAIChatFeedbackModel,
} from '../../../api/openapi/auto-generated';

const textInputSX = {
    minHeight: 32,
    paddingTop: 0.5,
    paddingBottom: 0.5,
};

const textInputIconSX = {
    paddingX: 1,
};

interface CSRDMessageActionPaletteProps {
    message: ChatMessageInterface;
    sendMessage: (text: string) => Promise<void>;
    updateFeedbackData: ({
        conversationId,
        feedback,
    }: {
        conversationId: string;
        feedback: DocsAIChatFeedbackModel;
    }) => void;
}

const CSRDMessageActionPalette: FC<CSRDMessageActionPaletteProps> = ({
    message,
    sendMessage,
    updateFeedbackData,
}: CSRDMessageActionPaletteProps) => {
    const theme = useTheme();

    const dividerSX = useMemo(
        () => ({
            minHeight: 26,
            borderColor: theme.palette.grey['400'],
        }),
        [theme]
    );

    const { addFeedback, isAddingFeedback: _a } = useChatAddFeedbackMutation();
    const { updateFeedback, isUpdatingFeedback: _b } =
        useChatUpdateFeedbackMutation();

    const isFeedbackLoading = useMemo(
        () => false,
        []
        // TODO: Uncomment below lines to show loading while feedback API responds
        /* () => isAddingFeedback || isUpdatingFeedback,
        [isAddingFeedback, isUpdatingFeedback] */
    );

    const {
        model,
        id: conversationId,
        question,
        feedback: feedbackData,
    } = useMemo(() => message, [message]);

    const {
        id: feedbackId,
        feedback,
        thumbAction,
    } = useMemo(
        () =>
            feedbackData ?? {
                id: '',
                feedback: '',
                thumbAction: DocsAIChatFeedbackInputThumbActionEnum.NUMBER_0,
            },
        [feedbackData]
    );

    const [commentsData, setCommentsData] = useState<CSRDCommentData>({
        text: feedback ?? '',
        state: CommentState.idle,
    });

    const handleCopyResponse = (responseText = '') => {
        if (isEmpty(responseText)) {
            return;
        }
        void copyTextToClipboard(responseText);
    };

    const handleRegenerateResponse = (questionText: string = '') => {
        if (isEmpty(questionText)) {
            return;
        }

        void sendMessage(questionText);
    };

    const handleFeedback = async (
        strConversationId: string = '',
        numThumbAction:
            | DocsAIChatFeedbackInputThumbActionEnum
            | undefined = thumbAction,
        strFeedback: string | undefined = feedback
    ): Promise<void> => {
        if (isEmpty(strConversationId)) {
            return;
        }
        const feedbackRequestInput = {
            conversationId: strConversationId,
            chatFeedbackInput: {
                thumbAction: numThumbAction,
                feedback: strFeedback,
            },
        };
        updateFeedbackData({
            conversationId: strConversationId,
            feedback: {
                id: feedbackId || '',
                ...feedbackRequestInput.chatFeedbackInput,
            } as DocsAIChatFeedbackModel,
        });
        const { feedback: resFeedback } = await (feedbackId
            ? updateFeedback(feedbackRequestInput)
            : addFeedback(feedbackRequestInput));
        if (resFeedback) {
            updateFeedbackData({
                conversationId: strConversationId,
                feedback: resFeedback,
            });
        }
    };

    const showComment = (convId: string = '') => {
        if (isEmpty(convId)) {
            return;
        }
        setCommentsData((pre) => ({
            ...pre,
            state: isEmpty(feedback) ? CommentState.edit : CommentState.view,
        }));
    };

    const hideComment = (convId: string = '') => {
        if (isEmpty(convId)) {
            return;
        }
        setCommentsData({
            text: feedback ?? '',
            state: CommentState.idle,
        });
    };

    const editComment = (convId: string = '') => {
        if (isEmpty(convId)) {
            return;
        }
        setCommentsData((pre) => ({
            ...pre,
            state: CommentState.edit,
        }));
    };

    const resetComment = (convId: string = '') => {
        if (isEmpty(convId)) {
            return;
        }
        if (isEmpty(feedback)) {
            hideComment(convId);
            return;
        }
        setCommentsData({
            text: feedback ?? '',
            state: CommentState.view,
        });
    };

    const handleChangeComment = (strComment: string, convId: string = '') => {
        if (isEmpty(convId)) {
            return;
        }

        setCommentsData((pre) => ({
            ...pre,
            text: strComment,
        }));
    };

    const saveComment = async (convId: string = '') => {
        if (isEmpty(convId) || commentsData.state !== CommentState.edit) {
            return;
        }
        setCommentsData((pre) => ({
            ...pre,
            state: CommentState.view,
        }));
        await handleFeedback(convId, undefined, commentsData.text);
        // resetComment(convId); // TODO: Uncomment when loading is supported for feedback
    };

    return (
        <Box
            display="flex"
            flexDirection="column"
            gap={0.5}
            paddingBottom={1}
            position="relative"
            width="100%"
        >
            <Box
                className={`reply-action-button-group ${isFeedbackLoading ? 'feedback-loading' : ''}`}
                sx={{
                    backgroundColor: (
                        theme.palette.background as MuiTypeBackground
                    ).header,
                    border: `1px solid ${theme.palette.grey['500']}`,
                    borderRadius: 1,
                    position: 'absolute',
                    top: -20,
                    alignSelf: 'flex-end',
                }}
            >
                <IconButton
                    color="primary"
                    onClick={() => handleCopyResponse(model.message)}
                    data-testid="copy-response-button"
                >
                    <Copy size="1rem" />
                </IconButton>
                <IconButton
                    color={thumbAction === 1 ? 'secondary' : 'primary'}
                    onClick={() => {
                        if (thumbAction === 1) {
                            return;
                        }
                        void handleFeedback(conversationId, 1);
                    }}
                    data-testid="thumbs-up-button"
                >
                    <ThumbsUp size="1rem" />
                </IconButton>
                <IconButton
                    color={thumbAction === -1 ? 'secondary' : 'primary'}
                    onClick={() => {
                        if (thumbAction === -1) {
                            return;
                        }
                        void handleFeedback(conversationId, -1);
                    }}
                    data-testid="thumbs-down-button"
                >
                    <ThumbsDown size="1rem" />
                </IconButton>
                <IconButton
                    color={!isEmpty(feedback) ? 'secondary' : 'primary'}
                    onClick={() => showComment(conversationId)}
                    data-testid="message-square-button"
                >
                    <MessageSquare size="1rem" />
                </IconButton>
                <IconButton
                    color="primary"
                    onClick={() => handleRegenerateResponse(question)}
                    data-testid="regenerate-response-button"
                >
                    <Repeat size="1rem" />
                </IconButton>
            </Box>
            {isFeedbackLoading && (
                <Box
                    className="reply-action-button-group feedback-loading"
                    sx={{
                        backgroundColor: (
                            theme.palette.background as MuiTypeBackground
                        ).header,
                        border: `1px solid ${theme.palette.grey['500']}`,
                        borderRadius: 1,
                        position: 'absolute',
                        top: -20,
                        alignSelf: 'flex-end',
                        opacity: 0.8,
                    }}
                >
                    <IconButton
                        disableRipple
                        color="secondary"
                        sx={{
                            width: '10rem',
                            cursor: 'auto',
                        }}
                    >
                        <CircularProgress size="1rem" />
                    </IconButton>
                </Box>
            )}
            {conversationId && commentsData.state !== CommentState.idle ? (
                <Box
                    sx={{
                        marginTop: theme.spacing(2),
                        marginLeft: theme.spacing(5),
                    }}
                >
                    {commentsData.state === CommentState.edit ? (
                        <TextField
                            fullWidth
                            multiline
                            placeholder="Enter Feedback..."
                            InputProps={{
                                sx: textInputSX,
                                endAdornment: (
                                    <InputAdornment
                                        position="end"
                                        sx={{
                                            height: '100%',
                                            maxHeight: 'unset',
                                        }}
                                    >
                                        <IconButton
                                            disabled={
                                                feedback ===
                                                    commentsData.text ||
                                                isFeedbackLoading
                                            }
                                            sx={textInputIconSX}
                                            onClick={() =>
                                                saveComment(conversationId)
                                            }
                                            data-testid="save-feedback-button"
                                        >
                                            <Check size="1rem" />
                                        </IconButton>
                                        <Divider
                                            orientation="vertical"
                                            sx={dividerSX}
                                        />
                                        <IconButton
                                            edge="end"
                                            sx={textInputIconSX}
                                            onClick={() =>
                                                resetComment(conversationId)
                                            }
                                            data-testid="reset-feedback-button"
                                        >
                                            <X size="1rem" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            defaultValue={feedback ?? ''}
                            onChange={(e) => {
                                handleChangeComment(
                                    e.target.value,
                                    conversationId
                                );
                            }}
                        />
                    ) : (
                        <TextField
                            fullWidth
                            multiline
                            placeholder="Enter Feedback..."
                            InputProps={{
                                sx: {
                                    ...textInputSX,
                                    '& .MuiInputBase-input': {
                                        cursor: 'default',
                                        caret: 'unset',
                                        caretColor: 'transparent',
                                    },
                                },
                                endAdornment: (
                                    <InputAdornment
                                        position="end"
                                        sx={{
                                            height: '100%',
                                            maxHeight: 'unset',
                                        }}
                                    >
                                        <IconButton
                                            sx={textInputIconSX}
                                            onClick={() =>
                                                editComment(conversationId)
                                            }
                                        >
                                            <Edit2 size="1rem" />
                                        </IconButton>
                                        <Divider
                                            orientation="vertical"
                                            sx={dividerSX}
                                        />
                                        <IconButton
                                            edge="end"
                                            sx={textInputIconSX}
                                            onClick={() =>
                                                hideComment(conversationId)
                                            }
                                        >
                                            <X size="1rem" />
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                            value={feedback || ''}
                        />
                    )}
                </Box>
            ) : null}
            {/* Uncomment below Link to support Source Doc as Citation */}
            {/* <Link
                variant="caption"
                sx={{
                    fontStyle: 'italic',
                    cursor: 'pointer',
                }}
            >
                Show Citations
                <Icon
                    sx={{
                        fontSize: theme.spacing(2),
                    }}
                >
                    <ChevronRight size="0.6875rem" />
                </Icon>
            </Link> */}
        </Box>
    );
};

export default CSRDMessageActionPalette;
