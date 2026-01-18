
import { Component, inject, signal, effect, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { VnService } from '../../services/vn.service';
import { VnScene } from '../../models/vn.model';
import { EconomyService } from '../../services/economy.service';
import { ToastService } from '../../services/toast.service';
import { VisualEffectsService } from '../../services/visual-effects.service';
import { ActivityService } from '../../services/activity.service';
import { VnEngineLogic } from '../../logic/vn/runtime/vn-engine.logic';

@Component({
  selector: 'app-vn-player',
  imports: [CommonModule, RouterLink],
  templateUrl: './vn-player.component.html',
  styles: [`
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

  novel = signal<any>(null);
  
  // Usando motor de lógica real
  engineState = signal<any>({ currentSceneId: '', gameEnded: false, isTyping: true, displayedText: '' });
  
  rewardCoins = 0;
  private typeTimeout: any;

  currentScene = computed(() => {
    const n = this.novel();
    const state = this.engineState();
    if (state.gameEnded || !n) return null;
    return n.scenes.find((s: VnScene) => s.id === state.currentSceneId);
  });

  creditsData = computed(() => {
    return this.novel() ? VnEngineLogic.getCredits(this.novel()) : null;
  });

  constructor() {
    const novelId = this.route.snapshot.paramMap.get('id') || '';
    
    // Assegura que dados estejam carregados
    this.vnService.initializeData().then(() => {
        const vn = this.vnService.getNovelById(novelId);
        if (vn) {
          this.novel.set(vn);
          this.engineState.set(VnEngineLogic.initialize(vn));
          
          // Increment play count
          vn.playCount = (vn.playCount || 0) + 1;
          this.vnService.saveNovel(vn);
        } else {
          this.exit();
        }
    });

    effect(() => {
      const state = this.engineState();
      if (state.gameEnded) {
          if (this.rewardCoins === 0) this.triggerEndGame();
          return;
      }

      const scene = this.currentScene();
      if (scene) {
        // Reinicia datilografia se a cena mudou
        this.startTypewriter(scene.dialogue);
        this.activityService.trackNovel(this.novel(), scene.name);
      } else if (this.novel()) {
        // Fallback if scene ID invalid
        this.engineState.update(s => ({ ...s, gameEnded: true }));
      }
    }, { allowSignalWrites: true });
  }

  triggerEndGame() {
    this.rewardCoins = 100;
    this.economy.addXp(100);
    this.economy.earnCoins(20, 'VN Clear');
    this.fxService.triggerConfetti(window.innerWidth / 2, window.innerHeight / 2, 100);
  }

  // Visual Helpers
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
    if(effect === 'rain') return 'fx-rain';
    if(effect === 'snow') return 'fx-snow';
    return '';
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

  // Typewriter Logic (UI)
  startTypewriter(text: string) {
    if (this.typeTimeout) clearTimeout(this.typeTimeout);
    
    this.engineState.update(s => ({ ...s, displayedText: '', isTyping: true }));
    
    let i = 0;
    const speed = 25; 
    
    const type = () => {
      const current = this.engineState().displayedText;
      if (i < text.length) {
        this.engineState.update(s => ({ ...s, displayedText: current + text.charAt(i) }));
        i++;
        this.typeTimeout = setTimeout(type, speed);
      } else {
        this.engineState.update(s => ({ ...s, isTyping: false }));
      }
    };
    type();
  }

  handleDialogueClick() {
    const state = this.engineState();
    
    if (state.isTyping) {
      this.completeTyping();
      return;
    }
    
    const scene = this.currentScene();
    if (!scene) return;
    
    // Se tiver escolhas, o clique na caixa de diálogo não faz nada (usuário deve clicar no botão)
    if (scene.choices && scene.choices.length > 0) return; 
    
    // Se for linear, avança
    const nextId = VnEngineLogic.getNextSceneId(scene);
    this.goToScene(nextId);
  }

  completeTyping() {
    clearTimeout(this.typeTimeout);
    const scene = this.currentScene();
    if (scene) {
        this.engineState.update(s => ({ ...s, displayedText: scene.dialogue, isTyping: false }));
    }
  }

  goToScene(id: string | null) {
    if (!id) return;
    
    if (id === '__END__') {
       this.engineState.update(s => ({ ...s, gameEnded: true }));
    } else {
       this.engineState.update(s => ({ ...s, currentSceneId: id, displayedText: '', isTyping: true }));
    }
  }

  restart() {
    const vn = this.novel();
    if (vn) {
      this.rewardCoins = 0;
      this.engineState.set(VnEngineLogic.initialize(vn));
    }
  }

  exit() {
    this.router.navigate(['/vn']);
  }
}
