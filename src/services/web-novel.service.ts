
import { Injectable, signal, inject } from '@angular/core';
import { WebNovel } from '../models/web-novel.model';
import { DatabaseService } from './core/database.service';
import { AuthService } from './auth.service';
import { SystemAssetsService } from './core/system-assets.service'; 
import { SocialService } from './social.service'; // Added
import { createNewWebNovel } from '../logic/web-novel/wn-factory.logic';

@Injectable({
  providedIn: 'root'
})
export class WebNovelService {
  private db = inject(DatabaseService);
  private auth = inject(AuthService);
  private assets = inject(SystemAssetsService); 
  private social = inject(SocialService); // Injected
  
  private readonly DB_COLLECTION = 'web_novels_v1';

  private _novels = signal<WebNovel[]>([]);
  readonly novels = this._novels.asReadonly();
  
  private _activeNovelId: string | null = null;
  private _initialized = false;

  private readonly SYSTEM_NOVEL: WebNovel = {
      id: 'wn_demo_1',
      creatorId: 'admin_ezequiel',
      author: 'わっせ', 
      title: 'O Rei dos Demônios Reencarnado',
      description: 'Após ser derrotado pelo herói, o Lorde Demônio acorda no corpo de um estudante comum no Brasil.',
      coverUrl: 'https://i.ibb.co/hxSz0SJr/Background-Eraser-20251224-125356967.png',
      tags: ['Isekai', 'Ação', 'Comédia'],
      status: 'Ongoing',
      chapters: [
        { id: 'ch1', title: 'Capítulo 1: O Despertar', content: 'Eu abri meus olhos. O teto era branco. Onde estava meu castelo?', publishedAt: Date.now() }
      ],
      readCount: 0,
      likes: 0,
      createdAt: Date.now(),
      updatedAt: Date.now()
  };

  constructor() {}

  async initializeData() {
    if (this._initialized) return;
    this.SYSTEM_NOVEL.coverUrl = this.assets.getIcon();

    try {
      const stored = await this.db.getAll<WebNovel>(this.DB_COLLECTION);
      const merged = [this.SYSTEM_NOVEL, ...stored];
      this._novels.set(merged);
      this._initialized = true;
    } catch (e) {
      this._novels.set([this.SYSTEM_NOVEL]);
    }
  }

  getNovelById(id: string): WebNovel | undefined {
    this._activeNovelId = id;
    let n = this._novels().find(n => n.id === id);
    if (!n && id === this.SYSTEM_NOVEL.id) return this.SYSTEM_NOVEL;
    return n;
  }

  async saveNovel(novel: WebNovel) {
    novel.updatedAt = Date.now();
    
    this._novels.update(current => {
      const index = current.findIndex(n => n.id === novel.id);
      if (index >= 0) {
        const updated = [...current];
        updated[index] = novel;
        return updated;
      }
      return [novel, ...current];
    });

    const toSave = this._novels().filter(n => n.creatorId !== 'admin_ezequiel');
    await this.db.saveAll(this.DB_COLLECTION, toSave);
  }

  async deleteNovel(id: string) {
    this._novels.update(current => current.filter(n => n.id !== id));
    const toSave = this._novels().filter(n => n.creatorId !== 'admin_ezequiel');
    await this.db.saveAll(this.DB_COLLECTION, toSave);
  }

  createEmpty(): WebNovel {
    const user = this.auth.currentUser();
    return createNewWebNovel(
      user?.id || 'guest',
      user?.username || 'Autor',
      this.assets.getIcon()
    );
  }

  // --- LIKE LOGIC ---
  toggleLike(id: string) {
    this.social.toggleWebNovelLike(id);
    const novel = this.getNovelById(id);
    if (novel) {
       const isLiked = this.social.isWebNovelLiked(id);
       novel.likes = (novel.likes || 0) + (isLiked ? 1 : -1);
    }
  }

  releaseMemory() {
    this._activeNovelId = null;
  }
}
