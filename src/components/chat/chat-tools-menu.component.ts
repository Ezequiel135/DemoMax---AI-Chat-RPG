
import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-chat-tools-menu',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="grid grid-cols-4 gap-4 p-4 bg-slate-900/95 backdrop-blur-xl rounded-t-3xl border-t border-white/10 animate-slide-up">
      
      <!-- Foto -->
      <button (click)="action.emit('photo')" class="flex flex-col items-center gap-2 group">
        <div class="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-slate-700 transition-colors border border-slate-700">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
        </div>
        <span class="text-[10px] text-slate-400 font-medium">Foto</span>
      </button>

      <!-- Pensamento -->
      <button (click)="action.emit('thought')" class="flex flex-col items-center gap-2 group">
        <div class="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-slate-700 transition-colors border border-slate-700">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" /></svg>
        </div>
        <span class="text-[10px] text-slate-400 font-medium text-center leading-tight">Pensamento<br>Interior</span>
      </button>

      <!-- Sonho -->
      <button (click)="action.emit('dream')" class="flex flex-col items-center gap-2 group">
        <div class="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-slate-700 transition-colors border border-slate-700">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>
        </div>
        <span class="text-[10px] text-slate-400 font-medium">Sonho</span>
      </button>

      <!-- Histórico -->
      <button (click)="action.emit('history')" class="flex flex-col items-center gap-2 group">
        <div class="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-slate-700 transition-colors border border-slate-700">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
        </div>
        <span class="text-[10px] text-slate-400 font-medium text-center leading-tight">Histórico<br>do Chat</span>
      </button>

      <!-- Diário -->
      <button (click)="action.emit('diary')" class="flex flex-col items-center gap-2 group">
        <div class="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-slate-700 transition-colors border border-slate-700">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
        </div>
        <span class="text-[10px] text-slate-400 font-medium">Diário</span>
      </button>

      <!-- Telefone -->
      <button (click)="action.emit('phone')" class="flex flex-col items-center gap-2 group">
        <div class="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-slate-700 transition-colors border border-slate-700">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
        </div>
        <span class="text-[10px] text-slate-400 font-medium">Telefone</span>
      </button>

      <!-- Memória -->
      <button (click)="action.emit('memory')" class="flex flex-col items-center gap-2 group">
        <div class="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-slate-700 transition-colors border border-slate-700">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
        </div>
        <span class="text-[10px] text-slate-400 font-medium">Memória</span>
      </button>

      <!-- Fórum -->
      <button (click)="action.emit('forum')" class="flex flex-col items-center gap-2 group">
        <div class="w-12 h-12 bg-slate-800 rounded-2xl flex items-center justify-center group-hover:bg-slate-700 transition-colors border border-slate-700">
           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" /></svg>
        </div>
        <span class="text-[10px] text-slate-400 font-medium">Fórum</span>
      </button>

    </div>
  `,
  styles: [`
    .animate-slide-up { animation: slideUp 0.3s cubic-bezier(0.16, 1, 0.3, 1); }
    @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
  `]
})
export class ChatToolsMenuComponent {
  action = output<string>();
}
