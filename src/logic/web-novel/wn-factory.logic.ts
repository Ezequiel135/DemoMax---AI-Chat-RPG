
import { WebNovel } from '../../models/web-novel.model';

export function createNewWebNovel(creatorId: string, creatorName: string, defaultCoverUrl: string): WebNovel {
  return {
    id: `wn_${Date.now()}`,
    creatorId: creatorId,
    author: creatorName,
    title: 'Sem Título',
    description: 'Sinopse da sua história...',
    coverUrl: defaultCoverUrl,
    tags: [],
    status: 'Ongoing',
    chapters: [],
    readCount: 0,
    likes: 0,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };
}
