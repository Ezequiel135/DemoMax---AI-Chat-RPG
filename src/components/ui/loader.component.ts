
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loader',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass()" class="relative flex items-center justify-center">
      <!-- Rotating Container -->
      <div class="absolute inset-0 animate-spin-slow">
        <!-- Heart 1 (Top) -->
        <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2">
           <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-pink-500 drop-shadow-[0_0_8px_rgba(236,72,153,0.6)]">
             <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
           </svg>
        </div>
        <!-- Heart 2 (Bottom Right) -->
        <div class="absolute bottom-[10%] right-[10%] rotate-[120deg] origin-center">
           <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-violet-500 drop-shadow-[0_0_8px_rgba(139,92,246,0.6)]">
             <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
           </svg>
        </div>
        <!-- Heart 3 (Bottom Left) -->
        <div class="absolute bottom-[10%] left-[10%] rotate-[240deg] origin-center">
           <svg viewBox="0 0 24 24" fill="currentColor" class="w-full h-full text-pink-300 drop-shadow-[0_0_8px_rgba(249,168,212,0.6)]">
             <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
           </svg>
        </div>
      </div>
      
      <!-- Center Glow Pulse -->
      <div class="absolute w-1/2 h-1/2 bg-white/20 rounded-full blur-md animate-pulse"></div>
    </div>
  `,
  styles: [`
    .animate-spin-slow {
      animation: spin 3s linear infinite;
    }
    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoaderComponent {
  size = input<'sm' | 'md' | 'lg'>('md');

  containerClass() {
    switch (this.size()) {
      case 'sm': return 'w-6 h-6';
      case 'md': return 'w-12 h-12';
      case 'lg': return 'w-24 h-24';
      default: return 'w-12 h-12';
    }
  }
}
