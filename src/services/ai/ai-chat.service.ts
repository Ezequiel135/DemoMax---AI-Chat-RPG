
import { Injectable, inject } from '@angular/core';
import { AiConfigService } from './ai-config.service';
import { Chat, HarmCategory, HarmBlockThreshold } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class AiChatService {
  private config = inject(AiConfigService);

  async createSession(systemInstruction: string): Promise<Chat> {
    return this.config.client.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: systemInstruction,
        temperature: 1.0, 
        topK: 64,
        topP: 0.95,
        safetySettings: [
          // We handle strict moderation locally (Regex) + Content Rewrite.
          // We lower API thresholds to prevent false positives on "roleplay combat".
          { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
          { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        ]
      }
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
      return "Error: Neural link unstable. The system prevented this response.";
    }
  }
}
