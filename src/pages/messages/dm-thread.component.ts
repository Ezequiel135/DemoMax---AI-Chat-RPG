
import { Component, inject, signal, effect, ViewChild, ElementRef, AfterViewChecked, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DirectMessageService } from '../../services/direct-message.service';
import { AuthService } from '../../services/auth.service';
import { SocialService } from '../../services/social.service';
import { SystemAssetsService } from '../../services/core/system-assets.service';
import { DirectMessage, DirectChat } from '../../models/direct-message.model';
import { DatabaseService } from '../../services/core/database.service';

@Component({
  selector: 'app-dm-thread',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="flex flex-col h-dvh bg-white dark:bg-[#0F0E17] page-enter transition-colors duration-500">
      
      <!-- HEADER -->
      <div class="flex-none h-16 bg-white/90 dark:bg-[#0F0E17]/90 backdrop-blur border-b border-slate-100 dark:border-white/5 flex items-center px-4 justify-between z-40 sticky top-0">
         <div class="flex items-center gap-3">
            <button routerLink="/inbox" class="text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
            </button>
            
            @if (chatInfo(); as chat) {
               <a [routerLink]="['/u', chat.otherUser?.username]" class="flex items-center gap-3 cursor-pointer group">
                  <div class="relative">
                     <img [src]="chat.otherUser?.avatarUrl || assets.getIcon()" class="w-9 h-9 rounded-full object-cover border border-slate-200 dark:border-white/10 group-hover:border-pink-500 transition-colors">
                     @if(isFriend()) {
                       <div class="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-emerald-500 border-2 border-white dark:border-[#0F0E17] rounded-full"></div>
                     }
                  </div>
                  <div class="flex flex-col">
                     <span class="font-bold text-sm text-slate-900 dark:text-white leading-none flex items-center gap-1">
                        {{ chat.otherUser?.username }}
                        @if(isFriend()) { <span class="text-[8px] text-emerald-500 bg-emerald-500/10 px-1 rounded uppercase tracking-wider">Amigo</span> }
                     </span>
                     <span class="text-[10px] text-slate-500 dark:text-slate-400">
                        {{ isFriend() ? 'Online agora' : 'Não segue você' }}
                     </span>
                  </div>
               </a>
            }
         </div>

         <div class="flex items-center gap-4 text-slate-400 dark:text-slate-500">
            <button class="hover:text-pink-500 transition-colors"><svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></button>
         </div>
      </div>

      <!-- MESSAGES AREA -->
      <div #scrollContainer class="flex-1 overflow-y-auto p-4 space-y-4 bg-white dark:bg-[#0F0E17] scroll-smooth">
         
         <!-- PROFILE HEADER IN CHAT -->
         @if (chatInfo(); as chat) {
            <div class="flex flex-col items-center py-8 mb-4 border-b border-slate-100 dark:border-white/5 mx-8">
               <img [src]="chat.otherUser?.avatarUrl || assets.getIcon()" class="w-20 h-20 rounded-full object-cover mb-3 border-4 border-slate-100 dark:border-[#1E1E24]">
               <h3 class="text-lg font-bold text-slate-900 dark:text-white">{{ chat.otherUser?.username }}</h3>
               <p class="text-xs text-slate-500 mb-3">DemoMax User • {{ isFriend() ? 'Amigos' : 'Público' }}</p>
               <a [routerLink]="['/u', chat.otherUser?.username]" class="px-4 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-full text-xs font-bold text-slate-900 dark:text-white transition-colors">
                  Ver Perfil
               </a>
            </div>
         }

         <!-- Messages Grouped -->
         @for (msg of messages(); track msg.id; let i = $index) {
            
            <!-- Date Separator (Simple Logic) -->
            @if (showDateSeparator(i)) {
               <div class="flex justify-center my-4">
                  <span class="text-[10px] font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
                     {{ getDateLabel(msg.timestamp) }}
                  </span>
               </div>
            }

            <div class="flex w-full animate-slide-up" [class.justify-end]="isMe(msg)" [class.justify-start]="!isMe(msg)">
               
               <!-- Avatar if other (Only show if not me) -->
               @if (!isMe(msg)) {
                  <img [src]="chatInfo()?.otherUser?.avatarUrl || assets.getIcon()" class="w-8 h-8 rounded-full object-cover self-end mb-1 mr-2 border border-slate-200 dark:border-white/10 shadow-sm">
               }

               <div class="max-w-[75%] flex flex-col" [class.items-end]="isMe(msg)" [class.items-start]="!isMe(msg)">
                  <div class="px-4 py-2.5 text-[15px] leading-relaxed relative group transition-all shadow-sm"
                       [class.bg-gradient-to-br]="isMe(msg)"
                       [class.from-blue-500]="isMe(msg)"
                       [class.to-blue-600]="isMe(msg)"
                       [class.text-white]="isMe(msg)"
                       [class.rounded-2xl]="true"
                       [class.rounded-br-sm]="isMe(msg)"
                       
                       [class.bg-slate-100]="!isMe(msg)"
                       [class.dark:bg-[#1E1E24]]="!isMe(msg)"
                       [class.text-slate-800]="!isMe(msg)"
                       [class.dark:text-slate-200]="!isMe(msg)"
                       [class.rounded-bl-sm]="!isMe(msg)"
                       [class.border]="!isMe(msg)"
                       [class.border-slate-200]="!isMe(msg)"
                       [class.dark:border-white_5]="!isMe(msg)">
                     
                     {{ msg.text }}
                     
                  </div>
                  <!-- Time -->
                  <span class="text-[9px] text-slate-400 mt-1 px-1 opacity-70">
                     {{ msg.timestamp | date:'shortTime' }}
                  </span>
               </div>

            </div>
         }
      </div>

      <!-- INPUT AREA (Conditional) -->
      @if (isFriend()) {
         <div class="p-3 bg-white dark:bg-[#0F0E17] flex items-center gap-3 border-t border-slate-100 dark:border-white/5">
            <div class="flex items-end gap-2 p-1.5 bg-slate-50 dark:bg-[#15151A] rounded-[24px] flex-1 border border-slate-200 dark:border-white/10 focus-within:border-blue-500/50 focus-within:ring-2 focus-within:ring-blue-500/10 transition-all">
               
               <div class="w-9 h-9 rounded-full flex items-center justify-center text-slate-400 hover:text-blue-500 cursor-pointer ml-0.5 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
               </div>

               <textarea [(ngModel)]="inputText" 
                      (keydown.enter)="handleEnter($event)"
                      rows="1"
                      placeholder="Mensagem..." 
                      class="bg-transparent flex-1 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none py-2.5 px-2 resize-none max-h-32 custom-scroll"></textarea>
               
               <button (click)="send()" 
                       [disabled]="!inputText.trim()"
                       class="w-9 h-9 mb-0.5 bg-blue-600 hover:bg-blue-500 text-white rounded-full flex items-center justify-center shadow-md disabled:opacity-50 disabled:scale-90 transition-all transform hover:scale-105">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-0.5" viewBox="0 0 20 20" fill="currentColor"><path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" /></svg>
               </button>
            </div>
         </div>
      } @else {
         <!-- Blocked State -->
         <div class="p-6 bg-slate-50 dark:bg-[#15151A] border-t border-slate-200 dark:border-white/10 text-center">
            <p class="text-sm text-slate-500 dark:text-slate-400 mb-3">
               Você não pode responder a esta conversa.
            </p>
            <div class="inline-block px-4 py-2 bg-slate-200 dark:bg-slate-800 rounded-lg text-xs font-bold text-slate-600 dark:text-slate-300">
               ⚠️ É necessário ser amigo (seguir de volta)
            </div>
         </div>
      }

    </div>
  `
})
export class DmThreadComponent implements AfterViewChecked {
  route = inject(ActivatedRoute);
  dmService = inject(DirectMessageService);
  auth = inject(AuthService);
  socialService = inject(SocialService);
  db = inject(DatabaseService);
  assets = inject(SystemAssetsService);

  chatId = '';
  chatInfo = signal<DirectChat | undefined>(undefined);
  messages = signal<DirectMessage[]>([]);
  inputText = '';

  // Check mutual friendship based on username
  isFriend = computed(() => {
     const chat = this.chatInfo();
     if (!chat || !chat.otherUser) return false;
     return this.socialService.isMutual(chat.otherUser.username);
  });

  @ViewChild('scrollContainer') private scrollContainer!: ElementRef;

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.chatId = params.get('id') || '';
      if (this.chatId) {
        this.loadData();
      }
    });
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  async loadData() {
    // 1. Get Chat Info
    const chat = await this.db.getById<DirectChat>('dm_chats_v1', this.chatId);
    if (chat) {
      this.chatInfo.set(chat);
    }

    // 2. Get Messages
    const msgs = await this.dmService.getMessages(this.chatId);
    this.messages.set(msgs);
  }

  isMe(msg: DirectMessage): boolean {
    return msg.senderId === this.auth.currentUser()?.id;
  }

  handleEnter(e: KeyboardEvent) {
     if (!e.shiftKey) {
        e.preventDefault();
        this.send();
     }
  }

  async send() {
    if (!this.inputText.trim()) return;
    if (!this.isFriend()) return; // Security check
    
    const text = this.inputText;
    this.inputText = ''; 
    
    // Optimistic Update
    const tempMsg: DirectMessage = {
       id: 'temp',
       senderId: this.auth.currentUser()!.id,
       text: text,
       timestamp: Date.now(),
       read: false
    };
    this.messages.update(m => [...m, tempMsg]);

    await this.dmService.sendMessage(this.chatId, text);
    this.loadData(); // Sync real data
  }

  scrollToBottom() {
    try {
      this.scrollContainer.nativeElement.scrollTop = this.scrollContainer.nativeElement.scrollHeight;
    } catch(err) { }
  }

  // Helper for Date Separators
  showDateSeparator(index: number): boolean {
     if (index === 0) return true;
     const curr = new Date(this.messages()[index].timestamp);
     const prev = new Date(this.messages()[index - 1].timestamp);
     return curr.getDate() !== prev.getDate();
  }

  getDateLabel(ts: number): string {
     const date = new Date(ts);
     const today = new Date();
     if (date.toDateString() === today.toDateString()) return 'Hoje';
     
     const yesterday = new Date();
     yesterday.setDate(today.getDate() - 1);
     if (date.toDateString() === yesterday.toDateString()) return 'Ontem';
     
     return date.toLocaleDateString();
  }
}
