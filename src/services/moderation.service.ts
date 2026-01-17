
import { Injectable, signal } from '@angular/core';

/**
 * @deprecated Use ModerationOrchestratorService instead.
 * Keeping this valid to prevent build errors if referenced during refactor.
 */
@Injectable({
  providedIn: 'root'
})
export class ModerationService {
  readonly showCrisisModal = signal(false);
}
