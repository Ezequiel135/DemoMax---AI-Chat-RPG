
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
    // UNRESTRICTED MODE: Bypass moderation rewrite entirely.
    // Return the original input as "safe" to allow any character concept.
    return { 
      safe: true, 
      rewritten: { 
        name, 
        description, 
        systemInstruction: instruction 
      } 
    };
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
