
import { Injectable } from '@angular/core';
import { StreakState, RewardTier } from '../models/economy.model';

@Injectable({
  providedIn: 'root'
})
export class DailyRewardsService {

  // Configuration: 7 Day Cycle
  // Spec: Login diário (+10)
  private readonly REWARDS: RewardTier[] = [
    { day: 1, sakuraCoins: 10, xp: 25 },
    { day: 2, sakuraCoins: 10, xp: 30 },
    { day: 3, sakuraCoins: 15, xp: 35 },
    { day: 4, sakuraCoins: 20, xp: 40 },
    { day: 5, sakuraCoins: 25, xp: 50 },
    { day: 6, sakuraCoins: 30, xp: 60 },
    { day: 7, sakuraCoins: 50, xp: 150, bonusItem: 'Gacha Ticket' },
  ];

  getRewardForDay(day: number): RewardTier {
    // Cycle wraps around 7
    const index = (day - 1) % this.REWARDS.length;
    return this.REWARDS[index];
  }

  checkAvailability(lastClaimDate: string | null): boolean {
    if (!lastClaimDate) return true;

    const last = new Date(lastClaimDate);
    const now = new Date();
    
    // Reset time to midnight for accurate day comparison
    last.setHours(0,0,0,0);
    now.setHours(0,0,0,0);

    return now.getTime() > last.getTime();
  }

  calculateNewStreak(currentState: StreakState): StreakState {
    const now = new Date();
    const todayStr = now.toISOString();

    if (!currentState.lastClaimDate) {
      return { 
        currentStreak: 1, 
        lastClaimDate: todayStr, 
        longestStreak: 1 
      };
    }

    const last = new Date(currentState.lastClaimDate);
    const diffTime = Math.abs(now.getTime() - last.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    let newStreak = currentState.currentStreak;

    if (diffDays === 1) {
      // Consecutive day
      newStreak++;
    } else if (diffDays > 1) {
      // Broken streak
      newStreak = 1;
    }

    return {
      currentStreak: newStreak,
      lastClaimDate: todayStr,
      longestStreak: Math.max(newStreak, currentState.longestStreak)
    };
  }

  getInitialState(): StreakState {
    return {
      currentStreak: 0,
      lastClaimDate: null,
      longestStreak: 0
    };
  }
}
