
import { Component, input, output, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Character } from '../../models/character.model';
import { SocialService } from '../../services/social.service';
import { PermissionService } from '../../services/permission.service'; // Added
import { PixDonateModalComponent } from '../ui/pix-donate-modal.component';

@Component({
  selector: 'app-character-profile-modal',
  standalone: true,
  imports: [CommonModule, PixDonateModalComponent],
  template: `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center pointer-events-none">
      <!-- Backdrop -->
      <div class="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fade-in pointer-events-auto" (click)="close.emit()"></div>

      <!-- Modal Card -->
      <div class="relative w-full max-w-md bg-[#121212] border border-white/10 sm:rounded-[2.5rem] rounded-t-[2.5rem] overflow-hidden shadow-2xl flex flex-col max-h-[90vh] pointer-events-auto animate-slide-up" (click)="$event.stopPropagation()">
        
        <!-- COVER IMAGE -->
        <div class="h-40 relative">
           <img [src]="character().coverUrl" class="w-full h-full object-cover opacity-60">
           <div class="absolute inset-0 bg-gradient-to-b from-transparent to-[#121212]"></div>
           
           <!-- Close Btn -->
           <button (click)="close.emit()" class="absolute top-4 right-4 w-8 h-8 bg-black/50 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/20 transition-colors z-20">
              ✕
           </button>
        </div>

        <!-- AVATAR & HEADER -->
        <div class="px-6 -mt-12 relative z-10 flex justify-between items-end">
           <div class="relative">
              <div class="w-24 h-24 rounded-full p-1 bg-[#121212]">
                 <img [src]="character().avatarUrl" class="w-full h-full rounded-full object-cover border-2 border-pink-500/50">
              </div>
              <div class="absolute bottom-1 right-1 w-4 h-4 bg-emerald-500 border-2 border-[#121212] rounded-full"></div>
           </div>

           <!-- Actions -->
           <div class="flex gap-2 mb-2">
              <!-- FOLLOW / FAVORITE BUTTON -->
              <button (click)="toggleFollow()" 
                      class="w-10 h-10 rounded-full border flex items-center justify-center transition-all shadow-lg"
                      [class.bg-pink-600]="isFollowing()"
                      [class.border-pink-500]="isFollowing()"
                      [class.text-white]="isFollowing()"
                      [class.bg-white_5]="!isFollowing()"
                      [class.border-white_10]="!isFollowing()"
                      [class.text-slate-300]="!isFollowing()"
                      [class.hover:bg-white_10]="!isFollowing()">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" [class.fill-current]="isFollowing()" [class.fill-none]="!isFollowing()" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                 </svg>
              </button>

              <!-- Share -->
              <button class="w-10 h-10 rounded-full border border-white/10 bg-white/5 flex items-center justify-center text-white hover:bg-white/10 transition-colors">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
              </button>

              <!-- Pix -->
              @if (character().pixKey) {
                <button (click)="openPix()" class="px-4 h-10 rounded-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 shadow-lg shadow-emerald-500/20 transition-all">
                   <span>💰</span> Apoiar
                </button>
              }
           </div>
        </div>

        <!-- INFO CONTENT -->
        <div class="p-6 overflow-y-auto custom-scroll space-y-6">
           
           <!-- Names -->
           <div>
              <h2 class="text-2xl font-black text-white leading-tight">{{ character().name }}</h2>
              <p class="text-pink-400 font-bold text-sm uppercase tracking-wider mb-2">{{ character().tagline }}</p>
              
              <!-- Creator Link -->
              <div (click)="goToCreator()" class="inline-flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-full cursor-pointer hover:bg-white/10 transition-colors border border-white/5">
                 <div class="w-4 h-4 rounded-full bg-gradient-to-tr from-pink-500 to-purple-500 flex items-center justify-center text-[8px] text-white">@</div>
                 <span class="text-xs text-slate-300 font-medium">Criado por <span class="text-white">{{ character().creator }}</span></span>
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
              </div>
           </div>

           <!-- Stats -->
           <div class="grid grid-cols-3 gap-2 py-4 border-y border-white/5">
              <div class="text-center">
                 <div class="text-white font-bold">{{ character().messageCount }}</div>
                 <div class="text-[10px] text-slate-500 uppercase">Mensagens</div>
              </div>
              <div class="text-center border-l border-white/5">
                 <div class="text-white font-bold">{{ character().favoriteCount }}</div>
                 <div class="text-[10px] text-slate-500 uppercase">Seguidores</div>
              </div>
              <div class="text-center border-l border-white/5">
                 <div class="text-white font-bold">{{ character().affinity }}</div>
                 <div class="text-[10px] text-slate-500 uppercase">Afinidade</div>
              </div>
           </div>

           <!-- Description -->
           <div>
              <h3 class="text-white font-bold text-sm mb-2">Sobre</h3>
              <p class="text-slate-400 text-sm leading-relaxed whitespace-pre-wrap">{{ character().description }}</p>
           </div>

           <!-- Tags -->
           <div>
              <h3 class="text-white font-bold text-sm mb-2">Tags</h3>
              <div class="flex flex-wrap gap-2">
                 @for (tag of character().tags; track tag) {
                    <span class="px-3 py-1 bg-slate-800 border border-slate-700 rounded-lg text-xs text-slate-300">#{{ tag }}</span>
                 }
              </div>
           </div>

           <!-- Start Chat (if accessed from outside chat, mostly just closes modal here) -->
           <button (click)="close.emit()" class="w-full py-4 bg-pink-600 hover:bg-pink-500 rounded-2xl text-white font-bold shadow-lg shadow-pink-600/20 transition-all active:scale-95">
              Continuar Conversa
           </button>

        </div>
      </div>

      <!-- PIX MODAL (Nested) -->
      @if (showPix()) {
         <app-pix-donate-modal [pixKey]="character().pixKey!" (close)="showPix.set(false)"></app-pix-donate-modal>
      }
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  `]
})
export class CharacterProfileModalComponent {
  character = input.required<Character>();
  close = output();
  
  router = inject(Router);
  socialService = inject(SocialService);
  permission = inject(PermissionService); // Injected
  
  showPix = signal(false);

  isFollowing = computed(() => {
    return this.socialService.isFollowingChar(this.character().id);
  });

  toggleFollow() {
    if (this.permission.canPerform('social_action')) {
      this.socialService.toggleFollowChar(this.character().id, this.character().name);
    }
  }

  openPix() {
    if (this.permission.canPerform('donate_pix')) {
      this.showPix.set(true);
    }
  }

  goToCreator() {
    // Navigate to public profile
    // Assuming creator string is "@username", we strip the @
    const username = this.character().creator.replace('@', '');
    this.router.navigate(['/u', username]);
    this.close.emit();
  }
}
