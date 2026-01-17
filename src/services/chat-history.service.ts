
import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { Message } from '../models/message.model';

export interface ToolEntry {
  id: string;
  type: 'diary' | 'dream' | 'thought' | 'forum';
  content: string;
  timestamp: number;
}

export interface ChatData {
  messages: Message[];
  summary: string;
  toolHistory: ToolEntry[]; // New: Stores generated content history
}

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  private storage = inject(StorageService);
  private readonly STORAGE_PREFIX = 'demomax_chat_v2_';

  getChatData(characterId: string): ChatData {
    const data = this.storage.getItem<ChatData>(`${this.STORAGE_PREFIX}${characterId}`);
    
    // Init empty if not found
    if (!data) {
        // Try legacy migration
        const legacy = this.storage.getItem<Message[]>(`demomax_chat_${characterId}`);
        return { 
          messages: legacy || [], 
          summary: '', 
          toolHistory: [] 
        };
    }
    
    // Migration: Ensure toolHistory exists if loading old V2 data
    if (!data.toolHistory) {
      data.toolHistory = [];
    }

    return data;
  }

  saveChatData(characterId: string, messages: Message[], summary: string, toolHistory: ToolEntry[] = []): void {
    const data: ChatData = { messages, summary, toolHistory };
    this.storage.setItem(`${this.STORAGE_PREFIX}${characterId}`, data);
  }

  addToolEntry(characterId: string, entry: ToolEntry) {
    const data = this.getChatData(characterId);
    data.toolHistory.unshift(entry); // Add to top (newest first)
    this.saveChatData(characterId, data.messages, data.summary, data.toolHistory);
  }

  clearHistory(characterId: string): void {
    this.storage.removeItem(`${this.STORAGE_PREFIX}${characterId}`);
    this.storage.removeItem(`demomax_chat_${characterId}`);
  }
}
