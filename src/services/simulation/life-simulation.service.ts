
import { Injectable, inject } from '@angular/core';
import { Character } from '../../models/character.model';
import { ToastService } from '../toast.service';
import { PregnancyProcessor } from '../../logic/simulation/lifecycle/pregnancy-processor';
import { HealthProcessor } from '../../logic/simulation/lifecycle/health-processor';
import { MortalityProcessor } from '../../logic/simulation/lifecycle/mortality-processor';

@Injectable({
  providedIn: 'root'
})
export class LifeSimulationService {
  private toast = inject(ToastService);

  processLifeCycle(character: Character): { updated: boolean, event?: string } {
    if (!character.lifeStatus) {
      character.lifeStatus = {
        isAlive: true,
        healthCondition: 'Healthy',
        isPregnant: false,
        pregnancyWeeks: 0,
        childrenCount: 0
      };
    }

    const status = character.lifeStatus;
    
    if (!status.isAlive) return { updated: false };

    const deathEvent = MortalityProcessor.process(character, status);
    if (deathEvent) {
      this.toast.show(deathEvent, 'error', 15000);
      return { updated: true, event: deathEvent };
    }

    const pregEvent = PregnancyProcessor.process(character, status);
    if (pregEvent) {
      this.toast.show(pregEvent, 'success', 8000);
      return { updated: true, event: pregEvent };
    }

    if (status.healthCondition !== 'Terminal') {
      const healthEvent = HealthProcessor.process(status);
      if (healthEvent) {
        return { updated: true, event: healthEvent };
      }
    }

    return { updated: false };
  }
}
