
export interface VnChoice {
  text: string;
  nextSceneId: string;
}

export type SceneTransition = 'none' | 'fade' | 'slide-left' | 'slide-right' | 'zoom-in';
export type CharacterAnimation = 'none' | 'fade-in' | 'slide-up' | 'shake' | 'hop' | 'pulse';

export interface VnScene {
  id: string;
  name: string; // Nome interno para organização
  backgroundUrl: string;
  characterUrl?: string; // Personagem na tela (opcional)
  speakerName: string;
  dialogue: string;
  choices: VnChoice[];
  
  // Flow Control (New)
  nextSceneId?: string | null; // Se definido, o clique na tela leva para esta cena (Fluxo Linear)

  // Visual & Audio Effects
  transition?: SceneTransition;
  characterEffect?: CharacterAnimation;
  backgroundMusicUrl?: string; // Optional: Music track
}

export interface VnCredits {
  enabled: boolean;
  endingTitle: string; // Ex: "FIM", "TO BE CONTINUED"
  scrollingText: string; // Texto dos créditos
  backgroundImageUrl?: string; // Imagem de fundo específica para o fim
  musicUrl?: string; // Música final
}

export interface VisualNovel {
  id: string;
  creatorId: string; // ID do usuário que criou
  title: string;
  description: string;
  coverUrl: string;
  author: string; // Nome de exibição
  createdAt: number;
  scenes: VnScene[];
  startSceneId: string;
  
  // Configurações de Fim de Jogo
  credits: VnCredits;
  
  // New Stats for Ranking
  playCount?: number;
  likes?: number;
  tags?: string[];
}
