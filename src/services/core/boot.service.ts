
import { Injectable, inject, signal } from '@angular/core';
import { SystemAssetsService } from './system-assets.service';
import { AuthService } from '../auth.service';
import { CharacterService } from '../character.service';
import { VnService } from '../vn.service';
import { WebNovelService } from '../web-novel.service';
import { DirectMessageService } from '../direct-message.service';
import { IndexedDbService } from './indexed-db.service';
import { DatabaseService } from './database.service';
import { MOCK_CHARACTERS } from '../../data/mock-characters.data';
import { MOCK_VNS } from '../../data/mock-vns.data';

@Injectable({
  providedIn: 'root'
})
export class BootService {
  private assets = inject(SystemAssetsService);
  private auth = inject(AuthService);
  private idb = inject(IndexedDbService);
  private db = inject(DatabaseService);
  
  // Lazy injected services
  private charService = inject(CharacterService);
  private vnService = inject(VnService);
  private wnService = inject(WebNovelService);
  private dmService = inject(DirectMessageService);

  readonly progress = signal(0);
  readonly statusMessage = signal('Iniciando...');
  readonly isReady = signal(false);

  async initializeApp() {
    // 1. Init Database
    this.statusMessage.set('Carregando memória...');
    await this.idb.init();
    this.progress.set(20);

    // 2. Preload Assets
    this.assets.preloadCriticalImages();
    this.progress.set(40);

    // 3. First Run Check: Populate DB if empty
    await this.checkAndPopulateData();
    this.progress.set(70);

    // 4. Auth Check
    this.statusMessage.set('Sincronizando perfil...');
    const user = this.auth.currentUser(); 
    
    this.progress.set(100);
    this.isReady.set(true);
  }

  private async checkAndPopulateData() {
    try {
      const chars = await this.db.getAll('characters_v1');
      if (chars.length === 0) {
        await this.db.saveAll('characters_v1', MOCK_CHARACTERS);
      }

      const vns = await this.db.getAll('visual_novels_v1');
      if (vns.length === 0) {
        await this.db.saveAll('visual_novels_v1', MOCK_VNS);
      }
    } catch (e) {
      console.error('[Boot] Seeding failed', e);
    }
  }

  startBackgroundLoading() {
    setTimeout(() => {
      const idleCallback = (window as any).requestIdleCallback || ((cb: any) => setTimeout(cb, 50));

      idleCallback(() => {
        Promise.all([
          this.charService.initializeData(),
          this.vnService.initializeData(),
          this.wnService.initializeData()
        ]).then(() => {
           this.dmService.loadChats();
        });
      });
    }, 800); 
  }
}
