
import { Injectable, signal } from '@angular/core';

export interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  life: number;
}

@Injectable({
  providedIn: 'root'
})
export class VisualEffectsService {
  particles = signal<Particle[]>([]);
  private nextId = 0;

  triggerConfetti(x: number, y: number, count = 20) {
    const colors = ['#ec4899', '#8b5cf6', '#f472b6', '#fbbf24', '#ffffff'];
    const newParticles: Particle[] = [];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      
      newParticles.push({
        id: this.nextId++,
        x: x,
        y: y,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed - 5 // Initial upward burst
        },
        life: 1.0
      });
    }

    this.particles.update(p => [...p, ...newParticles]);
    this.animate();
  }

  private animate() {
    requestAnimationFrame(() => {
      let activeParticles = this.particles();
      
      if (activeParticles.length === 0) return;

      activeParticles = activeParticles.map(p => ({
        ...p,
        x: p.x + p.velocity.x,
        y: p.y + p.velocity.y,
        velocity: {
          x: p.velocity.x * 0.98, // Air resistance
          y: p.velocity.y + 0.3   // Gravity
        },
        life: p.life - 0.02
      })).filter(p => p.life > 0);

      this.particles.set(activeParticles);

      if (activeParticles.length > 0) {
        this.animate();
      }
    });
  }
}
