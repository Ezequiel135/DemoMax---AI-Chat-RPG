
import { Injectable, signal, inject } from '@angular/core';
import { VisualNovel } from '../models/vn.model';
import { DatabaseService } from './core/database.service';
import { AuthService } from './auth.service';
import { SystemAssetsService } from './core/system-assets.service'; 
import { SocialService } from './social.service'; // Added
import { MOCK_VNS } from '../data/mock-vns.data';
import { createNewVisualNovel } from '../logic/vn/vn-factory.logic';

@Injectable({
  providedIn: 'root'
})
export class VnService {
  private db = inject(DatabaseService);
  private auth = inject(AuthService);
  private assets = inject(SystemAssetsService); 
  private social = inject(SocialService); // Injected
  
  private readonly DB_COLLECTION = 'visual_novels_v1';

  private _novels = signal<VisualNovel[]>([]);
  readonly novels = this._novels.asReadonly();

  private _activeNovelId: string | null = null;
  private _initialized = false;

  async initializeData() {
    if (this._initialized) return;

    try {
      const storedNovels = await this.db.getAll<VisualNovel>(this.DB_COLLECTION);
      const missingMocks = MOCK_VNS.filter(mock => !storedNovels.find(s => s.id === mock.id));
      const allNovels = [...storedNovels, ...missingMocks];

      if (allNovels.length > 0) {
        allNovels.forEach(n => {
          if (!n.credits) {
            n.credits = {
              enabled: true,
              endingTitle: 'FIM',
              scrollingText: 'Obrigado por jogar!\n\nCriado com DemoMax.',
              backgroundImageUrl: n.coverUrl
            };
          }
        });
        allNovels.sort((a, b) => b.createdAt - a.createdAt);
        this._novels.set(allNovels);
      } else {
        this._novels.set(MOCK_VNS);
      }
      this._initialized = true;

    } catch (e) {
      console.error("Erro ao carregar VNs", e);
      this._novels.set(MOCK_VNS);
    }
  }

  canEdit(novel: VisualNovel): boolean {
    const user = this.auth.currentUser();
    if (!user) return false;
    if (this.auth.isMaster()) return true;
    return novel.creatorId === user.id;
  }

  getNovelById(id: string): VisualNovel | undefined {
    this._activeNovelId = id;
    let n = this._novels().find(n => n.id === id);
    if (!n) n = MOCK_VNS.find(m => m.id === id);
    return n;
  }

  async saveNovel(novel: VisualNovel) {
    this._novels.update(current => {
      const index = current.findIndex(n => n.id === novel.id);
      if (index >= 0) {
        const updated = [...current];
        updated[index] = novel;
        return updated;
      }
      return [novel, ...current];
    });
    await this.db.saveAll(this.DB_COLLECTION, this._novels());
  }

  async deleteNovel(id: string) {
    const novel = this.getNovelById(id);
    if (!novel || !this.canEdit(novel)) {
      alert("Acesso Negado.");
      return;
    }
    this._novels.update(current => current.filter(n => n.id !== id));
    await this.db.saveAll(this.DB_COLLECTION, this._novels());
  }

  createEmptyNovel(): VisualNovel {
    const user = this.auth.currentUser();
    return createNewVisualNovel(
      user?.id || 'guest',
      user?.username || 'Autor',
      this.assets.getIcon()
    );
  }

  // --- LIKE LOGIC ---
  toggleLike(id: string) {
    this.social.toggleNovelLike(id);
    // Update local counter visual (not persisted to DB instantly to avoid spam write)
    const novel = this.getNovelById(id);
    if (novel) {
       const isLiked = this.social.isNovelLiked(id);
       novel.likes = (novel.likes || 0) + (isLiked ? 1 : -1);
    }
  }

  releaseMemory() {
    this._activeNovelId = null;
  }
}
