
import { Injectable, inject, signal, effect, computed } from '@angular/core';
import { StorageService } from './storage.service';
import { EconomyService } from './economy.service';
import { ToastService } from './toast.service';
import { MissionState } from '../models/economy.model';
import { hasDayChanged } from '../logic/core/daily-reset.logic';

@Injectable({
  providedIn: 'root'
})
export class MissionService {
  private storage = inject(StorageService);
  private economy = inject(EconomyService);
  private toast = inject(ToastService);

  private readonly STORAGE_KEY = 'demomax_missions_v1';
  private readonly DAILY_MSG_GOAL = 50;
  private readonly MISSION_REWARD = 20;

  private state = signal<MissionState>({
    dailyMessagesSent: 0,
    lastMissionDate: new Date().toISOString(),
    dailyMissionClaimed: false
  });

  readonly progress = computed(() => 
    Math.min(100, Math.floor((this.state().dailyMessagesSent / this.DAILY_MSG_GOAL) * 100))
  );

  constructor() {
    this.loadState();
    this.checkDailyReset();

    effect(() => {
      this.saveState();
    });
  }

  getDailyMessages(): number {
    this.checkDailyReset();
    return this.state().dailyMessagesSent;
  }

  trackMessageSent() {
    this.checkDailyReset();
    
    this.state.update(s => {
      const newCount = s.dailyMessagesSent + 1;
      return { ...s, dailyMessagesSent: newCount };
    });

    this.checkCompletion();
  }

  private checkCompletion() {
    const s = this.state();
    if (s.dailyMessagesSent >= this.DAILY_MSG_GOAL && !s.dailyMissionClaimed) {
      this.state.update(curr => ({ ...curr, dailyMissionClaimed: true }));
      this.economy.earnCoins(this.MISSION_REWARD);
      this.toast.show(`Mission Complete: 50 Messages! +${this.MISSION_REWARD} Sakura Coins`, 'success');
    }
  }

  private checkDailyReset() {
    if (hasDayChanged(this.state().lastMissionDate)) {
      this.state.set({
        dailyMessagesSent: 0,
        lastMissionDate: new Date().toISOString(),
        dailyMissionClaimed: false
      });
    }
  }

  private loadState() {
    const saved = this.storage.getItem<MissionState>(this.STORAGE_KEY);
    if (saved) {
      this.state.set(saved);
    }
  }

  private saveState() {
    this.storage.setItem(this.STORAGE_KEY, this.state());
  }
}
