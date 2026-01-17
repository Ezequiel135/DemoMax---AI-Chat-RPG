
import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EconomyService } from '../../services/economy.service';

@Component({
  selector: 'app-chat-modes-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-slide-up" (click)="$event.stopPropagation()">
        
        <div class="p-4 border-b border-slate-800 text-center">
           <h3 class="font-bold text-pink-400 text-lg">Modo de Chat</h3>
        </div>

        <div class="p-4 space-y-3">
           
           <!-- PRO -->
           <div class="p-4 rounded-xl border border-pink-500/50 bg-pink-900/10 relative overflow-hidden group cursor-pointer hover:bg-pink-900/20 transition-colors">
              <div class="flex justify-between items-start mb-1">
                 <div class="flex items-center gap-2">
                    <span class="text-yellow-400">☀️</span>
                    <span class="font-bold text-white">Pro</span>
                 </div>
                 <div class="text-white font-bold text-sm">20 💗</div>
              </div>
              <p class="text-xs text-slate-400">Melhor escolha, personagens e enredo melhores.</p>
           </div>

           <!-- PRIME -->
           <div class="p-4 rounded-xl border border-slate-700 bg-slate-800/50 cursor-pointer hover:border-yellow-500/50 transition-colors">
              <div class="flex justify-between items-start mb-1">
                 <div class="flex items-center gap-2">
                    <span class="text-yellow-400">👑</span>
                    <span class="font-bold text-white">Prime</span>
                 </div>
                 <div class="text-white font-bold text-sm">20 💗</div>
              </div>
              <p class="text-xs text-slate-400">Histórias mais ricas, emoções mais profundas.</p>
           </div>

           <!-- FLASH -->
           <div class="p-4 rounded-xl border border-slate-700 bg-slate-800/50 cursor-pointer hover:border-blue-500/50 transition-colors">
              <div class="flex justify-between items-start mb-1">
                 <div class="flex items-center gap-2">
                    <span class="text-blue-400">🌟</span>
                    <span class="font-bold text-white">Flash</span>
                 </div>
                 <div class="text-white font-bold text-sm">5 💗</div>
              </div>
              <p class="text-xs text-slate-400">Textos mais detalhados, respostas mais longas.</p>
           </div>

           <!-- LITE -->
           <div class="p-4 rounded-xl border border-slate-700 bg-slate-800/50 cursor-pointer hover:border-green-500/50 transition-colors">
              <div class="flex justify-between items-start mb-1">
                 <div class="flex items-center gap-2">
                    <span class="text-green-400">✨</span>
                    <span class="font-bold text-white">Lite</span>
                 </div>
                 <div class="text-white font-bold text-sm">2 💗</div>
              </div>
              <p class="text-xs text-slate-400">Conversas leves, respostas rápidas.</p>
           </div>

           <div class="text-right pt-2 text-xs text-pink-300 font-bold">
              Meus Corações: {{ economy.sakuraCoins() }} 💗
           </div>
           
           <button (click)="close.emit()" class="w-full py-3 bg-pink-500 hover:bg-pink-600 text-white font-bold rounded-xl transition-colors">
              Começar a conversar
           </button>

        </div>

      </div>
    </div>
  `
})
export class ChatModesModalComponent {
  economy = inject(EconomyService);
  close = output();
}
