
import { LevelState } from '../../models/economy.model';

export function calculateXpRequirement(level: number): number {
  return Math.floor(100 * Math.pow(level, 1.5));
}

export function calculateLevelProgress(currentXp: number, requiredXp: number): number {
  if (requiredXp === 0) return 0;
  return Math.min(100, Math.floor((currentXp / requiredXp) * 100));
}

export function processXpGain(currentState: LevelState, xpGained: number): { state: LevelState, leveledUp: boolean, levelsGained: number } {
    let { currentLevel, currentXp, totalXpEarned } = currentState;
    let xpToNext = calculateXpRequirement(currentLevel);

    currentXp += xpGained;
    totalXpEarned += xpGained;
    
    let levelsGained = 0;

    // Loop for multi-level gain
    while (currentXp >= xpToNext) {
      currentXp -= xpToNext;
      currentLevel++;
      levelsGained++;
      xpToNext = calculateXpRequirement(currentLevel);
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

export function getInitialLevelState(): LevelState {
    return {
      currentLevel: 1,
      currentXp: 0,
      xpToNextLevel: calculateXpRequirement(1),
      totalXpEarned: 0
    };
}
