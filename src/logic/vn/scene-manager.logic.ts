
import { VnScene, VisualNovel } from '../../models/vn.model';

export function createNewScene(currentScenes: VnScene[], refSceneId?: string): VnScene {
  const refScene = currentScenes.find(s => s.id === refSceneId) || currentScenes[currentScenes.length - 1];
  const newId = `scene_${Date.now()}`;
  
  return {
    id: newId,
    name: `Cena ${currentScenes.length + 1}`,
    backgroundUrl: refScene ? refScene.backgroundUrl : '',
    characterUrl: refScene ? refScene.characterUrl : '',
    speakerName: refScene ? refScene.speakerName : '', 
    transition: 'fade', 
    characterEffect: 'none',
    backgroundMusicUrl: refScene ? refScene.backgroundMusicUrl : undefined,
    nextSceneId: null,
    dialogue: '...', 
    choices: []
  };
}
