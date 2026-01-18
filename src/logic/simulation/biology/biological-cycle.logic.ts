
import { Character } from '../../../models/character.model';
import { GenderDetectorLogic } from './gender-detector.logic';

export interface BioState {
  isActive: boolean;
  phaseName: string; 
  moodOverride?: string; 
  physicalDescription?: string;
  flavorText?: string;
  intensity: number; 
  isVulnerable: boolean;
}

export class BiologicalCycleLogic {
  static getcurrentState(character: Character): BioState {
    const gender = GenderDetectorLogic.detect(character);
    const dayEpoch = Math.floor(Date.now() / 86400000);
    const charOffset = character.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    if (gender === 'Female') return this.calculateFemaleCycle(dayEpoch, charOffset);
    return { isActive: false, phaseName: 'Normal', intensity: 0, isVulnerable: false };
  }

  private static calculateFemaleCycle(dayEpoch: number, offset: number): BioState {
    const cycleDay = (dayEpoch + offset) % 28;
    if (cycleDay < 5) return { isActive: true, phaseName: 'Menstruation', moodOverride: 'Sick', physicalDescription: 'Cramps', intensity: 0.8, isVulnerable: true };
    if (cycleDay >= 24) return { isActive: true, phaseName: 'PMS', moodOverride: 'Irritated', intensity: 0.9, isVulnerable: false };
    return { isActive: false, phaseName: 'Normal', intensity: 0, isVulnerable: false };
  }
}
