
export interface ChatDecoration {
  id: string;
  name: string;
  userBubbleClass: string;
  modelBubbleClass: string;
  previewColor: string;
}

export const CHAT_DECORATIONS: ChatDecoration[] = [
  {
    id: 'default',
    name: 'Clássico',
    userBubbleClass: 'bg-gradient-to-br from-pink-600 to-purple-600 text-white rounded-br-sm',
    modelBubbleClass: 'bg-white dark:bg-[#1E1E24] text-slate-800 dark:text-slate-200 rounded-bl-sm',
    previewColor: '#ec4899'
  },
  {
    id: 'blue_ocean',
    name: 'Oceano',
    userBubbleClass: 'bg-blue-600 text-white rounded-2xl rounded-tr-none',
    modelBubbleClass: 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white rounded-2xl rounded-tl-none',
    previewColor: '#2563eb'
  },
  {
    id: 'green_nature',
    name: 'Natureza',
    userBubbleClass: 'bg-emerald-600 text-white rounded-xl border-2 border-emerald-500',
    modelBubbleClass: 'bg-[#f0fdf4] dark:bg-[#064e3b] text-emerald-900 dark:text-emerald-100 rounded-xl border border-emerald-200 dark:border-emerald-800',
    previewColor: '#059669'
  },
  {
    id: 'dark_neon',
    name: 'Cyber',
    userBubbleClass: 'bg-black border border-pink-500 text-pink-500 shadow-[0_0_10px_rgba(236,72,153,0.5)] font-mono',
    modelBubbleClass: 'bg-black border border-cyan-500 text-cyan-500 shadow-[0_0_10px_rgba(6,182,212,0.5)] font-mono',
    previewColor: '#000000'
  },
  {
    id: 'cute_soft',
    name: 'Soft',
    userBubbleClass: 'bg-[#ffe4e6] text-[#881337] rounded-[2rem]',
    modelBubbleClass: 'bg-[#fff1f2] text-[#881337] rounded-[2rem] border border-pink-200',
    previewColor: '#ffe4e6'
  }
];
