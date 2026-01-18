
import { VnScene } from '../../models/vn.model';

export function getNextSceneId(currentScene: VnScene | undefined): string | null {
    if (!currentScene) return null;
    
    // Automatic flow via nextSceneId
    if (currentScene.nextSceneId) {
        return currentScene.nextSceneId;
    }
    
    // No next scene and no choices = End of Game
    if (!currentScene.choices || currentScene.choices.length === 0) {
        return '__END__';
    }
    
    return null; // Waiting for choice
}

export function calculateReward(playCount: number): number {
    // Diminishing returns logic if needed, currently flat for demo
    return 100;
}
