
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { WebNovelService } from '../../services/web-novel.service';
import { WebNovel } from '../../models/web-novel.model';
import { parseNovelContent } from '../../logic/web-novel/chapter-utils.logic';

@Component({
  selector: 'app-web-novel-reader',
  imports: [CommonModule],
  template: `
    <div class="min-h-screen bg-[#111] text-slate-300 font-serif leading-relaxed page-enter">
      <div class="fixed top-0 left-0 right-0 h-14 bg-[#111]/90 backdrop-blur border-b border-white/10 flex items-center px-4 justify-between z-50">
         <button (click)="goBack()" class="text-slate-400 hover:text-white">← Voltar</button>
         <h1 class="text-sm font-bold text-white truncate max-w-[200px]">{{ novel()?.title }}</h1>
         <div class="w-8"></div>
      </div>

      <div class="pt-20 pb-24 max-w-2xl mx-auto px-6">
         @if (novel(); as n) {
            @if (currentChapter(); as chap) {
               <div class="mb-8 text-center">
                  <h2 class="text-2xl font-bold text-white mb-2">{{ chap.title }}</h2>
                  <p class="text-xs text-slate-500">{{ chap.publishedAt | date:'shortDate' }}</p>
               </div>

               <!-- Rendered Content with Images -->
               <div class="text-lg text-justify text-slate-200" [innerHTML]="parsedContent()"></div>

               <div class="flex justify-between items-center mt-12 pt-8 border-t border-white/10">
                  <button (click)="prevChapter()" [disabled]="currentChapterIndex() === 0" class="px-4 py-2 border border-slate-700 rounded-lg text-slate-400 hover:text-white disabled:opacity-30">Anterior</button>
                  <span class="text-xs text-slate-500">{{ currentChapterIndex() + 1 }} / {{ n.chapters.length }}</span>
                  <button (click)="nextChapter()" [disabled]="currentChapterIndex() >= n.chapters.length - 1" class="px-4 py-2 bg-emerald-700 hover:bg-emerald-600 rounded-lg text-white font-bold disabled:opacity-30">Próximo</button>
               </div>
            }
         }
      </div>
    </div>
  `
})
export class WebNovelReaderComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  wnService = inject(WebNovelService);

  novel = signal<WebNovel | undefined>(undefined);
  currentChapterIndex = signal(0);

  currentChapter = computed(() => this.novel()?.chapters[this.currentChapterIndex()]);
  parsedContent = computed(() => parseNovelContent(this.currentChapter()?.content || ''));

  constructor() {
    const id = this.route.snapshot.paramMap.get('id');
    const n = this.wnService.getNovelById(id!);
    if (n) this.novel.set(n); else this.router.navigate(['/']);
  }

  goBack() { this.router.navigate(['/home']); }
  nextChapter() { if (this.currentChapterIndex() < (this.novel()?.chapters.length || 0) - 1) { this.currentChapterIndex.update(i => i + 1); window.scrollTo(0, 0); } }
  prevChapter() { if (this.currentChapterIndex() > 0) { this.currentChapterIndex.update(i => i - 1); window.scrollTo(0, 0); } }
}
