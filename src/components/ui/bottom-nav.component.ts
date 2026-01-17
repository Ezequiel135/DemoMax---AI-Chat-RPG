
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router, NavigationEnd } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs/operators';

@Component({
  selector: 'app-bottom-nav',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    @if (isVisible()) {
      <nav class="fixed bottom-0 left-0 right-0 z-[90] pb-safe">
        <!-- Modern Glass Background -->
        <div class="absolute inset-0 bg-[#0F0E17]/95 backdrop-blur-xl border-t border-white/10 shadow-[0_-10px_30px_rgba(0,0,0,0.5)]"></div>

        <div class="relative flex justify-around items-center h-16 px-1">
          
          <!-- HOME -->
          <a routerLink="/home" routerLinkActive="text-pink-500 scale-110" class="nav-item group transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span class="label">Início</span>
          </a>

          <!-- INBOX / CHAT (New Centralized Hub) -->
          <a routerLink="/inbox" routerLinkActive="text-blue-400 scale-110" class="nav-item group transition-all duration-300">
            <div class="relative">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
               </svg>
               <!-- Optional Badge placeholder -->
               <!-- <div class="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-[#0F0E17]"></div> -->
            </div>
            <span class="label">Chat</span>
          </a>

          <!-- CREATE -->
          <a routerLink="/dashboard" routerLinkActive="text-cyan-400 scale-110" class="nav-item group transition-all duration-300">
             <div class="bg-white/10 p-2 rounded-xl group-hover:bg-white/20 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
               </svg>
             </div>
             <span class="label">Criar</span>
          </a>

          <!-- RANKING -->
          <a routerLink="/leaderboard" routerLinkActive="text-yellow-400 scale-110" class="nav-item group transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 01-2-2h-2a2 2 0 01-2-2z" />
            </svg>
            <span class="label">Ranking</span>
          </a>

          <!-- PROFILE -->
          <a routerLink="/profile" routerLinkActive="text-pink-400 scale-110" class="nav-item group transition-all duration-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span class="label">Perfil</span>
          </a>

        </div>
      </nav>
    }
  `,
  styles: [`
    .nav-item {
      @apply flex flex-col items-center justify-center text-slate-500 hover:text-white cursor-pointer h-full px-3;
    }
    .label {
      @apply text-[9px] font-bold mt-1 opacity-70 tracking-wide uppercase;
    }
  `]
})
export class BottomNavComponent {
  private router = inject(Router);

  // Hide on specific pages where we want immersive view
  isVisible = toSignal(
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map((e: any) => {
        const url = e.urlAfterRedirects;
        return !url.includes('/chat/') && 
               !url.includes('/splash') && 
               !url.includes('/auth') && 
               !url.includes('/login') && 
               !url.includes('/signup') && 
               !url.includes('/onboarding') &&
               !url.includes('/vn/play') &&
               !url.includes('/vn/edit'); // Chat/VN UI is immersive
      })
    ),
    { initialValue: false }
  );
}
