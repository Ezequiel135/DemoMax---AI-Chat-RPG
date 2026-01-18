
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VnService } from '../../services/vn.service';
import { VisualNovel, VnScene } from '../../models/vn.model';
import { HeaderComponent } from '../../components/header/header.component';
import { ToastService } from '../../services/toast.service';
import { ImageGenerationService } from '../../services/ai/image-generation.service';
import { EconomyService } from '../../services/economy.service';
import { VnSceneListComponent } from '../../components/vn-creator/scene-list.component';
import { VnStagePreviewComponent } from '../../components/vn-creator/stage-preview.component';
import { VnPropertyEditorComponent } from '../../components/vn-creator/property-editor.component';
import { createNewScene } from '../../logic/vn/scene-manager.logic';

@Component({
  selector: 'app-vn-creator',
  standalone: true,
  imports: [
    CommonModule, FormsModule, HeaderComponent,
    VnSceneListComponent, VnStagePreviewComponent, VnPropertyEditorComponent
  ],
  templateUrl: './vn-creator.component.html'
})
export class VnCreatorComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  vnService = inject(VnService);
  toast = inject(ToastService);
  imageGen = inject(ImageGenerationService);
  economy = inject(EconomyService);

  novel = signal<VisualNovel | undefined>(undefined);
  selectedSceneId = signal<string | null>(null);
  
  isGeneratingCover = signal(false);

  // Computed helpers
  scenes = computed(() => this.novel()?.scenes || []);
  activeScene = computed(() => this.scenes().find(s => s.id === this.selectedSceneId()));

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      // Must use a promise/async friendly approach or ensure service init
      this.vnService.initializeData().then(() => {
         const vn = this.vnService.getNovelById(id);
         if (vn && this.vnService.canEdit(vn)) {
           // Deep copy to allow editing without affecting signal prematurely
           this.novel.set(JSON.parse(JSON.stringify(vn)));
           this.selectedSceneId.set(vn.startSceneId);
         } else {
           this.router.navigate(['/vn']);
         }
      });
    }
  }

  async save() {
    if (this.novel()) {
      await this.vnService.saveNovel(this.novel()!);
      this.toast.show("Visual Novel salva no banco de dados!", "success");
    }
  }

  async generateAiCover() {
    const n = this.novel();
    if (!n) return;
    
    if (!n.title) {
        this.toast.show("Defina um título primeiro.", "error");
        return;
    }

    if (!this.economy.spendCoins(50)) {
        this.toast.show("Moedas insuficientes (50 SC).", "error");
        return;
    }

    this.isGeneratingCover.set(true);
    this.toast.show("Gerando capa...", "info");

    try {
        const url = await this.imageGen.generateVisualNovelCover(n.title, n.description || "Anime visual novel cover", 'anime_moe');
        if (url) {
            this.novel.update(curr => curr ? { ...curr, coverUrl: url } : undefined);
            this.toast.show("Capa gerada!", "success");
        } else {
            this.economy.earnCoins(50);
            this.toast.show("Erro na geração.", "error");
        }
    } catch(e) {
        this.economy.earnCoins(50);
        this.toast.show("Erro.", "error");
    } finally {
        this.isGeneratingCover.set(false);
    }
  }

  addScene() {
    const n = this.novel();
    if (!n) return;
    
    const newScene = createNewScene(n.scenes, this.selectedSceneId() || undefined);
    
    this.novel.update(curr => curr ? { ...curr, scenes: [...curr.scenes, newScene] } : undefined);
    this.selectedSceneId.set(newScene.id);
  }

  deleteScene(id: string) {
    if (confirm("Apagar cena?")) {
      this.novel.update(curr => {
        if (!curr) return curr;
        return { ...curr, scenes: curr.scenes.filter(s => s.id !== id) };
      });
      // Fallback selection
      if (this.selectedSceneId() === id) {
        this.selectedSceneId.set(this.novel()?.scenes[0]?.id || null);
      }
    }
  }

  updateStartScene(id: string) {
    this.novel.update(curr => curr ? { ...curr, startSceneId: id } : undefined);
  }

  handleImageUpload(event: {file: File, type: 'bg'|'char'}) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const res = e.target?.result as string;
      const sid = this.selectedSceneId();
      
      this.novel.update(n => {
        if (!n) return n;
        return {
          ...n,
          scenes: n.scenes.map(s => s.id === sid ? {
            ...s,
            backgroundUrl: event.type === 'bg' ? res : s.backgroundUrl,
            characterUrl: event.type === 'char' ? res : s.characterUrl
          } : s)
        };
      });
    };
    reader.readAsDataURL(event.file);
  }

  addChoice() {
    const sid = this.selectedSceneId();
    this.novel.update(n => {
      if(!n) return n;
      return {
        ...n,
        scenes: n.scenes.map(s => s.id === sid ? {
          ...s,
          choices: [...s.choices, { text: 'Nova Escolha', nextSceneId: '' }]
        } : s)
      };
    });
  }

  removeChoice(index: number) {
    const sid = this.selectedSceneId();
    this.novel.update(n => {
      if(!n) return n;
      return {
        ...n,
        scenes: n.scenes.map(s => s.id === sid ? {
          ...s,
          choices: s.choices.filter((_, i) => i !== index)
        } : s)
      };
    });
  }

  triggerUpdate() {
    this.novel.update(n => n ? ({...n}) : undefined);
  }
}
