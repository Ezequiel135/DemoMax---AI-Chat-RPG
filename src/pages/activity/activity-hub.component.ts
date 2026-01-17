
import { Component, inject, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ActivityService } from '../../services/activity.service';
import { DirectMessageService } from '../../services/direct-message.service';
import { AuthService } from '../../services/auth.service';
import { ChatHistoryService } from '../../services/chat-history.service';
import { SystemAssetsService } from '../../services/core/system-assets.service';
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-activity-hub',
  standalone: true,
  imports: [CommonModule, RouterLink, HeaderComponent],
  template: `
    <div class="min-h-screen pb-24 bg-slate-50 dark:bg-[#0F0E17] page-enter transition-colors duration-500">
      
      <!-- Custom Header -->
      <div class="fixed top-0 left-0 right-0 h-16 bg-white/90 dark:bg-[#0F0E17]/90 backdrop-blur border-b border-slate-200 dark:border-white/5 z-40 flex items-center justify-between px-4">
         <h1 class="font-black text-xl text-slate-900 dark:text-white tracking-wide">Minhas Atividades</h1>
         <div class="w-8 h-8 rounded-full overflow-hidden border border-slate-200 dark:border-white/10">
            <img [src]="auth.currentUser()?.avatarUrl || assets.getIcon()" class="w-full h-full object-cover">
         </div>
      </div>

      <div class="pt-20 px-4 max-w-2xl mx-auto space-y-8">

        <!-- TABS / FILTER -->
        <div class="flex p-1 bg-slate-200 dark:bg-slate-900 rounded-xl">
           <button (click)="activeTab.set('chats')" 
                   class="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                   [class.bg-white]="activeTab() === 'chats'"
                   [class.text-pink-600]="activeTab() === 'chats'"
                   [class.shadow-sm]="activeTab() === 'chats'"
                   [class.dark:bg-slate-800]="activeTab() === 'chats'"
                   [class.dark:text-white]="activeTab() === 'chats'"
                   [class.text-slate-500]="activeTab() !== 'chats'">
              Conversas
           </button>
           <button (click)="activeTab.set('stories')" 
                   class="flex-1 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all"
                   [class.bg-white]="activeTab() === 'stories'"
                   [class.text-cyan-600]="activeTab() === 'stories'"
                   [class.shadow-sm]="activeTab() === 'stories'"
                   [class.dark:bg-slate-800]="activeTab() === 'stories'"
                   [class.dark:text-white]="activeTab() === 'stories'"
                   [class.text-slate-500]="activeTab() !== 'stories'">
              Histórias
           </button>
        </div>

        <!-- SECTION: CONVERSAS (AI + HUMAN) -->
        @if (activeTab() === 'chats') {
           <div class="space-y-2 animate-fade-in">
              
              <!-- 1. DMs (Humanos) -->
              @for (chat of dmService.activeChats(); track chat.id) {
                 <a [routerLink]="['/direct', chat.id]" class="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm active:scale-95 transition-transform">
                    <div class="relative flex-shrink-0">
                       <img [src]="chat.otherUser?.avatarUrl || assets.getIcon()" class="w-14 h-14 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm">
                       <div class="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1">
                          <div class="w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-slate-800"></div>
                       </div>
                    </div>
                    <div class="flex-1 min-w-0">
                       <div class="flex justify-between items-center mb-1">
                          <h3 class="font-bold text-slate-900 dark:text-white text-sm">{{ chat.otherUser?.username }}</h3>
                          <span class="text-[10px] bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-0.5 rounded-full">DM</span>
                       </div>
                       <p class="text-xs text-slate-500 dark:text-slate-400 truncate font-medium" [class.text-slate-900]="chat.unreadCount > 0" [class.dark:text-white]="chat.unreadCount > 0">
                          {{ chat.lastMessage }}
                       </p>
                    </div>
                 </a>
              }

              <!-- 2. AI Chats (Personagens) -->
              @for (item of aiChats(); track item.id) {
                 <a [routerLink]="['/chat', item.id]" class="flex items-center gap-4 p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-100 dark:border-white/5 shadow-sm active:scale-95 transition-transform">
                    <div class="relative flex-shrink-0">
                       <img [src]="item.image || assets.getIcon()" class="w-14 h-14 rounded-full object-cover border-2 border-pink-100 dark:border-white/10">
                       <div class="absolute -bottom-1 -right-1 bg-white dark:bg-slate-800 rounded-full p-1">
                          <span class="flex items-center justify-center w-3 h-3 text-[8px]">🤖</span>
                       </div>
                    </div>
                    <div class="flex-1 min-w-0">
                       <div class="flex justify-between items-center mb-1">
                          <h3 class="font-bold text-slate-900 dark:text-white text-sm">{{ item.title }}</h3>
                          <span class="text-[10px] bg-pink-100 dark:bg-pink-900/30 text-pink-600 dark:text-pink-400 px-2 py-0.5 rounded-full">AI</span>
                       </div>
                       <p class="text-xs text-slate-500 dark:text-slate-400 truncate">
                          Conversa ativa • {{ item.timestamp | date:'shortDate' }}
                       </p>
                    </div>
                 </a>
              }

              @if (dmService.activeChats().length === 0 && aiChats().length === 0) {
                 <div class="text-center py-12">
                    <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl grayscale opacity-50">
                       💬
                    </div>
                    <p class="text-slate-500 text-sm">Nenhuma conversa iniciada.</p>
                    <button routerLink="/home" class="mt-4 px-6 py-2 bg-pink-600 text-white rounded-full text-xs font-bold shadow-lg shadow-pink-500/20">
                       Explorar Personagens
                    </button>
                 </div>
              }
           </div>
        }

        <!-- SECTION: HISTÓRIAS (VN + WEB NOVEL) -->
        @if (activeTab() === 'stories') {
           <div class="space-y-4 animate-fade-in">
              @for (item of stories(); track item.id) {
                 <div (click)="openStory(item)" class="group relative aspect-[2/1] rounded-3xl overflow-hidden cursor-pointer shadow-lg">
                    <img [src]="item.image || assets.getIcon()" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700">
                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-5">
                       <div class="flex gap-2 mb-2">
                          <span class="text-[9px] font-black uppercase px-2 py-1 rounded text-white"
                                [class.bg-cyan-600]="item.type === 'novel'"
                                [class.bg-emerald-600]="item.type === 'web_novel'">
                             {{ item.type === 'novel' ? 'Visual Novel' : 'Livro' }}
                          </span>
                       </div>
                       <h3 class="text-white font-bold text-lg leading-tight">{{ item.title }}</h3>
                       <p class="text-slate-300 text-xs mt-1">
                          {{ item.type === 'novel' ? 'Jogando: ' : 'Lendo: ' }} {{ item.subtitle }}
                       </p>
                    </div>
                    <!-- Play Icon -->
                    <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-white/20 backdrop-blur rounded-full flex items-center justify-center border border-white/50 opacity-0 group-hover:opacity-100 transition-opacity">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white ml-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
                    </div>
                 </div>
              }

              @if (stories().length === 0) {
                 <div class="text-center py-12">
                    <div class="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl grayscale opacity-50">
                       📖
                    </div>
                    <p class="text-slate-500 text-sm">Nenhuma leitura em andamento.</p>
                    <button routerLink="/vn" class="mt-4 px-6 py-2 bg-cyan-600 text-white rounded-full text-xs font-bold shadow-lg shadow-cyan-500/20">
                       Biblioteca de Histórias
                    </button>
                 </div>
              }
           </div>
        }

      </div>
    </div>
  `
})
export class ActivityHubComponent {
  activityService = inject(ActivityService);
  dmService = inject(DirectMessageService);
  historyService = inject(ChatHistoryService);
  auth = inject(AuthService);
  router = inject(Router);
  assets = inject(SystemAssetsService);

  activeTab = signal<'chats' | 'stories'>('chats');

  // Computed Lists with Strict User Interaction Check
  aiChats = computed(() => {
    return this.activityService.recent()
      .filter(i => i.type === 'chat')
      .filter(i => {
         // Verify if there are ANY user messages in history.
         const data = this.historyService.getChatData(i.id);
         return data.messages.some(m => m.role === 'user');
      });
  });
  
  stories = computed(() => this.activityService.recent().filter(i => i.type === 'novel' || i.type === 'web_novel'));

  constructor() {
    this.dmService.loadChats();
  }

  openStory(item: any) {
     if (item.type === 'novel') {
        this.router.navigate(['/vn/play', item.id]);
     } else {
        if (item.id.startsWith('wn_')) {
           this.router.navigate(['/novel/read', item.id]);
        } else {
           this.router.navigate(['/vn/play', item.id]);
        }
     }
  }
}
