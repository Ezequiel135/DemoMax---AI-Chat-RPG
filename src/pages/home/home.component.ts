
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { VnService } from '../../services/vn.service';
import { WebNovelService } from '../../services/web-novel.service';
import { ActivityService } from '../../services/activity.service';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { HeaderComponent } from '../../components/header/header.component';

type Category = 'for_you' | 'recent' | 'famous' | 'characters' | 'visual_novel' | 'web_novel';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, CharacterCardComponent, HeaderComponent],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  charService = inject(CharacterService);
  vnService = inject(VnService);
  wnService = inject(WebNovelService);
  activityService = inject(ActivityService);
  router = inject(Router);

  activeCategory = signal<Category>('for_you');
  searchQuery = signal('');

  constructor() {
    // Ensure all data services are initialized
    this.charService.initializeData();
    this.vnService.initializeData();
    this.wnService.initializeData();
  }

  private normalize(item: any, type: 'char' | 'novel' | 'web_novel') {
    return { type, data: item, date: item.createdAt || 0, score: (item.likes || item.favoriteCount || 0) };
  }

  feed = computed(() => {
    const category = this.activeCategory();
    
    // Direct signal access guarantees reactivity
    const chars = this.charService.recommended().map(c => this.normalize(c, 'char'));
    const vns = this.vnService.novels().map(n => this.normalize(n, 'novel'));
    const wns = this.wnService.novels().map(n => this.normalize(n, 'web_novel'));

    let allItems = [...chars, ...vns, ...wns];

    switch (category) {
      case 'recent':
        return allItems.sort((a, b) => b.date - a.date);
      
      case 'famous':
        return allItems.sort((a, b) => {
           const scoreA = typeof a.score === 'string' ? parseFloat(a.score) * 1000 : a.score;
           const scoreB = typeof b.score === 'string' ? parseFloat(b.score) * 1000 : b.score;
           return scoreB - scoreA;
        });

      case 'characters':
        return chars;

      case 'visual_novel':
        return vns;

      case 'web_novel':
        return wns;

      case 'for_you':
      default:
        // Simple shuffle for now, can be sophisticated later
        return allItems.sort(() => Math.random() - 0.5);
    }
  });

  searchResults = computed(() => {
    const q = this.searchQuery().toLowerCase();
    if (!q) return [];
    
    const chars = this.charService.search(q).map(c => this.normalize(c, 'char'));
    const vns = this.vnService.novels().filter(n => n.title.toLowerCase().includes(q)).map(n => this.normalize(n, 'novel'));
    const wns = this.wnService.novels().filter(n => n.title.toLowerCase().includes(q)).map(n => this.normalize(n, 'web_novel'));
    
    return [...chars, ...vns, ...wns];
  });

  setCategory(cat: Category) {
    this.activeCategory.set(cat);
  }

  navigateToItem(item: any) {
    if (item.type === 'chat') { 
      this.router.navigate(['/chat', item.id]);
    } else if (item.type === 'novel') { 
      this.router.navigate(['/vn/play', item.id]);
    } else if (item.type === 'web_novel') {
      this.router.navigate(['/novel/read', item.id]);
    }
  }
}
