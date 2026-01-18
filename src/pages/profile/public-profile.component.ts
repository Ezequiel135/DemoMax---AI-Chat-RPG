
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { VnService } from '../../services/vn.service'; // Added
import { WebNovelService } from '../../services/web-novel.service'; // Added
import { SocialService } from '../../services/social.service';
import { AuthService } from '../../services/auth.service';
import { DirectMessageService } from '../../services/direct-message.service';
import { SystemAssetsService } from '../../services/core/system-assets.service';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { HeaderComponent } from '../../components/header/header.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-public-profile',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent, CharacterCardComponent],
  template: `
    <app-header></app-header>
    
    <div class="min-h-screen pb-20 max-w-2xl mx-auto px-0 md:px-4 page-enter pt-0 md:pt-4 transition-colors duration-500 bg-slate-50 dark:bg-[#0F0E17]">
      
      <!-- CHECK BLOCK STATUS -->
      @if (isBlocked()) {
         <div class="min-h-[50vh] flex flex-col items-center justify-center p-8 text-center animate-fade-in">
            <div class="w-20 h-20 bg-slate-800 rounded-full flex items-center justify-center text-slate-500 mb-4 text-3xl">
               🚫
            </div>
            <h2 class="text-xl font-bold text-slate-900 dark:text-white mb-2">Usuário Indisponível</h2>
            <p class="text-slate-500 mb-6 text-sm">
               Você bloqueou este usuário. Desbloqueie para ver o perfil.
            </p>
            <button (click)="toggleBlock()" class="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-full font-bold text-sm">
               Desbloquear
            </button>
         </div>
      } @else {

         <!-- 1. BANNER & HEADER -->
         <div class="relative mb-3">
            <!-- Capa -->
            <div class="h-40 md:h-52 md:rounded-b-[2rem] overflow-hidden relative bg-slate-200 dark:bg-slate-800">
               <img [src]="assets.getIcon()" class="w-full h-full object-cover opacity-90">
               <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
               
               <!-- Botão Voltar (Mobile) -->
               <button routerLink="/home" class="absolute top-4 left-4 w-8 h-8 bg-black/40 backdrop-blur rounded-full flex items-center justify-center text-white md:hidden z-20">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
               </button>
            </div>

            <!-- Info Container (Avatar + Stats) -->
            <div class="px-4 flex flex-col items-start relative z-10 -mt-10">
               
               <div class="flex justify-between items-end w-full">
                  <!-- Avatar -->
                  <div class="relative shrink-0">
                     <div class="w-24 h-24 rounded-full p-1 bg-white dark:bg-[#0F0E17] shadow-lg">
                        <div class="w-full h-full rounded-full overflow-hidden bg-slate-300">
                           <img [src]="assets.getIcon()" class="w-full h-full object-cover">
                        </div>
                     </div>
                  </div>

                  <!-- Action Buttons -->
                  @if (!isMe()) {
                     <div class="flex gap-2 mb-2 items-center">
                        @if (isMutual()) {
                           <span class="text-[10px] font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-full border border-slate-300 dark:border-white/10 mr-1">
                              Amigos
                           </span>
                        }
                        
                        <!-- Block Button -->
                        <button (click)="toggleBlock()" class="w-10 h-10 rounded-full border border-red-500/30 flex items-center justify-center text-red-500 bg-white dark:bg-slate-800 shadow-sm hover:bg-red-500/10 transition-colors" title="Bloquear">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                        </button>

                        <button (click)="sendMessage()" [disabled]="!isMutual()" class="w-10 h-10 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                        </button>
                        
                        <button (click)="toggleFollow()" 
                                [disabled]="isMaster() && isFollowing()"
                                class="px-6 h-10 rounded-full font-bold text-sm shadow-lg transition-all flex items-center gap-1 disabled:opacity-80 disabled:cursor-not-allowed"
                                [class.bg-slate-200]="isFollowing()" [class.text-slate-900]="isFollowing()" [class.bg-pink-600]="!isFollowing()" [class.text-white]="!isFollowing()">
                           {{ isFollowing() ? 'Seguindo' : 'Seguir' }}
                        </button>
                     </div>
                  }
               </div>

               <!-- Text Info -->
               <div class="mt-3 w-full">
                  <h1 class="text-2xl font-black text-slate-900 dark:text-white leading-tight">
                     {{ displayUsername() }}
                     <span class="text-pink-500 text-lg align-middle" *ngIf="isVerified()">Verified</span>
                  </h1>
                  <p class="text-sm text-slate-500 dark:text-slate-400 font-medium mb-4">@{{ username() }}</p>
                  <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                     Criador de conteúdo digital e entusiasta de IA.
                  </p>

                  <!-- Stats Row -->
                  <div class="flex items-center gap-6 text-sm border-t border-slate-200 dark:border-white/10 pt-4">
                     <div class="flex flex-col">
                        <span class="font-black text-slate-900 dark:text-white text-lg">{{ creatorChars().length }}</span>
                        <span class="text-xs text-slate-500 uppercase tracking-wide">Chars</span>
                     </div>
                     <div class="w-px h-8 bg-slate-200 dark:bg-white/10"></div>
                     <div class="flex flex-col">
                        <span class="font-black text-slate-900 dark:text-white text-lg">{{ creatorVns().length }}</span>
                        <span class="text-xs text-slate-500 uppercase tracking-wide">Novels</span>
                     </div>
                     <div class="w-px h-8 bg-slate-200 dark:bg-white/10"></div>
                     <div class="flex flex-col">
                        <span class="font-black text-slate-900 dark:text-white text-lg">{{ creatorWebNovels().length }}</span>
                        <span class="text-xs text-slate-500 uppercase tracking-wide">Books</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>

         <!-- 2. CONTENT TABS -->
         <div class="flex gap-2 overflow-x-auto border-b border-slate-200 dark:border-white/10 mt-6 px-4 sticky top-[60px] bg-slate-50/95 dark:bg-[#0F0E17]/95 backdrop-blur z-20 pb-2">
            <button (click)="contentTab.set('chars')" class="px-4 py-2 rounded-full text-xs font-bold uppercase transition-colors"
                    [class.bg-slate-900]="contentTab() === 'chars'" [class.text-white]="contentTab() === 'chars'"
                    [class.bg-transparent]="contentTab() !== 'chars'" [class.text-slate-500]="contentTab() !== 'chars'">Personagens</button>
            <button (click)="contentTab.set('novels')" class="px-4 py-2 rounded-full text-xs font-bold uppercase transition-colors"
                    [class.bg-cyan-600]="contentTab() === 'novels'" [class.text-white]="contentTab() === 'novels'"
                    [class.bg-transparent]="contentTab() !== 'novels'" [class.text-slate-500]="contentTab() !== 'novels'">Visual Novels</button>
            <button (click)="contentTab.set('books')" class="px-4 py-2 rounded-full text-xs font-bold uppercase transition-colors"
                    [class.bg-emerald-600]="contentTab() === 'books'" [class.text-white]="contentTab() === 'books'"
                    [class.bg-transparent]="contentTab() !== 'books'" [class.text-slate-500]="contentTab() !== 'books'">Web Novels</button>
         </div>
         
         <!-- 3. CONTENT GRID -->
         <div class="mt-4 px-2 min-h-[300px]">
            
            <!-- CHARACTERS -->
            @if (contentTab() === 'chars') {
               @if (creatorChars().length > 0) {
                  <div class="grid grid-cols-2 sm:grid-cols-3 gap-3">
                     @for (char of creatorChars(); track char.id) {
                        <div class="aspect-[3/4]">
                           <app-character-card [character]="char"></app-character-card>
                        </div>
                     }
                  </div>
               } @else {
                  <div class="py-20 text-center text-slate-500">Nenhum personagem.</div>
               }
            }

            <!-- VISUAL NOVELS -->
            @if (contentTab() === 'novels') {
               @if (creatorVns().length > 0) {
                  <div class="grid grid-cols-2 gap-4">
                     @for (vn of creatorVns(); track vn.id) {
                        <a [routerLink]="['/vn/play', vn.id]" class="relative group bg-slate-900 rounded-xl overflow-hidden shadow-lg aspect-[3/4]">
                           <img [src]="vn.coverUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                           <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                              <h3 class="text-white font-bold text-sm leading-tight">{{ vn.title }}</h3>
                              <p class="text-xs text-slate-400 mt-1">{{ vn.playCount }} plays</p>
                           </div>
                        </a>
                     }
                  </div>
               } @else {
                  <div class="py-20 text-center text-slate-500">Nenhuma Visual Novel.</div>
               }
            }

            <!-- WEB NOVELS -->
            @if (contentTab() === 'books') {
               @if (creatorWebNovels().length > 0) {
                  <div class="grid grid-cols-2 gap-4">
                     @for (wn of creatorWebNovels(); track wn.id) {
                        <a [routerLink]="['/novel/read', wn.id]" class="relative group bg-slate-900 rounded-xl overflow-hidden shadow-lg aspect-[2/3]">
                           <img [src]="wn.coverUrl" class="w-full h-full object-cover group-hover:scale-105 transition-transform">
                           <div class="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-3">
                              <h3 class="text-white font-bold text-sm leading-tight">{{ wn.title }}</h3>
                              <p class="text-xs text-slate-400 mt-1">{{ wn.readCount }} leituras</p>
                           </div>
                        </a>
                     }
                  </div>
               } @else {
                  <div class="py-20 text-center text-slate-500">Nenhum livro publicado.</div>
               }
            }

         </div>
      } <!-- End Block Check -->

    </div>
  `
})
export class PublicProfileComponent {
  route = inject(ActivatedRoute);
  charService = inject(CharacterService);
  vnService = inject(VnService); 
  wnService = inject(WebNovelService); 
  socialService = inject(SocialService);
  auth = inject(AuthService);
  dmService = inject(DirectMessageService);
  toast = inject(ToastService);
  assets = inject(SystemAssetsService);

