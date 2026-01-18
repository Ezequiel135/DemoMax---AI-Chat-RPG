
export type RestrictedAction = 'create_character' | 'generate_image' | 'donate_pix' | 'unlimited_chat' | 'social_action';

export const GUEST_DAILY_MSG_LIMIT = 15;

export function checkPermission(action: RestrictedAction, isGuest: boolean, dailyMessages: number): { allowed: boolean } {
  if (!isGuest) return { allowed: true };

  switch (action) {
    case 'create_character':
    case 'generate_image':
    case 'donate_pix':
    case 'social_action':
      return { allowed: false };
    
    case 'unlimited_chat':
      if (dailyMessages >= GUEST_DAILY_MSG_LIMIT) {
         return { allowed: false };
      }
      return { allowed: true };
      
    default:
      return { allowed: true };
  }
}
