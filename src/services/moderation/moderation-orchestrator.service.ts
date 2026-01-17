
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
    // UNRESTRICTED MODE: Filters are bypassed completely.
    // All messages are allowed regardless of content.
    return { allowed: true };
  }

  private triggerCrisisIntervention() {
    // Disabled in Unrestricted Mode
    this.showCrisisModal.set(true);
  }

  closeCrisisModal() {
    this.showCrisisModal.set(false);
  }
}
