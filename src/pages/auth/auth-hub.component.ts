
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { LogoComponent } from '../../components/ui/logo.component';
import { BackgroundComponent } from '../../components/visual/background.component';

@Component({
  selector: 'app-auth-hub',
  standalone: true,
  imports: [CommonModule, RouterLink, LogoComponent, BackgroundComponent],
  template: `
    <app-background></app-background>
    
    <div class="min-h-screen flex items-center justify-center p-6 relative z-10 page-enter">
      <div class="w-full max-w-md bg-white/10 backdrop-blur-xl border border-white/20 rounded-[32px] p-8 shadow-2xl relative overflow-hidden">
        
        <!-- Decoration -->
        <div class="absolute -top-20 -right-20 w-60 h-60 bg-pink-500/20 rounded-full blur-[60px]"></div>

        <div class="relative z-10 flex flex-col items-center text-center">
          <app-logo size="xl" class="mb-3"></app-logo>
          <p class="text-slate-200 text-sm mb-10 font-medium">Where stories come alive.</p>

          <div class="w-full space-y-4">
            
            <!-- Log In (Existing) -->
            <button routerLink="/login" class="w-full py-4 rounded-2xl bg-white text-slate-900 font-bold tracking-wide shadow-lg hover:bg-pink-50 transition-all transform hover:scale-[1.02]">
               Log In
            </button>

            <!-- Sign Up (New) -->
            <button routerLink="/signup" class="w-full py-4 rounded-2xl bg-slate-800/80 hover:bg-slate-700 text-white font-bold border border-white/10 transition-all">
               Create Account
            </button>

            <!-- Guest -->
            <button (click)="openGuestTerms()" class="w-full py-3 text-sm text-white/60 hover:text-white font-medium transition-all">
               Continue as Guest
            </button>
          </div>
          
          <p class="mt-8 text-[11px] text-slate-300/60 max-w-xs leading-relaxed">
            By entering, you confirm you are 18+ and agree to our <span class="underline cursor-pointer hover:text-white">Community Guidelines</span>.
          </p>
        </div>
      </div>
    </div>

    <!-- Guest Terms Modal -->
    @if (showGuestTerms()) {
      <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-md animate-fade-in">
        <div class="bg-white text-slate-900 rounded-[24px] max-w-sm w-full p-6 shadow-2xl transform scale-100">
          <h3 class="text-xl font-bold mb-2">Guest Pass</h3>
          <p class="text-sm text-slate-500 mb-6">As a guest, your progress won't be saved and some features are limited.</p>
          
          <div class="flex gap-3">
             <button (click)="showGuestTerms.set(false)" class="flex-1 py-3 rounded-xl bg-slate-100 text-slate-600 font-bold hover:bg-slate-200 transition-colors">Cancel</button>
             <button (click)="confirmGuest()" class="flex-1 py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold shadow-lg shadow-pink-200 transition-colors">Enter</button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.2s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class AuthHubComponent {
  auth = inject(AuthService);
  showGuestTerms = signal(false);

  openGuestTerms() {
    this.showGuestTerms.set(true);
  }

  confirmGuest() {
    this.auth.loginAsGuest();
  }
}
