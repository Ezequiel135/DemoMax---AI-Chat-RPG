
import { Component, input, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-logo',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div [class]="containerClass()" class="font-bold tracking-tight inline-flex items-center gap-1 select-none">
      <!-- Icon/Emoji replacement for tech Katakana -->
      <span class="text-pink-500 relative top-[1px]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="w-[1em] h-[1em]">
          <path d="M11.645 20.91l-.007-.003-.022-.012a15.247 15.247 0 01-.383-.218 25.18 25.18 0 01-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0112 5.052 5.5 5.5 0 0116.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 01-4.244 3.17 15.247 15.247 0 01-.383.219l-.022.012-.007.004-.003.001a.752.752 0 01-.704 0l-.003-.001z" />
        </svg>
      </span>
      
      <!-- Softer Typography -->
      <span class="relative">
        <span class="bg-clip-text text-transparent bg-gradient-to-r from-white to-pink-200" style="font-family: 'Quicksand', sans-serif;">デモMax</span>
      </span>
    </div>
  `,
  styles: [`
    :host { display: inline-block; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LogoComponent {
  size = input<'sm' | 'md' | 'xl' | 'hero'>('md');

  containerClass() {
    switch (this.size()) {
      case 'sm': return 'text-lg';
      case 'md': return 'text-2xl';
      case 'xl': return 'text-4xl';
      case 'hero': return 'text-5xl md:text-6xl';
      default: return 'text-2xl';
    }
  }
}
