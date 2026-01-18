
import { RewardTier, StreakState } from '../../models/economy.model';

const REWARDS: RewardTier[] = [
    { day: 1, sakuraCoins: 10, xp: 25 },
    { day: 2, sakuraCoins: 10, xp: 30 },
    { day: 3, sakuraCoins: 15, xp: 35 },
    { day: 4, sakuraCoins: 20, xp: 40 },
    { day: 5, sakuraCoins: 25, xp: 50 },
    { day: 6, sakuraCoins: 30, xp: 60 },
    { day: 7, sakuraCoins: 50, xp: 150, bonusItem: 'Gacha Ticket' },
];

export function getRewardForDay(day: number): RewardTier {
    const index = (day - 1) % REWARDS.length;
    return REWARDS[index];
}

export function checkRewardAvailability(lastClaimDate: string | null): boolean {
    if (!lastClaimDate) return true;
    const last = new Date(lastClaimDate);
    const now = new Date();
    
    last.setHours(0,0,0,0);
    now.setHours(0,0,0,0);

    return now.getTime() > last.getTime();
}

export function calculateNewStreak(currentState: StreakState): StreakState {
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
      newStreak++;
    } else if (diffDays > 1) {
      newStreak = 1;
    }

    return {
      currentStreak: newStreak,
      lastClaimDate: todayStr,
      longestStreak: Math.max(newStreak, currentState.longestStreak)
    };
}

export function getInitialStreakState(): StreakState {
    return {
      currentStreak: 0,
      lastClaimDate: null,
      longestStreak: 0
    };
}
