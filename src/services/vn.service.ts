
import { Injectable, signal, inject } from '@angular/core';
import { VisualNovel } from '../models/vn.model';
import { DatabaseService } from './core/database.service';
import { AuthService } from './auth.service';
import { SystemAssetsService } from './core/system-assets.service'; // Injected
import { MOCK_VNS } from '../data/mock-vns.data';

@Injectable({
  providedIn: 'root'
})
export class VnService {
  private db = inject(DatabaseService);
  private auth = inject(AuthService);
  private assets = inject(SystemAssetsService); // Injected
  
  private readonly DB_COLLECTION = 'visual_novels_v1';

  private _novels = signal<VisualNovel[]>([]);
  readonly novels = this._novels.asReadonly();

  private _activeNovelId: string | null = null;

  constructor() {
    this.loadNovels();
  }

  private async loadNovels() {
    try {
      const storedNovels = await this.db.getAll<VisualNovel>(this.DB_COLLECTION);
      
      const missingMocks = MOCK_VNS.filter(mock => !storedNovels.find(s => s.id === mock.id));
      
      const allNovels = [...storedNovels, ...missingMocks];

      if (allNovels.length > 0) {
        // Normalização de dados legados
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
        
        // Sort: User created first, then mocks
        allNovels.sort((a, b) => b.createdAt - a.createdAt);
        
        this._novels.set(allNovels);
      } else {
        // Fallback ultimate if empty
        this._novels.set(MOCK_VNS);
      }

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
    return this._novels().find(n => n.id === id);
  }

  async saveNovel(novel: VisualNovel) {
    // 1. Atualiza Signal (UI Instantânea)
    this._novels.update(current => {
      const index = current.findIndex(n => n.id === novel.id);
      if (index >= 0) {
        const updated = [...current];
        updated[index] = novel;
        return updated;
      }
      return [novel, ...current];
    });

    // 2. Persiste no Banco de Dados (Async)
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
    const startSceneId = `scene_${Date.now()}`;
    const user = this.auth.currentUser();
    return {
      id: `vn_${Date.now()}`,
      creatorId: user?.id || 'guest',
      title: 'Nova História',
      description: 'Uma aventura incrível.',
      coverUrl: this.assets.getIcon(),
      author: user?.username || 'Autor',
      createdAt: Date.now(),
      startSceneId: startSceneId,
      playCount: 0,
      likes: 0,
      tags: ['Nova'],
      credits: {
        enabled: true,
        endingTitle: 'FIM',
        scrollingText: `Roteiro e Direção\n${user?.username || 'Autor'}\n\nArte\nIA Generativa\n\nProduzido no\nDemoMax Studio\n\nObrigado por jogar!`,
        backgroundImageUrl: this.assets.getIcon()
      },
      scenes: [
        {
          id: startSceneId,
          name: 'Cena 1',
          backgroundUrl: this.assets.getIcon(),
          speakerName: 'Narrador',
          dialogue: 'Tudo começou em uma tarde chuvosa...',
          transition: 'fade',
          characterEffect: 'none',
          choices: []
        }
      ]
    };
  }

  releaseMemory() {
    if (this._activeNovelId) {
      this._activeNovelId = null;
    }
  }
}
