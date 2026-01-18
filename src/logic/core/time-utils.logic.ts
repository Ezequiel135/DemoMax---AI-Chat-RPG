
export function isSameDay(timestamp1: number, timestamp2: number): boolean {
  const d1 = new Date(timestamp1);
  const d2 = new Date(timestamp2);
  return d1.getFullYear() === d2.getFullYear() &&
         d1.getMonth() === d2.getMonth() &&
         d1.getDate() === d2.getDate();
}

export function formatTime(timestamp: number): string {
  return new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

export function getRelativeDateLabel(timestamp: number): string {
  const date = new Date(timestamp);
  const today = new Date();
  
  if (isSameDay(timestamp, Date.now())) return 'Hoje';
  
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);
  if (isSameDay(timestamp, yesterday.getTime())) return 'Ontem';
  
  return date.toLocaleDateString();
}
