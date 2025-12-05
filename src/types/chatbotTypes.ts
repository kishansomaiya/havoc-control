import type {
    MessageListOwnProps,
    MessageModel,
} from '@chatscope/chat-ui-kit-react';
import { CommentState } from './chatbotEnum';
import { DocsAIChatConversationModel } from '../api/openapi/auto-generated';

export interface MsgListHTMLDivElement extends HTMLDivElement {
    scrollToBottom: (
        scrollBehaviour: MessageListOwnProps['scrollBehavior']
    ) => void;
}

export interface ChatMessageInterface extends Partial<DocsAIChatConversationModel> {
    model: MessageModel;
}

export interface CSRDCommentData {
    text: string;
    state: CommentState;
}
