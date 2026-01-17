
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { WebNovelService } from '../../services/web-novel.service';
import { WebNovel } from '../../models/web-novel.model';
import { HeaderComponent } from '../../components/header/header.component';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-web-novel-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header></app-header>
    
    <div class="min-h-screen pt-4 pb-20 max-w-6xl mx-auto px-4 page-enter">
      
      @if (novel(); as wn) {
        <div class="flex flex-col md:flex-row gap-6 h-full">
           
           <!-- META (Left) -->
           <div class="w-full md:w-72 flex flex-col gap-4 bg-slate-900/50 p-4 rounded-3xl border border-white/5 h-fit">
              <div class="aspect-[2/3] rounded-xl overflow-hidden border border-white/10 relative group cursor-pointer" (click)="uploadCover()">
                 <img [src]="wn.coverUrl" class="w-full h-full object-cover">
                 <div class="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-xs font-bold text-white">Mudar Capa</div>
              </div>
              <input type="file" id="coverUpload" class="hidden" accept="image/*" (change)="onCoverSelected($event)">

              <div class="space-y-1">
                 <label class="text-[10px] text-slate-500 font-bold uppercase">Título</label>
                 <input [(ngModel)]="wn.title" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm focus:border-emerald-500 outline-none">
              </div>

              <div class="space-y-1">
                 <label class="text-[10px] text-slate-500 font-bold uppercase">Sinopse</label>
                 <textarea [(ngModel)]="wn.description" rows="5" class="w-full bg-slate-950 border border-slate-700 rounded-xl p-3 text-white text-sm resize-none focus:border-emerald-500 outline-none"></textarea>
              </div>

              <button (click)="saveNovel()" class="w-full py-3 bg-emerald-600 hover:bg-emerald-500 rounded-xl text-white font-bold transition-colors shadow-lg">
                 Salvar Livro
              </button>
           </div>

           <!-- CHAPTERS (Right) -->
           <div class="flex-1 flex flex-col gap-4">
              <div class="flex justify-between items-center border-b border-white/10 pb-4">
                 <h2 class="text-white font-bold text-xl">Capítulos</h2>
                 <button (click)="addChapter()" class="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-emerald-400 text-xs font-bold border border-slate-700">+ Novo Capítulo</button>
              </div>

              <div class="flex-1 space-y-6">
                 @for (chap of wn.chapters; track chap.id; let idx = $index) {
                    <div class="bg-slate-900 border border-slate-700 rounded-3xl p-6 relative group">
                       
                       <div class="flex justify-between items-center mb-4">
                          <input [(ngModel)]="chap.title" class="bg-transparent text-white font-bold text-lg border-b border-transparent focus:border-emerald-500 outline-none w-full mr-4 placeholder-slate-600" placeholder="Título do Capítulo">
                          <button (click)="deleteChapter(idx)" class="text-slate-600 hover:text-red-500 transition-colors">🗑️</button>
                       </div>
                       
                       <!-- TEXT EDITOR WITH IMAGE INSERT -->
                       <div class="relative">
                          <textarea [id]="'area-'+idx" [(ngModel)]="chap.content" rows="12" class="w-full bg-black/30 border border-slate-800 rounded-2xl p-4 text-slate-300 text-base leading-relaxed resize-y focus:outline-none focus:border-emerald-500/50 font-serif" placeholder="Era uma vez..."></textarea>
                          
                          <!-- Toolbar -->
                          <div class="absolute bottom-4 right-4 flex gap-2">
                             <label class="cursor-pointer bg-slate-800 hover:bg-slate-700 text-white p-2 rounded-lg shadow-lg border border-slate-700 transition-colors" title="Inserir Imagem">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                <input type="file" class="hidden" accept="image/*" (change)="insertImage($event, idx)">
                             </label>
                          </div>
                       </div>
                       
                       <p class="text-[10px] text-slate-500 mt-2 ml-2">Dica: Use o botão de imagem para ilustrar o capítulo.</p>
                    </div>
                 }
              </div>
           </div>

        </div>
      }
    </div>
  `
})
export class WebNovelEditorComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  wnService = inject(WebNovelService);
  toast = inject(ToastService);

  novel = signal<WebNovel | undefined>(undefined);

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      const n = this.wnService.getNovelById(id);
      if (n) this.novel.set(JSON.parse(JSON.stringify(n)));
    }
  }

  saveNovel() {
    if (this.novel()) {
      this.wnService.saveNovel(this.novel()!);
      this.toast.show("Publicado com sucesso!", "success");
    }
  }

  addChapter() {
    this.novel()?.chapters.push({
      id: `ch_${Date.now()}`,
      title: `Capítulo ${this.novel()!.chapters.length + 1}`,
      content: '',
      publishedAt: Date.now()
    });
  }

  deleteChapter(idx: number) {
    if (confirm('Remover capítulo?')) this.novel()?.chapters.splice(idx, 1);
  }

  uploadCover() {
    document.getElementById('coverUpload')?.click();
  }

  onCoverSelected(e: Event) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (this.novel()) this.novel()!.coverUrl = ev.target?.result as string;
      };
      reader.readAsDataURL(file);
    }
  }

  insertImage(e: Event, chapterIndex: number) {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (ev) => {
      const base64 = ev.target?.result as string;
      const markdown = `\n![Imagem Ilustrativa](${base64})\n`;
      
      // Append to specific chapter content
      const n = this.novel();
      if (n && n.chapters[chapterIndex]) {
        n.chapters[chapterIndex].content += markdown;
        this.toast.show("Imagem inserida no texto!", "success");
      }
    };
    reader.readAsDataURL(file);
  }
}
