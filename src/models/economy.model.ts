
export interface EconomyState {
  sakuraCoins: number; // Renamed from credits
  gems: number; 
  totalSpent: number;
  totalEarned: number;
}

export interface Transaction {
  id: string;
  type: 'earn' | 'spend';
  amount: number;
  currency: 'SC' | 'GEM';
  reason: string;
  timestamp: number;
}

export interface LevelState {
  currentLevel: number;
  currentXp: number;
  xpToNextLevel: number;
  totalXpEarned: number;
}

export interface StreakState {
  currentStreak: number;
  lastClaimDate: string | null; // ISO Date String
  longestStreak: number;
}

export interface RewardTier {
  day: number;
  sakuraCoins: number;
  xp: number;
  bonusItem?: string;
}

export interface MissionState {
  dailyMessagesSent: number;
  lastMissionDate: string | null;
  dailyMissionClaimed: boolean;
}
