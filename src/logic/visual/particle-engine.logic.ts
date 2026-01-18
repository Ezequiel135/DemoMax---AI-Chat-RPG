
export interface Particle {
  id: number;
  x: number;
  y: number;
  color: string;
  size: number;
  velocity: { x: number; y: number };
  life: number;
}

export function createConfettiExplosion(startX: number, startY: number, count: number, startId: number): Particle[] {
    const colors = ['#ec4899', '#8b5cf6', '#f472b6', '#fbbf24', '#ffffff'];
    const particles: Particle[] = [];
    let currentId = startId;

    const safeCount = Math.min(count, 30);

    for (let i = 0; i < safeCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = 2 + Math.random() * 5;
      
      particles.push({
        id: currentId++,
        x: startX,
        y: startY,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 4 + Math.random() * 6,
        velocity: {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed - 5 
        },
        life: 1.0
      });
    }
    return particles;
}

export function updateParticles(particles: Particle[]): Particle[] {
    const nextParticles: Particle[] = [];
      
    for (const p of particles) {
      if (p.life > 0.05) {
        nextParticles.push({
          id: p.id,
          x: p.x + p.velocity.x,
          y: p.y + p.velocity.y,
          color: p.color,
          size: p.size,
          velocity: {
            x: p.velocity.x * 0.95, // Air resistance
            y: p.velocity.y + 0.4   // Gravity
          },
          life: p.life - 0.02
        });
      }
    }
    return nextParticles;
}
