
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EconomyService } from '../../services/economy.service';

@Component({
  selector: 'app-level-up-toast',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (economy.justLeveledUp(); as data) {
      <div class="fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none">
        <!-- Confetti/Rays Background -->
        <div class="absolute inset-0 bg-black/40 backdrop-blur-sm animate-fade-in"></div>
        
        <!-- Card -->
        <div class="relative bg-slate-900 border-2 border-pink-500 rounded-3xl p-8 text-center shadow-[0_0_50px_rgba(236,72,153,0.6)] animate-bounce-in pointer-events-auto overflow-hidden">
          
          <!-- Shine Effect -->
          <div class="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-transparent animate-shine"></div>

          <div class="relative z-10">
            <h2 class="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-pink-400 to-violet-400 font-tech uppercase tracking-widest mb-2 drop-shadow-lg">
              Level Up!
            </h2>
            
            <div class="text-6xl font-black text-white mb-4 drop-shadow-md">
              {{ data.level }}
            </div>

            <div class="flex flex-col gap-1 items-center justify-center text-sm font-bold text-slate-300">
               <span>Rewards Received</span>
               <span class="text-pink-400 text-lg flex items-center gap-1">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" /></svg>
                 +{{ data.reward }} SC
               </span>
            </div>

            <button (click)="close()" class="mt-6 px-8 py-2 bg-pink-600 hover:bg-pink-500 text-white rounded-full font-bold uppercase tracking-wide transition-colors shadow-lg">
              Awesome
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    .animate-bounce-in { animation: bounceIn 0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55); }
    .animate-shine { animation: shine 2s infinite linear; background-size: 200% auto; }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes bounceIn {
      0% { transform: scale(0.5); opacity: 0; }
      100% { transform: scale(1); opacity: 1; }
    }
    @keyframes shine {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LevelUpToastComponent {
  economy = inject(EconomyService);

  close() {
    this.economy.justLeveledUp.set(null);
  }
}
