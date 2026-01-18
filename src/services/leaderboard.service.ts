
import { Injectable, inject, computed } from '@angular/core';
import { CharacterService } from './character.service';
import { VnService } from './vn.service';
import { WebNovelService } from './web-novel.service';
import { CreatorRank, parseMetric, calculateCharacterScore, calculateNovelScore, calculateWebNovelScore } from '../logic/social/ranking.logic';

@Injectable({
  providedIn: 'root'
})
export class LeaderboardService {
  private characterService = inject(CharacterService);
  private vnService = inject(VnService);
  private wnService = inject(WebNovelService);

  readonly topCharacters = computed(() => {
    const chars = this.characterService.recommended();
    return [...chars].sort((a, b) => {
      const scoreA = calculateCharacterScore(parseMetric(a.messageCount), parseMetric(a.favoriteCount));
      const scoreB = calculateCharacterScore(parseMetric(b.messageCount), parseMetric(b.favoriteCount));
      return scoreB - scoreA;
    }).slice(0, 50);
  });

  readonly topNovels = computed(() => {
    const novels = this.vnService.novels();
    return [...novels].sort((a, b) => {
       const scoreA = calculateNovelScore(a.playCount || 0, a.likes || 0);
       const scoreB = calculateNovelScore(b.playCount || 0, b.likes || 0);
       return scoreB - scoreA;
    }).slice(0, 20);
  });

  readonly topWebNovels = computed(() => {
    const novels = this.wnService.novels();
    return [...novels].sort((a, b) => {
       const scoreA = calculateWebNovelScore(a.readCount || 0, a.likes || 0);
       const scoreB = calculateWebNovelScore(b.readCount || 0, b.likes || 0);
       return scoreB - scoreA;
    }).slice(0, 20);
  });

  readonly topOverallCreators = computed(() => {
    const map = new Map<string, CreatorRank>();

    // Process Chars
    this.characterService.recommended().forEach(c => {
      const msgs = parseMetric(c.messageCount);
      const favs = parseMetric(c.favoriteCount);
      const score = calculateCharacterScore(msgs, favs);
      
      if (!map.has(c.creator)) {
        map.set(c.creator, { name: c.creator, totalMessages: 0, totalFavorites: 0, score: 0, topItemUrl: c.avatarUrl, category: 'Character' });
      }
      const creator = map.get(c.creator)!;
      creator.totalMessages! += msgs;
      creator.totalFavorites! += favs;
      creator.score += score;
    });

    // Process VNs
    this.vnService.novels().forEach(n => {
      const authorName = n.author.startsWith('@') ? n.author : '@' + n.author;
      const score = calculateNovelScore(n.playCount || 0, n.likes || 0);

      if (!map.has(authorName)) {
        map.set(authorName, { name: authorName, totalPlays: 0, totalFavorites: 0, score: 0, topItemUrl: n.coverUrl, category: 'Visual Novel' });
      } else {
        const existing = map.get(authorName)!;
        existing.category = 'Mixed';
      }
      const creator = map.get(authorName)!;
      creator.totalPlays = (creator.totalPlays || 0) + (n.playCount || 0);
      creator.totalFavorites = (creator.totalFavorites || 0) + (n.likes || 0);
      creator.score += score;
    });

    // Process WNs
    this.wnService.novels().forEach(w => {
      const authorName = w.author.startsWith('@') ? w.author : '@' + w.author;
      const score = calculateWebNovelScore(w.readCount || 0, w.likes || 0);

      if (!map.has(authorName)) {
        map.set(authorName, { name: authorName, totalReads: 0, totalFavorites: 0, score: 0, topItemUrl: w.coverUrl, category: 'Web Novel' });
      } else {
        const existing = map.get(authorName)!;
        existing.category = 'Mixed';
      }
      const creator = map.get(authorName)!;
      creator.totalReads = (creator.totalReads || 0) + (w.readCount || 0);
      creator.totalFavorites = (creator.totalFavorites || 0) + (w.likes || 0);
      creator.score += score;
    });

    return Array.from(map.values()).sort((a, b) => b.score - a.score).slice(0, 50);
  });
  
  // Specific creator rankings can be derived from the computed above if needed, but keeping simple for now
  readonly topCharCreators = computed(() => this.topOverallCreators().filter(c => c.category === 'Character' || c.category === 'Mixed'));
  readonly topVnCreators = computed(() => this.topOverallCreators().filter(c => c.category === 'Visual Novel' || c.category === 'Mixed'));
  readonly topWnAuthors = computed(() => this.topOverallCreators().filter(c => c.category === 'Web Novel' || c.category === 'Mixed'));
}
