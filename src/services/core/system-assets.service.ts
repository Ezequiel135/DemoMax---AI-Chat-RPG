
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SystemAssetsService {
  // Centralized Asset URL
  readonly APP_ICON = 'https://i.ibb.co/hxSz0SJr/Background-Eraser-20251224-125356967.png';

  /**
   * Returns the cached URL.
   */
  getIcon(): string {
    return this.APP_ICON;
  }

  /**
   * Returns a promise that resolves when critical assets are loaded.
   */
  preloadCriticalImages(): Promise<void> {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = this.APP_ICON;
      
      if (img.complete) {
        resolve();
      } else {
        img.onload = () => resolve();
        img.onerror = () => resolve(); // Proceed even if fails
      }
    });
  }
}
