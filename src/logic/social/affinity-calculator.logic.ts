
import { AFFINITY_LEVELS, AffinityLevel } from '../../models/affinity.model';

export class AffinityCalculatorLogic {
  static getLevel(points: number): AffinityLevel {
    return AFFINITY_LEVELS.find(l => points >= l.min && points < l.max) || AFFINITY_LEVELS.find(l => l.label === 'Conhecido')!; 
  }

  static getProgressPercentage(points: number): number {
    const level = this.getLevel(points);
    const range = level.max - level.min;
    const current = points - level.min;
    if (range > 10000) return 100; 
    return Math.min(100, Math.max(0, (current / range) * 100));
  }

  static getPointsInCurrentLevel(points: number): number {
    const level = this.getLevel(points);
    return points - level.min;
  }

  static getLevelTotalRange(points: number): number {
    const level = this.getLevel(points);
    return level.max - level.min;
  }
}
