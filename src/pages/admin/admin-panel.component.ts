
import { Component, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CharacterService } from '../../services/character.service';
import { VnService } from '../../services/vn.service';
import { WebNovelService } from '../../services/web-novel.service';
import { AuthService } from '../../services/auth.service';
import { EconomyService } from '../../services/economy.service';
import { ToastService } from '../../services/toast.service';
import { StorageService } from '../../services/storage.service';
import { DatabaseService } from '../../services/core/database.service'; // Injected DB
import { HeaderComponent } from '../../components/header/header.component';

@Component({
  selector: 'app-admin-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, HeaderComponent],
  template: `
    <app-header></app-header>
    
    <div class="min-h-screen bg-[#050505] text-red-50 p-6 pt-24 font-mono">
      <div class="max-w-6xl mx-auto">
        
        <div class="border-b-2 border-red-600 mb-8 pb-4 flex justify-between items-end">
          <div>
            <h1 class="text-4xl font-black text-red-600 tracking-tighter">GOD MODE // ADMIN PANEL</h1>
            <p class="text-xs text-red-400 opacity-70">SYSTEM_OVERRIDE_ENABLED :: REAL DB ACCESS</p>
          </div>
          <div class="flex gap-2">
             <button (click)="activeTab.set('chars')" [class.bg-red-600]="activeTab() === 'chars'" class="px-4 py-2 border border-red-600 rounded hover:bg-red-900 transition-colors text-xs font-bold">Characters</button>
             <button (click)="activeTab.set('novels')" [class.bg-red-600]="activeTab() === 'novels'" class="px-4 py-2 border border-red-600 rounded hover:bg-red-900 transition-colors text-xs font-bold">Novels</button>
             <button (click)="activeTab.set('users')" [class.bg-red-600]="activeTab() === 'users'" class="px-4 py-2 border border-red-600 rounded hover:bg-red-900 transition-colors text-xs font-bold">Users</button>
             <button (click)="activeTab.set('system')" [class.bg-red-600]="activeTab() === 'system'" class="px-4 py-2 border border-red-600 rounded hover:bg-red-900 transition-colors text-xs font-bold">System</button>
          </div>
        </div>

        <!-- CHARACTERS MANAGEMENT -->
        @if (activeTab() === 'chars') {
           <div class="bg-black/50 border border-red-900/30 rounded-xl overflow-hidden">
              <table class="w-full text-left text-xs">
                 <thead class="bg-red-950/20 text-red-500 uppercase tracking-wider">
                    <tr>
                       <th class="p-4">ID</th>
                       <th class="p-4">Name</th>
                       <th class="p-4">Creator</th>
                       <th class="p-4">Affinity (Force)</th>
                       <th class="p-4">Status</th>
                       <th class="p-4 text-right">Actions</th>
                    </tr>
                 </thead>
                 <tbody class="divide-y divide-red-900/10 text-slate-300">
                    @for (char of charService.allCharacters(); track char.id) {
                       <tr class="hover:bg-red-900/10 transition-colors">
                          <td class="p-4 font-mono text-slate-500">{{ char.id.slice(0, 8) }}...</td>
                          <td class="p-4 font-bold text-white flex items-center gap-2">
                             <img [src]="char.avatarUrl" class="w-6 h-6 rounded-full">
                             {{ char.name }}
                          </td>
                          <td class="p-4">{{ char.creator }}</td>
                          <td class="p-4">
                             <div class="flex items-center gap-2">
                                <input type="number" [(ngModel)]="char.affinity" class="w-16 bg-black border border-red-900 px-2 py-1 text-center">
                                <button (click)="saveChar(char)" class="text-green-500 hover:text-green-400" title="Force Save">💾</button>
                             </div>
                          </td>
                          <td class="p-4">
                             <span *ngIf="char.isTrending" class="text-yellow-500">🔥 Hot</span>
                             <span *ngIf="char.isNSFW" class="text-red-500 ml-2">🔞 18+</span>
                          </td>
                          <td class="p-4 text-right">
                             <button (click)="deleteChar(char.id)" class="px-3 py-1 bg-red-600 hover:bg-red-500 text-white rounded font-bold uppercase tracking-wider text-[10px]">
                                ERASE
                             </button>
                          </td>
                       </tr>
                    }
                 </tbody>
              </table>
           </div>
        }

        <!-- NOVELS MANAGEMENT -->
        @if (activeTab() === 'novels') {
           <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              @for (vn of vnService.novels(); track vn.id) {
                 <div class="bg-black/50 border border-red-900/30 p-4 rounded-xl flex gap-4 group hover:border-red-600 transition-colors">
                    <img [src]="vn.coverUrl" class="w-20 h-28 object-cover rounded bg-slate-800">
                    <div class="flex-1 flex flex-col">
                       <h3 class="font-bold text-white mb-1">{{ vn.title }}</h3>
                       <p class="text-xs text-slate-400 mb-2">By {{ vn.author }}</p>
                       <div class="mt-auto flex justify-between items-center">
                          <span class="text-[10px] text-red-400 font-mono">{{ vn.id }}</span>
                          <button (click)="deleteVn(vn.id)" class="text-red-500 hover:text-white font-bold text-xs uppercase border border-red-900 px-2 py-1 rounded hover:bg-red-600 transition-colors">
                             DELETE
                          </button>
                       </div>
                    </div>
                 </div>
              }
           </div>
        }

        <!-- USERS MANAGEMENT -->
        @if (activeTab() === 'users') {
           <div class="bg-red-900/5 p-6 rounded-xl border border-red-900/20 text-center">
              <h3 class="text-xl font-bold text-white mb-4">User Database</h3>
              
              <div class="max-w-md mx-auto bg-black p-6 rounded-xl border border-white/10">
                 <h4 class="text-sm uppercase font-bold text-slate-500 mb-4">Current Active Session</h4>
                 @if (auth.currentUser(); as user) {
                    <div class="flex items-center gap-4 mb-6 text-left">
                       <img [src]="user.avatarUrl" class="w-16 h-16 rounded-full border-2 border-red-600">
                       <div>
                          <div class="font-black text-xl text-white">{{ user.username }}</div>
                          <div class="text-xs text-slate-500 font-mono">{{ user.id }}</div>
                       </div>
                    </div>
                    <button (click)="wipeUser()" class="w-full py-3 bg-red-600 hover:bg-red-500 text-white font-bold uppercase tracking-widest rounded transition-all">
                       NUKE ACCOUNT (WIPE DATA)
                    </button>
                 } @else {
                    <p class="text-red-500 font-bold">No active user found.</p>
                 }
              </div>
           </div>
        }

        <!-- SYSTEM GOD MODE -->
        @if (activeTab() === 'system') {
           <div class="grid md:grid-cols-2 gap-8">
              
              <!-- Economy God -->
              <div class="bg-black/50 border border-yellow-500/30 p-6 rounded-xl relative overflow-hidden">
                 <div class="absolute inset-0 bg-yellow-500/5 pointer-events-none"></div>
                 <h3 class="text-yellow-500 font-black text-2xl mb-4 font-tech uppercase">Economy Override</h3>
                 
                 <div class="space-y-4 relative z-10">
                    <button (click)="addInfiniteCoins()" class="w-full py-4 bg-yellow-600/20 border border-yellow-500 hover:bg-yellow-500 hover:text-black text-yellow-200 font-bold uppercase tracking-widest transition-all">
                       Set Infinite Balance
                    </button>
                    <button (click)="resetEconomy()" class="w-full py-4 bg-red-900/20 border border-red-500 hover:bg-red-600 text-red-200 hover:text-white font-bold uppercase tracking-widest transition-all">
                       Reset Economy Database
                    </button>
                 </div>
              </div>

              <!-- Storage God -->
              <div class="bg-black/50 border border-blue-500/30 p-6 rounded-xl relative overflow-hidden">
                 <div class="absolute inset-0 bg-blue-500/5 pointer-events-none"></div>
                 <h3 class="text-blue-500 font-black text-2xl mb-4 font-tech uppercase">Database Manager</h3>
                 
                 <div class="space-y-4 relative z-10">
                    <button (click)="clearAllChats()" class="w-full py-4 bg-blue-600/20 border border-blue-500 hover:bg-blue-500 hover:text-black text-blue-200 font-bold uppercase tracking-widest transition-all">
                       Wipe All Chat Histories (DB)
                    </button>
                    <button (click)="nukeEverything()" class="w-full py-4 bg-red-600 text-white font-black uppercase tracking-widest hover:scale-105 transition-transform shadow-[0_0_30px_rgba(220,38,38,0.5)]">
                       ⚠ FACTORY RESET APP ⚠
                    </button>
                 </div>
              </div>

           </div>
        }

      </div>
    </div>
  `
})
export class AdminPanelComponent {
  charService = inject(CharacterService);
  vnService = inject(VnService);
  wnService = inject(WebNovelService);
  auth = inject(AuthService);
  economy = inject(EconomyService);
  toast = inject(ToastService);
  storage = inject(StorageService);
  db = inject(DatabaseService);

