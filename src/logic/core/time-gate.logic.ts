
/**
 * Calculates if a timestamp is older than a specific number of days.
 * Used for anti-fraud features like PIX donation.
 */
export function isAccountMature(createdAt: number, daysRequired: number = 30): boolean {
  if (!createdAt) return false;
  
  const now = Date.now();
  const diffTime = Math.abs(now - createdAt);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  return diffDays >= daysRequired;
}
