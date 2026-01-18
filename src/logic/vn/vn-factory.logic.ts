
import { VisualNovel } from '../../models/vn.model';

export function createNewVisualNovel(creatorId: string, creatorName: string, defaultCoverUrl: string): VisualNovel {
  const startSceneId = `scene_${Date.now()}`;
  return {
    id: `vn_${Date.now()}`,
    creatorId: creatorId,
    title: 'Nova História',
    description: 'Uma aventura incrível.',
    coverUrl: defaultCoverUrl,
    author: creatorName,
    createdAt: Date.now(),
    startSceneId: startSceneId,
    playCount: 0,
    likes: 0,
    tags: ['Nova'],
    credits: {
      enabled: true,
      endingTitle: 'FIM',
      scrollingText: `Roteiro e Direção\n${creatorName}\n\nArte\nIA Generativa\n\nProduzido no\nDemoMax Studio\n\nObrigado por jogar!`,
      backgroundImageUrl: defaultCoverUrl
    },
    scenes: [
      {
        id: startSceneId,
        name: 'Cena 1',
        backgroundUrl: defaultCoverUrl,
        speakerName: 'Narrador',
        dialogue: 'Tudo começou em uma tarde chuvosa...',
        transition: 'fade',
        characterEffect: 'none',
        choices: []
      }
    ]
  };
}
