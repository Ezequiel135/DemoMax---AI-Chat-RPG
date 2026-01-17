
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SystemAssetsService {
  // Centralized Asset URL
  readonly APP_ICON = 'https://i.ibb.co/hxSz0SJr/Background-Eraser-20251224-125356967.png';

  constructor() {
    this.preloadAssets();
  }

  /**
   * Preloads critical images into browser memory/cache immediately upon app start.
   * This prevents flickering and repeated network requests later.
   */
  private preloadAssets() {
    const img = new Image();
    img.src = this.APP_ICON;
    // The browser now holds this in cache.
  }

  /**
   * Returns the cached URL.
   */
  getIcon(): string {
    return this.APP_ICON;
  }
}
