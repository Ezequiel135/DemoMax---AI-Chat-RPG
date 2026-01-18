
import { VisualNovel, VnScene, VnCredits } from '../../../models/vn.model';

export interface VnEngineState {
  currentSceneId: string;
  gameEnded: boolean;
  isTyping: boolean;
  displayedText: string;
}

export class VnEngineLogic {
  
  static initialize(novel: VisualNovel, startId?: string): VnEngineState {
    return {
      currentSceneId: startId || novel.startSceneId,
      gameEnded: false,
      isTyping: true,
      displayedText: ''
    };
  }

  static getNextSceneId(currentScene: VnScene | undefined): string | null {
    if (!currentScene) return null;
    
    // Automatic flow via nextSceneId
    if (currentScene.nextSceneId) {
        return currentScene.nextSceneId;
    }
    
    // No next scene and no choices = End of Game
    if (!currentScene.choices || currentScene.choices.length === 0) {
        return '__END__';
    }
    
    return null; // Waiting for user choice
  }

  static transitionTo(newState: VnEngineState, targetSceneId: string): VnEngineState {
    if (targetSceneId === '__END__') {
      return { ...newState, gameEnded: true };
    }
    return {
      ...newState,
      currentSceneId: targetSceneId,
      isTyping: true,
      displayedText: ''
    };
  }

  static getCredits(novel: VisualNovel): VnCredits {
    return novel.credits || {
       enabled: true,
       endingTitle: 'FIM',
       scrollingText: 'Obrigado por jogar!',
       backgroundImageUrl: novel.coverUrl
    };
  }
}
