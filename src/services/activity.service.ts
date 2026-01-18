
import { Injectable, inject, signal, computed } from '@angular/core';
import { StorageService } from './storage.service';
import { Character } from '../models/character.model';
import { VisualNovel } from '../models/vn.model';
import { sortActivitiesByRecency, createActivityItem } from '../logic/user/activity-tracker.logic';

export interface ActivityItem {
  type: 'chat' | 'novel' | 'web_novel';
  id: string;
  title: string;
  image: string;
  subtitle: string;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private storage = inject(StorageService);
  private readonly KEY = 'demomax_activity_log';

  private _activities = signal<ActivityItem[]>([]);
  readonly recent = computed(() => sortActivitiesByRecency(this._activities()));

  constructor() {
    const saved = this.storage.getItem<ActivityItem[]>(this.KEY);
    if (saved) this._activities.set(saved);
  }

  trackChat(char: Character) {
    this.upsert(createActivityItem('chat', char.id, char.name, char.avatarUrl, 'Conversa recente'));
  }

  trackNovel(vn: VisualNovel, sceneName: string) {
    this.upsert(createActivityItem('novel', vn.id, vn.title, vn.coverUrl, sceneName));
  }

  private upsert(item: ActivityItem) {
    this._activities.update(current => {
      const filtered = current.filter(i => !(i.type === item.type && i.id === item.id));
      const updated = [item, ...filtered].slice(0, 10); 
      this.storage.setItem(this.KEY, updated);
      return updated;
    });
  }
}
