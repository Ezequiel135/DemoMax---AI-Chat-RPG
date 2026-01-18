
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
        
        <div class="p-4 flex items-center gap-3 border-b border-white/5">
           <button (click)="close.emit()" class="text-pink-500 hover:text-pink-400">✕</button>
           <h3 class="font-bold text-white text-lg">Nível de Afinidade</h3>
        </div>

        <div class="overflow-y-auto custom-scroll p-4 space-y-6">
           <div class="bg-[#1E1E1E] rounded-3xl p-6 text-center border border-white/5">
              <h2 class="text-white font-bold text-lg mb-6">{{ character().name }} & Você</h2>
              
              <div class="flex justify-center items-center gap-4 mb-4">
                 <img [src]="character().avatarUrl" class="w-16 h-16 rounded-full object-cover border-2 border-pink-500">
                 <div class="flex flex-col items-center animate-pulse">
                    <span class="text-3xl mb-1">{{ currentLevel.icon }}</span>
                    <span class="text-pink-400 font-bold text-sm uppercase">{{ currentLevel.label }}</span>
                 </div>
                 <img [src]="userAvatar()" class="w-16 h-16 rounded-full object-cover border-2 border-blue-500">
              </div>

              <div class="mb-6 flex flex-col items-center">
                 <span class="text-xs text-slate-500 uppercase font-bold tracking-widest mb-1">Pontos Totais</span>
                 <div class="text-4xl font-black text-white flex items-center gap-2">
                    <span class="text-pink-500">❤</span> {{ character().affinity }}
                 </div>
              </div>

              <div class="text-left bg-black/20 p-4 rounded-xl border border-white/5">
                 <div class="flex justify-between text-xs font-bold text-pink-400 mb-2">
                    <span>Progresso</span>
                    <span>{{ affinityService.getPointsInLevel(character().affinity) }} / {{ affinityService.getLevelRange(character().affinity) }}</span>
                 </div>
                 <div class="h-2 bg-slate-800 rounded-full overflow-hidden">
                    <div class="h-full bg-gradient-to-r from-pink-600 to-purple-500 transition-all duration-500" 
                         [style.width.%]="affinityService.calculateProgress(character().affinity)"></div>
                 </div>
              </div>
           </div>

           <div class="space-y-2 pb-4">
              <h4 class="text-xs font-bold text-slate-500 uppercase px-2">Níveis</h4>
              @for (level of levels; track level.label) {
                 <div class="flex items-center justify-between px-4 py-3 rounded-xl transition-all"
                      [class.bg-pink-900_20]="level.label === currentLevel.label"
                      [class.border-pink-500_50]="level.label === currentLevel.label"
                      [class.border]="true"
                      [class.border-white_5]="level.label !== currentLevel.label"
                      [class.bg-white_5]="level.label !== currentLevel.label">
                    
                    <div class="flex items-center gap-3">
                       <span class="text-lg">{{ level.icon }}</span>
                       <span class="font-bold text-sm" [ngClass]="level.color">{{ level.label }}</span>
                    </div>
                    <div class="text-[10px] font-mono text-slate-400">{{ level.min }} pts</div>
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
  levels = AFFINITY_LEVELS.filter(l => l.max < 90000).reverse(); 

  get currentLevel() {
    return this.affinityService.getCurrentLevel(this.character().affinity);
  }
}
