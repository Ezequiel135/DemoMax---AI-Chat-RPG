
import { Injectable, inject } from '@angular/core';
import { Chat } from '@google/genai';
import { AiChatService } from './ai/ai-chat.service';
import { AiContentService } from './ai/ai-content.service';

// FACADE SERVICE: Delegates to specialized mini-services
@Injectable({
  providedIn: 'root'
})
export class GeminiService {
  private chatService = inject(AiChatService);
  private contentService = inject(AiContentService);

  // CACHE SYSTEM: Guarda múltiplas sessões pausadas na memória
  // Key: characterId, Value: Chat Session Object
  private sessionCache = new Map<string, Chat>();

  /**
   * Recupera uma sessão existente ou cria uma nova se não existir.
   * Não destrói as anteriores automaticamente.
   */
  async createChatSession(characterId: string, systemInstruction: string): Promise<Chat> {
    
    // 1. Tenta recuperar sessão pausada
    if (this.sessionCache.has(characterId)) {
      // console.log(`[GeminiService] Resuming paused session for: ${characterId}`);
      return this.sessionCache.get(characterId)!;
    }

    // 2. Cria nova se não existir
    // console.log(`[GeminiService] Creating new session for: ${characterId}`);
    const newSession = await this.chatService.createSession(systemInstruction);
    
    // 3. Salva no cache
    this.sessionCache.set(characterId, newSession);
    
    return newSession;
  }

  async sendMessage(chat: Chat, text: string): Promise<string> {
    return this.chatService.sendMessage(chat, text);
  }

  async compactMemory(current: string, recent: string): Promise<string> {
    return this.contentService.compactMemory(current, recent);
  }

  async moderateAndRewrite(name: string, desc: string, inst: string) {
    return this.contentService.moderateAndRewrite(name, desc, inst);
  }

  async generateCharacterImage(prompt: string): Promise<string | null> {
    return this.contentService.generateImage(prompt);
  }

  /**
   * MANUAL CLEANUP: Chamado apenas quando o usuário aperta "Limpar Memória".
   * Esvazia todas as conversas da RAM.
   */
  clearAllSessions() {
    this.sessionCache.clear();
    // console.log("[GeminiService] All sessions wiped from memory.");
  }
}
