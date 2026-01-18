
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { BackgroundComponent } from '../../components/visual/background.component';

@Component({
  selector: 'app-onboarding',
  standalone: true,
  imports: [CommonModule, FormsModule, BackgroundComponent],
  template: `
    <app-background></app-background>
    
    <div class="min-h-screen flex items-center justify-center p-6 page-enter">
      <div class="w-full max-w-lg bg-slate-900/90 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative">
        
        <!-- Progress Steps -->
        <div class="flex justify-between mb-8 px-4">
           @for (step of [1, 2, 3]; track step) {
             <div class="flex flex-col items-center gap-2">
               <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors duration-500"
                    [class.bg-pink-600]="currentStep() >= step"
                    [class.text-white]="currentStep() >= step"
                    [class.bg-slate-800]="currentStep() < step"
                    [class.text-slate-500]="currentStep() < step">
                 {{ step }}
               </div>
             </div>
             @if (step < 3) {
               <div class="flex-1 h-0.5 bg-slate-800 mt-4 mx-2">
                 <div class="h-full bg-pink-600 transition-all duration-500" 
                      [style.width.%]="currentStep() > step ? 100 : 0"></div>
               </div>
             }
           }
        </div>

        @if (currentStep() === 1) {
          <div class="animate-fade-in space-y-6">
            <h2 class="text-2xl font-bold text-white text-center">Identidade</h2>
            <div class="space-y-2">
              <label class="text-xs uppercase font-bold text-slate-500">Username</label>
              <input [(ngModel)]="username" type="text" placeholder="Ex: NeonBlade" 
                     class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white focus:border-pink-500 focus:outline-none">
            </div>
            <button (click)="nextStep()" [disabled]="!username" class="w-full py-3 bg-pink-600 rounded-xl text-white font-bold hover:bg-pink-500 transition-colors disabled:opacity-50">Próximo</button>
          </div>
        }

        @if (currentStep() === 2) {
          <div class="animate-fade-in space-y-6">
            <h2 class="text-2xl font-bold text-white text-center">Avatar</h2>
            <div class="grid grid-cols-3 gap-4">
              @for (av of avatarOptions; track av) {
                <button (click)="selectedAvatar = av" 
                        class="relative aspect-square rounded-xl overflow-hidden border-2 transition-all group"
                        [class.border-pink-500]="selectedAvatar === av"
                        [class.border-transparent]="selectedAvatar !== av">
                  <img [src]="av" class="w-full h-full object-cover group-hover:scale-110 transition-transform">
                </button>
              }
            </div>
            <div class="flex gap-3">
              <button (click)="currentStep.set(1)" class="flex-1 py-3 border border-slate-600 rounded-xl text-slate-300">Voltar</button>
              <button (click)="nextStep()" class="flex-1 py-3 bg-pink-600 rounded-xl text-white font-bold">Próximo</button>
            </div>
          </div>
        }

        @if (currentStep() === 3) {
          <div class="animate-fade-in space-y-6">
            <h2 class="text-2xl font-bold text-white text-center">Personalidade</h2>
            <textarea [(ngModel)]="bio" rows="4" placeholder="Fale um pouco sobre você..." 
                     class="w-full bg-slate-800 border border-slate-700 rounded-xl px-4 py-3 text-white resize-none"></textarea>
            
            <div class="flex gap-3">
              <button (click)="currentStep.set(2)" class="flex-1 py-3 border border-slate-600 rounded-xl text-slate-300">Voltar</button>
              <button (click)="finish()" class="flex-1 py-3 bg-gradient-to-r from-pink-600 to-violet-600 rounded-xl text-white font-bold">Entrar</button>
            </div>
          </div>
        }

      </div>
    </div>
  `,
  styles: [`
    .animate-fade-in { animation: fadeIn 0.4s ease-out; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  `]
})
export class OnboardingComponent {
  auth = inject(AuthService);
  
  currentStep = signal(1);
  username = '';
  selectedAvatar = 'https://picsum.photos/seed/u1/200/200';
  bio = '';

  avatarOptions = [
    'https://picsum.photos/seed/u1/200/200',
    'https://picsum.photos/seed/u2/200/200',
    'https://picsum.photos/seed/u3/200/200',
    'https://picsum.photos/seed/u4/200/200',
    'https://picsum.photos/seed/u5/200/200',
    'https://picsum.photos/seed/u6/200/200',
  ];

  nextStep() {
    this.currentStep.update(v => v + 1);
  }

  finish() {
    this.auth.completeOnboarding(this.username, this.selectedAvatar, this.bio);
  }
}
