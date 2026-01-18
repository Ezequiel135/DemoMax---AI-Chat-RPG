
import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EconomyService } from '../../../services/economy.service';
import { PersonaService } from '../../../services/persona.service';

@Component({
  selector: 'app-chat-main-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-[#18181b] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-slide-up" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="p-4 text-center border-b border-white/5">
           <h3 class="font-bold text-white text-lg">Configurações do Chat</h3>
        </div>

        <div class="p-2 space-y-1">
           
           <!-- Ver Personagem -->
           <button (click)="action.emit('profile')" class="w-full p-4 flex justify-between items-center hover:bg-white/5 rounded-xl transition-colors group">
              <span class="text-white font-medium">Ver Personagem</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500 group-hover:text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
           </button>

           <!-- Personagem (Persona) -->
           <button (click)="action.emit('persona')" class="w-full p-4 flex justify-between items-center hover:bg-white/5 rounded-xl transition-colors group">
              <div class="text-left">
                 <div class="text-white font-medium">Sua Identidade (Persona)</div>
                 <div class="text-xs text-slate-500">{{ currentPersonaName() }}</div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500 group-hover:text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
           </button>

           <!-- Modo de Chat -->
           <button (click)="action.emit('modes')" class="w-full p-4 flex justify-between items-center hover:bg-white/5 rounded-xl transition-colors group">
              <div class="text-left">
                 <div class="text-white font-medium">Modo de Chat</div>
                 <div class="text-xs text-yellow-500 font-bold flex items-center gap-1">
                    <span>🌟</span> Flash
                 </div>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500 group-hover:text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
           </button>

           <!-- Visual Settings (Background/Deco) -->
           <button (click)="action.emit('visuals')" class="w-full p-4 flex justify-between items-center hover:bg-white/5 rounded-xl transition-colors group">
              <span class="text-white font-medium">Fundo & Decoração</span>
              <span class="text-purple-400 text-xs">👑</span>
           </button>

           <!-- Actions -->
           <button (click)="action.emit('new_chat')" class="w-full p-4 flex justify-between items-center hover:bg-white/5 rounded-xl transition-colors group text-left">
              <span class="text-white font-medium">Iniciar Novo Chat</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
           </button>

           <button (click)="action.emit('reset')" class="w-full p-4 flex justify-between items-center hover:bg-white/5 rounded-xl transition-colors group text-left">
              <span class="text-white font-medium">Reiniciar Chat</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-slate-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clip-rule="evenodd" /></svg>
           </button>

        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
  `]
})
export class ChatMainMenuComponent {
  close = output();
  action = output<string>();
  
  personaService = inject(PersonaService);

  currentPersonaName() {
    // FIX: Using signal property correctly
    const p = this.personaService.activePersona();
    return p ? p.name : 'Perfil Original';
  }
}
