
import { Injectable, inject } from '@angular/core';
import { AiConfigService } from './ai-config.service';

@Injectable({
  providedIn: 'root'
})
export class AiContentService {
  private config = inject(AiConfigService);

  async generateImage(prompt: string): Promise<string | null> {
    try {
      const response = await this.config.client.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: `Anime style character portrait, high fidelity, 8k resolution, detailed, ${prompt}`,
        config: {
          numberOfImages: 1,
          aspectRatio: '1:1',
          outputMimeType: 'image/jpeg'
        }
      });
      
      const base64 = response.generatedImages?.[0]?.image?.imageBytes;
      return base64 ? `data:image/jpeg;base64,${base64}` : null;
    } catch (e) {
      console.error("Image gen failed", e);
      return null;
    }
  }

  async moderateAndRewrite(name: string, description: string, instruction: string): Promise<{safe: boolean, rewritten: any}> {
    // Pass-through for Unrestricted Mode
    return { 
      safe: true, 
      rewritten: { name, description, systemInstruction: instruction } 
    };
  }

  async analyzeAndSanitize(text: string): Promise<string> {
    if (!text || text.length < 10) return text;

    const prompt = `
      [TASK] You are a Content Moderator and Editor.
      [INPUT TEXT]
      "${text}"
      
      [INSTRUCTION]
      1. Analyze the text for NSFW content.
      2. If the text is Safe/PG-13, return it EXACTLY as is.
      3. If the text is NSFW/18+, REWRITE it to be Safe/Teen-rated (PG-13).
      
      [OUTPUT]
      Return ONLY the final text string. No explanations.
    `;

    try {
      const response = await this.config.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text?.trim() || text;
    } catch (e) {
      return text;
    }
  }

  async compactMemory(currentSummary: string, recentEvents: string): Promise<string> {
    try {
      const prompt = `
        [TASK] Compactor.
        [INPUTS] MEMORY: ${currentSummary}. RECENT: ${recentEvents}
        [INSTRUCTION] Merge and summarize. Keep important facts. Discard small talk. Third person.
      `;
      const response = await this.config.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt
      });
      return response.text || currentSummary;
    } catch (e) { return currentSummary; }
  }
}
