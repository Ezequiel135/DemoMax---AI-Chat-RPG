
export interface Character {
  id: string;
  creatorId?: string; // ID do dono (opcional para manter compatibilidade com mocks antigos)
  name: string;
  tagline: string;
  description: string;
  avatarUrl: string;
  coverUrl: string;
  systemInstruction: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  affinity: number; // 0-100
  tags: string[];
  // Social & Feed Stats
  creator: string; // @username para exibição
  messageCount: string; // e.g. "12.5k"
  favoriteCount: string; // e.g. "3.4k"
  isTrending?: boolean; // Hot 🔥
  isNew?: boolean; // New Arrival
  isNSFW?: boolean; // Content Filter Flag
  pixKey?: string; // New: Creator's PIX key for donations
  
  // AI Configuration
  modelConfig?: 'Standard' | 'Deep Thought' | 'Creative'; 
}
