
import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { BackgroundComponent } from './components/visual/background.component';
import { VisualEffectsOverlayComponent } from './components/visual/visual-effects-overlay.component';
import { ToastContainerComponent } from './components/ui/toast-container.component';
import { LevelUpToastComponent } from './components/ui/level-up-toast.component';
import { AuthRequirementModalComponent } from './components/ui/auth-requirement-modal.component';
import { CrisisModalComponent } from './components/ui/crisis-modal.component';
import { BottomNavComponent } from './components/ui/bottom-nav.component';
import { OptimizationManagerService } from './services/core/optimization-manager.service';
import { SystemAssetsService } from './services/core/system-assets.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    BackgroundComponent, 
    VisualEffectsOverlayComponent, 
    ToastContainerComponent, 
    LevelUpToastComponent, 
    AuthRequirementModalComponent, 
    CrisisModalComponent,
    BottomNavComponent
  ],
  template: `
    <app-background></app-background>
    <app-visual-effects-overlay></app-visual-effects-overlay>
    <app-toast-container></app-toast-container>
    <app-level-up-toast></app-level-up-toast>
    <app-auth-requirement-modal></app-auth-requirement-modal>
    <app-crisis-modal></app-crisis-modal>
    
    <router-outlet></router-outlet>
    
    <!-- Mobile Navigation -->
    <app-bottom-nav></app-bottom-nav>
  `
})
export class AppComponent {
  // Injeta o otimizador para iniciar o ciclo de vida de memória assim que o app abrir
  private optimizer = inject(OptimizationManagerService);
  
  // Injeta o Assets Service para pré-carregar o ícone na memória imediatamente
  private assets = inject(SystemAssetsService);
}
