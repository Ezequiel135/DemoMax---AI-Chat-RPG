
import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatSettingsService } from '../../../services/chat-settings.service';
import { CHAT_WALLPAPERS } from '../../../data/chat-wallpapers.data';
import { CHAT_DECORATIONS } from '../../../data/chat-decorations.data';
import { AuthService } from '../../../services/auth.service';

type SettingsTab = 'background' | 'decoration' | 'voice' | 'persona';

@Component({
  selector: 'app-chat-settings-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/80 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-[#121212] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative flex flex-col h-[85vh] sm:h-auto sm:max-h-[85vh]" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="p-4 border-b border-white/5 flex justify-between items-center">
           <h3 class="font-bold text-white text-lg">Configurações de Bate-papo</h3>
           <button (click)="close.emit()" class="text-slate-400 hover:text-white p-2">✕</button>
        </div>

        <!-- Scrollable Content -->
        <div class="flex-1 overflow-y-auto custom-scroll">
           
           <!-- PERSONA SECTION -->
           <div class="p-4 border-b border-white/5 hover:bg-white/5 transition-colors cursor-pointer group">
              <div class="flex justify-between items-center mb-1">
                 <span class="text-slate-300 text-sm">Minha Persona</span>
                 <div class="flex items-center gap-2 text-slate-500 group-hover:text-white transition-colors">
                    <span class="text-xs">{{ settings.currentSettings().personaName || auth.currentUser()?.username }}</span>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" /></svg>
                 </div>
              </div>
           </div>

           <!-- WALLPAPER SECTION -->
           <div class="p-4 border-b border-white/5">
              <div class="flex items-center gap-2 mb-3">
                 <span class="text-slate-300 font-bold text-sm">Fundo</span>
                 <span class="text-[10px] bg-purple-500/20 text-purple-300 px-1.5 rounded">Visual</span>
              </div>
              
              <div class="grid grid-cols-3 gap-3">
                 @for (wp of wallpapers; track wp.id) {
                    <button (click)="selectWallpaper(wp.id)" 
                            class="aspect-[2/3] rounded-xl border-2 transition-all relative overflow-hidden group"
                            [class.border-pink-500]="settings.currentSettings().wallpaperId === wp.id"
                            [class.border-transparent]="settings.currentSettings().wallpaperId !== wp.id">
                       
                       <!-- Preview -->
                       <div class="absolute inset-0" 
                            [style.background]="wp.value"
                            [style.background-size]="'cover'"></div>
                       
                       <!-- Icon if default -->
                       @if (wp.id === 'default') {
                          <div class="absolute inset-0 flex items-center justify-center bg-slate-800 text-slate-500">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" /></svg>
                          </div>
                       }

                       <!-- Label -->
                       <div class="absolute bottom-0 left-0 right-0 bg-black/60 p-1 text-center">
                          <span class="text-[9px] text-white font-bold">{{ wp.name }}</span>
                       </div>

                       <!-- Checkmark -->
                       @if (settings.currentSettings().wallpaperId === wp.id) {
                          <div class="absolute top-1 right-1 w-5 h-5 bg-pink-500 rounded-full flex items-center justify-center shadow">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                          </div>
                       }
                    </button>
                 }
              </div>
           </div>

           <!-- DECORATION SECTION -->
           <div class="p-4 border-b border-white/5">
              <div class="flex items-center gap-2 mb-3">
                 <span class="text-slate-300 font-bold text-sm">Decoração</span>
                 <span class="text-[10px] bg-blue-500/20 text-blue-300 px-1.5 rounded">Bolhas</span>
              </div>

              <div class="grid grid-cols-3 gap-3">
                 @for (deco of decorations; track deco.id) {
                    <button (click)="selectDecoration(deco.id)" 
                            class="aspect-square rounded-xl border-2 transition-all relative overflow-hidden bg-slate-900 flex items-center justify-center p-2"
                            [class.border-pink-500]="settings.currentSettings().decorationId === deco.id"
                            [class.border-slate-800]="settings.currentSettings().decorationId !== deco.id">
                       
                       <div class="w-full h-8 rounded-lg" [style.background-color]="deco.previewColor"></div>
                       
                       <div class="absolute bottom-2 text-[10px] text-slate-400 font-bold">{{ deco.name }}</div>

                       @if (settings.currentSettings().decorationId === deco.id) {
                          <div class="absolute top-1 right-1 w-4 h-4 bg-pink-500 rounded-full flex items-center justify-center shadow">
                             <svg xmlns="http://www.w3.org/2000/svg" class="h-2 w-2 text-white" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                          </div>
                       }
                    </button>
                 }
              </div>
           </div>

           <!-- VOICE SECTION -->
           <div class="p-4 flex justify-between items-center">
              <div>
                 <div class="text-slate-300 font-bold text-sm">Voz Automática</div>
                 <div class="text-xs text-slate-500">Ler mensagens em voz alta (Todo app)</div>
              </div>
              <label class="relative inline-flex items-center cursor-pointer">
                 <input type="checkbox" [checked]="settings.currentSettings().autoVoice" (change)="toggleVoice()" class="sr-only peer">
                 <div class="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-purple-600"></div>
              </label>
           </div>

        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class ChatSettingsModalComponent {
  characterId = input.required<string>();
  close = output();
  
  settings = inject(ChatSettingsService);
  auth = inject(AuthService);

  wallpapers = CHAT_WALLPAPERS;
  decorations = CHAT_DECORATIONS;

  selectWallpaper(id: string) {
    this.settings.updateSetting(this.characterId(), 'wallpaperId', id);
  }

  selectDecoration(id: string) {
    this.settings.updateSetting(this.characterId(), 'decorationId', id);
  }

  toggleVoice() {
    const current = this.settings.currentSettings().autoVoice;
    this.settings.updateSetting(this.characterId(), 'autoVoice', !current);
  }
}
