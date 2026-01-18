
import { Injectable, inject } from '@angular/core';
import { AiConfigService } from './ai-config.service';
import { Chat, Content } from '@google/genai';
import { ChatMode } from '../chat-settings.service';
import { getChatConfig } from '../../logic/ai/model-config.logic';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private config = inject(AiConfigService);

  async createSession(systemInstruction: string, mode: ChatMode = 'flash', history: Content[] = []): Promise<Chat> {
    const config = getChatConfig(mode, systemInstruction);
    
    return this.config.client.chats.create({
      model: 'gemini-2.5-flash',
      config: config,
      history: history // Injeção crítica do histórico
    });
  }

  async sendMessage(chat: Chat, text: string): Promise<string> {
    try {
      const result = await chat.sendMessage({
        message: text
      });
      return result.text || "...";
    } catch (error) {
      console.error("AI Chat Error:", error);
      // Fallback gracioso para não quebrar a UI
      return "*Connection unstable...* (The system resets slightly). What were we saying?";
    }
  }
}
