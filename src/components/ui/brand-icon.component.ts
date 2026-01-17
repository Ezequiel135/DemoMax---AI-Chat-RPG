
import { Component, input, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { SystemAssetsService } from '../../services/core/system-assets.service';

@Component({
  selector: 'app-brand-icon',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  template: `
    <div [class]="containerClass()" class="relative rounded-xl overflow-hidden shadow-lg border border-pink-200/20 group select-none">
      
      <!-- Background: Soft Pink Gradient -->
      <div class="absolute inset-0 bg-gradient-to-b from-pink-100 to-pink-200"></div>

      <!-- Main Character Image -->
      <div class="absolute inset-0 flex items-end justify-center">
         <img [ngSrc]="assets.getIcon()" 
              fill
              priority
              alt="App Icon" 
              class="object-cover transform scale-110 translate-y-[5%] group-hover:scale-125 transition-transform duration-500">
      </div>

      <!-- Top Center Star -->
      <div class="absolute top-0.5 left-1/2 -translate-x-1/2 z-10 filter drop-shadow-[0_0_5px_rgba(253,224,71,0.8)]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-3 h-3 text-yellow-300 animate-pulse">
          <path fill-rule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z" clip-rule="evenodd" />
        </svg>
      </div>

      <!-- Bottom Right Heart -->
      <div class="absolute bottom-0.5 right-0.5 z-10 filter drop-shadow-md">
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-2.5 h-2.5 text-pink-500 animate-bounce">
            <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
         </svg>
      </div>

      <!-- Glass Gloss Overlay -->
      <div class="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none"></div>
    </div>
  `,
  styles: [`
    :host { display: block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BrandIconComponent {
  assets = inject(SystemAssetsService);
  size = input<'sm' | 'md' | 'lg'>('md');

  containerClass() {
    switch (this.size()) {
      case 'sm': return 'w-8 h-8';
      case 'md': return 'w-10 h-10';
      case 'lg': return 'w-16 h-16';
      default: return 'w-10 h-10';
    }
  }
}
