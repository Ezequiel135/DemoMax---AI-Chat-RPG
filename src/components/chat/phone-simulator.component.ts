
import { Component, input, output, signal, ElementRef, ViewChild, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneData, PhoneContact, Note, PhoneMessage } from '../../models/phone-content.model';
import { BankUtilsLogic } from '../../logic/phone/utils/bank.utils';

type AppType = 'home' | 'chat' | 'bank' | 'notes' | 'browser' | 'gallery' | 'map';

@Component({
  selector: 'app-phone-simulator',
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" (click)="close.emit()">
      
      <!-- PHONE BEZEL -->
      <div class="relative w-[320px] h-[650px] bg-slate-900 rounded-[40px] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col" (click)="$event.stopPropagation()">
        
        <!-- STATUS BAR -->
        <div class="h-8 bg-black/40 flex justify-between items-center px-6 pt-2 text-[10px] font-bold text-white z-20 backdrop-blur-sm absolute top-0 left-0 right-0 rounded-t-[30px]">
           <span>{{ time }}</span>
           <div class="w-20 h-4 bg-black/80 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2"></div>
           <div class="flex items-center gap-1">
              <button (click)="refresh.emit()" class="mr-2 text-white/50 hover:text-white transition-colors" title="Atualizar">
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
              </button>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" /></svg>
              <span>{{ data().batteryLevel }}%</span>
           </div>
        </div>

        <!-- APP CONTENT AREA -->
        <div class="flex-1 relative overflow-hidden bg-cover bg-center transition-all pt-8"
             [style.background-image]="currentApp() === 'home' ? 'url(https://picsum.photos/seed/wallpaper/320/650)' : 'none'"
             [class.bg-slate-50]="currentApp() !== 'home' && currentApp() !== 'bank' && currentApp() !== 'map' && currentApp() !== 'gallery'">
           
           @if (currentApp() === 'home') {
               <div class="absolute inset-0 bg-black/40"></div>
               <div class="relative z-10 h-full p-6 flex flex-col animate-fade-in">
                  <div class="mt-8 text-center text-white">
                     <div class="text-5xl font-thin">{{ time }}</div>
                     <div class="text-sm font-medium opacity-80">{{ date }}</div>
                  </div>

                  <div class="flex-1"></div>

                  <!-- App Grid -->
                  <div class="grid grid-cols-4 gap-4 mb-8">
                     <button (click)="openApp('chat')" class="flex flex-col items-center gap-1 group relative">
                        <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg group-active:scale-90 transition-transform">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                        </div>
                        @if(totalUnread() > 0) {
                            <div class="absolute -top-1 right-2 bg-red-500 text-white text-[9px] w-5 h-5 flex items-center justify-center rounded-full border-2 border-slate-900 font-bold">
                               {{ totalUnread() }}
                            </div>
                        }
                        <span class="text-[10px] text-white font-medium">Chat</span>
                     </button>

                     <!-- Other apps... -->
                     <button (click)="openApp('bank')" class="flex flex-col items-center gap-1 group">
                        <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-active:scale-90 transition-transform"><span class="font-bold">$</span></div>
                        <span class="text-[10px] text-white font-medium">Bank</span>
                     </button>
                     <button (click)="openApp('browser')" class="flex flex-col items-center gap-1 group">
                        <div class="w-12 h-12 bg-blue-400 rounded-xl flex items-center justify-center text-white shadow-lg group-active:scale-90 transition-transform">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" /></svg>
                        </div>
                        <span class="text-[10px] text-white font-medium">Web</span>
                     </button>
                     <button (click)="openApp('gallery')" class="flex flex-col items-center gap-1 group">
                        <div class="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-slate-900 shadow-lg group-active:scale-90 transition-transform">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        </div>
                        <span class="text-[10px] text-white font-medium">Photos</span>
                     </button>
                     <button (click)="openApp('notes')" class="flex flex-col items-center gap-1 group">
                        <div class="w-12 h-12 bg-yellow-400 rounded-xl flex items-center justify-center text-white shadow-lg group-active:scale-90 transition-transform">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                        </div>
                        <span class="text-[10px] text-white font-medium">Notes</span>
                     </button>
                     <button (click)="openApp('map')" class="flex flex-col items-center gap-1 group">
                        <div class="w-12 h-12 bg-slate-700 rounded-xl flex items-center justify-center text-white shadow-lg group-active:scale-90 transition-transform">
                           <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" /></svg>
                        </div>
                        <span class="text-[10px] text-white font-medium">Maps</span>
                     </button>
                  </div>
               </div>
           }

           <!-- CHAT APP -->
           @if (currentApp() === 'chat') {
               <div class="bg-[#e5e5e5] h-full flex flex-col text-slate-900 animate-slide-in">
                  <div class="p-4 bg-white border-b flex items-center gap-2 z-10 shadow-sm">
                     <button (click)="closeThreadOrApp()" class="text-blue-500 font-bold text-sm flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
                        {{ selectedThread() ? 'Back' : 'Home' }}
                     </button>
                     
                     @if (selectedThread()) {
                       @let contact = selectedThread()!;
                       <div class="flex-1 text-center">
                          <div class="font-bold text-sm">{{ contact.name }}</div>
                          <div class="text-[9px] text-slate-400">Online</div>
                       </div>
                     } @else {
                       <h3 class="font-bold flex-1 text-center">Mensagens</h3>
                     }
                     
                     <div class="w-8"></div>
                  </div>
                  
                  <!-- CONTACT LIST -->
                  @if (!selectedThread()) {
                     <div class="flex-1 overflow-y-auto bg-white">
                        @for (contact of data().contacts; track $index) {
                           <div (click)="openThread(contact)" class="flex items-center gap-3 p-4 border-b border-slate-100 hover:bg-slate-50 cursor-pointer active:bg-slate-100 relative">
                              <img [src]="'https://picsum.photos/seed/'+contact.avatarSeed+'/50/50'" class="w-12 h-12 rounded-full object-cover">
                              <div class="flex-1 min-w-0">
                                 <div class="flex justify-between items-baseline mb-1">
                                    <h4 class="font-bold text-sm">{{ contact.name }}</h4>
                                    <span class="text-[10px] text-slate-400">Ontem</span>
                                 </div>
                                 <p class="text-xs text-slate-500 truncate" [class.font-bold]="contact.unreadCount && contact.unreadCount > 0">
                                    {{ contact.lastMessage }}
                                 </p>
                              </div>
                              <!-- Contact Badge -->
                              @if(contact.unreadCount && contact.unreadCount > 0) {
                                 <div class="w-5 h-5 bg-blue-500 text-white text-[10px] rounded-full flex items-center justify-center font-bold">
                                    {{ contact.unreadCount }}
                                 </div>
                              }
                           </div>
                        }
                     </div>
                  }

                  <!-- THREAD VIEW -->
                  @if (selectedThread()) {
                     @let thread = selectedThread()!;
                     <div class="flex-1 flex flex-col h-full relative">
                         <div class="absolute inset-0 opacity-5 pointer-events-none" style="background-image: url('https://www.transparenttextures.com/patterns/crossword.png');"></div>

                         <div class="flex-1 overflow-y-auto p-4 space-y-2 z-10" #chatScroll>
                            @for (msg of getThreadMessages(thread); track $index) {
                               <div class="flex w-full" [class.justify-end]="msg.isMe" [class.justify-start]="!msg.isMe">
                                  <div class="max-w-[75%] px-3 py-2 rounded-lg text-xs shadow-sm relative"
                                       [class.bg-[#dcf8c6]]="msg.isMe"
                                       [class.text-slate-900]="msg.isMe"
                                       [class.rounded-tr-none]="msg.isMe"
                                       [class.bg-white]="!msg.isMe"
                                       [class.text-slate-900]="!msg.isMe"
                                       [class.rounded-tl-none]="!msg.isMe">
                                     <span class="block leading-relaxed">{{ msg.text }}</span>
                                     <div class="text-[9px] opacity-50 text-right mt-0.5 flex justify-end gap-1 items-center">
                                        {{ msg.time }}
                                        <span *ngIf="msg.isMe" class="text-blue-500">✓✓</span>
                                     </div>
                                  </div>
                               </div>
                            }
                         </div>
                         
                         <!-- Fake Keyboard -->
                         <div class="p-2 bg-[#f0f0f0] border-t flex items-center gap-2 z-10">
                            <button class="text-blue-500 p-1">+</button>
                            <div class="flex-1 h-9 bg-white border border-slate-200 rounded-full px-4 text-xs flex items-center text-slate-400 shadow-inner">
                               Apenas leitura...
                            </div>
                            <button class="text-blue-500 p-1">🎤</button>
                         </div>
                     </div>
                  }
               </div>
           }

           <!-- BANK -->
           @if (currentApp() === 'bank') {
               <div class="bg-[#820ad1] h-full flex flex-col text-white animate-slide-in">
                  <div class="p-6 pb-8">
                     <button (click)="currentApp.set('home')" class="text-white/70 hover:text-white">✕</button>
                     <div class="mt-4 text-3xl font-bold tracking-tight">{{ formatMoney(data().bankAccount.balance) }}</div>
                  </div>
               </div>
           }
           
           <!-- NOTES -->
           @if (currentApp() === 'notes') {
               <div class="bg-slate-50 h-full flex flex-col text-slate-800 animate-slide-in">
                  <div class="p-4 border-b flex justify-between"><button (click)="currentApp.set('home')">Back</button> Notes</div>
                  <div class="p-4 space-y-2">
                     @for (note of data().notes; track $index) {
                        <div class="bg-white p-4 rounded shadow-sm">
                           <div class="font-bold text-sm">{{ note.title }}</div>
                           <div class="text-xs text-slate-500">{{ note.content }}</div>
                        </div>
                     }
                  </div>
               </div>
           }
           
           <!-- BROWSER (Placeholder) -->
           @if (currentApp() === 'browser') {
               <div class="bg-white h-full flex flex-col animate-slide-in">
                  <div class="p-2 bg-slate-100 flex items-center gap-2 border-b">
                     <button (click)="currentApp.set('home')">🏠</button>
                     <div class="flex-1 bg-white rounded-full px-3 py-1 text-xs text-slate-500">google.com</div>
                  </div>
                  <div class="p-4 text-center text-slate-400 mt-20">
                     Sem conexão
                  </div>
               </div>
           }

           <!-- GALLERY (Placeholder) -->
           @if (currentApp() === 'gallery') {
               <div class="bg-black h-full flex flex-col animate-slide-in text-white">
                  <div class="p-4 flex items-center gap-2">
                     <button (click)="currentApp.set('home')">Back</button>
                     <span class="font-bold">Fotos</span>
                  </div>
                  <div class="grid grid-cols-3 gap-1 p-1">
                     @for (img of data().gallery; track $index) {
                        <div class="aspect-square bg-slate-800 relative">
                           <!-- Placeholder visual -->
                           <div class="absolute inset-0 flex items-center justify-center text-xs text-white/20">IMG</div>
                        </div>
                     }
                  </div>
               </div>
           }

           <!-- MAP (Placeholder) -->
           @if (currentApp() === 'map') {
               <div class="bg-slate-200 h-full flex flex-col animate-slide-in relative">
                  <button (click)="currentApp.set('home')" class="absolute top-4 left-4 z-10 bg-white p-2 rounded-full shadow">🔙</button>
                  <div class="flex-1 flex items-center justify-center text-slate-400">
                     📍 {{ data().currentLocation }}
                  </div>
               </div>
           }

        </div>

        <!-- BOTTOM BAR -->
        <div class="h-6 bg-black flex justify-center items-center z-20 cursor-pointer" (click)="currentApp.set('home')">
           <div class="w-32 h-1 bg-white/50 rounded-full"></div>
        </div>

      </div>
    </div>
  `
})
export class PhoneSimulatorComponent {
  data = input.required<PhoneData>();
  hasPermission = input(false); 

  close = output();
  refresh = output();
  caughtReading = output<string>();

  currentApp = signal<AppType>('home');
  selectedThread = signal<PhoneContact | null>(null);
  selectedNote = signal<Note | null>(null); 
  
  @ViewChild('chatScroll') private chatScroll!: ElementRef;

  totalUnread = computed(() => {
     return this.data().contacts?.reduce((acc, c) => acc + (c.unreadCount || 0), 0) || 0;
  });

  get time() {
    const d = new Date();
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  get date() {
    return new Date().toLocaleDateString('pt-BR', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  formatMoney(val: string): string { return BankUtilsLogic.formatCurrency(val); }

  openApp(app: AppType) {
    this.currentApp.set(app);
    this.selectedNote.set(null); 
  }

  openThread(contact: PhoneContact) {
    if (!this.hasPermission()) {
        if ((contact.unreadCount && contact.unreadCount > 0) || contact.isSensitive) {
           setTimeout(() => {
              this.caughtReading.emit('embarrassing');
           }, 1500); 
        }
    }

    this.selectedThread.set(contact);
    contact.unreadCount = 0;

    setTimeout(() => {
       if (this.chatScroll) this.chatScroll.nativeElement.scrollTop = this.chatScroll.nativeElement.scrollHeight;
    }, 100);
  }

  closeThreadOrApp() {
    if (this.selectedThread()) {
       this.selectedThread.set(null);
    } else {
       this.currentApp.set('home');
    }
  }

  getThreadMessages(contact: PhoneContact) {
    if (!contact) return [];
    let msgs = contact.history || [];
    if (msgs.length === 0 && contact.lastMessage) {
       msgs = [{ sender: 'other', text: contact.lastMessage, time: 'Now' }];
    }
    return msgs.map(m => ({
       ...m,
       isMe: m.sender.toLowerCase() === 'me' || m.sender.toLowerCase() === 'user' || m.sender.toLowerCase() === 'myself'
    }));
  }
}
