
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
         [class.bg-[#2F2F2F]]="theme.theme() === 'dark'">
      
      <!-- DARK MODE: Cyber Grid -->
      <div class="absolute inset-0 transition-opacity duration-700" 
           [class.opacity-[0.05]]="theme.theme() === 'dark'"
           [class.opacity-0]="theme.theme() === 'light'"
           style="background-image: linear-gradient(#fff 1px, transparent 1px), linear-gradient(90deg, #fff 1px, transparent 1px); background-size: 50px 50px;">
      </div>

      <!-- LIGHT MODE: Soft Sakura Gradient Overlay -->
      <div class="absolute inset-0 transition-opacity duration-700 bg-gradient-to-br from-pink-50 to-white/50"
           [class.opacity-100]="theme.theme() === 'light'"
           [class.opacity-0]="theme.theme() === 'dark'">
      </div>

      <!-- LIGHT MODE: Floating Petals (Simulated with Orbs for performance) -->
      <div class="absolute top-[-10%] left-[20%] w-[400px] h-[400px] rounded-full bg-pink-300/20 blur-[80px] animate-drift-slow transition-opacity duration-700"
           [class.opacity-0]="theme.theme() === 'dark'"></div>
       <div class="absolute bottom-[-10%] right-[10%] w-[300px] h-[300px] rounded-full bg-pink-200/30 blur-[60px] animate-pulse-slow transition-opacity duration-700"
           [class.opacity-0]="theme.theme() === 'dark'"></div>
      
      <!-- DARK MODE: Neon Gradient Orbs -->
      <div class="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] rounded-full bg-violet-600/20 blur-[120px] animate-drift-slow transition-opacity duration-700"
           [class.opacity-0]="theme.theme() === 'light'"></div>
      <div class="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] rounded-full bg-pink-600/20 blur-[100px] animate-pulse-slow transition-opacity duration-700"
           [class.opacity-0]="theme.theme() === 'light'"></div>
      
      <!-- Vignette (Stronger in Dark Mode) -->
      <div class="absolute inset-0 transition-opacity duration-700"
           [style.background]="'radial-gradient(circle at center, transparent 0%, ' + (theme.theme() === 'dark' ? '#2F2F2F' : 'transparent') + ' 100%)'"></div>
    </div>
  `,
  styles: [`
    .animate-drift-slow {
      animation: drift 20s ease-in-out infinite alternate;
    }
    .animate-pulse-slow {
      animation: pulse-glow 10s ease-in-out infinite alternate;
    }
    @keyframes drift {
      0% { transform: translate(0, 0); }
      100% { transform: translate(50px, 30px); }
    }
    @keyframes pulse-glow {
      0% { transform: scale(1); }
      100% { transform: scale(1.1); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BackgroundComponent {
  theme = inject(ThemeService);
}
