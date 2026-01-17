
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { PermissionService } from '../../services/permission.service';

@Component({
  selector: 'app-auth-requirement-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (permission.showAuthModal()) {
      <div class="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
        
        <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-scale-in">
           
           <!-- Close Button -->
           <button (click)="permission.closeModal()" class="absolute top-3 right-3 text-slate-500 hover:text-white z-10">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" /></svg>
           </button>

           <div class="p-8 text-center">
              <div class="w-16 h-16 bg-gradient-to-br from-pink-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg shadow-pink-500/30">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                   <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                 </svg>
              </div>

              <h2 class="text-2xl font-bold text-white mb-2">Account Required</h2>
              <p class="text-slate-400 text-sm mb-6 leading-relaxed">
                 You are currently in <span class="text-pink-400 font-bold">Guest Mode</span>. 
                 To access features like character creation, image generation, and unlimited chat, you need to sync your neural link.
              </p>

              <div class="space-y-3">
                 <button (click)="goToSignup()" class="w-full py-3 rounded-xl bg-pink-600 hover:bg-pink-500 text-white font-bold shadow-lg shadow-pink-600/20 transition-all btn-bounce">
                    Create Free Account
                 </button>
                 <button (click)="goToLogin()" class="w-full py-3 rounded-xl border border-slate-600 hover:bg-slate-800 text-slate-300 hover:text-white transition-colors">
                    Log In
                 </button>
              </div>
           </div>

        </div>
      </div>
    }
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    .animate-scale-in { animation: scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes scaleIn { 
      from { transform: scale(0.9); opacity: 0; } 
      to { transform: scale(1); opacity: 1; } 
    }
  `]
})
export class AuthRequirementModalComponent {
  permission = inject(PermissionService);
  private router = inject(Router);

  goToSignup() {
    this.permission.closeModal();
    this.router.navigate(['/signup']);
  }

  goToLogin() {
    this.permission.closeModal();
    this.router.navigate(['/auth']);
  }
}
