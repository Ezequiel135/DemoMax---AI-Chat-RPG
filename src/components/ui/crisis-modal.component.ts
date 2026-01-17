
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ModerationOrchestratorService } from '../../services/moderation/moderation-orchestrator.service';

@Component({
  selector: 'app-crisis-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    @if (moderation.showCrisisModal()) {
      <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-950/95 backdrop-blur-xl animate-fade-in">
        
        <div class="max-w-md w-full text-center space-y-6">
          <!-- Icon -->
          <div class="mx-auto w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center animate-pulse">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
               <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
             </svg>
          </div>

          <div>
            <h2 class="text-3xl font-bold text-white mb-2">You are not alone.</h2>
            <p class="text-slate-300 leading-relaxed">
              It seems like you might be going through a difficult time. 
              There are people who want to listen and help, free of judgment.
            </p>
          </div>

          <div class="space-y-4">
             <!-- CVV Brazil -->
             <a href="tel:188" class="block w-full py-4 bg-red-600 hover:bg-red-500 text-white rounded-xl font-bold text-lg shadow-lg shadow-red-600/30 transition-all transform hover:scale-105">
                Call 188 (CVV Brazil)
             </a>
             
             <!-- Global Text -->
             <a href="https://www.befrienders.org/" target="_blank" class="block w-full py-4 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-bold transition-all border border-slate-600">
                Find International Support
             </a>
          </div>

          <button (click)="moderation.closeCrisisModal()" class="text-slate-500 hover:text-white text-sm underline mt-8">
             I am safe, close this window
          </button>
        </div>

      </div>
    }
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.3s ease-out; }
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  `]
})
export class CrisisModalComponent {
  moderation = inject(ModerationOrchestratorService);
}
