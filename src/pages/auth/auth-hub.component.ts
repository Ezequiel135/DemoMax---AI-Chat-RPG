
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LogoComponent } from '../../components/ui/logo.component';
import { BackgroundComponent } from '../../components/visual/background.component';
import { TosModalComponent } from '../../components/ui/tos-modal.component';

@Component({
  selector: 'app-auth-hub',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoComponent, BackgroundComponent, TosModalComponent],
  template: `
    <app-background></app-background>
    
    <!-- Cinematic Overlay (Adaptive) -->
    <div class="fixed inset-0 bg-gradient-to-t from-slate-100/90 via-slate-100/40 to-transparent dark:from-black dark:via-black/50 dark:to-transparent pointer-events-none z-0"></div>

    <div class="min-h-screen flex flex-col items-center justify-end md:justify-center pb-12 p-6 relative z-10 page-enter">
      
      <!-- Main Card -->
      <div class="w-full max-w-md bg-white/60 dark:bg-white/5 backdrop-blur-3xl border border-white/40 dark:border-white/10 rounded-[40px] p-8 shadow-2xl dark:shadow-[0_0_50px_rgba(0,0,0,0.5)] relative overflow-hidden group hover:border-pink-200 dark:hover:border-white/20 transition-all duration-500">
        
        <!-- Glow Effect -->
        <div class="absolute -top-32 -right-32 w-64 h-64 bg-pink-500/20 dark:bg-pink-500/30 rounded-full blur-[80px] group-hover:bg-pink-500/30 dark:group-hover:bg-pink-500/40 transition-colors duration-700"></div>
        <div class="absolute -bottom-32 -left-32 w-64 h-64 bg-purple-500/20 dark:bg-purple-600/30 rounded-full blur-[80px] group-hover:bg-purple-500/30 dark:group-hover:bg-purple-600/40 transition-colors duration-700"></div>

        <div class="relative z-10 flex flex-col items-center text-center">
          
          <div class="mb-8 transform scale-125">
             <app-logo size="xl"></app-logo>
          </div>
          
          <h2 class="text-2xl font-bold text-slate-900 dark:text-white mb-2 tracking-tight">Realidade Virtual de Chat</h2>
          <p class="text-slate-600 dark:text-slate-300 text-sm mb-10 font-medium leading-relaxed max-w-xs">
            Crie, converse e viva histórias com IAs que parecem reais. O limite é a sua imaginação.
          </p>

          <div class="w-full space-y-3">
            
            <!-- Primary Actions -->
            <button routerLink="/login" class="w-full py-4 rounded-2xl bg-slate-900 text-white dark:bg-white dark:text-black font-black tracking-wide shadow-xl hover:shadow-2xl hover:scale-[1.02] transition-all flex items-center justify-center gap-2">
               <span>Entrar</span>
               <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
            </button>

            <button routerLink="/signup" class="w-full py-4 rounded-2xl bg-white/50 hover:bg-white/80 text-slate-900 border border-slate-200 dark:bg-white/10 dark:hover:bg-white/20 dark:text-white dark:border-white/10 font-bold backdrop-blur-md transition-all flex items-center justify-center">
               Criar Conta Grátis
            </button>

            <!-- Divider -->
            <div class="flex items-center gap-4 py-2 w-full">
               <div class="h-px bg-slate-300 dark:bg-white/10 flex-1"></div>
               <span class="text-[10px] text-slate-400 dark:text-white/30 uppercase tracking-widest">ou</span>
               <div class="h-px bg-slate-300 dark:bg-white/10 flex-1"></div>
            </div>

            <!-- Guest -->
            <button (click)="openGuestTerms()" class="w-full py-3 text-sm text-pink-600 hover:text-pink-700 dark:text-pink-300/80 dark:hover:text-pink-300 font-medium transition-all hover:tracking-wide">
               Apenas visitar (Convidado)
            </button>
          </div>
          
          <p class="mt-8 text-[10px] text-slate-500 max-w-xs leading-relaxed">
            Ao continuar, você confirma ter 18+ anos e concorda com nossos <span (click)="showTos.set(true)" class="underline cursor-pointer hover:text-slate-900 dark:hover:text-white">Termos de Uso</span>.
          </p>
        </div>
      </div>
    </div>

    <!-- Guest Terms Modal (Modernized) -->
    @if (showGuestTerms()) {
      <div class="fixed inset-0 z-[100] flex items-end md:items-center justify-center p-4 bg-black/50 dark:bg-black/80 backdrop-blur-md animate-fade-in">
        <div class="bg-white dark:bg-[#151515] border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-[32px] max-w-sm w-full p-8 shadow-2xl transform scale-100 animate-slide-up">
          <div class="w-12 h-12 bg-pink-100 dark:bg-pink-500/20 rounded-full flex items-center justify-center mb-4 text-pink-600 dark:text-pink-400">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
          </div>
          <h3 class="text-xl font-bold mb-2">Modo Visitante</h3>
          <p class="text-sm text-slate-600 dark:text-slate-400 mb-8 leading-relaxed">
             Você poderá explorar o app, mas seu progresso não será salvo e recursos de criação/IA avançada estarão bloqueados.
          </p>
          
          <div class="flex gap-3">
             <button (click)="showGuestTerms.set(false)" class="flex-1 py-3.5 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">Voltar</button>
             <button (click)="confirmGuest()" class="flex-1 py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold shadow-lg hover:scale-105 transition-all">Continuar</button>
          </div>
        </div>
      </div>
    }

    <!-- TOS Modal (Read Only mode) -->
    @if (showTos()) {
      <app-tos-modal (confirm)="showTos.set(false)"></app-tos-modal>
    }
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    .animate-slide-up { animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class AuthHubComponent {
  auth = inject(AuthService);
  showGuestTerms = signal(false);
  showTos = signal(false);

  openGuestTerms() {
    this.showGuestTerms.set(true);
  }

  confirmGuest() {
    this.auth.loginAsGuest();
  }
}
