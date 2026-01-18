
import { Component, ElementRef, ViewChild, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TERMS_OF_SERVICE } from '../../data/terms-of-service.data';

@Component({
  selector: 'app-tos-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
      <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg shadow-2xl flex flex-col max-h-[85vh] relative overflow-hidden">
        
        <!-- Header -->
        <div class="p-6 border-b border-slate-800 bg-slate-900 z-10">
          <h2 class="text-2xl font-bold text-white font-tech uppercase tracking-wide">Termos de Uso</h2>
          <p class="text-xs text-slate-400">Por favor, leia atentamente para continuar.</p>
        </div>

        <!-- Scrollable Content -->
        <div #scrollContainer 
             (scroll)="onScroll()"
             class="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-slate-300 leading-relaxed custom-scroll bg-[#0F0E17]">
          
          <div class="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded-xl mb-6">
             <p class="text-yellow-200 text-xs font-bold flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd" /></svg>
                Aviso Importante: Este aplicativo contém conteúdo adulto gerado por IA.
             </p>
          </div>

          @for (section of terms; track section.title) {
            <div class="space-y-2">
               <h3 class="font-bold text-white text-base">{{ section.title }}</h3>
               <p class="whitespace-pre-wrap text-justify opacity-90">{{ section.content }}</p>
            </div>
          }
          
          <div class="h-12"></div> <!-- Spacer -->
          <div class="text-center text-xs text-slate-600 italic border-t border-slate-800 pt-4">
             Fim do Documento • DemoMax Legal
          </div>
        </div>

        <!-- Footer Actions -->
        <div class="p-6 border-t border-slate-800 bg-slate-900 z-10 shadow-[0_-10px_40px_rgba(0,0,0,0.5)]">
           
           <!-- Progress Indicator (if not scrolled) -->
           @if (!hasScrolledToBottom()) {
              <div class="absolute top-0 left-0 right-0 h-1 bg-slate-800">
                 <div class="h-full bg-pink-600 animate-pulse w-1/3 mx-auto rounded-full"></div>
              </div>
              <p class="text-[10px] text-pink-500 text-center mb-3 animate-bounce">
                 Role até o final para aceitar ↓
              </p>
           }

           <div class="flex items-start gap-3 mb-4 p-3 rounded-xl transition-colors" 
                [class.bg-white_5]="hasScrolledToBottom()" 
                [class.opacity-50]="!hasScrolledToBottom()">
              <input type="checkbox" 
                     id="agree" 
                     [disabled]="!hasScrolledToBottom()"
                     [(checked)]="isChecked"
                     (change)="toggleCheck($event)"
                     class="mt-1 w-5 h-5 rounded border-slate-600 text-pink-600 focus:ring-pink-500 disabled:cursor-not-allowed cursor-pointer bg-slate-800">
              <label for="agree" class="text-sm select-none cursor-pointer" 
                     [class.text-slate-500]="!hasScrolledToBottom()" 
                     [class.text-white]="hasScrolledToBottom()">
                 Eu li, compreendi e concordo com os Termos de Uso e confirmo ter 18 anos ou mais.
              </label>
           </div>
           
           <button (click)="confirm.emit()" 
                   [disabled]="!isChecked || !hasScrolledToBottom()"
                   class="w-full py-4 rounded-xl bg-gradient-to-r from-pink-600 to-purple-600 text-white font-bold tracking-wide shadow-lg hover:shadow-pink-500/20 disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none transition-all active:scale-95">
              Aceitar e Continuar
           </button>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    
    .bg-white_5 { background-color: rgba(255, 255, 255, 0.05); }
  `]
})
export class TosModalComponent {
  confirm = output();
  
  // Expose data to template
  terms = TERMS_OF_SERVICE;
  
  @ViewChild('scrollContainer') scrollContainer!: ElementRef;
  
  hasScrolledToBottom = signal(false);
  isChecked = false;

  onScroll() {
    const el = this.scrollContainer.nativeElement;
    // Buffer de 80px para garantir detecção em telas diferentes
    const isBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
    
    if (isBottom) {
      this.hasScrolledToBottom.set(true);
    }
  }

  toggleCheck(event: Event) {
    const input = event.target as HTMLInputElement;
    this.isChecked = input.checked;
  }
}
