
import { Component, input, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-pix-donate-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md animate-fade-in">
       
       <div class="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl relative">
          
          <!-- Header -->
          <div class="bg-gradient-to-r from-emerald-600 to-teal-600 p-4 flex justify-between items-center">
             <h3 class="font-bold text-white flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1.41 16.09V20h-2.67v-1.93c-1.71-.36-3.15-1.46-3.27-3.4h1.96c.1 1.05 1.18 1.91 2.53 1.91 1.38 0 2.66-.84 2.66-2.12 0-1.27-1.07-1.63-3.1-2.09C9.37 11.91 7.9 11.23 7.9 9.38c0-1.98 1.49-3.19 3.48-3.51V4h2.67v1.92c1.42.26 2.7 1.16 2.85 2.91h-1.98c-.1-1.08-1.03-1.67-2.33-1.67-1.35 0-2.43.91-2.43 2.01 0 1.25.9 1.68 2.96 2.16 2.2.51 3.4 1.49 3.4 3.31 0 2.08-1.56 3.23-3.54 3.37z"/></svg>
                Apoiar Criador
             </h3>
             <button (click)="close.emit()" class="text-white/80 hover:text-white">✕</button>
          </div>

          <div class="p-6">
             <!-- ELIGIBILITY CHECK -->
             @if (auth.canViewSensitiveKeys()) {
                
                <!-- SECURITY WARNING -->
                <div class="mb-6 p-4 bg-yellow-500/10 border border-yellow-500/30 rounded-xl relative overflow-hidden">
                   <div class="absolute inset-0 bg-yellow-500/5 animate-pulse"></div>
                   <div class="relative z-10 flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-500 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                         <h4 class="text-yellow-400 font-bold text-sm uppercase tracking-wider mb-1">Aviso de Segurança</h4>
                         <p class="text-xs text-yellow-200/80 leading-relaxed blink-text">
                            Use uma <strong>CHAVE ALEATÓRIA</strong> para sua segurança! Nunca compartilhe CPF ou Telefone em chaves públicas.
                         </p>
                      </div>
                   </div>
                </div>

                <div class="space-y-4">
                   <p class="text-sm text-slate-300">
                      Envie uma contribuição diretamente para este criador via PIX. 
                      <span class="text-slate-500 block text-xs mt-1">Nota: O app não processa pagamentos.</span>
                   </p>

                   <!-- KEY DISPLAY -->
                   <div class="bg-slate-950 p-4 rounded-xl border border-slate-800 flex items-center justify-between gap-2 group">
                      <code class="text-emerald-400 font-mono text-sm truncate select-all">{{ pixKey() }}</code>
                      <button (click)="copyKey()" class="p-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-colors">
                         <svg *ngIf="!copied()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                         <svg *ngIf="copied()" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-emerald-500" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                      </button>
                   </div>
                   
                   <p class="text-[10px] text-center text-slate-600 mt-2">
                      Chave fornecida pelo criador. Verifique no seu app bancário antes de confirmar.
                   </p>
                </div>

             } @else {
                <!-- BLOCKED VIEW (Time Gate) -->
                <div class="text-center py-6 space-y-4">
                   <div class="w-16 h-16 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                   </div>
                   <h4 class="text-white font-bold">Acesso Restrito</h4>
                   <p class="text-sm text-slate-400 px-4">
                      Para prevenir fraudes e garantir a segurança, chaves de pagamento só são visíveis para contas com mais de <strong>30 dias</strong>.
                   </p>
                   @if (auth.isMaster()) {
                      <p class="text-yellow-500 font-bold text-xs uppercase animate-pulse">Bypass Mestre Ativo</p>
                   }
                   <button (click)="close.emit()" class="px-6 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-sm transition-colors">
                      Entendido
                   </button>
                </div>
             }
          </div>
       </div>
    </div>
  `,
  styles: [`
    .blink-text { animation: flashText 2s infinite; }
    @keyframes flashText {
       0%, 100% { opacity: 1; color: rgba(254, 240, 138, 0.9); }
       50% { opacity: 0.7; color: rgba(254, 240, 138, 0.5); }
    }
  `]
})
export class PixDonateModalComponent {
  auth = inject(AuthService);
  toast = inject(ToastService);
  
  pixKey = input.required<string>();
  close = output();
  copied = signal(false);

  copyKey() {
    navigator.clipboard.writeText(this.pixKey()).then(() => {
       this.copied.set(true);
       this.toast.show("Chave PIX copiada!", "success");
       setTimeout(() => this.copied.set(false), 2000);
    }).catch(() => {
       this.toast.show("Erro ao copiar. Tente manualmente.", "error");
    });
  }
}
