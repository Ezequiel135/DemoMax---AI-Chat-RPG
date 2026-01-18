
export interface SocialState {
  followingUsers: string[]; 
  followingChars: string[];
  followers: string[]; 
  likedNovels: string[];
  likedWebNovels: string[];
  blockedUsers: string[]; // Nova lista de bloqueados
}

export function toggleUserFollow(currentState: SocialState, username: string): { state: SocialState, action: 'followed' | 'unfollowed' } {
  const isFollowing = currentState.followingUsers.includes(username);
  let newFollowing = [...currentState.followingUsers];
  
  if (isFollowing) {
    newFollowing = newFollowing.filter(u => u !== username);
    return { 
      state: { ...currentState, followingUsers: newFollowing }, 
      action: 'unfollowed' 
    };
  } else {
    newFollowing.push(username);
    return { 
      state: { ...currentState, followingUsers: newFollowing }, 
      action: 'followed' 
    };
  }
}

export function toggleCharFollow(currentState: SocialState, charId: string): { state: SocialState, action: 'added' | 'removed' } {
  const exists = currentState.followingChars.includes(charId);
  const newChars = exists ? currentState.followingChars.filter(id => id !== charId) : [...currentState.followingChars, charId];
  
  return { 
    state: { ...currentState, followingChars: newChars }, 
    action: exists ? 'removed' : 'added' 
  };
}

export function toggleItemLike(currentList: string[], itemId: string): string[] {
  if (currentList.includes(itemId)) {
    return currentList.filter(id => id !== itemId);
  } else {
    return [...currentList, itemId];
  }
}

export function simulateFollowBack(currentState: SocialState, username: string): SocialState | null {
  if (currentState.followers.includes(username)) return null;
  return { ...currentState, followers: [...currentState.followers, username] };
}

// --- NOVAS FUNÇÕES DE BLOQUEIO E REMOÇÃO ---

export function removeFollower(currentState: SocialState, username: string): SocialState {
  return {
    ...currentState,
    followers: currentState.followers.filter(u => u !== username)
  };
}

export function blockUser(currentState: SocialState, username: string): SocialState {
  // Ao bloquear: Remove dos seguidores, Remove dos seguidos, Adiciona aos bloqueados
  return {
    ...currentState,
    followers: currentState.followers.filter(u => u !== username),
    followingUsers: currentState.followingUsers.filter(u => u !== username),
    blockedUsers: [...currentState.blockedUsers, username]
  };
}

export function unblockUser(currentState: SocialState, username: string): SocialState {
  return {
    ...currentState,
    blockedUsers: currentState.blockedUsers.filter(u => u !== username)
  };
}
