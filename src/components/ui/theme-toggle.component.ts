
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button (click)="themeService.toggle()" 
            class="relative w-14 h-8 rounded-full transition-colors duration-500 ease-in-out border border-white/10 shadow-inner flex items-center px-1 group"
            [class.bg-[#2F2F2F]]="themeService.theme() === 'dark'"
            [class.bg-pink-100]="themeService.theme() === 'light'">
            
      <!-- Track Glow -->
      <div class="absolute inset-0 rounded-full opacity-20 transition-opacity duration-500"
           [class.bg-pink-500]="themeService.theme() === 'dark'"
           [class.bg-yellow-400]="themeService.theme() === 'light'"></div>

      <!-- Thumb -->
      <div class="relative w-6 h-6 rounded-full shadow-md transform transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] flex items-center justify-center overflow-hidden"
           [class.translate-x-6]="themeService.theme() === 'dark'"
           [class.translate-x-0]="themeService.theme() === 'light'"
           [class.bg-slate-800]="themeService.theme() === 'dark'"
           [class.bg-white]="themeService.theme() === 'light'">
        
        <!-- Sun Icon (Light Mode) -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
             class="absolute w-4 h-4 text-orange-400 transition-all duration-500"
             [class.opacity-100]="themeService.theme() === 'light'"
             [class.opacity-0]="themeService.theme() === 'dark'"
             [class.rotate-90]="themeService.theme() === 'dark'">
          <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.758 17.303a.75.75 0 00-1.061-1.06l-1.591 1.59a.75.75 0 001.06 1.061l1.591-1.59zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.697 7.757a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 00-1.061 1.06l1.59 1.591z" />
        </svg>

        <!-- Moon Icon (Dark Mode) -->
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" 
             class="absolute w-4 h-4 text-pink-500 transition-all duration-500"
             [class.opacity-100]="themeService.theme() === 'dark'"
             [class.opacity-0]="themeService.theme() === 'light'"
             [class.rotate-[-90deg]]="themeService.theme() === 'light'">
          <path fill-rule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.7-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clip-rule="evenodd" />
        </svg>
      </div>
    </button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ThemeToggleComponent {
  themeService = inject(ThemeService);
}
