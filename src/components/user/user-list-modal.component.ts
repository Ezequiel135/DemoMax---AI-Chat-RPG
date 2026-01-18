
import { Component, input, output, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SocialService } from '../../services/social.service';
import { SystemAssetsService } from '../../services/core/system-assets.service';

@Component({
  selector: 'app-user-list-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-[100] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/90 backdrop-blur-sm animate-fade-in" (click)="close.emit()">
      <div class="bg-[#121212] border-t sm:border border-white/10 rounded-t-3xl sm:rounded-3xl w-full max-w-sm overflow-hidden shadow-2xl relative flex flex-col h-[70vh] sm:h-auto sm:max-h-[80vh]" (click)="$event.stopPropagation()">
        
        <!-- Header -->
        <div class="p-4 border-b border-white/5 flex justify-between items-center bg-[#121212] shrink-0">
           <h3 class="font-bold text-white text-lg">
             {{ type() === 'followers' ? 'Seguidores' : 'Seguindo' }}
           </h3>
           <button (click)="close.emit()" class="text-slate-400 hover:text-white p-2">✕</button>
        </div>

        <!-- List -->
        <div class="flex-1 overflow-y-auto custom-scroll p-2">
           @if (users().length === 0) {
             <div class="text-center py-10 text-slate-500 text-sm">
                Ninguém aqui ainda.
             </div>
           }

           @for (user of users(); track user) {
              <div class="flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-colors group">
                 <div class="flex items-center gap-3">
                    <div class="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-white/10">
                       <img [src]="assets.getIcon()" class="w-full h-full object-cover">
                    </div>
                    <div class="flex flex-col">
                       <span class="font-bold text-white text-sm">{{ user }}</span>
                       <span class="text-[10px] text-slate-500">@{{ user }}</span>
                    </div>
                 </div>

                 <!-- Actions -->
                 @if (type() === 'followers') {
                    <button (click)="removeFollower(user)" class="text-xs bg-slate-800 hover:bg-red-900/50 hover:text-red-400 text-slate-300 px-3 py-1.5 rounded-lg font-bold border border-white/10 transition-colors">
                       Remover
                    </button>
                 } @else {
                    <button (click)="unfollow(user)" class="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-lg font-bold border border-white/10 transition-colors">
                       Seguindo
                    </button>
                 }
              </div>
           }
        </div>

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class UserListModalComponent {
  type = input.required<'followers' | 'following'>();
  users = input.required<string[]>();
  close = output();
  
  social = inject(SocialService);
  assets = inject(SystemAssetsService);

  removeFollower(username: string) {
    if (confirm(`Remover @${username} dos seus seguidores?`)) {
      this.social.removeFollowerUser(username);
    }
  }

  unfollow(username: string) {
    if (confirm(`Deixar de seguir @${username}?`)) {
      this.social.toggleFollowUser(username);
    }
  }
}
