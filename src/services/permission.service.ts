
import { Injectable, inject, signal, computed } from '@angular/core';
import { AuthService } from './auth.service';
import { MissionService } from './mission.service';

export type RestrictedAction = 'create_character' | 'generate_image' | 'donate_pix' | 'unlimited_chat' | 'social_action';

@Injectable({
  providedIn: 'root'
})
export class PermissionService {
  private auth = inject(AuthService);
  private mission = inject(MissionService);

  // Modal State
  readonly showAuthModal = signal(false);
  
  // Rules Configuration
  private readonly GUEST_DAILY_MSG_LIMIT = 15;

  // Public check method
  canPerform(action: RestrictedAction): boolean {
    const isGuest = this.auth.isGuest();
    
    // If not a guest, they generally have full access (permissions wise)
    // specific economy checks (like having coins) are handled by EconomyService
    if (!isGuest) return true;

    // GUEST RULES
    switch (action) {
      case 'create_character':
      case 'generate_image':
      case 'donate_pix':
      case 'social_action': // Follow/Like requires account
        this.triggerBlocker();
        return false;
      
      case 'unlimited_chat':
        // Check message limit logic
        if (this.mission.getDailyMessages() >= this.GUEST_DAILY_MSG_LIMIT) {
           this.triggerBlocker();
           return false;
        }
        return true;
        
      default:
        return true;
    }
  }

  getGuestMessageLimit(): { current: number, max: number } {
    return {
      current: this.mission.getDailyMessages(),
      max: this.GUEST_DAILY_MSG_LIMIT
    };
  }

  private triggerBlocker() {
    this.showAuthModal.set(true);
  }

  closeModal() {
    this.showAuthModal.set(false);
  }
}
