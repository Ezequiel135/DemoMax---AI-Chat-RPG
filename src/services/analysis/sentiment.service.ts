
import { Injectable } from '@angular/core';
import { SentimentPatternsLogic } from '../../logic/analysis/sentiment-patterns.logic';

@Injectable({
  providedIn: 'root'
})
export class SentimentService {

  analyzeScore(text: string): number {
    let score = 1; // Base interaction point

    // Check Negatives (High Penalty)
    if (SentimentPatternsLogic.check(text, 'NEGATIVE')) {
      return -5;
    }

    // Check Positives
    if (SentimentPatternsLogic.check(text, 'POSITIVE')) {
      score += 2;
    }

    // Check Flirty (Contextual bonus)
    if (SentimentPatternsLogic.check(text, 'FLIRTY')) {
      score += 2;
    }

    // Length Bonus (Effort)
    if (text.length > 50) score += 1;

    return Math.min(5, Math.max(-5, score));
  }
}
