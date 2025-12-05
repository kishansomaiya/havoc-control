import { MessageModel } from "@chatscope/chat-ui-kit-react";
import { ChatSender } from "../types/chatbotEnum";

export const INCOMING_MESSAGE: Omit<MessageModel, 'message'> = {
    sender: ChatSender.bot,
    direction: 'incoming',
    position: 'single',
}

export const OUTGOING_MESSAGE: Omit<MessageModel, 'message'> = {
    sender: ChatSender.user,
    direction: 'outgoing',
    position: 'single',
}
