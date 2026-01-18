
import { Character, LifeStatus } from '../../../models/character.model';

export class MortalityProcessor {
  private static readonly CHANCE_ACCIDENT = 0.0005; // 0.05% (Very Rare)
  private static readonly CHANCE_TERMINAL = 0.001;  // 0.1% (Rare)
  private static readonly TERMINAL_DEATH_RATE = 0.1; // 10% chance per check if terminal

  static process(character: Character, status: LifeStatus): string | null {
    const rand = Math.random();

    // 1. Terminal Illness Progression (If already terminal)
    if (status.healthCondition === 'Terminal') {
      if (Math.random() < this.TERMINAL_DEATH_RATE) {
         this.executeDeath(character, status, status.illnessName || 'Doença Terminal');
         return '💀 O fim chegou. O personagem faleceu devido à doença.';
      }
      return null;
    }

    // 2. New Fatal Events (If currently alive and not terminal)
    if (status.healthCondition === 'Healthy' || status.healthCondition === 'Sick') {
      
      // Sudden Accident
      if (rand < this.CHANCE_ACCIDENT) {
        this.executeDeath(character, status, 'Acidente Repentino');
        return '💀 TRAGÉDIA: O personagem morreu em um acidente.';
      } 
      
      // Terminal Diagnosis
      else if (rand < this.CHANCE_TERMINAL) {
        status.healthCondition = 'Terminal';
        status.illnessName = 'Síndrome Desconhecida';
        return '🏥 Diagnóstico: Doença Terminal detectada.';
      }
    }

    return null;
  }

  private static executeDeath(char: Character, status: LifeStatus, cause: string) {
    status.isAlive = false;
    status.causeOfDeath = cause;
    status.deathDate = Date.now();
    status.healthCondition = 'Healthy'; // Reset visual health as they are now a spirit
  }
}
