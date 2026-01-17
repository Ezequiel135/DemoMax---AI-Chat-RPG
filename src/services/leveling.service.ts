
import { Injectable, signal, computed } from '@angular/core';
import { LevelState } from '../models/economy.model';

@Injectable({
  providedIn: 'root'
})
export class LevelingService {
  
  // Math: Calculate XP required for a specific level
  // Formula: Base 100 * (Level ^ 1.5)
  private calculateXpRequirement(level: number): number {
    return Math.floor(100 * Math.pow(level, 1.5));
  }

  // Pure function to calculate progress
  calculateProgress(currentXp: number, requiredXp: number): number {
    if (requiredXp === 0) return 0;
    return Math.min(100, Math.floor((currentXp / requiredXp) * 100));
  }

  // Core Logic: Add XP and determine if Level Up occurred
  // Returns: { newState, leveledUp: boolean, levelsGained: number }
  processXpGain(currentState: LevelState, xpGained: number): { state: LevelState, leveledUp: boolean, levelsGained: number } {
    let { currentLevel, currentXp, totalXpEarned } = currentState;
    let xpToNext = this.calculateXpRequirement(currentLevel);

    currentXp += xpGained;
    totalXpEarned += xpGained;
    
    let levelsGained = 0;

    // Loop for multi-level gain (e.g. huge XP dump)
    while (currentXp >= xpToNext) {
      currentXp -= xpToNext;
      currentLevel++;
      levelsGained++;
      xpToNext = this.calculateXpRequirement(currentLevel);
    }

    return {
      state: {
        currentLevel,
        currentXp,
        xpToNextLevel: xpToNext,
        totalXpEarned
      },
      leveledUp: levelsGained > 0,
      levelsGained
    };
  }

  getInitialState(): LevelState {
    return {
      currentLevel: 1,
      currentXp: 0,
      xpToNextLevel: this.calculateXpRequirement(1),
      totalXpEarned: 0
    };
  }
}
