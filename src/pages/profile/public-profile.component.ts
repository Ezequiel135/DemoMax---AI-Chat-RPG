
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CharacterService } from '../../services/character.service';
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
                  <!-- Online Status -->
                  <div class="absolute bottom-2 right-2 w-4 h-4 bg-emerald-500 border-2 border-white dark:border-[#0F0E17] rounded-full"></div>
               </div>

               <!-- Action Buttons -->
               @if (!isMe()) {
                  <div class="flex gap-2 mb-2 items-center">
                     
                     <!-- Friendship Badge -->
                     @if (isMutual()) {
                        <span class="text-[10px] font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-full border border-slate-300 dark:border-white/10 mr-1">
                           Amigos
                        </span>
                     } @else if (socialService.isFollower(username())) {
                        <span class="text-[10px] font-bold uppercase bg-slate-200 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-full border border-slate-300 dark:border-white/10 mr-1">
                           Segue você
                        </span>
                     }

                     <!-- Message Button (Only if Mutual) -->
                     <button (click)="sendMessage()" 
                             [disabled]="!isMutual()"
                             [class.opacity-50]="!isMutual()"
                             [class.cursor-not-allowed]="!isMutual()"
                             class="w-10 h-10 rounded-full border border-slate-300 dark:border-white/10 flex items-center justify-center text-slate-600 dark:text-white bg-white dark:bg-slate-800 shadow-sm hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                             title="Mensagem (Requer amizade mútua)">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                     </button>

                     <!-- Follow Button -->
                     <button (click)="toggleFollow()" 
                             class="px-6 h-10 rounded-full font-bold text-sm shadow-lg transition-all flex items-center gap-1"
                             [class.bg-slate-200]="isFollowing()"
                             [class.dark:bg-slate-800]="isFollowing()"
                             [class.text-slate-900]="isFollowing()"
                             [class.dark:text-white]="isFollowing()"
                             [class.bg-pink-600]="!isFollowing()"
                             [class.text-white]="!isFollowing()">
                        {{ isFollowing() ? 'Seguindo' : (socialService.isFollower(username()) ? 'Seguir de volta' : 'Seguir') }}
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
               
               <!-- Bio -->
               <p class="text-sm text-slate-700 dark:text-slate-300 leading-relaxed mb-4">
                  Criador de conteúdo digital e entusiasta de IA. Bem-vindo ao meu universo de histórias. 
                  ✨ {{ creatorChars().length }} criações publicadas.
               </p>

               <!-- Stats Row -->
               <div class="flex items-center gap-6 text-sm border-t border-slate-200 dark:border-white/10 pt-4">
                  <div class="flex flex-col">
                     <span class="font-black text-slate-900 dark:text-white text-lg">{{ creatorChars().length }}</span>
                     <span class="text-xs text-slate-500 uppercase tracking-wide">Posts</span>
                  </div>
                  <div class="w-px h-8 bg-slate-200 dark:bg-white/10"></div>
                  <div class="flex flex-col">
                     <span class="font-black text-slate-900 dark:text-white text-lg">{{ followersCount() }}</span>
                     <span class="text-xs text-slate-500 uppercase tracking-wide">Seguidores</span>
                  </div>
                  <div class="w-px h-8 bg-slate-200 dark:bg-white/10"></div>
                  <div class="flex flex-col">
                     <span class="font-black text-slate-900 dark:text-white text-lg">{{ followingCount() }}</span>
                     <span class="text-xs text-slate-500 uppercase tracking-wide">Seguindo</span>
                  </div>
               </div>

            </div>
         </div>
      </div>

      <!-- 2. CONTENT TABS (Visual) -->
      <div class="flex border-b border-slate-200 dark:border-white/10 mt-6 px-4 sticky top-[60px] bg-slate-50/95 dark:bg-[#0F0E17]/95 backdrop-blur z-20">
         <button class="flex-1 pb-3 text-slate-900 dark:text-white font-bold border-b-2 border-pink-500">Criações</button>
         <button class="flex-1 pb-3 text-slate-400 font-medium hover:text-slate-600 dark:hover:text-slate-200">Curtidas</button>
      </div>
      
      <!-- 3. CONTENT GRID -->
      <div class="mt-4 px-1 min-h-[300px]">
         @if (creatorChars().length > 0) {
            <div class="grid grid-cols-3 gap-0.5 sm:gap-2">
               @for (char of creatorChars(); track char.id) {
                  <div class="aspect-[3/4] relative group cursor-pointer overflow-hidden bg-slate-200 dark:bg-slate-800">
                     <app-character-card [character]="char"></app-character-card>
                  </div>
               }
            </div>
         } @else {
            <div class="py-20 text-center">
               <div class="text-4xl mb-2 grayscale opacity-50">👻</div>
               <p class="text-slate-500 text-sm">Nenhuma criação pública.</p>
            </div>
         }
      </div>

    </div>
  `
})
export class PublicProfileComponent {
  route = inject(ActivatedRoute);
  charService = inject(CharacterService);
  socialService = inject(SocialService);
  auth = inject(AuthService);
  dmService = inject(DirectMessageService);
  toast = inject(ToastService);
  assets = inject(SystemAssetsService);

  username = signal('');
  
  constructor() {
    this.route.paramMap.subscribe(params => { 
       const u = params.get('username'); 
       if (u) this.username.set(u); 
    });
  }

  isMe = computed(() => this.auth.currentUser()?.username === this.username());
  isFollowing = computed(() => this.socialService.isFollowingUser(this.username()));
  isMutual = computed(() => this.socialService.isMutual(this.username()));
  
  followersCount = computed(() => {
     let base = this.username().length * 123; 
     if (this.isFollowing()) base += 1;
     return base;
  });

  followingCount = computed(() => {
     return this.username().length * 15;
  });

  creatorChars = computed(() => {
    const target = '@' + this.username();
    return this.charService.allCharacters().filter(c => c.creator.toLowerCase() === target.toLowerCase());
  });

  displayUsername() {
     return this.username().charAt(0).toUpperCase() + this.username().slice(1);
  }

  isVerified() {
     return this.followersCount() > 500; 
  }

  toggleFollow() { 
     this.socialService.toggleFollowUser(this.username()); 
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
