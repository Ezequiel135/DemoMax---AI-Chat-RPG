
import { Injectable, signal, inject, computed } from '@angular/core';
import { Router } from '@angular/router';
import { StorageService } from './storage.service';
import { EconomyService } from './economy.service';
import { SystemAssetsService } from './core/system-assets.service'; 
import { SocialService } from './social.service'; // Added
import { isMasterIdentity } from '../logic/core/master-user.logic';
import { isAccountMature } from '../logic/core/time-gate.logic';

export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string;
  bannerUrl?: string;
  bio: string;
  isGuest: boolean;
  isAdultVerified: boolean;
  showNSFW: boolean;
  createdAt: number; 
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private storage = inject(StorageService);
  private router = inject(Router);
  private economy = inject(EconomyService);
  private assets = inject(SystemAssetsService);
  private social = inject(SocialService); // Injected
  
  private _currentUser = signal<UserProfile | null>(null);
  
  readonly currentUser = this._currentUser.asReadonly();
  readonly isAuthenticated = computed(() => !!this._currentUser());
  readonly isGuest = computed(() => this._currentUser()?.isGuest ?? false);

  readonly isMaster = computed(() => isMasterIdentity(this._currentUser()));

  readonly canViewSensitiveKeys = computed(() => {
    const user = this._currentUser();
    if (!user) return false;
    if (isMasterIdentity(user)) return true;
    return isAccountMature(user.createdAt, 30);
  });

  constructor() {
    const savedUser = this.storage.getItem<UserProfile>('demomax_user_v1');
    if (savedUser) {
      if (!savedUser.createdAt) savedUser.createdAt = Date.now();
      if (savedUser.showNSFW === undefined) savedUser.showNSFW = true;
      this._currentUser.set(savedUser);
      
      // Garante conexão com o Mestre mesmo para usuários retornando
      if (!isMasterIdentity(savedUser)) {
         this.social.initializeMasterConnection();
      }
    }
  }

  login(email: string, pass: string): boolean {
    if (email.toLowerCase() === 'ezequiel@gmail.com' && pass === 'Ezequiel') {
      this.loginAsMaster();
      return true;
    }

    if (email === 'demo@demomax.ai' && pass === 'password') {
       const demoUser: UserProfile = {
        id: 'user_demo_real',
        username: 'Usuario',
        avatarUrl: this.assets.getIcon(),
        bannerUrl: this.assets.getIcon(),
        bio: 'Olá, estou usando o DemoMax.', 
        isGuest: false,
        isAdultVerified: true,
        showNSFW: true,
        createdAt: Date.now() 
      };
      this.setUser(demoUser);
      this.economy.initNewAccount();
      this.social.initializeMasterConnection(); // Auto Follow
      this.router.navigate(['/home']);
      return true;
    }

    return false;
  }

  loginAsGuest() {
    const guestUser: UserProfile = {
      id: 'guest_' + Date.now(),
      username: 'Visitante',
      avatarUrl: this.assets.getIcon(),
      bannerUrl: this.assets.getIcon(),
      bio: '',
      isGuest: true,
      isAdultVerified: true,
      showNSFW: true,
      createdAt: Date.now() 
    };
    this.setUser(guestUser);
    this.social.initializeMasterConnection(); // Auto Follow
    this.router.navigate(['/home']);
  }

  loginAsMaster() {
    const masterUser: UserProfile = {
      id: 'admin_ezequiel',
      username: 'わっせ', 
      avatarUrl: this.assets.getIcon(), 
      bannerUrl: this.assets.getIcon(),
      bio: '日本人だよ。ツンデレ好きです',
      isGuest: false,
      isAdultVerified: true,
      showNSFW: true,
      createdAt: Date.now() - (365 * 24 * 60 * 60 * 1000) 
    };
    this.setUser(masterUser);
    this.economy.setInfiniteBalance();
    this.router.navigate(['/home']);
  }

  signup(email: string, dob: Date) {
    return true; 
  }

  completeOnboarding(username: string, avatarUrl: string, bio: string) {
    const newUser: UserProfile = {
      id: 'user_' + Date.now(),
      username,
      avatarUrl: avatarUrl || this.assets.getIcon(),
      bannerUrl: this.assets.getIcon(),
      bio,
      isGuest: false,
      isAdultVerified: true,
      showNSFW: true, 
      createdAt: Date.now()
    };
    this.setUser(newUser);
    this.economy.initNewAccount();
    this.social.initializeMasterConnection(); // Auto Follow
    this.router.navigate(['/home']);
  }

  updateContentFilter(showNSFW: boolean) {
    const user = this._currentUser();
    if (user) {
      if (showNSFW && !user.isAdultVerified && !user.isGuest) return;
      const updated = { ...user, showNSFW };
      this.setUser(updated);
    }
  }

  updateProfile(data: Partial<UserProfile>) {
    const current = this._currentUser();
    if (current) {
      const updated = { ...current, ...data };
      this.setUser(updated);
    }
  }

  logout() {
    this._currentUser.set(null);
    this.storage.removeItem('demomax_user_v1');
    this.router.navigate(['/splash']);
  }

  private setUser(user: UserProfile) {
    this._currentUser.set(user);
    this.storage.setItem('demomax_user_v1', user);
  }
}
