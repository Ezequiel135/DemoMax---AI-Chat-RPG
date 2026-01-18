
import { Injectable, signal, inject, computed } from '@angular/core';
import { StorageService } from './storage.service';
import { ToastService } from './toast.service';
import { SocialState, toggleUserFollow, toggleCharFollow, simulateFollowBack, toggleItemLike, blockUser, unblockUser, removeFollower } from '../logic/social/relationship.logic';

@Injectable({
  providedIn: 'root'
})
export class SocialService {
  private storage = inject(StorageService);
  private toast = inject(ToastService);
  private readonly KEY = 'demomax_social_v2';
  
  // Constantes do Mestre (Conta Admin)
  private readonly MASTER_USERNAME = 'わっせ'; 

  // Estado Reativo
  private state = signal<SocialState>({ 
    followingUsers: [], 
    followingChars: [],
    followers: [],
    likedNovels: [],
    likedWebNovels: [],
    blockedUsers: []
  });

  // Seletores
  readonly followerCount = computed(() => this.state().followers.length);
  readonly followingCount = computed(() => this.state().followingUsers.length);
  
  readonly followingCharsIds = computed(() => this.state().followingChars);
  readonly likedNovelsIds = computed(() => this.state().likedNovels);
  readonly likedWebNovelsIds = computed(() => this.state().likedWebNovels);
  readonly blockedUsersList = computed(() => this.state().blockedUsers);

  // Getter para usar em modais
  get followersList() { return this.state().followers; }
  get followingList() { return this.state().followingUsers; }

  constructor() {
    const saved = this.storage.getItem<SocialState>(this.KEY);
    if (saved) {
      this.state.set({
        likedNovels: [],
        likedWebNovels: [],
        blockedUsers: [],
        ...saved
      });
    }
  }

  initializeMasterConnection() {
    this.state.update(current => {
      const newState = { ...current };
      if (!newState.followingUsers.includes(this.MASTER_USERNAME)) {
        newState.followingUsers = [...newState.followingUsers, this.MASTER_USERNAME];
      }
      if (!newState.followers.includes(this.MASTER_USERNAME)) {
        newState.followers = [...newState.followers, this.MASTER_USERNAME];
      }
      return newState;
    });
    this.saveState();
  }

  // --- FOLLOW USER ---
  isFollowingUser(username: string): boolean {
    return this.state().followingUsers.includes(username);
  }

  isFollower(username: string): boolean {
    return this.state().followers.includes(username);
  }

  isBlocked(username: string): boolean {
    return this.state().blockedUsers.includes(username);
  }

  isMutual(username: string): boolean {
    return this.isFollowingUser(username) && this.isFollower(username) && !this.isBlocked(username);
  }

  toggleFollowUser(username: string) {
    // PROTEÇÃO MESTRE: Não pode deixar de seguir
    if (username === this.MASTER_USERNAME && this.isFollowingUser(username)) {
       this.toast.show("Você não pode deixar de seguir a Entidade Mestre.", "error");
       return;
    }

    if (this.isBlocked(username)) {
       this.toast.show("Desbloqueie o usuário para seguir.", "info");
       return;
    }

    const result = toggleUserFollow(this.state(), username);
    this.state.set(result.state);
    this.saveState();

    if (result.action === 'unfollowed') {
      this.toast.show(`Você deixou de seguir @${username}`, 'info');
    } else {
      this.toast.show(`Agora você segue @${username}`, 'success');
      
      if (username !== this.MASTER_USERNAME && !this.isFollower(username)) {
         setTimeout(() => {
           const updated = simulateFollowBack(this.state(), username);
           if (updated) {
             this.state.set(updated);
             this.saveState();
             this.toast.show(`@${username} começou a seguir você!`, 'success');
           }
         }, 3000); 
      }
    }
  }

  // --- REMOVE FOLLOWER ---
  removeFollowerUser(username: string) {
    // PROTEÇÃO MESTRE
    if (username === this.MASTER_USERNAME) {
      this.toast.show("A Entidade Mestre observa tudo. Não pode ser removida.", "error");
      return;
    }

    const newState = removeFollower(this.state(), username);
    this.state.set(newState);
    this.saveState();
    this.toast.show(`@${username} removido dos seguidores.`, 'info');
  }

  // --- BLOCK USER ---
  toggleBlockUser(username: string) {
    // PROTEÇÃO MESTRE
    if (username === this.MASTER_USERNAME) {
      this.toast.show("Ação impossível. Entidade Suprema.", "error");
      return;
    }

    if (this.isBlocked(username)) {
      // Unblock
      const newState = unblockUser(this.state(), username);
      this.state.set(newState);
      this.toast.show(`@${username} desbloqueado.`, 'success');
    } else {
      // Block
      if(confirm(`Bloquear @${username}? Vocês deixarão de se seguir e não verão o conteúdo um do outro.`)) {
        const newState = blockUser(this.state(), username);
        this.state.set(newState);
        this.toast.show(`@${username} bloqueado.`, 'error');
      }
    }
    this.saveState();
  }

  // --- FOLLOW CHARACTER & LIKES ---
  isFollowingChar(charId: string): boolean {
    return this.state().followingChars.includes(charId);
  }

  toggleFollowChar(charId: string, charName: string) {
    const result = toggleCharFollow(this.state(), charId);
    this.state.set(result.state);
    this.saveState();
    if (result.action === 'added') this.toast.show(`${charName} salvo nos favoritos!`, 'success');
    else this.toast.show(`${charName} removido dos favoritos.`, 'info');
  }

  isNovelLiked(id: string): boolean {
    return this.state().likedNovels.includes(id);
  }

  toggleNovelLike(id: string) {
    this.state.update(s => ({ ...s, likedNovels: toggleItemLike(s.likedNovels, id) }));
    this.saveState();
  }

  isWebNovelLiked(id: string): boolean {
    return this.state().likedWebNovels.includes(id);
  }

  toggleWebNovelLike(id: string) {
    this.state.update(s => ({ ...s, likedWebNovels: toggleItemLike(s.likedWebNovels, id) }));
    this.saveState();
  }

  private saveState() {
    this.storage.setItem(this.KEY, this.state());
  }
}
