
import { Injectable, inject } from '@angular/core';
import { AiConfigService } from './ai-config.service';
import { TranslationService } from './translation.service';
import { buildStructuredPrompt, StyleConfig } from '../../logic/image-generation/prompt-template.logic';
import { buildNovelCoverPrompt } from '../../logic/image-generation/novel-prompt.logic';

// Import Styles
import { ANIME_MOE_STYLE } from '../../logic/image-generation/styles/anime-moe.style';
import { DARK_FANTASY_STYLE } from '../../logic/image-generation/styles/dark-fantasy.style';
import { REALISTIC_STYLE } from '../../logic/image-generation/styles/realistic.style';
import { RETRO_ANIME_STYLE } from '../../logic/image-generation/styles/retro-anime.style';
import { OIL_PAINTING_STYLE } from '../../logic/image-generation/styles/oil-painting.style';

export type GenStyleId = 'anime_moe' | 'dark_fantasy' | 'realistic' | 'retro' | 'oil';

@Injectable({
  providedIn: 'root'
})
export class ImageGenerationService {
  private config = inject(AiConfigService);
  private translator = inject(TranslationService);

  // --- CHARACTER GENERATION ---
  async generateCharacter(userPrompt: string, styleId: GenStyleId): Promise<string | null> {
    const englishSubject = await this.translator.translateToEnglish(userPrompt);
    const styleConfig = this.getStyleConfig(styleId);
    const fullPrompt = buildStructuredPrompt(englishSubject, styleConfig);

    return this.callImagen(fullPrompt, '3:4'); // Portrait for chars
  }

  // --- VISUAL NOVEL COVER (Game Style) ---
  async generateVisualNovelCover(title: string, description: string, styleId: GenStyleId): Promise<string | null> {
    const englishDesc = await this.translator.translateToEnglish(description);
    const styleConfig = this.getStyleConfig(styleId);
    const fullPrompt = buildNovelCoverPrompt(title, englishDesc, styleConfig, 'Game');

    // Visual Novels often use 3:4 in this app for cards, or 16:9 for screens.
    // Using 3:4 to match the Card UI.
    return this.callImagen(fullPrompt, '3:4'); 
  }

  // --- WEB NOVEL COVER (Book Style) ---
  async generateWebNovelCover(title: string, description: string, styleId: GenStyleId): Promise<string | null> {
    const englishDesc = await this.translator.translateToEnglish(description);
    const styleConfig = this.getStyleConfig(styleId);
    const fullPrompt = buildNovelCoverPrompt(title, englishDesc, styleConfig, 'Book');

    // Web Novels are tall (Book format). Closest generic is 3:4 or 9:16.
    return this.callImagen(fullPrompt, '3:4');
  }

  // --- SHARED API CALL ---
  private async callImagen(prompt: string, aspectRatio: '1:1' | '3:4' | '16:9'): Promise<string | null> {
    try {
      const response = await this.config.client.models.generateImages({
        model: 'imagen-4.0-generate-001',
        prompt: prompt,
        config: {
          numberOfImages: 1,
          aspectRatio: aspectRatio,
          outputMimeType: 'image/jpeg'
        }
      });
      
      const base64 = response.generatedImages?.[0]?.image?.imageBytes;
      return base64 ? `data:image/jpeg;base64,${base64}` : null;
    } catch (e) {
      console.error("Master Image Gen Failed", e);
      return null;
    }
  }

  private getStyleConfig(id: GenStyleId): StyleConfig {
    switch (id) {
      case 'anime_moe': return ANIME_MOE_STYLE;
      case 'dark_fantasy': return DARK_FANTASY_STYLE;
      case 'realistic': return REALISTIC_STYLE;
      case 'retro': return RETRO_ANIME_STYLE;
      case 'oil': return OIL_PAINTING_STYLE;
      default: return ANIME_MOE_STYLE;
    }
  }
}
