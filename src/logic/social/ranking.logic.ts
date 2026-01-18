
export interface CreatorRank {
  name: string;
  totalMessages?: number;
  totalFavorites?: number;
  totalPlays?: number;
  totalReads?: number;
  score: number;
  topItemUrl: string;
  category: 'Mixed' | 'Character' | 'Visual Novel' | 'Web Novel';
}

export function parseMetric(value: string | number | undefined): number {
  if (value === undefined) return 0;
  if (typeof value === 'number') return value;
  
  const n = parseFloat(value);
  const lower = value.toLowerCase();
  if (lower.includes('m')) return n * 1000000;
  if (lower.includes('k')) return n * 1000;
  return n;
}

export function calculateCharacterScore(msgCount: number, favCount: number): number {
  return msgCount + (favCount * 5);
}

export function calculateNovelScore(playCount: number, likes: number): number {
  return playCount + (likes * 10);
}

export function calculateWebNovelScore(readCount: number, likes: number): number {
  return readCount + (likes * 5);
}
