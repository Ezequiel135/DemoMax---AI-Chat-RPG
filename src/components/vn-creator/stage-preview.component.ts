
import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VnScene } from '../../models/vn.model';

@Component({
  selector: 'app-vn-stage-preview',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-black rounded-2xl border-4 border-slate-800 relative overflow-hidden shadow-2xl flex items-center justify-center aspect-video w-full h-full">
      @if (scene(); as s) {
         <!-- Background -->
         @if (s.backgroundUrl) {
            <img [src]="s.backgroundUrl" class="absolute inset-0 w-full h-full object-cover">
         } @else {
            <div class="absolute inset-0 flex items-center justify-center text-slate-600 font-bold bg-slate-900 flex-col gap-2">
               <div class="text-4xl opacity-20">🖼️</div>
               <div class="text-xs uppercase tracking-widest">Sem Fundo</div>
            </div>
         }

         <!-- Character -->
         @if (s.characterUrl) {
            <img [src]="s.characterUrl" 
                 class="absolute bottom-0 left-1/2 -translate-x-1/2 h-[80%] object-contain drop-shadow-2xl transition-all duration-500"
                 [class.grayscale]="s.characterEffect === 'none'"
                 [class.opacity-50]="s.characterEffect === 'fade-in'"
                 [class.translate-y-4]="s.characterEffect === 'slide-up'">
         }

         <!-- Dialogue Box -->
         <div class="absolute bottom-4 left-4 right-4 bg-slate-900/90 backdrop-blur-md border border-white/10 rounded-xl p-3 md:p-4 min-h-[80px]">
            <div class="text-pink-400 font-bold text-xs md:text-sm mb-1">{{ s.speakerName || '???' }}</div>
            <div class="text-white text-xs md:text-sm leading-relaxed line-clamp-3">{{ s.dialogue || '...' }}</div>
         </div>
         
         <!-- Meta Info -->
         <div class="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-[10px] text-white/50 border border-white/10 pointer-events-none">
           Preview
         </div>

      } @else {
         <div class="text-slate-500">Selecione uma cena</div>
      }
    </div>
  `
})
export class VnStagePreviewComponent {
  scene = input<VnScene | undefined>();
}