  activeTab = signal<'chars' | 'novels' | 'users' | 'system'>('chars');

  // --- ACTIONS ---

  deleteChar(id: string) {
    if(confirm('GOD MODE: Permanently erase this entity from DB?')) {
       this.charService.deleteCharacter(id);
       this.toast.show("Entity Erased.", "success");
    }
  }

  saveChar(char: any) {
    this.charService.addCharacter(char);
    this.toast.show("Entity Updated & Persisted.", "success");
  }

  deleteVn(id: string) {
    if(confirm('GOD MODE: Destroy this timeline?')) {
       this.vnService.deleteNovel(id);
       this.toast.show("Timeline Destroyed.", "success");
    }
  }

  wipeUser() {
    if(confirm('NUCLEAR OPTION: This will delete the user account and data locally.')) {
       this.auth.logout();
       this.storage.removeItem('demomax_user_v1');
       this.db.clearCollection('user_data');
       location.reload();
    }
  }

  addInfiniteCoins() {
    this.economy.setInfiniteBalance();
    this.toast.show("Infinite Wealth Granted.", "success");
  }

  resetEconomy() {
    this.storage.removeItem('demomax_eco_v2');
    this.toast.show("Economy Reset. Reloading...", "info");
    setTimeout(() => location.reload(), 1000);
  }

  async clearAllChats() {
    if(confirm('Clear ALL chat history for everyone?')) {
       // Clear local storage legacy
       localStorage.clear(); 
       // Clear Real DB
       await this.db.clearCollection('dm_messages');
       await this.db.clearCollection('dm_chats_v1');
       
       this.toast.show("Memory Banks Wiped.", "info");
       setTimeout(() => location.reload(), 1500);
    }
  }

  async nukeEverything() {
    if(confirm('⚠ FACTORY RESET: DELETE ALL DATABASES? ⚠')) {
      const stores = ['characters_v1', 'visual_novels_v1', 'web_novels_v1', 'dm_chats_v1', 'dm_messages', 'user_data'];
      for (const store of stores) {
         await this.db.clearCollection(store);
      }
      localStorage.clear();
      location.href = '/splash';
    }
  }
}
