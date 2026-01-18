
import { Injectable, inject, signal } from '@angular/core';
import { TextFilterService, ViolationType } from './text-filter.service';

@Injectable({
  providedIn: 'root'
})
export class ModerationOrchestratorService {
  private filter = inject(TextFilterService);
  
  // State for Modal Triggers
  readonly showCrisisModal = signal(false);

  checkMessage(text: string): { allowed: boolean, reason?: ViolationType } {
    const violation = this.filter.analyze(text);
    
    if (violation === 'CRISIS') {
        this.triggerCrisisIntervention();
        return { allowed: false, reason: 'CRISIS' };
    }
    
    return { allowed: true };
  }

  private triggerCrisisIntervention() {
    this.showCrisisModal.set(true);
  }

  closeCrisisModal() {
    this.showCrisisModal.set(false);
  }
}
