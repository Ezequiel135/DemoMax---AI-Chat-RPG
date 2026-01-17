
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from './core/database.service';
import { AuthService } from './auth.service';
import { DirectChat, DirectMessage } from '../models/direct-message.model';

@Injectable({
  providedIn: 'root'
})
export class DirectMessageService {
  private db = inject(DatabaseService);
  private auth = inject(AuthService);
  private router = inject(Router);

  private readonly CHATS_COLLECTION = 'dm_chats_v1';
  private readonly MESSAGES_PREFIX = 'dm_messages_';

  // Signals for UI reactivity
  activeChats = signal<DirectChat[]>([]);

  constructor() {
    this.loadChats();
  }

  async loadChats() {
    const user = this.auth.currentUser();
    if (!user) return;

    const allChats = await this.db.getAll<DirectChat>(this.CHATS_COLLECTION);
    
    // Filter chats where current user is a participant
    const myChats = allChats.filter(c => c.participantIds.includes(user.id));
    
    // Sort by recent
    myChats.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
    
    this.activeChats.set(myChats);
  }

  /**
   * Starts a chat or navigates to existing one
   */
  async startChat(targetUserId: string, targetUsername: string, targetAvatar: string) {
    const user = this.auth.currentUser();
    if (!user) return;

    // Create a unique ID independent of who started it (sort IDs)
    const participants = [user.id, targetUserId].sort();
    const chatId = `chat_${participants.join('_')}`;

    // Check if exists
    let chat = await this.db.getById<DirectChat>(this.CHATS_COLLECTION, chatId);

    if (!chat) {
      chat = {
        id: chatId,
        participantIds: participants,
        lastMessage: 'Iniciou o chat',
        lastMessageTime: Date.now(),
        unreadCount: 0,
        otherUser: {
          id: targetUserId,
          username: targetUsername,
          avatarUrl: targetAvatar
        }
      };
      await this.db.save(this.CHATS_COLLECTION, chat);
      // Update local list
      this.loadChats();
    }

    this.router.navigate(['/direct', chatId]);
  }

  async getMessages(chatId: string): Promise<DirectMessage[]> {
    const collection = `${this.MESSAGES_PREFIX}${chatId}`;
    const msgs = await this.db.getAll<DirectMessage>(collection);
    return msgs.sort((a, b) => a.timestamp - b.timestamp);
  }

  async sendMessage(chatId: string, text: string) {
    const user = this.auth.currentUser();
    if (!user) return;

    const collection = `${this.MESSAGES_PREFIX}${chatId}`;
    
    const msg: DirectMessage = {
      id: `msg_${Date.now()}`,
      senderId: user.id,
      text,
      timestamp: Date.now(),
      read: false
    };

    // 1. Save Message
    await this.db.save(collection, msg);

    // 2. Update Chat Meta (Last Message)
    const chat = await this.db.getById<DirectChat>(this.CHATS_COLLECTION, chatId);
    if (chat) {
      chat.lastMessage = text;
      chat.lastMessageTime = Date.now();
      chat.unreadCount = 1; // Logic for the other user (simplified)
      await this.db.save(this.CHATS_COLLECTION, chat);
    }

    // 3. Refresh List if needed
    this.loadChats();
    
    return msg;
  }
}
