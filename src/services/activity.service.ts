
import { Injectable, inject, signal, computed } from '@angular/core';
import { StorageService } from './storage.service';
import { Character } from '../models/character.model';
import { VisualNovel } from '../models/vn.model';

export interface ActivityItem {
  type: 'chat' | 'novel';
  id: string;
  title: string;
  image: string;
  subtitle: string;
  timestamp: number;
  progress?: number; // 0-100
}

@Injectable({
  providedIn: 'root'
})
export class ActivityService {
  private storage = inject(StorageService);
  private readonly KEY = 'demomax_activity_log';

  private _activities = signal<ActivityItem[]>([]);
  readonly recent = computed(() => this._activities().sort((a, b) => b.timestamp - a.timestamp));

  constructor() {
    const saved = this.storage.getItem<ActivityItem[]>(this.KEY);
    if (saved) this._activities.set(saved);
  }

  trackChat(char: Character) {
    this.upsert({
      type: 'chat',
      id: char.id,
      title: char.name,
      image: char.avatarUrl,
      subtitle: 'Conversa recente',
      timestamp: Date.now()
    });
  }

  trackNovel(vn: VisualNovel, sceneName: string) {
    this.upsert({
      type: 'novel',
      id: vn.id,
      title: vn.title,
      image: vn.coverUrl,
      subtitle: sceneName,
      timestamp: Date.now()
    });
  }

  private upsert(item: ActivityItem) {
    this._activities.update(current => {
      const filtered = current.filter(i => !(i.type === item.type && i.id === item.id));
      const updated = [item, ...filtered].slice(0, 10); // Keep last 10
      this.storage.setItem(this.KEY, updated);
      return updated;
    });
  }
}
