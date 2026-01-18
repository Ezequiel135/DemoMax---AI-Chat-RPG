
import { DirectMessage, DirectChat } from '../../../models/direct-message.model';
import { generateUUID } from '../../core/uuid.logic';

export function createChatId(userId1: string, userId2: string): string {
  const participants = [userId1, userId2].sort();
  return `chat_${participants.join('_')}`;
}

export function createNewChat(id: string, participants: string[], targetUser: { id: string, username: string, avatarUrl: string }, initialMessage: string): DirectChat {
  return {
    id,
    participantIds: participants,
    lastMessage: initialMessage,
    lastMessageTime: Date.now(),
    unreadCount: 0,
    otherUser: targetUser
  };
}

export function createDirectMessage(senderId: string, text: string): DirectMessage {
  return {
    id: generateUUID(),
    senderId,
    text,
    timestamp: Date.now(),
    read: false
  };
}
