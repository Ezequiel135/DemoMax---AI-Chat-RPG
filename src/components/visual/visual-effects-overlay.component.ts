
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualEffectsService } from '../../services/visual-effects.service';

@Component({
  selector: 'app-visual-effects-overlay',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 pointer-events-none z-[100] overflow-hidden">
      @for (p of effects.particles(); track p.id) {
        <div class="absolute rounded-full"
             [style.left.px]="p.x"
             [style.top.px]="p.y"
             [style.width.px]="p.size"
             [style.height.px]="p.size"
             [style.backgroundColor]="p.color"
             [style.opacity]="p.life"
             [style.transform]="'scale(' + p.life + ')'">
        </div>
      }
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class VisualEffectsOverlayComponent {
  effects = inject(VisualEffectsService);
}
