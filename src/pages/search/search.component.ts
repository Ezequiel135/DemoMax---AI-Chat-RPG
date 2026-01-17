
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../services/character.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent, CharacterCardComponent],
  template: `
    <app-header></app-header>
    
    <div class="min-h-screen pb-20 max-w-[1400px] mx-auto px-4 lg:px-8 page-enter pt-4">
      
      <!-- Search Header -->
      <div class="mb-6">
        <div class="relative max-w-2xl mx-auto">
          <input [(ngModel)]="searchQuery" 
                 (keyup.enter)="saveToHistory()"
                 type="text" 
                 placeholder="Search characters, tags, or creators..." 
                 class="w-full bg-slate-900 border border-slate-700 rounded-full py-3.5 pl-12 pr-6 text-white text-base focus:border-pink-500 focus:outline-none shadow-lg transition-all placeholder-slate-500">
          
          <svg xmlns="http://www.w3.org/2000/svg" class="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      <!-- Filters -->
      <div class="flex flex-wrap justify-center gap-3 mb-6">
         <div class="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700">
            <span class="text-[10px] text-slate-500 uppercase font-bold">Rarity:</span>
            <select [(ngModel)]="filterRarity" class="bg-transparent text-white text-xs focus:outline-none cursor-pointer">
              <option value="All">All</option>
              <option value="Common">Common</option>
              <option value="Rare">Rare</option>
              <option value="Legendary">Legendary</option>
            </select>
         </div>

         <!-- NSFW Toggle (Only if Allowed) -->
         @if (auth.currentUser()?.isAdultVerified) {
           <div class="flex items-center gap-2 bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-700 cursor-pointer" (click)="toggleNSFW()">
              <span class="text-[10px] font-bold uppercase" [class.text-red-500]="showNSFW()" [class.text-slate-500]="!showNSFW()">
                 18+ Content
              </span>
              <div class="w-6 h-3 bg-slate-800 rounded-full relative">
                 <div class="absolute top-0.5 left-0.5 w-2 h-2 bg-white rounded-full transition-all"
                      [class.translate-x-3]="showNSFW()" [class.bg-red-500]="showNSFW()"></div>
              </div>
           </div>
         }
      </div>

      <!-- Recent Searches -->
      @if (!searchQuery() && recentSearches().length > 0) {
        <div class="max-w-2xl mx-auto mb-8 animate-fade-in">
           <div class="flex justify-between items-center mb-2 px-2">
              <h3 class="text-xs font-bold text-slate-400 uppercase">Recent Searches</h3>
              <button (click)="clearHistory()" class="text-[10px] text-pink-500 hover:text-pink-400">Clear</button>
           </div>
           <div class="flex flex-wrap gap-2">
              @for (term of recentSearches(); track term) {
                 <button (click)="searchQuery.set(term)" class="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors">
                    {{ term }}
                 </button>
              }
           </div>
        </div>
      }

      <!-- Results Grid (2 Columns) -->
      @if (results().length > 0) {
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 animate-fade-in">
           @for (char of results(); track char.id) {
              <app-character-card [character]="char"></app-character-card>
           }
        </div>
      } @else if (searchQuery()) {
        <div class="text-center py-20 animate-fade-in">
           <div class="text-5xl mb-4 grayscale opacity-50">🔍</div>
           <h3 class="text-lg font-bold text-white mb-2">No signals found</h3>
           <p class="text-sm text-slate-400">Try adjusting your filters or keywords.</p>
        </div>
      }

    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class SearchComponent {
  charService = inject(CharacterService);
  auth = inject(AuthService);
  storage = inject(StorageService);

  searchQuery = signal('');
  filterRarity = signal<string>('All');
  showNSFW = signal(false);
  recentSearches = signal<string[]>([]);

  constructor() {
    this.showNSFW.set(this.auth.currentUser()?.showNSFW ?? false);
    const history = this.storage.getItem<string[]>('search_history');
    if (history) this.recentSearches.set(history);
  }

  results = computed(() => {
    const q = this.searchQuery().toLowerCase();
    const rarity = this.filterRarity();
    const allowNSFW = this.showNSFW();
    
    let chars = this.charService.allCharacters();

    if (!allowNSFW) {
       chars = chars.filter(c => !c.isNSFW);
    }

    if (rarity !== 'All') {
       chars = chars.filter(c => c.rarity === rarity);
    }

    if (q) {
      chars = chars.filter(c => 
         c.name.toLowerCase().includes(q) || 
         c.tags.some(t => t.toLowerCase().includes(q)) ||
         c.creator.toLowerCase().includes(q)
      );
    } else {
      if (rarity === 'All') return [];
    }

    return chars;
  });

  toggleNSFW() {
    this.showNSFW.update(v => !v);
  }

  saveToHistory() {
    const q = this.searchQuery().trim();
    if (!q) return;

    this.recentSearches.update(curr => {
       const filtered = curr.filter(x => x !== q);
       const updated = [q, ...filtered].slice(0, 8);
       this.storage.setItem('search_history', updated);
       return updated;
    });
  }

  clearHistory() {
    this.recentSearches.set([]);
    this.storage.removeItem('search_history');
  }
}
