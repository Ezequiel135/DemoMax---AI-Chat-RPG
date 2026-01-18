
import { Injectable, inject } from '@angular/core';
import { AiConfigService } from './ai-config.service';
import { buildCompactionPrompt } from '../../logic/ai/memory/memory-compactor.logic';

@Injectable({
  providedIn: 'root'
})
export class AiMemoryService {
  private config = inject(AiConfigService);

  async compactHistory(existingSummary: string, messagesChunk: string): Promise<string> {
    const prompt = buildCompactionPrompt(existingSummary, messagesChunk);

    try {
      const response = await this.config.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text?.trim() || existingSummary;
    } catch (e) {
      console.error("Memory Compaction Failed", e);
      return existingSummary; 
    }
  }
}
