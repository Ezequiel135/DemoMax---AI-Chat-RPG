
import { Routes, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from './services/auth.service';
import { nonGuestGuard } from './guards/non-guest.guard';
import { masterGuard } from './guards/master.guard';

const authGuard = () => {
  const auth = inject(AuthService);
  const router = inject(Router);
  return auth.isAuthenticated() ? true : router.parseUrl('/splash');
};

export const routes: Routes = [
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.component').then(m => m.SplashComponent)
  },
  {
    path: 'auth',
    loadComponent: () => import('./pages/auth/auth-hub.component').then(m => m.AuthHubComponent)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/auth/signup.component').then(m => m.SignupComponent)
  },
  {
    path: 'onboarding',
    loadComponent: () => import('./pages/onboarding/onboarding.component').then(m => m.OnboardingComponent)
  },
  {
    path: 'home',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent)
  },
  // --- ACTIVITY HUB (New: Centralized Chat/Stories) ---
  {
    path: 'inbox',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/activity/activity-hub.component').then(m => m.ActivityHubComponent)
  },
  // --- DIRECT MESSAGES (Specific Thread or Old Inbox) ---
  {
    path: 'direct',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/messages/dm-inbox.component').then(m => m.DmInboxComponent)
  },
  {
    path: 'direct/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/messages/dm-thread.component').then(m => m.DmThreadComponent)
  },
  // --- ADMIN PANEL ---
  {
    path: 'admin',
    canActivate: [authGuard, masterGuard],
    loadComponent: () => import('./pages/admin/admin-panel.component').then(m => m.AdminPanelComponent)
  },
  // --- PUBLIC PROFILE ---
  {
    path: 'u/:username',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/public-profile.component').then(m => m.PublicProfileComponent)
  },
  // --- CREATE ROUTES ---
  {
    path: 'create',
    canActivate: [authGuard, nonGuestGuard],
    loadComponent: () => import('./pages/create/create-hub.component').then(m => m.CreateHubComponent)
  },
  {
    path: 'create/character',
    canActivate: [authGuard, nonGuestGuard],
    loadComponent: () => import('./pages/create/character-creator.component').then(m => m.CharacterCreatorComponent)
  },
  // --- VISUAL NOVEL ROUTES ---
  {
    path: 'vn',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/vn/vn-library.component').then(m => m.VnLibraryComponent)
  },
  {
    path: 'vn/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/vn/vn-creator.component').then(m => m.VnCreatorComponent)
  },
  {
    path: 'vn/play/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/vn/vn-player.component').then(m => m.VnPlayerComponent)
  },
  // --- WEB NOVEL ROUTES ---
  {
    path: 'novel/edit/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/web-novel/web-novel-editor.component').then(m => m.WebNovelEditorComponent)
  },
  {
    path: 'novel/read/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/web-novel/web-novel-reader.component').then(m => m.WebNovelReaderComponent)
  },
  // ---------------------------
  {
    path: 'search',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/search/search.component').then(m => m.SearchComponent)
  },
  {
    path: 'dashboard',
    canActivate: [authGuard, nonGuestGuard],
    loadComponent: () => import('./pages/creator-dashboard/creator-dashboard.component').then(m => m.CreatorDashboardComponent)
  },
  {
    path: 'leaderboard',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/leaderboard/leaderboard.component').then(m => m.LeaderboardComponent)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/profile/profile.component').then(m => m.ProfileComponent)
  },
  {
    path: 'chat/:id',
    canActivate: [authGuard],
    loadComponent: () => import('./pages/chat/chat.component').then(m => m.ChatComponent)
  },
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: '**',
    redirectTo: 'splash'
  }
];
