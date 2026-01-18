
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WebNovelService } from '../../services/web-novel.service';
import { WebNovel } from '../../models/web-novel.model';
import { HeaderComponent } from '../../components/header/header.component';
import { ToastService } from '../../services/toast.service';
import { ImageGenerationService } from '../../services/ai/image-generation.service';
import { AiContentService } from '../../services/ai/ai-content.service';
import { EconomyService } from '../../services/economy.service';

@Component({
  selector: 'app-web-novel-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  templateUrl: './web-novel-editor.component.html'
})
export class WebNovelEditorComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  wnService = inject(WebNovelService);
  toast = inject(ToastService);
  imageGen = inject(ImageGenerationService);
  aiContent = inject(AiContentService);
  economy = inject(EconomyService);

  novel = signal<WebNovel | undefined>(undefined);
  isGeneratingCover = signal(false);
  isSaving = signal(false);
  isNSFW = signal(false);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.wnService.initializeData().then(() => {
         const n = this.wnService.getNovelById(id);
         if (n) {
           this.novel.set(JSON.parse(JSON.stringify(n)));
           this.isNSFW.set(n.tags.includes('18+') || n.tags.includes('NSFW'));
         }
      });
    }
  }

  async saveNovel() {
    const n = this.novel();
    if (!n) return;

    this.isSaving.set(true);
    this.toast.show("Salvando conteúdo...", "info");

    try {
      // Update Tags
      let currentTags = n.tags.filter(t => t !== '18+' && t !== 'NSFW');
      if (this.isNSFW()) {
        currentTags.push('18+');
      }
      n.tags = currentTags;

      // Auto-Sanitization (Optional - simplified for now to ensure saving works first)
      if (!this.isNSFW()) {
         // Placeholder for heavy AI sanitization logic
      }

      // Real Save
      await this.wnService.saveNovel(n);
      this.toast.show("Publicado com sucesso!", "success");
      
    } catch (e) {
      this.toast.show("Erro ao salvar.", "error");
    } finally {
      this.isSaving.set(false);
    }
  }

  addChapter() {
    this.novel.update(n => {
      if (!n) return n;
      return {
        ...n,
        chapters: [
          ...n.chapters,
          {
            id: `ch_${Date.now()}`,
            title: `Capítulo ${n.chapters.length + 1}`,
            content: '',
            publishedAt: Date.now()
          }
        ]
      };
    });
    this.toast.show("Novo capítulo adicionado.", "info");
  }

  deleteChapter(idx: number) {
    if (confirm('Remover capítulo?')) {
      this.novel.update(n => {
        if (!n) return n;
        const newChapters = [...n.chapters];
        newChapters.splice(idx, 1);
        return { ...n, chapters: newChapters };
      });
    }
  }

  uploadCover() {
    document.getElementById('coverUpload')?.click();
  }

  onCoverSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        this.novel.update(n => n ? { ...n, coverUrl: ev.target?.result as string } : undefined);
      };
      reader.readAsDataURL(file);
    }
  }

  async generateAiCover() {
    const n = this.novel();
    if (!n) return;
    if (!n.title || !n.description) {
      this.toast.show("Preencha Título e Sinopse primeiro.", "error");
      return;
    }

    if (!this.economy.spendCoins(50)) {
      this.toast.show("Moedas insuficientes (Custo: 50).", "error");
      return;
    }

    this.isGeneratingCover.set(true);
    this.toast.show("IA trabalhando na capa...", "info");

    try {
      const url = await this.imageGen.generateWebNovelCover(n.title, n.description, 'anime_moe');
      if (url) {
        this.novel.update(curr => curr ? { ...curr, coverUrl: url } : undefined);
        this.toast.show("Capa gerada com sucesso!", "success");
      } else {
        this.economy.earnCoins(50);
        this.toast.show("Falha na geração.", "error");
      }
    } catch (e) {
      this.economy.earnCoins(50);
      this.toast.show("Erro na conexão.", "error");
    } finally {
      this.isGeneratingCover.set(false);
    }
  }

  insertImage(e: Event, chapterIndex: number) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      const markdown = `\n![Imagem Ilustrativa](${base64})\n`;
      this.novel.update(n => {
        if (!n) return n;
        const chapters = [...n.chapters];
        chapters[chapterIndex] = { ...chapters[chapterIndex], content: chapters[chapterIndex].content + markdown };
        return { ...n, chapters };
      });
      this.toast.show("Imagem inserida no texto!", "success");
    };
    reader.readAsDataURL(file);
  }
}
