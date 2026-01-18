
import { Injectable } from '@angular/core';
import { AffinityLevel } from '../models/affinity.model';
import { AffinityCalculatorLogic } from '../logic/social/affinity-calculator.logic';

@Injectable({
  providedIn: 'root'
})
export class AffinityService {
  
  getCurrentLevel(points: number): AffinityLevel {
    return AffinityCalculatorLogic.getLevel(points);
  }

  calculateProgress(points: number): number {
    return AffinityCalculatorLogic.getProgressPercentage(points);
  }

  getPointsInLevel(points: number): number {
    return AffinityCalculatorLogic.getPointsInCurrentLevel(points);
  }

  getLevelRange(points: number): number {
    return AffinityCalculatorLogic.getLevelTotalRange(points);
  }
}
