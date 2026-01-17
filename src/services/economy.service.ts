
import { Injectable, signal, computed, effect, inject, Injector } from '@angular/core';
import { StorageService } from './storage.service';
import { LevelingService } from './leveling.service';
import { DailyRewardsService } from './daily-rewards.service';
import { ToastService } from './toast.service';
import { EconomyState, LevelState, StreakState, RewardTier, Transaction } from '../models/economy.model';
import { AuthService } from './auth.service';
import { getMasterWallet } from '../logic/economy/wealth.logic';

@Injectable({
  providedIn: 'root'
})
export class EconomyService {
  private storage = inject(StorageService);
  private leveling = inject(LevelingService);
  private rewards = inject(DailyRewardsService);
  private toast = inject(ToastService);
  private injector = inject(Injector);
  
  private readonly STORAGE_KEY = 'demomax_eco_v2';
  private readonly HISTORY_KEY = 'demomax_eco_history';
  private readonly INITIAL_BONUS = 300;

  // --- STATE SIGNALS ---
  private _wallet = signal<EconomyState>({ sakuraCoins: 0, gems: 0, totalSpent: 0, totalEarned: 0 });
  private _level = signal<LevelState>(this.leveling.getInitialState());
  private _streak = signal<StreakState>(this.rewards.getInitialState());
  private _history = signal<Transaction[]>([]);

  // --- PUBLIC COMPUTED ---
  readonly sakuraCoins = computed(() => this._wallet().sakuraCoins);
  readonly userLevel = computed(() => this._level().currentLevel);
  readonly xpProgress = computed(() => 
    this.leveling.calculateProgress(this._level().currentXp, this._level().xpToNextLevel)
  );
  readonly currentStreak = computed(() => this._streak().currentStreak);
  readonly history = this._history.asReadonly();
  
  readonly canClaimDaily = computed(() => {
    if (this.isGuest()) return false;
    return this.rewards.checkAvailability(this._streak().lastClaimDate);
  });

  readonly nextDailyReward = computed<RewardTier>(() => {
    return this.rewards.getRewardForDay(this._streak().currentStreak + 1);
  });

  readonly justLeveledUp = signal<{level: number, reward: number} | null>(null);

  constructor() {
    this.loadState();
    effect(() => { this.saveState(); });
  }

  private isGuest(): boolean {
    const auth = this.injector.get(AuthService);
    return auth.isGuest();
  }

  // --- ACTIONS ---

  initNewAccount() {
    if (this.isGuest()) return;

    if (this._wallet().totalEarned === 0) {
      this.earnCoins(this.INITIAL_BONUS, 'Welcome Bonus');
      this.toast.show(`Welcome Bonus: +${this.INITIAL_BONUS} Sakura Coins!`, 'success');
    }
  }

  // MASTER ACCOUNT FUNCTION - Uses pure logic from library
  setInfiniteBalance() {
    this._wallet.update(s => getMasterWallet(s));
    
    this.logTransaction('earn', 999999999, 'GOD MODE ACTIVATED');
    this._level.update(l => ({ ...l, currentLevel: 100 })); // Max Level
  }

  addXp(amount: number) {
    if (this.isGuest()) return;

    const result = this.leveling.processXpGain(this._level(), amount);
    this._level.set(result.state);

    if (result.leveledUp) {
      const coinReward = result.levelsGained * 50;
      this.earnCoins(coinReward, `Level Up (Lvl ${result.state.currentLevel})`);
      
      this.justLeveledUp.set({ 
        level: result.state.currentLevel, 
        reward: coinReward 
      });

      setTimeout(() => this.justLeveledUp.set(null), 5000);
      this.toast.show(`Level Up! You reached Lvl ${result.state.currentLevel}`, 'success');
    }
  }

  earnCoins(amount: number, reason: string = 'Earnings') {
    if (this.isGuest()) return;

    this._wallet.update(s => ({
      ...s,
      sakuraCoins: s.sakuraCoins + amount,
      totalEarned: s.totalEarned + amount
    }));
    this.logTransaction('earn', amount, reason);
  }

  spendCoins(amount: number, reason: string = 'Purchase'): boolean {
    if (this.isGuest()) {
      this.toast.show("Guests cannot spend coins. Please create an account.", "error");
      return false;
    }

    // Check balance
    if (this._wallet().sakuraCoins >= amount) {
      this._wallet.update(s => ({
        ...s,
        sakuraCoins: s.sakuraCoins - amount,
        totalSpent: s.totalSpent + amount
      }));
      this.logTransaction('spend', amount, reason);
      return true;
    }
    return false;
  }

  claimDailyReward(): boolean {
    if (this.isGuest()) {
      this.toast.show("Register to claim daily rewards!", "info");
      return false;
    }

    if (!this.canClaimDaily()) return false;

    const newStreakState = this.rewards.calculateNewStreak(this._streak());
    this._streak.set(newStreakState);

    const reward = this.rewards.getRewardForDay(newStreakState.currentStreak);

    this.earnCoins(reward.sakuraCoins, `Daily Login (Day ${newStreakState.currentStreak})`);
    this.addXp(reward.xp);

    return true;
  }

  watchAdForReward() {
     if (this.isGuest()) {
        this.toast.show("Guests cannot earn rewards.", "error");
        return;
     }
     this.earnCoins(50, 'Ad Reward');
     this.toast.show("Ad Watched: +50 Sakura Coins", "success");
  }

  private logTransaction(type: 'earn' | 'spend', amount: number, reason: string) {
    const tx: Transaction = {
      id: Date.now().toString() + Math.random().toString().slice(2, 6),
      type,
      amount,
      currency: 'SC',
      reason,
      timestamp: Date.now()
    };
    this._history.update(h => [tx, ...h]);
    this.storage.setItem(this.HISTORY_KEY, this._history());
  }

  private loadState() {
    const saved = this.storage.getItem<{wallet: EconomyState, level: LevelState, streak: StreakState}>(this.STORAGE_KEY);
    if (saved) {
      const wallet = saved.wallet as any;
      if (wallet.credits !== undefined && wallet.sakuraCoins === undefined) {
          wallet.sakuraCoins = wallet.credits;
          delete wallet.credits;
      }
      this._wallet.set(wallet);
      this._level.set(saved.level);
      this._streak.set(saved.streak);
    }
    
    const savedHistory = this.storage.getItem<Transaction[]>(this.HISTORY_KEY);
    if (savedHistory) {
      this._history.set(savedHistory);
    }
  }

  private saveState() {
    this.storage.setItem(this.STORAGE_KEY, {
      wallet: this._wallet(),
      level: this._level(),
      streak: this._streak()
    });
  }
}
