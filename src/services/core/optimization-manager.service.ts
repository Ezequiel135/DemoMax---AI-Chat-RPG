import { Injectable, inject } from '@angular/core';
import { GeminiService } from '../gemini.service';
import { CharacterService } from '../character.service';
import { VnService } from '../vn.service';
import { WebNovelService } from '../web-novel.service';
import { ToastService } from '../toast.service';

@Injectable({
  providedIn: 'root'
})
export class OptimizationManagerService {
  private geminiService = inject(GeminiService);
  private charService = inject(CharacterService);
  private vnService = inject(VnService);
  private wnService = inject(WebNovelService);
  private toast = inject(ToastService);

  public manualCleanup() {
    // 1. Limpa sessões de IA (Chats)
    this.geminiService.clearAllSessions();

    // 2. Limpa dados pesados de serviços de conteúdo
    this.charService.releaseActiveMemory();
    this.vnService.releaseMemory();
    this.wnService.releaseMemory();

    // 3. Força Garbage Collection do navegador (sugestão)
    if ((window as any).gc) {
      try { (window as any).gc(); } catch(e) {}
    }

    this.toast.show("Memória otimizada! Cache limpo com sucesso.", "success");
  }
}