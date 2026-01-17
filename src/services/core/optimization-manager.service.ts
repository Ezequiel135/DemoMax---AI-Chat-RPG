
import { Injectable, inject } from '@angular/core';
import { GeminiService } from '../gemini.service';
import { CharacterService } from '../character.service';
import { VnService } from '../vn.service';
import { WebNovelService } from '../web-novel.service';
import { ToastService } from '../toast.service';

/**
 * OPTIMIZATION MANAGER
 * Agora opera em modo "Suspender/Resumir".
 * Não deleta nada automaticamente ao navegar.
 * Apenas limpa quando solicitado manualmente.
 */
@Injectable({
  providedIn: 'root'
})
export class OptimizationManagerService {
  private geminiService = inject(GeminiService);
  private charService = inject(CharacterService);
  private vnService = inject(VnService);
  private wnService = inject(WebNovelService);
  private toast = inject(ToastService);

  constructor() {
    // Monitoramento automático removido para permitir persistência de estado (pausa).
  }

  /**
   * LIMPEZA MANUAL
   * Acionado pelo botão no Perfil.
   * Reseta caches e libera RAM forçadamente.
   */
  public manualCleanup() {
    // 1. Limpa sessões de IA (Chats)
    this.geminiService.clearAllSessions();

    // 2. Limpa dados pesados de serviços de conteúdo
    this.charService.releaseActiveMemory();
    this.vnService.releaseMemory();
    this.wnService.releaseMemory();

    // 3. Força Garbage Collection do navegador (sugestão)
    if (window.gc) {
      try { window.gc(); } catch(e) {}
    }

    this.toast.show("Memória otimizada! Cache limpo com sucesso.", "success");
  }
}

// Declaração global para typescript aceitar window.gc (alguns browsers dev)
declare global {
  interface Window {
    gc?: () => void;
  }
}
