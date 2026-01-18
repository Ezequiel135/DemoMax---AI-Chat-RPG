
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../components/ui/logo.component';
import { AuthService } from '../../services/auth.service';
import { BootService } from '../../services/core/boot.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  template: `
    <div class="fixed inset-0 bg-[#0F0E17] flex flex-col items-center justify-center overflow-hidden z-50">
      
      <!-- Background Gradients -->
      <div class="absolute inset-0 opacity-40">
        <div class="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-purple-500/30 rounded-full blur-[100px] animate-pulse-fast"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-pink-500/30 rounded-full blur-[100px] animate-pulse-fast" style="animation-delay: 0.5s;"></div>
      </div>

      <div class="relative z-10 flex flex-col items-center animate-fade-in-up w-full max-w-xs">
        <div class="mb-8 transform scale-110">
           <app-logo size="hero"></app-logo>
        </div>
        
        <!-- Loading Bar Container -->
        <div class="w-full h-1 bg-slate-800 rounded-full overflow-hidden mb-4 relative">
           <!-- Progress Fill -->
           <div class="absolute top-0 bottom-0 left-0 bg-gradient-to-r from-pink-500 to-purple-500 transition-all duration-200 ease-linear shadow-[0_0_10px_rgba(236,72,153,0.5)]"
                [style.width.%]="boot.progress()"></div>
        </div>

        <!-- Terminal Status -->
        <div class="flex justify-between w-full text-[10px] font-mono font-bold tracking-widest text-slate-500">
           <span class="animate-pulse">{{ boot.statusMessage() }}</span>
           <span>{{ boot.progress() }}%</span>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in-up {
      animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    .animate-pulse-fast {
      animation: pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; }
      50% { opacity: .5; }
    }
  `]
})
export class SplashComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);
  boot = inject(BootService);

  async ngOnInit() {
    await this.boot.initializeApp();
    this.navigate();
    this.boot.startBackgroundLoading();
  }

  private navigate() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/auth']);
    }
  }
}
