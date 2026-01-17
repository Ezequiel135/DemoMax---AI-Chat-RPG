
export interface DirectMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
  read: boolean;
}

export interface DirectChat {
  id: string; // Usually composed of "userA_userB" (sorted)
  participantIds: string[];
  lastMessage: string;
  lastMessageTime: number;
  unreadCount: number;
  // Cached info for display optimization
  otherUser?: {
    id: string;
    username: string;
    avatarUrl: string;
  };
}
