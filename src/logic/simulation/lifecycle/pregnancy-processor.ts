
import { Character, LifeStatus } from '../../../models/character.model';

export class PregnancyProcessor {
  private static readonly CHANCE_PREGNANCY = 0.03; // 3% per check if conditions met

  static process(character: Character, status: LifeStatus): string | null {
    // 1. If already pregnant, advance time
    if (status.isPregnant) {
      status.pregnancyWeeks += 1;
      
      // Birth Logic (40 weeks)
      if (status.pregnancyWeeks >= 40) {
        status.isPregnant = false;
        status.pregnancyWeeks = 0;
        status.childrenCount += 1;
        return '👶 O BEBÊ NASCEU! A família cresceu.';
      }
      return null;
    }

    // 2. Conception Logic
    // Conditions: Not pregnant, High Affinity (Lover+), Random Chance
    if (!status.isPregnant && character.affinity > 500) {
      if (Math.random() < this.CHANCE_PREGNANCY) {
        status.isPregnant = true;
        status.pregnancyWeeks = 1;
        return '🤰 Teste de Gravidez: POSITIVO.';
      }
    }

    return null;
  }
}
