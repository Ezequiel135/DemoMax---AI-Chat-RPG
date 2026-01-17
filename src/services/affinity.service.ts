
import { Injectable } from '@angular/core';
import { AFFINITY_LEVELS, AffinityLevel } from '../models/affinity.model';

@Injectable({
  providedIn: 'root'
})
export class AffinityService {
  
  getCurrentLevel(points: number): AffinityLevel {
    // Sort logic handled by array order, find first match
    return AFFINITY_LEVELS.find(l => points >= l.min && points < l.max) || AFFINITY_LEVELS.find(l => l.label === 'Conhecido')!; 
  }

  // Returns strict 0-100 percentage for the current level bracket
  calculateProgress(points: number): number {
    const level = this.getCurrentLevel(points);
    const range = level.max - level.min;
    const current = points - level.min;
    
    // Prevent division by zero or infinity
    if (range > 10000) return 100; // Cap for max level
    
    return Math.min(100, Math.max(0, (current / range) * 100));
  }

  getPointsInLevel(points: number): number {
    const level = this.getCurrentLevel(points);
    return points - level.min;
  }

  getLevelRange(points: number): number {
    const level = this.getCurrentLevel(points);
    return level.max - level.min;
  }
}
