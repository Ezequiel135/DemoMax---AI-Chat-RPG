
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from '../../components/header/header.component';
import { VnService } from '../../services/vn.service';
import { PermissionService } from '../../services/permission.service';
import { VisualNovel } from '../../models/vn.model';

@Component({
  selector: 'app-vn-library',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterLink, FormsModule],
  template: `
    <app-header></app-header>
    
    <div class="min-h-screen pb-24 max-w-[1400px] mx-auto px-4 lg:px-8 page-enter pt-4">
      
      <!-- SEARCH INTERFACE & ACTIONS -->
      <div class="sticky top-20 z-30 mb-6 mt-2">
        <div class="flex gap-3 items-center">
          
          <!-- Search Bar -->
          <div class="relative flex-1 group">
             <div class="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500 group-focus-within:text-pink-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
             </div>
             <input [(ngModel)]="searchQuery" 
                    type="text" 
                    placeholder="Pesquisar novels..." 
                    class="w-full bg-slate-900/90 backdrop-blur-xl border border-slate-700/50 rounded-2xl py-3.5 pl-12 pr-4 text-white placeholder-slate-500 focus:outline-none focus:border-pink-500/50 focus:ring-1 focus:ring-pink-500/20 shadow-xl transition-all text-sm">
          </div>

          <!-- Create Button -->
          <button (click)="createNew()" class="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-pink-600 to-purple-600 hover:from-pink-500 hover:to-purple-500 text-white rounded-2xl flex items-center justify-center shadow-lg shadow-pink-600/20 transition-all transform hover:scale-105 active:scale-95" title="Criar Nova Novel">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 4v16m8-8H4" />
             </svg>
          </button>

        </div>
      </div>

      <!-- RESULTS GRID (2 Columns) -->
      @if (filteredNovels().length > 0) {
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          @for (vn of filteredNovels(); track vn.id) {
             <div class="group relative bg-slate-900 border border-white/5 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-purple-500/10 transition-all duration-300 hover:-translate-y-1">
                
                <!-- Cover -->
                <div class="aspect-[3/4] relative overflow-hidden">
                   <img [src]="vn.coverUrl" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 opacity-90 group-hover:opacity-100">
                   <div class="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent"></div>
                   
                   <!-- Play Button Overlay -->
                   <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-black/20 backdrop-blur-[1px]">
                      <button [routerLink]="['/vn/play', vn.id]" class="w-12 h-12 bg-white text-black rounded-full flex items-center justify-center shadow-2xl transform scale-0 group-hover:scale-100 transition-transform duration-300">
                         <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 ml-0.5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                      </button>
                   </div>
                </div>

                <!-- Info -->
                <div class="p-3">
                   <div class="flex justify-between items-start mb-1">
                      <h3 class="text-sm font-bold text-white truncate pr-1">{{ vn.title }}</h3>
                      @if (vnService.canEdit(vn)) {
                        <div class="flex gap-1 flex-shrink-0">
                           <button [routerLink]="['/vn/edit', vn.id]" class="p-1 text-slate-500 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors" title="Editar">
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                           </button>
                        </div>
                      }
                   </div>
                   
                   <p class="text-[9px] text-pink-400 font-bold uppercase tracking-wider mb-1">Por {{ vn.author }}</p>
                   <p class="text-[10px] text-slate-400 line-clamp-2">{{ vn.description }}</p>
                </div>
             </div>
          }
        </div>
      } @else {
        <!-- EMPTY STATE -->
        <div class="flex flex-col items-center justify-center py-20 text-center animate-fade-in">
           <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
           </div>
           <h3 class="text-lg font-bold text-white mb-2">Nada aqui</h3>
           <p class="text-slate-400 text-xs max-w-xs mx-auto mb-4">
             Não encontramos novels com esse termo.
           </p>
           <button (click)="createNew()" class="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold text-xs transition-colors border border-slate-700">
              Criar Nova
           </button>
        </div>
      }

    </div>
  `
})
export class VnLibraryComponent {
  vnService = inject(VnService);
  router = inject(Router);
  permission = inject(PermissionService);

  searchQuery = signal('');

  filteredNovels = computed(() => {
    const q = this.searchQuery().toLowerCase().trim();
    const all = this.vnService.novels();

    if (!q) return all;

    return all.filter(vn => 
      vn.title.toLowerCase().includes(q) || 
      vn.author.toLowerCase().includes(q) ||
      vn.description.toLowerCase().includes(q)
    );
  });

  createNew() {
    if (this.permission.canPerform('create_character')) {
      const newVn = this.vnService.createEmptyNovel();
      this.vnService.saveNovel(newVn);
      this.router.navigate(['/vn/edit', newVn.id]);
    }
  }

  deleteVn(id: string) {
    if (confirm('Tem certeza que deseja excluir esta história?')) {
      this.vnService.deleteNovel(id);
    }
  }
}
