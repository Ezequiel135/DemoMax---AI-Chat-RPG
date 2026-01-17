
export interface AffinityLevel {
  label: string;
  min: number;
  max: number;
  icon: string; // Emoji or SVG path
  color: string;
  bgColor: string; // For the list background
}

export const AFFINITY_LEVELS: AffinityLevel[] = [
  { label: 'Em Chamas', min: -9999, max: -100, icon: '😈', color: 'text-purple-500', bgColor: 'bg-purple-500/20' },
  { label: 'Irritado', min: -100, max: -20, icon: '💢', color: 'text-red-500', bgColor: 'bg-red-500/20' },
  { label: 'Distante', min: -20, max: 0, icon: '😕', color: 'text-gray-400', bgColor: 'bg-gray-500/20' },
  { label: 'Conhecido', min: 0, max: 20, icon: '🙂', color: 'text-pink-300', bgColor: 'bg-pink-500/10' }, 
  { label: 'Amigo', min: 20, max: 100, icon: '👫', color: 'text-pink-400', bgColor: 'bg-pink-500/20' },
  { label: 'Paixão', min: 100, max: 500, icon: '💗', color: 'text-pink-500', bgColor: 'bg-pink-500/30' },
  { label: 'Amante', min: 500, max: 2000, icon: '🌹', color: 'text-rose-500', bgColor: 'bg-rose-500/30' },
  { label: 'Parceiro', min: 2000, max: 99999, icon: '💍', color: 'text-blue-300', bgColor: 'bg-blue-500/30' }
];
