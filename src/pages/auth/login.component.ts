
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';
import { BackgroundComponent } from '../../components/visual/background.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, BackgroundComponent],
  template: `
    <app-background></app-background>
    
    <div class="min-h-screen flex items-center justify-center p-6 page-enter">
      <div class="w-full max-w-md bg-slate-900/80 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
        
        <div class="mb-8">
          <button routerLink="/auth" class="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-sm mb-4">
            ← Back
          </button>
          <h2 class="text-3xl font-bold text-white font-tech">Welcome Back</h2>
          <p class="text-slate-400">Enter your credentials to sync.</p>
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
            <div class="flex justify-between">
               <label class="text-xs uppercase font-bold text-slate-500 tracking-wider">Password</label>
               <span class="text-xs text-pink-500 hover:underline cursor-pointer">Forgot?</span>
            </div>
            <input type="password" [(ngModel)]="password" name="password" required
                   class="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-pink-500 transition-colors placeholder-slate-600"
                   placeholder="••••••••">
          </div>

          <button type="submit" 
                  [disabled]="!email || !password"
                  class="w-full py-3.5 rounded-xl bg-white text-slate-900 hover:bg-pink-50 disabled:opacity-50 disabled:cursor-not-allowed font-bold tracking-wide shadow-lg shadow-pink-500/10 transition-all btn-bounce mt-4">
             Log In
          </button>
        </form>

        <div class="mt-8 text-center text-sm">
           <span class="text-slate-500">Don't have an account? </span>
           <a routerLink="/signup" class="text-white font-bold hover:underline">Sign Up</a>
        </div>
      </div>
    </div>
  `
})
export class LoginComponent {
  router = inject(Router);
  auth = inject(AuthService);
  toast = inject(ToastService);

  email = '';
  password = '';

  onSubmit(e: Event) {
    e.preventDefault();

    if (this.auth.login(this.email, this.password)) {
      if (this.email === 'ezequiel@gmail.com') {
         this.toast.show("⚡ GOD MODE ACTIVATED ⚡", "success");
      } else {
         this.toast.show("Welcome back, Agent.", "success");
      }
    } else {
      this.toast.show("Invalid credentials. Try 'demo@demomax.ai' / 'password'", "error");
    }
  }
}
