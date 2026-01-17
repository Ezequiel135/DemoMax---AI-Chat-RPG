
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { Character } from '../../models/character.model';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-character-card',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './character-card.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CharacterCardComponent {
  character = input.required<Character>();
  rank = input<number | undefined>(undefined);

  getRarityColor(rarity: string): string {
    switch (rarity) {
      case 'Legendary': return 'text-yellow-400 border-yellow-500/50 bg-yellow-500/10';
      case 'Rare': return 'text-purple-400 border-purple-500/50 bg-purple-500/10';
      default: return 'text-slate-400 border-slate-500/50 bg-slate-500/10';
    }
  }

  getRankClass(): string {
    if (!this.rank()) return 'border-white/5';
    
    switch (this.rank()) {
      case 1: return 'border-yellow-400 shadow-[0_0_30px_rgba(250,204,21,0.4)] bg-yellow-400/5 from-yellow-900/50 to-slate-900';
      case 2: return 'border-slate-300 shadow-[0_0_25px_rgba(203,213,225,0.3)] bg-slate-300/5 from-slate-700/50 to-slate-900';
      case 3: return 'border-orange-400 shadow-[0_0_25px_rgba(251,146,60,0.3)] bg-orange-400/5 from-orange-900/50 to-slate-900';
      default: return 'border-slate-700/50';
    }
  }
}
