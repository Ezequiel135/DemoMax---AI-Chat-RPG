
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService } from '../../services/leaderboard.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CharacterCardComponent, RouterLink],
  template: `
    <app-header></app-header>
    
    <div class="min-h-screen pb-20 max-w-[1400px] mx-auto px-4 lg:px-8 page-enter pt-8">
      
      <!-- Header Section -->
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 via-pink-500 to-violet-500 font-tech uppercase tracking-widest drop-shadow-sm mb-4">
          Global Rankings
        </h1>
        <p class="text-slate-400 max-w-lg mx-auto text-sm md:text-base">
          As entidades mais influentes e as histórias mais lidas da rede.
        </p>
      </div>

      <!-- Tab Switcher (4 Categories) -->
      <div class="flex justify-center mb-10">
        <div class="bg-slate-900/80 backdrop-blur-md p-1 rounded-2xl border border-white/10 flex relative w-full max-w-lg">
           <!-- Slider BG (Width 25% for 4 items) -->
           <div class="absolute inset-y-1 w-[24%] bg-pink-600 rounded-xl transition-all duration-300 ease-out shadow-lg shadow-pink-600/20"
                [class.left-1]="activeTab() === 'chars'"
                [class.left-[25%]]="activeTab() === 'novels'"
                [class.left-[50%]]="activeTab() === 'webnovels'"
                [class.left-[75%]]="activeTab() === 'creators'"></div>
           
           <button (click)="activeTab.set('chars')" 
                   class="relative z-10 flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-300 text-center"
                   [class.text-white]="activeTab() === 'chars'"
                   [class.text-slate-400]="activeTab() !== 'chars'">
             Personagens
           </button>
           <button (click)="activeTab.set('novels')" 
                   class="relative z-10 flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-300 text-center"
                   [class.text-white]="activeTab() === 'novels'"
                   [class.text-slate-400]="activeTab() !== 'novels'">
             V. Novels
           </button>
           <button (click)="activeTab.set('webnovels')" 
                   class="relative z-10 flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-300 text-center"
                   [class.text-white]="activeTab() === 'webnovels'"
                   [class.text-slate-400]="activeTab() !== 'webnovels'">
             Livros
           </button>
           <button (click)="activeTab.set('creators')" 
                   class="relative z-10 flex-1 py-3 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-colors duration-300 text-center"
                   [class.text-white]="activeTab() === 'creators'"
                   [class.text-slate-400]="activeTab() !== 'creators'">
             Criadores
           </button>
        </div>
      </div>

      <!-- 1. CHARACTERS RANKING -->
      @if (activeTab() === 'chars') {
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 animate-fade-in">
           @for (char of leaderboard.topCharacters(); track char.id; let idx = $index) {
             <app-character-card [character]="char" [rank]="idx + 1"></app-character-card>
           }
        </div>
      }

      <!-- 2. NOVELS RANKING (Visual Novels) -->
      @if (activeTab() === 'novels') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in max-w-5xl mx-auto">
           @for (vn of leaderboard.topNovels(); track vn.id; let idx = $index) {
              <div class="relative group bg-slate-900 border border-white/5 rounded-3xl overflow-hidden hover:border-pink-500/30 transition-all hover:shadow-2xl hover:shadow-pink-500/10 flex flex-col sm:flex-row">
                 
                 <!-- Rank Badge -->
                 <div class="absolute top-0 left-0 z-20 w-10 h-10 bg-slate-950/80 backdrop-blur flex items-center justify-center font-black text-lg border-r border-b border-white/10 rounded-br-xl"
                      [class.text-yellow-400]="idx === 0"
                      [class.text-slate-300]="idx === 1"
                      [class.text-orange-400]="idx === 2"
                      [class.text-white]="idx > 2">
                    #{{ idx + 1 }}
                 </div>

                 <!-- Cover Image -->
                 <div class="sm:w-48 aspect-video sm:aspect-auto relative overflow-hidden shrink-0">
                    <img [src]="vn.coverUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110">
                    <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
                    
                    <!-- Play Button (Overlay) -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <a [routerLink]="['/vn/play', vn.id]" class="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 ml-0.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                       </a>
                    </div>
                 </div>

                 <!-- Info -->
                 <div class="p-5 flex flex-col justify-center flex-1">
                    <div class="flex justify-between items-start mb-2">
                       <div>
                          <div class="flex gap-2 mb-1">
                             <span class="text-[9px] font-bold uppercase tracking-wider bg-cyan-500/20 px-2 py-0.5 rounded text-cyan-400 border border-cyan-500/20">Visual Novel</span>
                          </div>
                          <h3 class="text-xl font-bold text-white leading-tight group-hover:text-pink-400 transition-colors">{{ vn.title }}</h3>
                          <p class="text-xs text-pink-500 font-bold mt-0.5">by {{ vn.author }}</p>
                       </div>
                    </div>
                    
                    <p class="text-sm text-slate-400 line-clamp-2 mb-4">{{ vn.description }}</p>

                    <!-- Stats -->
                    <div class="flex items-center gap-4 text-xs font-mono text-slate-500 border-t border-white/5 pt-3 mt-auto">
                       <span class="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                          {{ (vn.playCount || 0) | number }} Plays
                       </span>
                       <span class="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-pink-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>
                          {{ (vn.likes || 0) | number }}
                       </span>
                    </div>
                 </div>
              </div>
           }
        </div>
      }

      <!-- 3. WEB NOVELS RANKING (Books) -->
      @if (activeTab() === 'webnovels') {
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 animate-fade-in max-w-5xl mx-auto">
           @for (wn of leaderboard.topWebNovels(); track wn.id; let idx = $index) {
              <div class="relative group bg-slate-900 border border-white/5 rounded-3xl overflow-hidden hover:border-emerald-500/30 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 flex flex-col sm:flex-row">
                 
                 <!-- Rank Badge -->
                 <div class="absolute top-0 left-0 z-20 w-10 h-10 bg-slate-950/80 backdrop-blur flex items-center justify-center font-black text-lg border-r border-b border-white/10 rounded-br-xl"
                      [class.text-yellow-400]="idx === 0"
                      [class.text-slate-300]="idx === 1"
                      [class.text-orange-400]="idx === 2"
                      [class.text-white]="idx > 2">
                    #{{ idx + 1 }}
                 </div>

                 <!-- Cover Image (Book ratio) -->
                 <div class="sm:w-40 aspect-[2/3] sm:aspect-auto relative overflow-hidden shrink-0">
                    <img [src]="wn.coverUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105">
                    <div class="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    
                    <!-- Read Button (Overlay) -->
                    <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                       <a [routerLink]="['/novel/read', wn.id]" class="px-4 py-2 bg-emerald-600 text-white font-bold rounded-lg shadow-lg transform scale-0 group-hover:scale-100 transition-transform duration-300 text-xs">
                          LER AGORA
                       </a>
                    </div>
                 </div>

                 <!-- Info -->
                 <div class="p-5 flex flex-col justify-center flex-1">
                    <div class="flex justify-between items-start mb-2">
                       <div>
                          <div class="flex gap-2 mb-1">
                             <span class="text-[9px] font-bold uppercase tracking-wider bg-emerald-500/20 px-2 py-0.5 rounded text-emerald-400 border border-emerald-500/20">Web Novel</span>
                          </div>
                          <h3 class="text-xl font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors">{{ wn.title }}</h3>
                          <p class="text-xs text-slate-500 font-bold mt-0.5">by {{ wn.author }}</p>
                       </div>
                    </div>
                    
                    <p class="text-sm text-slate-400 line-clamp-2 mb-4">{{ wn.description }}</p>

                    <!-- Stats -->
                    <div class="flex items-center gap-4 text-xs font-mono text-slate-500 border-t border-white/5 pt-3 mt-auto">
                       <span class="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
                          {{ (wn.readCount || 0) | number }} Reads
                       </span>
                       <span class="flex items-center gap-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-pink-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clip-rule="evenodd" /></svg>
                          {{ (wn.likes || 0) | number }}
                       </span>
                    </div>
                 </div>
              </div>
           }
        </div>
      }

      <!-- 4. CREATORS RANKING -->
      @if (activeTab() === 'creators') {
        <div class="max-w-3xl mx-auto space-y-4 animate-fade-in">
           @for (creator of leaderboard.topCreators(); track creator.name; let idx = $index) {
             <div [routerLink]="getProfileUrl(creator.name)" 
                  class="bg-slate-900/50 border border-slate-700/50 rounded-2xl p-4 flex items-center gap-6 hover:bg-slate-800 transition-colors group relative overflow-hidden cursor-pointer">
                
                <!-- Rank # -->
                <div class="w-12 text-center font-black text-2xl font-tech"
                     [class.text-yellow-400]="idx === 0"
                     [class.text-slate-300]="idx === 1"
                     [class.text-orange-400]="idx === 2"
                     [class.text-slate-600]="idx > 2">
                   #{{ idx + 1 }}
                </div>

                <!-- Avatar -->
                <div class="relative w-16 h-16 rounded-full overflow-hidden border-2"
                     [class.border-yellow-400]="idx === 0"
                     [class.border-slate-300]="idx === 1"
                     [class.border-orange-400]="idx === 2"
                     [class.border-slate-700]="idx > 2">
                   <img [src]="creator.topCharUrl" class="w-full h-full object-cover">
                   @if (idx === 0) {
                     <div class="absolute inset-0 bg-yellow-400/20 animate-pulse"></div>
                   }
                </div>

                <!-- Info -->
                <div class="flex-1">
                   <h3 class="text-white font-bold text-lg group-hover:text-pink-400 transition-colors">{{ creator.name }}</h3>
                   <div class="flex gap-4 mt-1 text-xs text-slate-400 font-mono">
                      <span class="flex items-center gap-1">
                        <span class="text-pink-500">Msg:</span> {{ (creator.totalMessages / 1000).toFixed(1) }}k
                      </span>
                      <span class="flex items-center gap-1">
                        <span class="text-yellow-500">Fav:</span> {{ (creator.totalFavorites / 1000).toFixed(1) }}k
                      </span>
                   </div>
                </div>

                <!-- Score -->
                <div class="text-right px-4">
                   <div class="text-[10px] text-slate-500 uppercase font-bold tracking-widest">Score</div>
                   <div class="text-xl font-black text-white font-tech">{{ creator.score.toLocaleString() }}</div>
                </div>

                <!-- Glow for Top 1 -->
                @if (idx === 0) {
                   <div class="absolute inset-0 bg-gradient-to-r from-yellow-500/10 to-transparent pointer-events-none"></div>
                }
             </div>
           }
        </div>
      }

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class LeaderboardComponent {
  leaderboard = inject(LeaderboardService);
  activeTab = signal<'chars' | 'novels' | 'webnovels' | 'creators'>('chars');

  getProfileUrl(creatorName: string): any[] {
    const username = creatorName.replace(/^@/, '');
    return ['/u', username];
  }
}
