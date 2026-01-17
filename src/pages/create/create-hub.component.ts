
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { VnService } from '../../services/vn.service';
import { BackgroundComponent } from '../../components/visual/background.component';

@Component({
  selector: 'app-create-hub',
  standalone: true,
  imports: [CommonModule, HeaderComponent, RouterLink, BackgroundComponent],
  template: `
    <app-header></app-header>
    <app-background></app-background>

    <div class="min-h-screen pt-24 pb-24 px-4 max-w-5xl mx-auto page-enter flex flex-col items-center">
      
      <div class="text-center mb-12">
        <h1 class="text-4xl md:text-5xl font-black text-white mb-4 drop-shadow-lg font-tech uppercase tracking-wider">
          Creation Studio
        </h1>
        <p class="text-slate-400 text-lg max-w-xl mx-auto">
          O que você quer criar hoje? Escolha seu caminho.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-4xl">
        
        <!-- CREATE CHARACTER CARD -->
        <a routerLink="/create/character" class="group relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden hover:bg-slate-800/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(236,72,153,0.3)] cursor-pointer flex flex-col items-center text-center">
           <div class="absolute inset-0 bg-gradient-to-br from-pink-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
           
           <div class="w-24 h-24 bg-gradient-to-br from-pink-500 to-rose-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500 relative z-10">
              👤
           </div>

           <h2 class="text-2xl font-bold text-white mb-2 relative z-10 font-tech uppercase tracking-wide">Novo Personagem</h2>
           <p class="text-slate-400 text-sm leading-relaxed relative z-10">
              Crie uma persona de IA com personalidade única, avatar e história para conversar.
           </p>

           <div class="mt-8 px-6 py-2 rounded-full border border-pink-500/50 text-pink-300 text-xs font-bold uppercase tracking-widest group-hover:bg-pink-600 group-hover:text-white group-hover:border-transparent transition-all relative z-10">
              Iniciar
           </div>
        </a>

        <!-- CREATE NOVEL CARD -->
        <button (click)="createNovel()" class="group relative bg-slate-900/60 backdrop-blur-xl border border-white/10 rounded-[3rem] p-8 md:p-12 overflow-hidden hover:bg-slate-800/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_20px_50px_rgba(14,165,233,0.3)] cursor-pointer flex flex-col items-center text-center text-left w-full">
           <div class="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
           
           <div class="w-24 h-24 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full flex items-center justify-center text-4xl mb-6 shadow-lg group-hover:scale-110 transition-transform duration-500 relative z-10">
              📖
           </div>

           <h2 class="text-2xl font-bold text-white mb-2 relative z-10 font-tech uppercase tracking-wide">Nova Visual Novel</h2>
           <p class="text-slate-400 text-sm leading-relaxed relative z-10">
              Escreva histórias interativas com cenas, escolhas e múltiplos finais.
           </p>

           <div class="mt-8 px-6 py-2 rounded-full border border-cyan-500/50 text-cyan-300 text-xs font-bold uppercase tracking-widest group-hover:bg-cyan-600 group-hover:text-white group-hover:border-transparent transition-all relative z-10">
              Escrever
           </div>
        </button>

      </div>

    </div>
  `
})
export class CreateHubComponent {
  private vnService = inject(VnService);
  private router = inject(Router);

  createNovel() {
    const newVn = this.vnService.createEmptyNovel();
    this.vnService.saveNovel(newVn);
    this.router.navigate(['/vn/edit', newVn.id]);
  }
}
