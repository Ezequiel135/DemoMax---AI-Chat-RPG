
import { Component, input, output, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PhoneData, PhoneContact } from '../../models/phone-content.model';

type AppType = 'home' | 'chat' | 'bank' | 'notes' | 'browser' | 'gallery' | 'map';

@Component({
  selector: 'app-phone-simulator',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in" (click)="close.emit()">
      
      <!-- PHONE BEZEL -->
      <div class="relative w-[320px] h-[650px] bg-slate-900 rounded-[40px] border-[8px] border-slate-800 shadow-2xl overflow-hidden flex flex-col" (click)="$event.stopPropagation()">
        
        <!-- STATUS BAR -->
        <div class="h-8 bg-black/20 flex justify-between items-center px-6 pt-2 text-[10px] font-bold text-white z-20">
           <span>{{ time }}</span>
           <div class="w-20 h-4 bg-black/50 rounded-full mx-auto absolute left-1/2 -translate-x-1/2 top-2"></div> <!-- Notch -->
           <div class="flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M17.778 8.222c-4.296-4.296-11.26-4.296-15.556 0A1 1 0 01.808 6.808c5.076-5.077 13.308-5.077 18.384 0a1 1 0 01-1.414 1.414zM14.95 11.05a7 7 0 00-9.9 0 1 1 0 01-1.414-1.414 9 9 0 0112.728 0 1 1 0 01-1.414 1.414zM12.12 13.88a3 3 0 00-4.242 0 1 1 0 01-1.415-1.415 5 5 0 017.072 0 1 1 0 01-1.415 1.415zM9 16a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1z" clip-rule="evenodd" /></svg>
              <span>{{ data().batteryLevel }}%</span>
           </div>
        </div>

        <!-- APP CONTENT AREA -->
        <div class="flex-1 relative overflow-hidden bg-cover bg-center transition-all"
             [style.background-image]="currentApp() === 'home' ? 'url(https://picsum.photos/seed/wallpaper/320/650)' : 'none'"
             [class.bg-slate-50]="currentApp() !== 'home'">
           
           <!-- Overlay for Home Wallpaper -->
           <div *ngIf="currentApp() === 'home'" class="absolute inset-0 bg-black/40"></div>

           <!-- HOME SCREEN -->
           <div *ngIf="currentApp() === 'home'" class="relative z-10 h-full p-6 flex flex-col">
              <div class="mt-8 text-center text-white">
                 <div class="text-5xl font-thin">{{ time }}</div>
                 <div class="text-sm font-medium opacity-80">{{ date }}</div>
              </div>

              <div class="flex-1"></div>

              <!-- App Grid -->
              <div class="grid grid-cols-4 gap-4 mb-8">
                 <button (click)="openApp('chat')" class="flex flex-col items-center gap-1 group">
                    <div class="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center text-white shadow-lg group-active:scale-90 transition-transform">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
                    </div>
                    <span class="text-[10px] text-white font-medium">Chat</span>
                 </button>

                 <button (click)="openApp('bank')" class="flex flex-col items-center gap-1 group">
                    <div class="w-12 h-12 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg group-active:scale-90 transition-transform">
                       <span class="font-bold">$</span>
                    </div>
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

           <!-- CHAT APP -->
           <div *ngIf="currentApp() === 'chat'" class="bg-white h-full flex flex-col text-slate-900">
              <div class="p-4 bg-slate-100 border-b flex items-center gap-2">
                 <button (click)="currentApp.set('home')" class="text-blue-500">Back</button>
                 <h3 class="font-bold flex-1 text-center">Messages</h3>
                 <div class="w-8"></div>
              </div>
              
              <div *ngIf="!selectedThread()" class="flex-1 overflow-y-auto">
                 @for (contact of data().contacts; track contact.name) {
                    <div (click)="selectedThread.set(contact)" class="flex items-center gap-3 p-4 border-b hover:bg-slate-50 cursor-pointer">
                       <img [src]="'https://picsum.photos/seed/'+contact.avatarSeed+'/50/50'" class="w-12 h-12 rounded-full object-cover">
                       <div class="flex-1 min-w-0">
                          <div class="flex justify-between items-baseline">
                             <h4 class="font-bold text-sm">{{ contact.name }}</h4>
                             <span class="text-[10px] text-slate-400">Yesterday</span>
                          </div>
                          <p class="text-xs text-slate-500 truncate">{{ contact.lastMessage }}</p>
                       </div>
                    </div>
                 }
              </div>

              <div *ngIf="selectedThread(); as thread" class="flex-1 flex flex-col h-full">
                 <div class="bg-slate-50 p-2 flex items-center gap-2 border-b">
                    <button (click)="selectedThread.set(null)" class="text-xs text-blue-500 font-bold">Back</button>
                    <span class="font-bold text-xs">{{ thread.name }}</span>
                 </div>
                 <div class="flex-1 overflow-y-auto p-4 space-y-3 bg-slate-100">
                    @for (msg of thread.history; track $index) {
                       <div class="flex" [class.justify-end]="msg.sender === 'me'">
                          <div class="max-w-[70%] px-3 py-2 rounded-xl text-xs"
                               [class.bg-green-500]="msg.sender === 'me'"
                               [class.text-white]="msg.sender === 'me'"
                               [class.bg-white]="msg.sender !== 'me'"
                               [class.text-slate-800]="msg.sender !== 'me'"
                               [class.border]="msg.sender !== 'me'">
                             {{ msg.text }}
                          </div>
                       </div>
                    }
                 </div>
              </div>
           </div>

           <!-- BANK APP -->
           <div *ngIf="currentApp() === 'bank'" class="bg-slate-900 h-full flex flex-col text-white">
              <div class="p-6 bg-indigo-600 rounded-b-3xl shadow-lg">
                 <div class="flex justify-between items-start">
                    <button (click)="currentApp.set('home')" class="text-white/70 hover:text-white">✕</button>
                    <div class="text-right">
                       <div class="text-[10px] uppercase opacity-70">Total Balance</div>
                       <div class="text-3xl font-bold">{{ data().bankAccount.balance }}</div>
                    </div>
                 </div>
              </div>
              <div class="p-4">
                 <h3 class="font-bold text-slate-400 text-xs uppercase mb-2">Recent Transactions</h3>
                 <div class="space-y-3">
                    @for (tx of data().bankAccount.transactions; track $index) {
                       <div class="flex justify-between items-center p-3 bg-slate-800 rounded-xl border border-slate-700">
                          <div>
                             <div class="font-bold text-sm">{{ tx.merchant }}</div>
                             <div class="text-[10px] text-slate-500">{{ tx.date }}</div>
                          </div>
                          <div class="font-mono text-sm" [class.text-red-400]="tx.type === 'debit'" [class.text-green-400]="tx.type === 'credit'">
                             {{ tx.amount }}
                          </div>
                       </div>
                    }
                 </div>
              </div>
           </div>

           <!-- BROWSER APP -->
           <div *ngIf="currentApp() === 'browser'" class="bg-slate-50 h-full flex flex-col text-slate-900">
              <div class="p-3 bg-slate-200 border-b flex items-center gap-2">
                 <button (click)="currentApp.set('home')" class="text-slate-500">🏠</button>
                 <div class="flex-1 bg-white rounded-md px-2 py-1 text-xs text-slate-500 flex items-center">
                    <span class="mr-1">🔒</span> google.com/search
                 </div>
              </div>
              <div class="p-6">
                 <div class="flex flex-col items-center mb-8">
                    <span class="text-4xl font-bold text-slate-700 mb-4">Gooogle</span>
                    <input disabled placeholder="Search..." class="w-full border rounded-full px-4 py-2 text-sm bg-white">
                 </div>
                 <div class="space-y-2">
                    <div class="text-xs font-bold text-slate-400 uppercase">Recent Searches</div>
                    @for (item of data().browserHistory; track $index) {
                       <div class="flex items-center gap-2 text-blue-600 text-sm border-b py-2">
                          <span class="text-slate-400">🕒</span> {{ item }}
                       </div>
                    }
                 </div>
              </div>
           </div>

           <!-- NOTES APP -->
           <div *ngIf="currentApp() === 'notes'" class="bg-[#fef9c3] h-full flex flex-col text-slate-800">
              <div class="p-4 flex justify-between items-center border-b border-yellow-200">
                 <button (click)="currentApp.set('home')" class="text-yellow-700 font-bold">Done</button>
                 <span class="font-bold">Notes</span>
                 <span></span>
              </div>
              <div class="p-4 grid grid-cols-2 gap-4 overflow-y-auto">
                 @for (note of data().notes; track $index) {
                    <div class="bg-white p-3 rounded-lg shadow-sm h-32 overflow-hidden relative">
                       <h4 class="font-bold text-sm mb-1">{{ note.title }}</h4>
                       <p class="text-xs text-slate-500 leading-tight">{{ note.content }}</p>
                       <span class="absolute bottom-2 right-2 text-[8px] text-slate-400">{{ note.date }}</span>
                    </div>
                 }
              </div>
           </div>

           <!-- GALLERY APP -->
           <div *ngIf="currentApp() === 'gallery'" class="bg-black h-full flex flex-col">
              <div class="p-4 flex justify-between items-center bg-black/50 backdrop-blur absolute top-0 w-full z-10">
                 <button (click)="currentApp.set('home')" class="text-white">❮ Back</button>
                 <span class="text-white font-bold">Gallery</span>
                 <span></span>
              </div>
              <div class="pt-16 px-1 grid grid-cols-3 gap-1 overflow-y-auto pb-8">
                 @for (photo of data().gallery; track $index) {
                    <div class="aspect-square bg-slate-800 relative group cursor-pointer border border-white/10">
                       <div class="absolute inset-0 flex items-center justify-center p-2 text-center">
                          <span class="text-[8px] text-slate-400">{{ photo.description }}</span>
                       </div>
                       <!-- Placeholder overlay -->
                       <div class="absolute inset-0 bg-gradient-to-tr from-purple-500/20 to-blue-500/20"></div>
                    </div>
                 }
              </div>
           </div>

           <!-- MAP APP -->
           <div *ngIf="currentApp() === 'map'" class="bg-slate-800 h-full flex flex-col relative overflow-hidden">
              <!-- Stylized Map BG -->
              <div class="absolute inset-0 opacity-30" style="background-image: radial-gradient(circle, #64748b 1px, transparent 1px); background-size: 20px 20px;"></div>
              
              <!-- Map Content -->
              <div class="relative z-10 h-full flex flex-col">
                 <div class="p-4 mt-2 mx-4 bg-white/90 backdrop-blur rounded-xl shadow-lg flex items-center gap-3">
                    <button (click)="currentApp.set('home')" class="text-slate-500">❮</button>
                    <div class="flex-1">
                       <div class="text-[10px] text-slate-500 uppercase font-bold">Current Location</div>
                       <div class="text-sm font-bold text-slate-900">{{ data().currentLocation }}</div>
                    </div>
                    <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white">
                       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" /></svg>
                    </div>
                 </div>

                 <!-- Radar Effect -->
                 <div class="flex-1 flex items-center justify-center">
                    <div class="relative w-40 h-40">
                       <div class="absolute inset-0 bg-blue-500/20 rounded-full animate-ping"></div>
                       <div class="absolute inset-8 bg-blue-500/40 rounded-full"></div>
                       <div class="absolute inset-0 border border-blue-400 rounded-full"></div>
                       <!-- Center Dot -->
                       <div class="absolute top-1/2 left-1/2 w-4 h-4 bg-blue-500 border-2 border-white rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg"></div>
                    </div>
                 </div>
              </div>
           </div>

        </div>

        <!-- BOTTOM BAR -->
        <div class="h-6 bg-black flex justify-center items-center z-20 cursor-pointer" (click)="currentApp.set('home')">
           <div class="w-32 h-1 bg-white/50 rounded-full"></div>
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: scale(0.95); } to { opacity: 1; transform: scale(1); } }
  `]
})
export class PhoneSimulatorComponent {
  data = input.required<PhoneData>();
  close = output();

  currentApp = signal<AppType>('home');
  selectedThread = signal<PhoneContact | null>(null);

  get time() {
    const d = new Date();
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, '0')}`;
  }

  get date() {
    return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }

  openApp(app: AppType) {
    this.currentApp.set(app);
  }
}
