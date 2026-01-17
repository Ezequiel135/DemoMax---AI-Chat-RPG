
import { Component, inject, signal, computed, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { VnService } from '../../services/vn.service';
import { VisualNovel, VnScene } from '../../models/vn.model';
import { HeaderComponent } from '../../components/header/header.component';
import { ToastService } from '../../services/toast.service';
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

  novel = signal<VisualNovel | undefined>(undefined);
  selectedSceneId = signal<string | null>(null);
  
  // Computed helpers
  scenes = computed(() => this.novel()?.scenes || []);
  activeScene = computed(() => this.scenes().find(s => s.id === this.selectedSceneId()));

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const vn = this.vnService.getNovelById(id);
      if (vn && this.vnService.canEdit(vn)) {
        // Deep copy
        this.novel.set(JSON.parse(JSON.stringify(vn)));
        this.selectedSceneId.set(vn.startSceneId);
      } else {
        this.router.navigate(['/vn']);
      }
    }
  }

  save() {
    if (this.novel()) {
      this.vnService.saveNovel(this.novel()!);
      this.toast.show("Salvo com sucesso!", "success");
    }
  }

  // --- Actions delegates ---

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
    // Helper to trigger signal update if needed manually, though object mutation usually caught if reference changes
    this.novel.update(n => n ? ({...n}) : undefined);
  }
}
