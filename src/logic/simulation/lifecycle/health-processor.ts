
import { LifeStatus } from '../../../models/character.model';
import { DiseaseCatalogLogic } from '../health/disease-catalog.logic';

export class HealthProcessor {
  private static readonly CHANCE_SICK = 0.05; // 5% chance

  static process(status: LifeStatus): string | null {
    const rand = Math.random();

    // 1. Recovery Check (If already sick)
    if (status.healthCondition === 'Sick') {
      if (rand > 0.5) {
        status.healthCondition = 'Healthy';
        status.illnessName = undefined;
        return 'Recuperou-se da doença.';
      }
      return null;
    }

    // 2. Falling Sick Check (If healthy)
    if (status.healthCondition === 'Healthy') {
      if (rand < this.CHANCE_SICK) {
        const disease = DiseaseCatalogLogic.getRandomCommonDisease();
        status.healthCondition = 'Sick';
        status.illnessName = disease.name;
        return `🤒 O personagem contraiu ${disease.name}.`;
      }
    }

    return null;
  }
}
