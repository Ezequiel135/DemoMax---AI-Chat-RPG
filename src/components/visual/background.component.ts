
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[-1] overflow-hidden pointer-events-none select-none transition-colors duration-700"
         [class.bg-[#FAFAFA]]="theme.theme() === 'light'"
         [class.bg-[#0F0E17]]="theme.theme() === 'dark'">
      
      <!-- DARK MODE: Static Grid (GPU Accelerated) -->
      <div class="absolute inset-0 transition-opacity duration-700 opacity-[0.03] will-change-transform" 
           [class.opacity-0]="theme.theme() === 'light'"
           style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 40px 40px; transform: translateZ(0);">
      </div>

      <!-- LIGHT MODE: Static Gradient -->
      <div class="absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-pink-50 to-white/50"
           [class.opacity-100]="theme.theme() === 'light'"
           [class.opacity-0]="theme.theme() === 'dark'">
      </div>

      <!-- ANIMATED BLOBS (Optimized: Reduced Blur Radius & Count) -->
      <!-- Only visible in Light Mode to save battery in Dark Mode -->
      @if (theme.theme() === 'light') {
        <div class="absolute top-[-10%] left-[-10%] w-[60vw] h-[60vw] rounded-full bg-pink-500/10 blur-[60px] animate-breathe will-change-transform"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[60vw] h-[60vw] rounded-full bg-purple-600/10 blur-[60px] animate-breathe-delayed will-change-transform"></div>
      }
           
      <!-- Vignette (Static CSS) -->
      <div class="absolute inset-0 radial-vignette"></div>
    </div>
  `,
  styles: [`
    .radial-vignette {
      background: radial-gradient(circle at center, transparent 0%, rgba(15, 14, 23, 0.4) 100%);
    }
    :host-context(.light) .radial-vignette {
      background: radial-gradient(circle at center, transparent 0%, transparent 100%);
    }
    
    @keyframes breathe {
      0%, 100% { transform: scale(1) translateZ(0); }
      50% { transform: scale(1.05) translateZ(0); }
    }
    
    .animate-breathe { animation: breathe 15s ease-in-out infinite; }
    .animate-breathe-delayed { animation: breathe 18s ease-in-out infinite reverse; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackgroundComponent {
  theme = inject(ThemeService);
}
