
import { Injectable, inject } from '@angular/core';
import { Chat, Content } from '@google/genai';
import { AiChatService } from './ai/ai-chat.service';
import { AiContentService } from './ai/ai-content.service';
import { ChatMode } from './chat-settings.service';
import { executeWithRetry } from '../logic/ai/error-handling/retry-strategy.logic';
import { Message } from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private chatService = inject(AiChatService);
  private contentService = inject(AiContentService);

  // Removido cache de sessão para garantir que cada envio tenha o contexto 
  // mais atualizado e corrigido (incluindo a mensagem inicial).
  
  async createChatSession(characterId: string, systemInstruction: string, mode: ChatMode = 'flash', previousMessages: Message[] = []): Promise<Chat> {
    // Converte mensagens do app para o formato do Gemini (Content[])
    const history: Content[] = previousMessages.map(m => ({
      role: m.role,
      parts: [{ text: m.text }]
    }));

    return executeWithRetry(async () => {
       // Passamos o histórico para que a IA "leia" o que já aconteceu
       // Isso resolve o problema dela achar que é o início da conversa
       return await this.chatService.createSession(systemInstruction, mode, history);
    });
  }

  async sendMessage(chat: Chat, text: string): Promise<string> {
    return executeWithRetry(async () => {
       return await this.chatService.sendMessage(chat, text);
    });
  }

  // Funções auxiliares delegadas para sub-serviços
  async compactMemory(current: string, recent: string): Promise<string> {
    return executeWithRetry(() => this.contentService.compactMemory(current, recent));
  }

  async moderateAndRewrite(name: string, desc: string, inst: string) {
    return this.contentService.moderateAndRewrite(name, desc, inst);
  }

  async generateCharacterImage(prompt: string): Promise<string | null> {
    return executeWithRetry(() => this.contentService.generateImage(prompt), 2, 2000);
  }

  clearAllSessions() {
    // No-op (Stateless architecture for robustness)
  }
}
