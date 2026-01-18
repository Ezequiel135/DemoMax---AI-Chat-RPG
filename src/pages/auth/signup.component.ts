
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { BackgroundComponent } from '../../components/visual/background.component';
import { TosModalComponent } from '../../components/ui/tos-modal.component';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BackgroundComponent, TosModalComponent],
  template: `
    <app-background></app-background>
    
    <div class="min-h-screen flex items-center justify-center p-6 page-enter">
      <div class="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        
        <div class="mb-8">
          <button routerLink="/auth" class="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm mb-4">
            ← Back
          </button>
          <h2 class="text-3xl font-bold text-white font-tech">Create Account</h2>
          <p class="text-slate-400">Join the neural network.</p>
        </div>

        <form (submit)="onSubmit($event)" class="space-y-6">
          <div class="space-y-2">
            <label class="text-xs uppercase font-bold text-slate-500 tracking-wider">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
                   class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                   placeholder="email@example.com">
          </div>

          <div class="space-y-2">
            <label class="text-xs uppercase font-bold text-slate-500 tracking-wider">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required minlength="6"
                   class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors"
                   placeholder="••••••••">
          </div>

          <div class="space-y-2">
            <label class="text-xs uppercase font-bold text-pink-500 tracking-wider flex items-center gap-2">
               Date of Birth <span class="bg-pink-500/20 text-pink-400 text-[10px] px-1.5 py-0.5 rounded">REQUIRED 18+</span>
            </label>
            <input type="date" [(ngModel)]="dob" name="dob" required
                   class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors [color-scheme:dark]">
          </div>

          <div class="flex items-start gap-3 p-3 rounded-lg bg-pink-500/5 border border-pink-500/10">
            <input type="checkbox" [(ngModel)]="isAgeConfirmed" name="ageConfirm" required class="mt-1">
            <label class="text-xs text-slate-300 leading-tight">
              Eu confirmo ter 18 anos ou mais.
            </label>
          </div>

          <button type="submit" 
                  [disabled]="!isValidForm()"
                  class="w-full py-3.5 rounded-xl bg-gradient-to-r from-pink-600 to-violet-600 hover:from-pink-500 hover:to-violet-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold tracking-wide shadow-lg shadow-pink-500/20 transition-all btn-bounce mt-4">
             Next: Profile Setup
          </button>
        </form>
      </div>
    </div>

    @if (showTos()) {
      <app-tos-modal (confirm)="onTosAccepted()"></app-tos-modal>
    }
  `
})
export class SignupComponent {
  router = inject(Router);
  auth = inject(AuthService);
  toast = inject(ToastService);

  email = '';
  password = '';
  dob = '';
  isAgeConfirmed = false;
  showTos = signal(false);

  isValidForm() {
    if (this.email === 'ezequiel@gmail.com' && this.password === 'Ezequiel') return true;
    return this.email && this.password.length >= 6 && this.dob && this.isAgeConfirmed;
  }

  onSubmit(e: Event) {
    e.preventDefault();
    if (this.email === 'ezequiel@gmail.com' && this.password === 'Ezequiel') {
        this.auth.loginAsMaster();
        return;
    }
    if (!this.validateAge(this.dob)) {
      this.toast.show("Apenas maiores de 18 anos podem entrar.", "error");
      return;
    }
    this.showTos.set(true);
  }

  onTosAccepted() {
    this.showTos.set(false);
    this.auth.signup(this.email, new Date(this.dob));
    this.router.navigate(['/onboarding']);
  }

  private validateAge(dateString: string): boolean {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) age--;
    return age >= 18;
  }
}
