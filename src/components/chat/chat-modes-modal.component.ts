
import { Component, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EconomyService } from '../../services/economy.service';
import { ChatSettingsService, ChatMode } from '../../services/chat-settings.service';
import { CharacterService } from '../../services/character.service'; // Para saber qual char está ativo (via service ou input, aqui usaremos input no futuro, mas por enquanto pegamos do settings service que mantem estado)
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-chat-modes-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative animate-slide-up" (click)="$event.stopPropagation()">
        
        <div class="p-4 border-b border-slate-800 text-center">
           <h3 class="font-bold text-pink-400 text-lg">Modo de Chat</h3>
           <p class="text-xs text-slate-500">Escolha a inteligência da IA</p>
        </div>

        <div class="p-4 space-y-3">
           
           <!-- PRO -->
           <div (click)="selectMode('pro')" 
                class="p-4 rounded-xl border relative overflow-hidden group cursor-pointer transition-all"
                [class.border-yellow-500]="currentMode() === 'pro'"
                [class.bg-yellow-900_20]="currentMode() === 'pro'"
                [class.border-slate-700]="currentMode() !== 'pro'"
                [class.bg-slate-800_50]="currentMode() !== 'pro'">
              
              <div class="flex justify-between items-start mb-1">
                 <div class="flex items-center gap-2">
                    <span class="text-yellow-400 text-xl">☀️</span>
                    <span class="font-bold text-white">Pro</span>
                 </div>
                 @if(currentMode() === 'pro') {
                    <span class="text-xs bg-yellow-500 text-black font-bold px-2 py-0.5 rounded-full">ATIVO</span>
                 }
              </div>
              <p class="text-xs text-slate-400">Melhor escolha. Raciocínio lógico complexo e memória aprimorada.</p>
           </div>

           <!-- PRIME -->
           <div (click)="selectMode('prime')" 
                class="p-4 rounded-xl border cursor-pointer transition-all"
                [class.border-purple-500]="currentMode() === 'prime'"
                [class.bg-purple-900_20]="currentMode() === 'prime'"
                [class.border-slate-700]="currentMode() !== 'prime'"
                [class.bg-slate-800_50]="currentMode() !== 'prime'">
                
              <div class="flex justify-between items-start mb-1">
                 <div class="flex items-center gap-2">
                    <span class="text-purple-400 text-xl">👑</span>
                    <span class="font-bold text-white">Prime</span>
                 </div>
                 @if(currentMode() === 'prime') {
                    <span class="text-xs bg-purple-500 text-white font-bold px-2 py-0.5 rounded-full">ATIVO</span>
                 }
              </div>
              <p class="text-xs text-slate-400">Histórias mais ricas, criatividade alta e emoções profundas.</p>
           </div>

           <!-- FLASH -->
           <div (click)="selectMode('flash')" 
                class="p-4 rounded-xl border cursor-pointer transition-all"
                [class.border-blue-500]="currentMode() === 'flash'"
                [class.bg-blue-900_20]="currentMode() === 'flash'"
                [class.border-slate-700]="currentMode() !== 'flash'"
                [class.bg-slate-800_50]="currentMode() !== 'flash'">
                
              <div class="flex justify-between items-start mb-1">
                 <div class="flex items-center gap-2">
                    <span class="text-blue-400 text-xl">🌟</span>
                    <span class="font-bold text-white">Flash</span>
                 </div>
                 @if(currentMode() === 'flash') {
                    <span class="text-xs bg-blue-500 text-white font-bold px-2 py-0.5 rounded-full">ATIVO</span>
                 }
              </div>
              <p class="text-xs text-slate-400">Padrão. Respostas rápidas e equilibradas.</p>
           </div>

           <div class="text-right pt-2 text-xs text-slate-500 font-bold">
              Alterar o modo reinicia o contexto imediato da IA.
           </div>
           
           <button (click)="close.emit()" class="w-full py-3 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl transition-colors mt-2">
              Voltar
           </button>

        </div>

      </div>
    </div>
  `
})
export class ChatModesModalComponent {
  economy = inject(EconomyService);
  settings = inject(ChatSettingsService);
  route = inject(ActivatedRoute);
  
  close = output();

  // Helper to get active character ID from URL since modal is inside ChatComponent context usually
  // But purely relying on Settings Service state is safer as ChatComponent loads it.
  currentMode() {
    return this.settings.currentSettings().chatMode;
  }

  selectMode(mode: ChatMode) {
    // Need character ID to save setting. 
    // We assume ChatSettingsService.currentSettings is already loaded for the correct character 
    // because ChatComponent calls loadSettings(id) on init.
    // However, saveSettings requires an ID. 
    // We can parse it from URL or use a trick.
    
    // Better Approach: Update the signal in service, and let the service handle persistence logic 
    // IF we knew the ID. Since we are inside the modal which is inside ChatComponent, 
    // ChatComponent could pass the ID, but for now let's grab from URL to be robust.
    
    const urlParts = window.location.hash.split('/');
    const id = urlParts[urlParts.length - 1]; // /chat/:id
    
    if (id) {
       this.settings.updateSetting(id, 'chatMode', mode);
    }
    
    // Close modal
    this.close.emit();
  }
}
