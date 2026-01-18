
import { Injectable, signal, computed, effect, inject, Injector } from '@angular/core';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { EconomyState, LevelState, StreakState, RewardTier, Transaction } from '../models/economy.model';
import { AuthService } from './auth.service';
import { getMasterWallet } from '../logic/economy/wealth.logic';
import { calculateLevelProgress, processXpGain, getInitialLevelState } from '../logic/economy/leveling.logic';
import { getRewardForDay, checkRewardAvailability, calculateNewStreak, getInitialStreakState } from '../logic/economy/daily-rewards.logic';
import { createTransaction } from '../logic/economy/transaction.logic';

@Injectable({
  providedIn: 'root'
})
export class EconomyService {
  private storage = inject(StorageService);
  private toast = inject(ToastService);
  private injector = inject(Injector);
  
  private readonly STORAGE_KEY = 'demomax_eco_v2';
  private readonly HISTORY_KEY = 'demomax_eco_history';
  private readonly INITIAL_BONUS = 300;

  private _wallet = signal<EconomyState>({ sakuraCoins: 0, gems: 0, totalSpent: 0, totalEarned: 0 });
  private _level = signal<LevelState>(getInitialLevelState());
  private _streak = signal<StreakState>(getInitialStreakState());
  private _history = signal<Transaction[]>([]);

  readonly sakuraCoins = computed(() => this._wallet().sakuraCoins);
  readonly userLevel = computed(() => this._level().currentLevel);
  readonly xpProgress = computed(() => 
    calculateLevelProgress(this._level().currentXp, this._level().xpToNextLevel)
  );
  readonly currentStreak = computed(() => this._streak().currentStreak);
  readonly history = this._history.asReadonly();
  
  readonly canClaimDaily = computed(() => {
    if (this.isGuest()) return false;
    return checkRewardAvailability(this._streak().lastClaimDate);
  });

  readonly nextDailyReward = computed<RewardTier>(() => {
    return getRewardForDay(this._streak().currentStreak + 1);
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

  initNewAccount() {
    if (this.isGuest()) return;

    if (this._wallet().totalEarned === 0) {
      this.earnCoins(this.INITIAL_BONUS, 'Welcome Bonus');
      this.toast.show(`Welcome Bonus: +${this.INITIAL_BONUS} Sakura Coins!`, 'success');
    }
  }

  setInfiniteBalance() {
    this._wallet.update(s => getMasterWallet(s));
    this.logTransaction('earn', 999999999, 'GOD MODE ACTIVATED');
    this._level.update(l => ({ ...l, currentLevel: 100 }));
  }

  addXp(amount: number) {
    if (this.isGuest()) return;

    const result = processXpGain(this._level(), amount);
    this._level.set(result.state);

    if (result.leveledUp) {
      const coinReward = result.levelsGained * 50;
      this.earnCoins(coinReward, `Level Up (Lvl ${result.state.currentLevel})`);
      
      this.justLeveledUp.set({ level: result.state.currentLevel, reward: coinReward });
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
      this.toast.show("Guests cannot spend coins.", "error");
      return false;
    }

    if (this._wallet().sakuraCoins >= amount) {
      this._wallet.update(s => ({
        ...s,
        sakuraCoins: s.sakuraCoins - amount,
        totalSpent: s.totalSpent + amount
      }));
      this.logTransaction('spend', amount, reason);
      return true;
    }
    return false; // BLOQUEIA A AÇÃO SE NÃO TIVER SALDO
  }

  claimDailyReward(): boolean {
    if (this.isGuest()) {
      this.toast.show("Register to claim daily rewards!", "info");
      return false;
    }

    if (!this.canClaimDaily()) return false;

    const newStreakState = calculateNewStreak(this._streak());
    this._streak.set(newStreakState);

    const reward = getRewardForDay(newStreakState.currentStreak);

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
    const tx = createTransaction(type, amount, reason);
    this._history.update(h => [tx, ...h]);
    this.storage.setItem(this.HISTORY_KEY, this._history());
  }

  private loadState() {
    const saved = this.storage.getItem<{wallet: EconomyState, level: LevelState, streak: StreakState}>(this.STORAGE_KEY);
    if (saved) {
      this._wallet.set(saved.wallet);
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
