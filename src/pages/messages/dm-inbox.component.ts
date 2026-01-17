
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { DirectMessageService } from '../../services/direct-message.service';
import { AuthService } from '../../services/auth.service';
import { SystemAssetsService } from '../../services/core/system-assets.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-dm-inbox',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  template: `
    <!-- Custom Header for DM -->
    <div class="fixed top-0 left-0 right-0 h-16 bg-white dark:bg-[#0F0E17] border-b border-slate-200 dark:border-white/10 z-40 flex items-center justify-between px-4 transition-colors duration-500">
       <button routerLink="/home" class="p-2 -ml-2 text-slate-900 dark:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" /></svg>
       </button>
       <div class="font-bold text-lg flex items-center gap-1 cursor-pointer">
          <span>{{ auth.currentUser()?.username }}</span>
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
       </div>
       <button class="p-2 -mr-2 text-slate-900 dark:text-white">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
       </button>
    </div>

    <div class="min-h-screen pt-16 bg-white dark:bg-[#0F0E17] page-enter transition-colors duration-500">
       
       <!-- Search -->
       <div class="p-4">
          <div class="relative">
             <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-slate-400" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clip-rule="evenodd" /></svg>
             </div>
             <input type="text" placeholder="Pesquisar" class="w-full bg-slate-100 dark:bg-slate-900 rounded-xl py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-pink-500 transition-colors">
          </div>
       </div>

       <!-- Messages List -->
       <div class="flex flex-col">
          <div class="px-4 pb-2 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Mensagens</div>
          
          @if (dmService.activeChats().length === 0) {
             <div class="flex flex-col items-center justify-center py-20 text-center opacity-60">
                <div class="w-16 h-16 rounded-full border-2 border-slate-300 dark:border-slate-700 flex items-center justify-center mb-4">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                </div>
                <h3 class="font-bold text-lg text-slate-900 dark:text-white">Suas mensagens</h3>
                <p class="text-sm text-slate-500">Envie mensagens privadas para outros usuários.</p>
             </div>
          }

          @for (chat of dmService.activeChats(); track chat.id) {
             <a [routerLink]="['/direct', chat.id]" class="flex items-center gap-3 px-4 py-3 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors active:bg-slate-100 dark:active:bg-slate-800">
                <!-- Avatar -->
                <div class="relative flex-shrink-0">
                   <img [src]="chat.otherUser?.avatarUrl || assets.getIcon()" class="w-14 h-14 rounded-full object-cover border border-slate-200 dark:border-white/10">
                   @if (chat.unreadCount > 0) {
                      <div class="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-white dark:border-[#0F0E17] rounded-full"></div>
                   }
                </div>
                
                <!-- Content -->
                <div class="flex-1 min-w-0">
                   <div class="flex justify-between items-baseline mb-0.5">
                      <h4 class="font-bold text-sm text-slate-900 dark:text-white truncate">{{ chat.otherUser?.username || 'Usuário' }}</h4>
                      <span class="text-[10px] text-slate-400 flex-shrink-0 ml-2">{{ chat.lastMessageTime | date:'shortTime' }}</span>
                   </div>
                   <div class="flex items-center gap-1">
                      <p class="text-sm text-slate-500 dark:text-slate-400 truncate" [class.font-bold]="chat.unreadCount > 0" [class.text-slate-900]="chat.unreadCount > 0" [class.dark:text-white]="chat.unreadCount > 0">
                         {{ chat.lastMessage }}
                      </p>
                      @if (chat.unreadCount > 0) {
                         <div class="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 ml-1"></div>
                      }
                   </div>
                </div>
                
                <!-- Camera Icon (Instagram style) -->
                <button class="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-2">
                   <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </button>
             </a>
          }
       </div>
    </div>
  `
})
export class DmInboxComponent {
  dmService = inject(DirectMessageService);
  auth = inject(AuthService);
  assets = inject(SystemAssetsService);
}
