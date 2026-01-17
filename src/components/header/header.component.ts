
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { EconomyService } from '../../services/economy.service';
import { AuthService } from '../../services/auth.service';
import { PermissionService } from '../../services/permission.service';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../ui/logo.component';
import { BrandIconComponent } from '../ui/brand-icon.component';
import { ThemeToggleComponent } from '../ui/theme-toggle.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule, LogoComponent, BrandIconComponent, ThemeToggleComponent],
  template: `
    <header class="fixed top-0 left-0 right-0 z-40 glass-panel border-b-0 h-16 flex items-center justify-between px-4 lg:px-8 transition-colors duration-500">
      <div class="flex items-center gap-3 group cursor-pointer" routerLink="/">
        <!-- Brand Icon -->
        <app-brand-icon size="md" class="transform group-hover:scale-105 transition-transform duration-300"></app-brand-icon>
        
        <!-- Logo -->
        <app-logo size="md"></app-logo>
      </div>

      <div class="flex items-center gap-3 md:gap-4">
        
        <!-- DESKTOP NAVIGATION (Hidden on Mobile) -->
        <div class="hidden md:flex items-center gap-2 mr-2">
          <!-- CREATE BUTTON -->
          <button (click)="navigateToCreate()" class="flex items-center gap-2 px-4 py-2 rounded-full bg-pink-600 hover:bg-pink-500 text-white font-bold text-sm shadow-lg shadow-pink-500/20 transition-all btn-bounce">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clip-rule="evenodd" />
             </svg>
             <span>Create</span>
          </button>

          <!-- Search Button -->
          <button routerLink="/search" routerLinkActive="text-pink-500 bg-pink-50" class="p-2 rounded-full border border-slate-200 dark:border-slate-200/20 text-slate-500 dark:text-slate-400 hover:text-pink-500 hover:bg-pink-50/10 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" />
             </svg>
          </button>

          <!-- DM Button (Replaced Dashboard or Added) -->
          <button routerLink="/direct" routerLinkActive="text-blue-500 bg-blue-500/10" class="p-2 rounded-full border border-slate-200 dark:border-slate-200/20 text-slate-500 dark:text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition-colors" title="Messages">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
             </svg>
          </button>

          <!-- Dashboard Button -->
          <button routerLink="/dashboard" routerLinkActive="text-indigo-400 bg-indigo-500/10" class="p-2 rounded-full border border-slate-200 dark:border-slate-200/20 text-slate-500 dark:text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-colors" title="My Studio">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
             </svg>
          </button>

          <!-- Leaderboard Button -->
          <button routerLink="/leaderboard" routerLinkActive="text-yellow-400 bg-yellow-500/10" class="p-2 rounded-full border border-slate-200 dark:border-slate-200/20 text-slate-500 dark:text-slate-400 hover:text-yellow-400 hover:bg-yellow-500/10 transition-colors">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
               <path fill-rule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.333c-.275.114-.576.183-.893.183h-2.88a2.322 2.322 0 01-.894-.183A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.333 1 1 0 01-.285-1.05l1.738-5.42-1.233-.616a1 1 0 01.894-1.79l1.599.8L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clip-rule="evenodd" />
             </svg>
          </button>
        </div>

        <!-- ALWAYS VISIBLE ITEMS -->
        
        <!-- Coins Badge -->
        <div class="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 shadow-inner" title="Sakura Coins">
          <div class="w-1.5 h-1.5 rounded-full bg-pink-500 animate-pulse"></div>
          <span class="text-sm text-slate-700 dark:text-pink-200 font-bold">{{ economy.sakuraCoins() }}</span>
        </div>

        <!-- Profile Link (Avatar) -->
        <a routerLink="/profile" class="relative block w-9 h-9 rounded-full overflow-hidden border-2 border-transparent hover:border-pink-500 transition-colors">
           <img [src]="auth.currentUser()?.avatarUrl || 'https://i.ibb.co/hxSz0SJr/Background-Eraser-20251224-125356967.png'" class="w-full h-full object-cover">
        </a>
      </div>
    </header>
    <div class="h-16"></div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HeaderComponent {
  economy = inject(EconomyService);
  auth = inject(AuthService);
  permission = inject(PermissionService);
  router = inject(Router);

  get isCreateActive(): boolean {
    return this.router.url === '/create';
  }

  navigateToCreate() {
    if (this.permission.canPerform('create_character')) {
      this.router.navigate(['/create']);
    }
  }
}
