
import { Component, inject, signal, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GeminiService } from '../../services/gemini.service';
import { EconomyService } from '../../services/economy.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-image-gen-modal',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-sm animate-fade-in">
       <div class="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
          
          <!-- Header -->
          <div class="p-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
             <h3 class="text-lg font-bold text-white flex items-center gap-2 font-tech">
               <span class="text-pink-500">🎨</span> Neural Art Gen
             </h3>
             <button (click)="close.emit()" class="text-slate-400 hover:text-white">✕</button>
          </div>

          <div class="p-6 flex-1 overflow-y-auto">
             
             <!-- PROMPT STAGE -->
             @if (state() === 'idle' || state() === 'generating') {
               <div class="space-y-4">
                 <p class="text-sm text-slate-400">Describe the scene. Cost: <span class="text-pink-400 font-bold">50 SC</span></p>
                 <textarea [(ngModel)]="prompt" rows="3" placeholder="e.g. Cyberpunk street in rain..." class="w-full bg-slate-800 rounded-xl p-3 text-white focus:border-pink-500 border border-slate-700"></textarea>
                 
                 <div class="flex justify-between items-center">
                    <span class="text-xs text-slate-500">Balance: {{ economy.sakuraCoins() }} SC</span>
                    <button (click)="generate()" 
                            [disabled]="state() === 'generating' || !prompt"
                            class="px-6 py-2 bg-pink-600 rounded-full text-white font-bold hover:bg-pink-500 disabled:opacity-50 transition-all">
                       @if(state() === 'generating') { <span class="animate-spin inline-block mr-1">↻</span> }
                       Generate (-50)
                    </button>
                 </div>
               </div>
             }

             <!-- PREVIEW STAGE (Blurred) -->
             @if (state() === 'preview') {
               <div class="relative rounded-xl overflow-hidden border border-slate-700 group">
                  <!-- Blurred Image -->
                  <img [src]="imageUrl()" class="w-full aspect-square object-cover blur-md scale-105 opacity-50 transition-all duration-700">
                  
                  <!-- Watermark Overlay -->
                  <div class="absolute inset-0 flex items-center justify-center pointer-events-none">
                     <span class="text-3xl font-bold text-white/20 -rotate-12 select-none" style="font-family: 'Quicksand', sans-serif;">デモMax PREVIEW</span>
                  </div>

                  <!-- Lock Overlay -->
                  <div class="absolute inset-0 flex flex-col items-center justify-center bg-black/40 backdrop-blur-sm">
                     <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-pink-500 mb-2" viewBox="0 0 20 20" fill="currentColor">
                       <path fill-rule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clip-rule="evenodd" />
                     </svg>
                     <p class="text-white font-bold mb-4">Unlock High-Res</p>
                     <button (click)="unlock()" class="px-8 py-3 bg-gradient-to-r from-pink-600 to-violet-600 rounded-full text-white font-bold hover:shadow-lg hover:shadow-pink-500/30 transition-all">
                        Unlock (-50 SC)
                     </button>
                     <button (click)="reset()" class="mt-4 text-xs text-slate-400 hover:text-white underline">Discard</button>
                  </div>
               </div>
             }

             <!-- UNLOCKED STAGE -->
             @if (state() === 'unlocked') {
               <div class="space-y-4">
                  <div class="relative rounded-xl overflow-hidden border border-pink-500/50 shadow-[0_0_30px_rgba(236,72,153,0.15)]">
                    <img [src]="imageUrl()" class="w-full aspect-square object-cover">
                    <!-- Subtle Watermark -->
                    <div class="absolute bottom-2 right-2 opacity-50 text-[10px] text-white font-bold drop-shadow-md" style="font-family: 'Quicksand', sans-serif;">デモMax</div>
                  </div>
                  
                  <div class="flex gap-2">
                     <a [href]="imageUrl()" download="demomax_gen.jpg" class="flex-1 py-3 bg-slate-800 hover:bg-slate-700 border border-slate-600 rounded-xl text-center text-white font-bold transition-colors flex items-center justify-center gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
                        Download
                     </a>
                     <button (click)="reset()" class="flex-1 py-3 bg-pink-600 hover:bg-pink-500 rounded-xl text-white font-bold transition-colors">
                        New Gen
                     </button>
                  </div>
               </div>
             }
          </div>
          
          <!-- Footer: Earn Coins -->
          <div class="p-4 bg-slate-950 border-t border-slate-800 flex justify-between items-center">
             <span class="text-xs text-slate-500">Need more coins?</span>
             <button (click)="watchAd()" 
                     [disabled]="adLoading()"
                     class="text-xs font-bold text-yellow-400 hover:text-yellow-300 flex items-center gap-1 border border-yellow-500/30 px-3 py-1.5 rounded-full hover:bg-yellow-500/10 transition-colors disabled:opacity-50 disabled:cursor-wait">
               @if(adLoading()) {
                 <span class="w-3 h-3 rounded-full border-2 border-yellow-400 border-t-transparent animate-spin"></span>
               } @else {
                 <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clip-rule="evenodd" /></svg>
               }
               Watch Ad (+50 SC)
             </button>
          </div>
       </div>
    </div>
  `
})
export class ImageGenModalComponent {
  economy = inject(EconomyService);
  gemini = inject(GeminiService);
  toast = inject(ToastService);
  
  close = output();

  prompt = '';
  state = signal<'idle' | 'generating' | 'preview' | 'unlocked'>('idle');
  imageUrl = signal<string | null>(null);
  
  adLoading = signal(false);

  async generate() {
    if (!this.economy.spendCoins(50)) {
       this.toast.show("Insufficient Sakura Coins!", "error");
       return;
    }
    
    this.state.set('generating');
    try {
      const result = await this.gemini.generateCharacterImage(this.prompt);
      if (result) {
        this.imageUrl.set(result);
        this.state.set('preview');
      } else {
        this.toast.show("Generation failed. Coins refunded.", "error");
        this.economy.earnCoins(50); // Refund
        this.state.set('idle');
      }
    } catch (e) {
      this.economy.earnCoins(50); // Refund
      this.state.set('idle');
    }
  }

  unlock() {
    if (!this.economy.spendCoins(50)) {
       this.toast.show("Insufficient Sakura Coins for Unlock!", "error");
       return;
    }
    this.state.set('unlocked');
    this.toast.show("Image Decrypted Successfully.", "success");
  }

  reset() {
    this.prompt = '';
    this.imageUrl.set(null);
    this.state.set('idle');
  }

  watchAd() {
    this.adLoading.set(true);
    // Simulate Ad Duration (3 seconds) to be "Real" work
    setTimeout(() => {
       this.economy.watchAdForReward();
       this.adLoading.set(false);
    }, 3000);
  }
}
