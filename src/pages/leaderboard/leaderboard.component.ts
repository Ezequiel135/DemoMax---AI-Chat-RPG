
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LeaderboardService } from '../../services/leaderboard.service';
import { HeaderComponent } from '../../components/header/header.component';
import { CharacterCardComponent } from '../../components/character-card/character-card.component';
import { RouterLink } from '@angular/router';
import { CharacterService } from '../../services/character.service';
import { VnService } from '../../services/vn.service';
import { WebNovelService } from '../../services/web-novel.service';

@Component({
  selector: 'app-leaderboard',
  standalone: true,
  imports: [CommonModule, HeaderComponent, CharacterCardComponent, RouterLink],
  templateUrl: './leaderboard.component.html' // Mantém o HTML original (ele está correto)
})
export class LeaderboardComponent {
  leaderboard = inject(LeaderboardService);
  
  // Injeta os serviços de dados para garantir que eles inicializem se o usuário entrar direto aqui
  private charService = inject(CharacterService);
  private vnService = inject(VnService);
  private wnService = inject(WebNovelService);

  activeTab = signal<'chars' | 'novels' | 'webnovels' | 'creators'>('chars');
  creatorSubTab = signal<'all' | 'char' | 'vn' | 'wn'>('all');

  constructor() {
    // Force init
    this.charService.initializeData();
    this.vnService.initializeData();
    this.wnService.initializeData();
  }

  displayCreators = computed(() => {
    switch (this.creatorSubTab()) {
      case 'char': return this.leaderboard.topCharCreators();
      case 'vn': return this.leaderboard.topVnCreators();
      case 'wn': return this.leaderboard.topWnAuthors();
      case 'all': default: return this.leaderboard.topOverallCreators();
    }
  });

  getProfileUrl(creatorName: string): any[] {
    const username = creatorName.replace(/^@/, '');
    return ['/u', username];
  }
}
