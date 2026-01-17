
import { Injectable, inject, computed } from '@angular/core';
import { CharacterService } from './character.service';
import { VnService } from './vn.service';
import { WebNovelService } from './web-novel.service';
import { Character } from '../models/character.model';
import { VisualNovel } from '../models/vn.model';
import { WebNovel } from '../models/web-novel.model';

export interface CreatorRank {
  name: string;
  totalMessages: number;
  totalFavorites: number;
  score: number;
  topCharUrl: string;
}

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private characterService = inject(CharacterService);
  private vnService = inject(VnService);
  private wnService = inject(WebNovelService);

  // Helper to parse strings like "1.2k", "1M" into numbers
  private parseMetric(value: string | number | undefined): number {
    if (value === undefined) return 0;
    if (typeof value === 'number') return value;
    
    const n = parseFloat(value);
    const lower = value.toLowerCase();
    if (lower.includes('m')) return n * 1000000;
    if (lower.includes('k')) return n * 1000;
    return n;
  }

  readonly topCharacters = computed(() => {
    const chars = this.characterService.recommended(); // Get all chars
    
    // Sort by a composite score: Messages + (Favorites * 5)
    return [...chars].sort((a, b) => {
      const scoreA = this.parseMetric(a.messageCount) + (this.parseMetric(a.favoriteCount) * 5);
      const scoreB = this.parseMetric(b.messageCount) + (this.parseMetric(b.favoriteCount) * 5);
      return scoreB - scoreA;
    }).slice(0, 50); // Top 50
  });

  readonly topNovels = computed(() => {
    const novels = this.vnService.novels();
    
    // Score = Plays + (Likes * 10)
    return [...novels].sort((a, b) => {
       const scoreA = (a.playCount || 0) + ((a.likes || 0) * 10);
       const scoreB = (b.playCount || 0) + ((b.likes || 0) * 10);
       return scoreB - scoreA;
    }).slice(0, 20);
  });

  readonly topWebNovels = computed(() => {
    const novels = this.wnService.novels();
    
    // Score = Reads + (Likes * 5)
    return [...novels].sort((a, b) => {
       const scoreA = (a.readCount || 0) + ((a.likes || 0) * 5);
       const scoreB = (b.readCount || 0) + ((b.likes || 0) * 5);
       return scoreB - scoreA;
    }).slice(0, 20);
  });

  readonly topCreators = computed(() => {
    const chars = this.characterService.recommended();
    const creatorMap = new Map<string, CreatorRank>();

    chars.forEach(c => {
      const msgs = this.parseMetric(c.messageCount);
      const favs = this.parseMetric(c.favoriteCount);
      
      if (!creatorMap.has(c.creator)) {
        creatorMap.set(c.creator, {
          name: c.creator,
          totalMessages: 0,
          totalFavorites: 0,
          score: 0,
          topCharUrl: c.avatarUrl
        });
      }

      const creator = creatorMap.get(c.creator)!;
      creator.totalMessages += msgs;
      creator.totalFavorites += favs;
      // Creator Score: Heavy weight on engagement
      creator.score += msgs + (favs * 5); 
    });

    return Array.from(creatorMap.values())
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  });
}
