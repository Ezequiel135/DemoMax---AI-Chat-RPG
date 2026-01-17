
import { Injectable, signal, inject, computed } from '@angular/core';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';

interface SocialState {
  followingUsers: string[]; 
  followingChars: string[];
  // In a real app, this would be fetched from API (who follows me)
  followers: string[]; 
}

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  private storage = inject(StorageService);
  private toast = inject(ToastService);
  private readonly KEY = 'demomax_social_v2';

  private state = signal<SocialState>({ 
    followingUsers: [], 
    followingChars: [],
    followers: ['Ezequiel', 'Mirella', 'Luna', 'System'] // Mock initial followers
  });

  constructor() {
    const saved = this.storage.getItem<SocialState>(this.KEY);
    if (saved) {
      // Ensure structure integrity for v2
      if (!saved.followers) saved.followers = ['Ezequiel', 'Mirella', 'Luna'];
      this.state.set(saved);
    }
  }

  isFollowingUser(username: string): boolean {
    return this.state().followingUsers.includes(username);
  }

  isFollower(username: string): boolean {
    return this.state().followers.includes(username);
  }

  isFollowingChar(charId: string): boolean {
    return this.state().followingChars.includes(charId);
  }

  // "Friends" logic: I follow them AND they follow me
  isMutual(username: string): boolean {
    return this.isFollowingUser(username) && this.isFollower(username);
  }

  toggleFollowUser(username: string) {
    this.state.update(s => {
      const isFollowing = s.followingUsers.includes(username);
      let newFollowing = [...s.followingUsers];
      let newFollowers = [...s.followers];

      if (isFollowing) {
        // Unfollow
        newFollowing = newFollowing.filter(u => u !== username);
        this.toast.show(`Você deixou de seguir @${username}`, 'info');
      } else {
        // Follow
        newFollowing.push(username);
        this.toast.show(`Agora você segue @${username}`, 'success');
        
        // DEMO HACK: Simulate they follow back automatically so you can test chat
        if (!newFollowers.includes(username)) {
           newFollowers.push(username);
           setTimeout(() => this.toast.show(`@${username} começou a seguir você! (Amigos)`, 'success'), 1000);
        }
      }
      
      const newState = { ...s, followingUsers: newFollowing, followers: newFollowers };
      this.storage.setItem(this.KEY, newState);
      return newState;
    });
  }

  toggleFollowChar(charId: string, charName: string) {
    this.state.update(s => {
      const exists = s.followingChars.includes(charId);
      const newChars = exists ? s.followingChars.filter(id => id !== charId) : [...s.followingChars, charId];
      if (!exists) this.toast.show(`${charName} salvo nos favoritos!`, 'success');
      else this.toast.show(`${charName} removido dos favoritos.`, 'info');
      
      const newState = { ...s, followingChars: newChars };
      this.storage.setItem(this.KEY, newState);
      return newState;
    });
  }
}
