
export interface LifeStatus {
  isAlive: boolean;
  causeOfDeath?: string; // e.g., "Car Accident", "Old Age", "Illness"
  deathDate?: number;

  healthCondition: 'Healthy' | 'Sick' | 'Hospitalized' | 'Terminal';
  illnessName?: string; // "Flu", "Cancer", "Magic Curse"
  
  isPregnant: boolean;
  pregnancyWeeks: number; // 0 to 40
  childrenCount: number;
}

export interface Character {
  id: string;
  creatorId?: string; 
  name: string;
  tagline: string;
  description: string;
  avatarUrl: string;
  coverUrl: string;
  systemInstruction: string;
  rarity: 'Common' | 'Rare' | 'Legendary';
  affinity: number; 
  initialAffinity?: number; // New: Configured by creator
  tags: string[];
  
  creator: string; 
  messageCount: string; 
  favoriteCount: string; 
  isTrending?: boolean; 
  isNew?: boolean; 
  isNSFW?: boolean; 
  pixKey?: string; 
  
  modelConfig?: 'Standard' | 'Deep Thought' | 'Creative'; 
  gender?: 'Female' | 'Male' | 'Other'; // Added Gender
  
  firstMessage?: string; 

  // New Life Simulation Data
  lifeStatus?: LifeStatus;
}
