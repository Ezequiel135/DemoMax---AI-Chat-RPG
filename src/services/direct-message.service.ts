
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { DatabaseService } from './core/database.service';
import { AuthService } from './auth.service';
import { SocialService } from './social.service';
import { DirectChat, DirectMessage } from '../models/direct-message.model';
import { createChatId, createNewChat, createDirectMessage } from '../logic/chat/dm/dm-factory.logic';

@Injectable({
  providedIn: 'root'
})
export class DirectMessageService {
  private db = inject(DatabaseService);
  private auth = inject(AuthService);
  private social = inject(SocialService);
  private router = inject(Router);

  private readonly CHATS_COLLECTION = 'dm_chats_v1';
  private readonly MESSAGES_PREFIX = 'dm_messages_';

  activeChats = signal<DirectChat[]>([]);

  constructor() {
    this.loadChats();
  }

  async loadChats() {
    const user = this.auth.currentUser();
    if (!user) return;

    try {
      const allChats = await this.db.getAll<DirectChat>(this.CHATS_COLLECTION);
      const myChats = allChats.filter(c => c.participantIds && c.participantIds.includes(user.id));
      
      // Filter out blocked users from initial list? No, usually you still see the chat but can't reply.
      // But we sort by time.
      myChats.sort((a, b) => b.lastMessageTime - a.lastMessageTime);
      this.activeChats.set(myChats);
    } catch(e) {
      console.error("Error loading chats", e);
    }
  }

  async startChat(targetUserId: string, targetUsername: string, targetAvatar: string) {
    const user = this.auth.currentUser();
    if (!user) return;

    // Check blocking logic
    if (this.social.isBlocked(targetUsername)) {
       // Allow opening to unblock, handled by UI
    }

    const chatId = createChatId(user.id, targetUserId);
    const participants = [user.id, targetUserId].sort();

    let chat = await this.db.getById<DirectChat>(this.CHATS_COLLECTION, chatId);

    if (!chat) {
      chat = createNewChat(chatId, participants, {
        id: targetUserId,
        username: targetUsername,
        avatarUrl: targetAvatar
      }, 'Iniciou o chat');
      
      await this.db.save(this.CHATS_COLLECTION, chat);
      this.loadChats();
    }

    this.router.navigate(['/direct', chatId]);
  }

  async getMessages(chatId: string): Promise<DirectMessage[]> {
    const collection = `${this.MESSAGES_PREFIX}${chatId}`;
    try {
      const msgs = await this.db.getAll<DirectMessage>(collection);
      return msgs.sort((a, b) => a.timestamp - b.timestamp);
    } catch(e) {
      return [];
    }
  }

  async sendMessage(chatId: string, text: string) {
    const user = this.auth.currentUser();
    if (!user) return;

    // Fetch chat to check target user for blocking
    const chat = await this.db.getById<DirectChat>(this.CHATS_COLLECTION, chatId);
    if (chat && chat.otherUser) {
        if (this.social.isBlocked(chat.otherUser.username)) {
            throw new Error("User is blocked.");
        }
    }

    const collection = `${this.MESSAGES_PREFIX}${chatId}`;
    const msg = createDirectMessage(user.id, text);

    // 1. Save Message
    await this.db.save(collection, msg);

    // 2. Update Chat Meta
    if (chat) {
      chat.lastMessage = text;
      chat.lastMessageTime = Date.now();
      await this.db.save(this.CHATS_COLLECTION, chat);
    }

    // 3. Refresh List
    this.loadChats();
    
    return msg;
  }
}