  username = signal('');
  contentTab = signal<'chars' | 'novels' | 'books'>('chars');
  
  constructor() {
    this.route.paramMap.subscribe(params => { 
       const u = params.get('username'); 
       if (u) this.username.set(u); 
    });
  }

  isMe = computed(() => this.auth.currentUser()?.username === this.username());
  isFollowing = computed(() => this.socialService.isFollowingUser(this.username()));
  isBlocked = computed(() => this.socialService.isBlocked(this.username())); // Se EU bloqueei ELE
  isMutual = computed(() => this.socialService.isMutual(this.username()));
  isMaster = computed(() => this.username() === 'わっせ');
  
  creatorChars = computed(() => {
    const target = '@' + this.username();
    return this.charService.allCharacters().filter(c => c.creator.toLowerCase() === target.toLowerCase());
  });

  // Filter VNs by Author Name (Case Insensitive normalization)
  creatorVns = computed(() => {
    const target = this.username().toLowerCase();
    return this.vnService.novels().filter(n => 
       n.author.toLowerCase() === target || n.author.toLowerCase() === '@' + target
    );
  });

  // Filter WNs by Author Name
  creatorWebNovels = computed(() => {
    const target = this.username().toLowerCase();
    return this.wnService.novels().filter(n => 
       n.author.toLowerCase() === target || n.author.toLowerCase() === '@' + target
    );
  });

  displayUsername() {
     return this.username().charAt(0).toUpperCase() + this.username().slice(1);
  }

  isVerified() {
     return (this.creatorChars().length + this.creatorVns().length + this.creatorWebNovels().length) > 10; 
  }

  toggleFollow() { 
     this.socialService.toggleFollowUser(this.username()); 
  }

  toggleBlock() {
     this.socialService.toggleBlockUser(this.username());
  }
  
  sendMessage() {
     if (!this.isMutual()) {
       this.toast.show("Você precisa seguir e ser seguido para enviar mensagens.", "error");
       return;
     }
     const targetId = 'u_' + this.username();
     this.dmService.startChat(targetId, this.displayUsername(), this.assets.getIcon());
  }
}
