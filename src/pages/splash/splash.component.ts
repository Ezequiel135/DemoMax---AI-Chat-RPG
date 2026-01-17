
import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LogoComponent } from '../../components/ui/logo.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-splash',
  standalone: true,
  imports: [CommonModule, LogoComponent],
  template: `
    <div class="fixed inset-0 bg-[#0F0E17] flex flex-col items-center justify-center overflow-hidden z-50 cursor-pointer"
         (click)="skip()">
      
      <!-- Background Gradients (Soft & Dreamy) -->
      <div class="absolute inset-0 opacity-40">
        <div class="absolute top-[-10%] left-[-10%] w-[50vh] h-[50vh] bg-purple-500/30 rounded-full blur-[100px] animate-float-slow"></div>
        <div class="absolute bottom-[-10%] right-[-10%] w-[50vh] h-[50vh] bg-pink-500/30 rounded-full blur-[100px] animate-float-slow-reverse"></div>
      </div>

      <div class="relative z-10 flex flex-col items-center animate-fade-in-up">
        <app-logo size="hero"></app-logo>
        
        <p class="mt-4 text-pink-200/80 font-medium tracking-wide text-sm animate-pulse">
          Your story begins here...
        </p>
      </div>
      
      <!-- Subtle Loading Indicator -->
      <div class="absolute bottom-12 flex gap-2">
        <div class="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0s"></div>
        <div class="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.1s"></div>
        <div class="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
      </div>
    </div>
  `,
  styles: [`
    .animate-float-slow { animation: float 10s ease-in-out infinite alternate; }
    .animate-float-slow-reverse { animation: float 12s ease-in-out infinite alternate-reverse; }
    
    @keyframes float {
      0% { transform: translate(0, 0); }
      100% { transform: translate(30px, 20px); }
    }

    .animate-fade-in-up {
      animation: fadeInUp 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    }
    @keyframes fadeInUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
  `]
})
export class SplashComponent implements OnInit {
  private router = inject(Router);
  private auth = inject(AuthService);

  ngOnInit() {
    setTimeout(() => {
      this.navigate();
    }, 2500);
  }

  skip() {
    this.navigate();
  }

  private navigate() {
    if (this.auth.isAuthenticated()) {
      this.router.navigate(['/home']);
    } else {
      this.router.navigate(['/auth']);
    }
  }
}
