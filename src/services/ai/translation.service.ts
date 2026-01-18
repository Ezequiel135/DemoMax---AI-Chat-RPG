
import { Injectable, inject } from '@angular/core';
import { AiConfigService } from './ai-config.service';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private config = inject(AiConfigService);

  async translateToEnglish(text: string): Promise<string> {
    if (!text) return '';
    
    const prompt = `
      [TASK] Translate the following text to English to be used as an image generation prompt.
      [INPUT] "${text}"
      [CONSTRAINT] Return ONLY the translated English text. No explanations.
    `;

    try {
      const response = await this.config.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text?.trim() || text;
    } catch (e) {
      console.error("Translation failed", e);
      return text;
    }
  }
}
