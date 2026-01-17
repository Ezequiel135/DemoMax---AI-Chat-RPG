
import { Injectable, signal, inject } from '@angular/core';
import { WebNovel } from '../models/web-novel.model';
import { DatabaseService } from './core/database.service';
import { AuthService } from './auth.service';
import { SystemAssetsService } from './core/system-assets.service'; // Injected

@Injectable({
  providedIn: 'root'
})
export class WebNovelService {
  private db = inject(DatabaseService);
  private auth = inject(AuthService);
  private assets = inject(SystemAssetsService); // Injected
  
  private readonly DB_COLLECTION = 'web_novels_v1';

  private _novels = signal<WebNovel[]>([]);
  readonly novels = this._novels.asReadonly();
  
  private _activeNovelId: string | null = null;

  // Mock Inicial
  private readonly SYSTEM_NOVEL: WebNovel = {
      id: 'wn_demo_1',
      creatorId: 'system',
      author: 'System Author',
      title: 'O Rei dos Demônios Reencarnado',
      description: 'Após ser derrotado pelo herói, o Lorde Demônio acorda no corpo de um estudante comum no Brasil.',
      coverUrl: 'https://i.ibb.co/hxSz0SJr/Background-Eraser-20251224-125356967.png', // Keep as string or better, use service in a real constructor, but here it's static prop. For static, we keep the URL, but the service handles the caching for dynamic ones.
      tags: ['Isekai', 'Ação', 'Comédia'],
      status: 'Ongoing',
      chapters: [
        { id: 'ch1', title: 'Capítulo 1: O Despertar', content: 'Eu abri meus olhos. O teto era branco. Onde estava meu castelo?', publishedAt: Date.now() }
      ],
      readCount: 1540,
      likes: 320,
      createdAt: Date.now(),
      updatedAt: Date.now()
  };

  constructor() {
    // Update system novel with cached asset URL
    this.SYSTEM_NOVEL.coverUrl = this.assets.getIcon();
    this.loadWebNovels();
  }

  private async loadWebNovels() {
    try {
      const stored = await this.db.getAll<WebNovel>(this.DB_COLLECTION);
      const merged = [this.SYSTEM_NOVEL, ...stored];
      this._novels.set(merged);
    } catch (e) {
      this._novels.set([this.SYSTEM_NOVEL]);
    }
  }

  getNovelById(id: string): WebNovel | undefined {
    this._activeNovelId = id;
    return this._novels().find(n => n.id === id);
  }

  async saveNovel(novel: WebNovel) {
    novel.updatedAt = Date.now();
    
    // UI Update
    this._novels.update(current => {
      const index = current.findIndex(n => n.id === novel.id);
      if (index >= 0) {
        const updated = [...current];
        updated[index] = novel;
        return updated;
      }
      return [novel, ...current];
    });

    // DB Update
    const toSave = this._novels().filter(n => n.creatorId !== 'system');
    await this.db.saveAll(this.DB_COLLECTION, toSave);
  }

  async deleteNovel(id: string) {
    this._novels.update(current => current.filter(n => n.id !== id));
    
    const toSave = this._novels().filter(n => n.creatorId !== 'system');
    await this.db.saveAll(this.DB_COLLECTION, toSave);
  }

  createEmpty(): WebNovel {
    const user = this.auth.currentUser();
    return {
      id: `wn_${Date.now()}`,
      creatorId: user?.id || 'guest',
      author: user?.username || 'Autor',
      title: 'Sem Título',
      description: 'Sinopse da sua história...',
      coverUrl: this.assets.getIcon(),
      tags: [],
      status: 'Ongoing',
      chapters: [],
      readCount: 0,
      likes: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
    };
  }

  releaseMemory() {
    this._activeNovelId = null;
  }
}
