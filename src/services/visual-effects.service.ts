
import { Injectable, signal, NgZone, inject } from '@angular/core';
import { Particle, createConfettiExplosion, updateParticles } from '../logic/visual/particle-engine.logic';

@Injectable({
  providedIn: 'root'
})
export class VisualEffectsService {
  private ngZone = inject(NgZone);
  particles = signal<Particle[]>([]);
  private nextId = 0;
  private isAnimating = false;

  triggerConfetti(x: number, y: number, count = 15) {
    // Reduzido count padrão para otimização em mobile
    const newParticles = createConfettiExplosion(x, y, count, this.nextId);
    this.nextId += newParticles.length;

    this.particles.update(p => [...p, ...newParticles]);
    
    if (!this.isAnimating) {
      this.isAnimating = true;
      // Executa fora do Angular Zone para não disparar Change Detection a cada frame (Performance boost massivo)
      this.ngZone.runOutsideAngular(() => {
        this.animate();
      });
    }
  }

  private animate() {
    if (!this.isAnimating) return;

    requestAnimationFrame(() => {
      const currentParticles = this.particles();
      
      if (currentParticles.length === 0) {
        this.isAnimating = false;
        return;
      }

      const nextParticles = updateParticles(currentParticles);
      
      // Só atualiza o sinal (e dispara a UI) se houver mudança relevante ou em intervalos
      // Mas para fluidez, precisamos atualizar. O segredo é ter poucas partículas.
      this.ngZone.run(() => {
         this.particles.set(nextParticles);
      });

      if (nextParticles.length > 0) {
        this.animate();
      } else {
        this.isAnimating = false;
      }
    });
  }
}
