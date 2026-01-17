
import { UserProfile } from '../../services/auth.service';

/**
 * Verifies if the user is the System Administrator / God Mode user.
 */
export function isMasterIdentity(user: UserProfile | null): boolean {
  if (!user) return false;
  // Case insensitive check for username, or specific ID
  return (
    user.username.toLowerCase() === 'ezequiel' || 
    user.id === 'admin_ezequiel'
  );
}
