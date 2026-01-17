
import { Component, output, inject, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AFFINITY_LEVELS } from '../../models/affinity.model';
import { Character } from '../../models/character.model';
import { AffinityService } from '../../services/affinity.service';

@Component({
  selector: 'app-affinity-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-[#121212] border border-white/10 rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative flex flex-col max-h-[85vh]" (click)="$event.stopPropagation()">
        
        <!-- HEADER -->
        <div class="p-4 flex items-center gap-3 border-b border-white/5">
           <button (click)="close.emit()" class="text-pink-500">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
           </button>
           <h3 class="font-bold text-white text-lg">Nível de afinidade</h3>
        </div>

        <div class="overflow-y-auto custom-scroll p-4 space-y-6">
           
           <!-- RELATIONSHIP CARD (Screenshot 3) -->
           <div class="bg-[#1E1E1E] rounded-3xl p-6 text-center border border-white/5 relative overflow-hidden">
              <h2 class="text-white font-bold text-lg mb-6">{{ character().name }} & User</h2>
              
              <div class="flex justify-center items-center gap-4 mb-4 relative z-10">
                 <!-- Char Avatar -->
                 <div class="w-16 h-16 rounded-full p-1 bg-white/10">
                    <img [src]="character().avatarUrl" class="w-full h-full rounded-full object-cover">
                 </div>
                 
                 <!-- Status Icon -->
                 <div class="flex flex-col items-center">
                    <span class="text-2xl mb-1">{{ currentLevel.icon }}</span>
                    <span class="text-pink-400 font-bold text-sm uppercase">{{ currentLevel.label }}</span>
                 </div>

                 <!-- User Avatar -->
                 <div class="w-16 h-16 rounded-full p-1 bg-white/10">
                    <img [src]="userAvatar()" class="w-full h-full rounded-full object-cover grayscale opacity-70">
                 </div>
              </div>

              <p class="text-slate-400 text-sm mb-6">Conectado por 0 dias</p>

              <!-- Progress Bar Inside Modal -->
              <div class="text-left">
                 <div class="flex justify-between text-xs font-bold text-pink-400 mb-2">
                    <span>Afinidade</span>
                    <span>{{ affinityService.getPointsInLevel(character().affinity) }}/{{ affinityService.getLevelRange(character().affinity) }}</span>
                 </div>
                 <div class="h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-pink-500 rounded-full" [style.width.%]="affinityService.calculateProgress(character().affinity)"></div>
                 </div>
                 <div class="text-left mt-1 text-2xl text-pink-500">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>
                 </div>
              </div>
           </div>

           <!-- LEVELS LIST (Screenshot 1) -->
           <div class="space-y-2">
              @for (level of levels; track level.label) {
                 <div class="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                      [ngClass]="level === currentLevel ? 'bg-pink-500/20 border border-pink-500/50' : 'bg-[#1E1E1E] border border-white/5'">
                    
                    <div class="flex items-center gap-2">
                       <span class="text-lg">{{ level.icon }}</span>
                       <span class="font-bold text-sm" [ngClass]="level.color">{{ level.label }}</span>
                    </div>

                    <div class="font-mono text-xs font-bold text-slate-400 bg-black/20 px-2 py-1 rounded">
                       {{ formatRange(level.min, level.max) }}
                    </div>
                 </div>
              }
           </div>

        </div>

      </div>
    </div>
  `
})
export class AffinityModalComponent {
  character = input.required<Character>();
  userAvatar = input.required<string>();
  close = output();
  
  affinityService = inject(AffinityService);
  
  levels = AFFINITY_LEVELS.filter(l => l.max < 90000).reverse(); // Reverse to show highest at top if desired, or keep logic

  get currentLevel() {
    return this.affinityService.getCurrentLevel(this.character().affinity);
  }

  formatRange(min: number, max: number): string {
    if (min < -1000) return '< ' + max;
    if (max > 10000) return '> ' + min;
    return `${min}~${max}`;
  }
}
