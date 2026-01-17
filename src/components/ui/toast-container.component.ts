
import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-toast-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed top-4 right-4 z-[9999] flex flex-col gap-2 pointer-events-none w-full max-w-sm px-4 sm:px-0">
      @for (toast of toastService.toasts(); track toast.id) {
        <div class="pointer-events-auto transform transition-all duration-300 animate-slide-in relative overflow-hidden rounded-xl shadow-lg border backdrop-blur-md p-4 flex items-center gap-3"
             [class.border-pink-500_30]="toast.type === 'success'"
             [class.bg-slate-900_90]="toast.type === 'success'"
             [class.text-pink-100]="toast.type === 'success'"
             
             [class.border-red-500_30]="toast.type === 'error'"
             [class.bg-slate-950_90]="toast.type === 'error'"
             [class.text-red-100]="toast.type === 'error'"
             
             [class.border-blue-500_30]="toast.type === 'info'"
             [class.bg-slate-900_90]="toast.type === 'info'"
             [class.text-blue-100]="toast.type === 'info'">
          
          <!-- Icon -->
          <div class="flex-shrink-0">
            @if (toast.type === 'success') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-pink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            @if (toast.type === 'error') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            @if (toast.type === 'info') {
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          </div>

          <!-- Message -->
          <p class="text-sm font-medium">{{ toast.message }}</p>

          <!-- Close Button -->
          <button (click)="toastService.remove(toast.id)" class="ml-auto text-white/50 hover:text-white">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
          </button>
          
          <!-- Progress Bar (Pseudo) -->
          <div class="absolute bottom-0 left-0 h-0.5 bg-current opacity-30 animate-shrink" 
               [style.animation-duration.ms]="toast.duration"></div>
        </div>
      }
    </div>
  `,
  styles: [`
    .animate-slide-in {
      animation: slideIn 0.3s cubic-bezier(0.16, 1, 0.3, 1);
    }
    @keyframes slideIn {
      from { transform: translateX(100%); opacity: 0; }
      to { transform: translateX(0); opacity: 1; }
    }
    .animate-shrink {
      width: 100%;
      animation: shrink linear forwards;
    }
    @keyframes shrink {
      from { width: 100%; }
      to { width: 0%; }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastContainerComponent {
  toastService = inject(ToastService);
}
