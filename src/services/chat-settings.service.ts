
import { Injectable, inject, signal } from '@angular/core';
import { StorageService } from './storage.service';
import { CHAT_WALLPAPERS } from '../data/chat-wallpapers.data';
import { CHAT_DECORATIONS } from '../data/chat-decorations.data';
import { getDefaultChatSettings } from '../logic/chat/settings-defaults.logic';

export type ChatMode = 'flash' | 'prime' | 'pro' | 'lite';

export interface ChatSettings {
  wallpaperId: string;
  decorationId: string;
  autoVoice: boolean;
  personaName?: string; 
  chatMode: ChatMode;
}

@Injectable({
  providedIn: 'root'
})
export class ChatSettingsService {
  private storage = inject(StorageService);
  private readonly PREFIX = 'chat_settings_v1_';

  currentSettings = signal<ChatSettings>(getDefaultChatSettings());

  loadSettings(characterId: string) {
    const saved = this.storage.getItem<ChatSettings>(`${this.PREFIX}${characterId}`);
    if (saved) {
      this.currentSettings.set({ ...getDefaultChatSettings(), ...saved });
    } else {
      this.currentSettings.set(getDefaultChatSettings());
    }
  }

  saveSettings(characterId: string, settings: ChatSettings) {
    this.currentSettings.set(settings);
    this.storage.setItem(`${this.PREFIX}${characterId}`, settings);
  }

  updateSetting(characterId: string, key: keyof ChatSettings, value: any) {
    const current = this.currentSettings();
    const updated = { ...current, [key]: value };
    this.saveSettings(characterId, updated);
  }

  getWallpaperValue(id: string) {
    return CHAT_WALLPAPERS.find(w => w.id === id)?.value || '';
  }

  getDecorationClasses(id: string) {
    return CHAT_DECORATIONS.find(d => d.id === id) || CHAT_DECORATIONS[0];
  }
}
