
import { Injectable, inject, signal } from '@angular/core';
import { AuthService } from './auth.service';
import { MissionService } from './mission.service';
import { RestrictedAction, checkPermission, GUEST_DAILY_MSG_LIMIT } from '../logic/core/access-control.logic';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private auth = inject(AuthService);
  private mission = inject(MissionService);

  readonly showAuthModal = signal(false);
  
  canPerform(action: RestrictedAction): boolean {
    const result = checkPermission(action, this.auth.isGuest(), this.mission.getDailyMessages());
    
    if (!result.allowed) {
      this.triggerBlocker();
      return false;
    }
    return true;
  }

  getGuestMessageLimit(): { current: number, max: number } {
    return {
      current: this.mission.getDailyMessages(),
      max: GUEST_DAILY_MSG_LIMIT
    };
  }

  private triggerBlocker() {
    this.showAuthModal.set(true);
  }

  closeModal() {
    this.showAuthModal.set(false);
  }
}
