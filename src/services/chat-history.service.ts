
import { Injectable, inject } from '@angular/core';
import { StorageService } from './storage.service';
import { Message } from '../models/message.model';
import { PhoneData } from '../models/phone-content.model';

export interface ToolEntry {
  id: string;
  type: 'diary' | 'dream' | 'thought' | 'forum';
  content: string;
  timestamp: number;
  dateRef?: string;
}

export interface ChatData {
  messages: Message[];
  summary: string;
  toolHistory: ToolEntry[];
  phoneData?: PhoneData | null;
}

@Injectable({
  providedIn: 'root'
})
export class ChatHistoryService {
  private storage = inject(StorageService);
  private readonly STORAGE_PREFIX = 'demomax_chat_v2_';

  getChatData(characterId: string): ChatData {
    const data = this.storage.getItem<ChatData>(`${this.STORAGE_PREFIX}${characterId}`);
    
    if (!data) {
        // Fallback legado
        const legacy = this.storage.getItem<Message[]>(`demomax_chat_${characterId}`);
        return { 
          messages: legacy || [], 
          summary: '', 
          toolHistory: [],
          phoneData: null
        };
    }
    
    if (!data.toolHistory) data.toolHistory = [];
    return data;
  }

  saveChatData(characterId: string, messages: Message[], summary: string, toolHistory: ToolEntry[] = [], phoneData?: PhoneData | null): void {
    const existing = this.getChatData(characterId);
    
    const data: ChatData = { 
        messages, 
        summary, 
        toolHistory: toolHistory.length ? toolHistory : existing.toolHistory, 
        phoneData: phoneData !== undefined ? phoneData : existing.phoneData 
    };
    
    this.storage.setItem(`${this.STORAGE_PREFIX}${characterId}`, data);
  }

  // Novo método específico para atualizar apenas a memória sem tocar nas mensagens recentes
  updateSummary(characterId: string, newSummary: string) {
    const current = this.getChatData(characterId);
    this.saveChatData(characterId, current.messages, newSummary, current.toolHistory, current.phoneData);
  }

  addToolEntry(characterId: string, entry: ToolEntry) {
    const data = this.getChatData(characterId);
    data.toolHistory.unshift(entry);
    this.saveChatData(characterId, data.messages, data.summary, data.toolHistory, data.phoneData);
  }
  
  savePhoneData(characterId: string, data: PhoneData) {
    const current = this.getChatData(characterId);
    this.saveChatData(characterId, current.messages, current.summary, current.toolHistory, data);
  }

  clearHistory(characterId: string): void {
    this.storage.removeItem(`${this.STORAGE_PREFIX}${characterId}`);
    this.storage.removeItem(`demomax_chat_${characterId}`);
  }
}
