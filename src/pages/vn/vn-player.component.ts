
import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VnService } from '../../services/vn.service';
import { VnScene, VnCredits } from '../../models/vn.model';
import { EconomyService } from '../../services/economy.service';
import { ToastService } from '../../services/toast.service';
import { VisualEffectsService } from '../../services/visual-effects.service';
import { ActivityService } from '../../services/activity.service';

@Component({
  selector: 'app-vn-player',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './vn-player.component.html',
  styles: [`
    /* Same styles as before */
    .text-shadow { text-shadow: 0 2px 4px rgba(0,0,0,0.5); }
    .fx-rain { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity: 0.1; animation: rain 1s linear infinite; }
    .fx-snow { background-image: url('https://www.transparenttextures.com/patterns/stardust.png'); opacity: 0.2; animation: snow 5s linear infinite; }
    .animate-fade-in { animation: fadeIn 1s ease-out forwards; }
    .animate-zoom-in { animation: zoomIn 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-slide-left { animation: slideLeft 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-slide-right { animation: slideRight 1s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
    .animate-char-fade-in { animation: fadeIn 0.8s ease-out forwards; }
    .animate-char-slide-up { animation: slideUp 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards; }
    .animate-char-shake { animation: shake 0.5s ease-in-out; }
    .animate-char-hop { animation: hop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275); }
    .animate-char-pulse { animation: pulse 1s ease-in-out infinite; }
    .animate-shine { animation: shine 3s infinite; }
    .animate-scroll-up { animation: scrollUp 20s linear forwards; }
    
    @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
    @keyframes zoomIn { from { transform: scale(0.9); opacity: 0; } to { transform: scale(1); opacity: 1; } }
    @keyframes slideLeft { from { transform: translateX(5%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideRight { from { transform: translateX(-5%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    @keyframes slideUp { from { transform: translateX(-50%) translateY(50px); opacity: 0; } to { transform: translateX(-50%) translateY(0); opacity: 1; } }
    @keyframes shake { 0%, 100% { transform: translateX(-50%); } 25% { transform: translateX(-51%); } 75% { transform: translateX(-49%); } }
    @keyframes hop { 0%, 100% { transform: translateX(-50%) translateY(0); } 50% { transform: translateX(-50%) translateY(-20px); } }
    @keyframes pulse { 0%, 100% { transform: translateX(-50%) scale(1); } 50% { transform: translateX(-50%) scale(1.02); } }
    @keyframes shine { 0% { transform: translateX(-100%); } 20% { transform: translateX(100%); } 100% { transform: translateX(100%); } }
    @keyframes rain { 0% { background-position: 0 0; } 100% { background-position: 0 100px; } }
    @keyframes snow { 0% { background-position: 0 0; } 100% { background-position: 50px 200px; } }
    @keyframes scrollUp { from { transform: translateY(100%); } to { transform: translateY(-120%); } }
  `]
})
export class VnPlayerComponent {
  route = inject(ActivatedRoute);
  router = inject(Router);
  vnService = inject(VnService);
  economy = inject(EconomyService);
  toast = inject(ToastService);
  fxService = inject(VisualEffectsService);
  activityService = inject(ActivityService);

  novelId = '';
  novel = signal<any>(null);
  currentSceneId = signal<string>('');
  
  // Game State
  gameEnded = signal(false);
  rewardCoins = 0;
  
  // Typing Effect
  displayedText = signal('');
  isTyping = signal(false);
  private typeTimeout: any;

  currentScene = computed(() => {
    const n = this.novel();
    // If game ended, force scene to null to trigger else block template
    if (this.gameEnded() || !n) return null;
    
    return n.scenes.find((s: VnScene) => s.id === this.currentSceneId());
  });

  creditsData = computed<VnCredits | null>(() => {
    const n = this.novel();
    if (!n) return null;
    return n.credits || {
       enabled: true,
       endingTitle: 'FIM',
       scrollingText: 'Obrigado por jogar!',
       backgroundImageUrl: n.coverUrl
    };
  });

  constructor() {
    this.novelId = this.route.snapshot.paramMap.get('id') || '';
    const vn = this.vnService.getNovelById(this.novelId);
    if (vn) {
      this.novel.set(vn);
      this.currentSceneId.set(vn.startSceneId);
    } else {
      this.exit();
    }

    effect(() => {
      // Check if scene is valid or if it's the end
      if (this.gameEnded()) return;

      const n = this.novel();
      if (!n) return;
      
      const scene = n.scenes.find((s: VnScene) => s.id === this.currentSceneId());

      if (scene) {
        this.startTypewriter(scene.dialogue);
        this.activityService.trackNovel(n, scene.name);
      } else {
        // SCENE NOT FOUND => END GAME
        // This handles both explicit null/empty nextSceneId AND invalid IDs
        this.triggerEndGame();
      }
    }, { allowSignalWrites: true });
  }

  triggerEndGame() {
    if (this.gameEnded()) return; // Prevent double trigger
    
    this.gameEnded.set(true);
    
    // No coins for VNs
    this.rewardCoins = 0;
    
    this.economy.addXp(100);
    
    this.fxService.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
  }

  getTransitionClass(transition: string | undefined): string {
    switch (transition) {
      case 'fade': return 'animate-fade-in';
      case 'slide-left': return 'animate-slide-left';
      case 'slide-right': return 'animate-slide-right';
      case 'zoom-in': return 'animate-zoom-in';
      default: return 'animate-fade-in';
    }
  }

  getWeatherClass(effect: string | undefined): string {
    switch (effect) {
      case 'rain': return 'fx-rain';
      case 'snow': return 'fx-snow';
      default: return '';
    }
  }

  getCharacterAnimationClass(effect: string | undefined): string {
    switch (effect) {
      case 'fade-in': return 'animate-char-fade-in';
      case 'slide-up': return 'animate-char-slide-up';
      case 'shake': return 'animate-char-shake';
      case 'hop': return 'animate-char-hop';
      case 'pulse': return 'animate-char-pulse';
      default: return '';
    }
  }

  startTypewriter(text: string) {
    if (this.typeTimeout) clearTimeout(this.typeTimeout);
    this.displayedText.set('');
    this.isTyping.set(true);
    let i = 0;
    const speed = 30; 
    const type = () => {
      if (i < text.length) {
        this.displayedText.update(s => s + text.charAt(i));
        i++;
        this.typeTimeout = setTimeout(type, speed);
      } else {
        this.isTyping.set(false);
      }
    };
    type();
  }

  handleDialogueClick() {
    if (this.isTyping()) {
      this.completeTyping();
      return;
    }
    const scene = this.currentScene();
    if (!scene) return;
    if (scene.choices && scene.choices.length > 0) return; 
    
    // Check flow
    if (scene.nextSceneId) {
        this.goToScene(scene.nextSceneId);
    } else {
        // No next scene defined => End of Novel
        // We set to a special marker or just trigger end game logic by setting invalid ID
        this.goToScene('__END__'); 
    }
  }

  completeTyping() {
    if (this.isTyping()) {
      clearTimeout(this.typeTimeout);
      const scene = this.currentScene();
      if (scene) this.displayedText.set(scene.dialogue);
      this.isTyping.set(false);
    }
  }

  goToScene(id: string) {
    clearTimeout(this.typeTimeout); 
    this.currentSceneId.set(id); 
  }

  restart() {
    const vn = this.novel();
    if (vn) {
      this.gameEnded.set(false);
      this.currentSceneId.set(vn.startSceneId);
    }
  }

  exit() {
    this.router.navigate(['/vn']);
  }
}
