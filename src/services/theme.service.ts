
import { Injectable, signal, effect, inject } from '@angular/core';
import { StorageService } from './storage.service';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private storage = inject(StorageService);
  readonly theme = signal<Theme>('dark'); 

  constructor() {
    this.initializeTheme();
    
    // Effect to apply theme to HTML tag whenever signal changes
    effect(() => {
      const current = this.theme();
      const html = document.documentElement;
      
      if (current === 'dark') {
        html.classList.add('dark');
        html.classList.remove('light');
      } else {
        html.classList.remove('dark');
        html.classList.add('light');
      }
      
      this.storage.setItem('app-theme', current);
    });
  }

  private initializeTheme() {
    const saved = this.storage.getItem<Theme>('app-theme');
    if (saved) {
      this.theme.set(saved);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      this.theme.set(prefersDark ? 'dark' : 'light');
    }
  }

  toggle() {
    this.theme.update(current => current === 'dark' ? 'light' : 'dark');
  }
}
