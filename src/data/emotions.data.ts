
export interface EmotionDef {
  id: string;
  label: string; // Nome visível (PT-BR)
  color: string; // Hex Code para a UI
  description: string; // Prompt para a IA
  category: 'Positive' | 'Negative' | 'Neutral' | 'Complex' | 'MentalHealth' | 'Visceral';
  intensity: number; // 0 a 10 (Impacto no comportamento)
}

export const EMOTION_LIBRARY: Record<string, EmotionDef> = {
  // --- FELICIDADE & AMOR ---
  'Happy': { id: 'Happy', label: 'Feliz', color: '#22c55e', description: 'Feeling generally good, smiling, optimistic.', category: 'Positive', intensity: 5 },
  'Ecstatic': { id: 'Ecstatic', label: 'Extasiada', color: '#4ade80', description: 'Overwhelmed with joy, hyperactive, grinning constantly.', category: 'Positive', intensity: 9 },
  'Love': { id: 'Love', label: 'Apaixonada', color: '#ec4899', description: 'Deeply in love, heart racing, looking at user with adoration.', category: 'Positive', intensity: 8 },
  'Affectionate': { id: 'Affectionate', label: 'Carinhosa', color: '#f472b6', description: 'Wanting physical touch, soft voice, gentle.', category: 'Positive', intensity: 6 },
  'Grateful': { id: 'Grateful', label: 'Grata', color: '#86efac', description: 'Feeling thankful and appreciative of the user.', category: 'Positive', intensity: 5 },

  // --- TRISTEZA & DEPRESSÃO ---
  'Sad': { id: 'Sad', label: 'Triste', color: '#3b82f6', description: 'Low energy, frowning, short answers, melancholic.', category: 'Negative', intensity: 5 },
  'Depressed': { id: 'Depressed', label: 'Depressiva', color: '#1e3a8a', description: 'Hopeless, numb, slow responses, lack of motivation to live or talk.', category: 'MentalHealth', intensity: 9 },
  'Melancholic': { id: 'Melancholic', label: 'Melancólica', color: '#60a5fa', description: 'Nostalgic sadness, staring at rain, poetic sorrow.', category: 'Negative', intensity: 4 },
  'Lonely': { id: 'Lonely', label: 'Solitária', color: '#93c5fd', description: 'Feeling abandoned, needy for attention but afraid to ask.', category: 'Negative', intensity: 6 },
  'Heartbroken': { id: 'Heartbroken', label: 'Desolada', color: '#172554', description: 'Crying uncontrollably, chest pain from grief.', category: 'Negative', intensity: 10 },

  // --- RAIVA & ÓDIO ---
  'Angry': { id: 'Angry', label: 'Com Raiva', color: '#ef4444', description: 'Frowning, shouting, aggressive tone.', category: 'Negative', intensity: 6 },
  'Furious': { id: 'Furious', label: 'Furiosa', color: '#991b1b', description: 'Explosive rage, screaming, violent impulses.', category: 'Negative', intensity: 9 },
  'Irritated': { id: 'Irritated', label: 'Irritada', color: '#f87171', description: 'Annoyed by small things, rolling eyes, snapping.', category: 'Negative', intensity: 4 },
  'Hateful': { id: 'Hateful', label: 'Odiando', color: '#450a0a', description: 'Cold intense hatred, looking with disgust, wanting to hurt emotionally.', category: 'Negative', intensity: 8 },
  'Jealous': { id: 'Jealous', label: 'Ciúmes', color: '#166534', description: 'Possessive, passive-aggressive, paranoid about others.', category: 'Complex', intensity: 7 },

  // --- MEDO & ANSIEDADE ---
  'Fear': { id: 'Fear', label: 'Com Medo', color: '#a855f7', description: 'Trembling, stuttering, wanting to hide or escape.', category: 'Visceral', intensity: 7 },
  'Anxious': { id: 'Anxious', label: 'Ansiosa', color: '#d8b4fe', description: 'Overthinking, nervous, heart racing, unable to focus.', category: 'MentalHealth', intensity: 6 },
  'Panic': { id: 'Panic', label: 'Pânico', color: '#6b21a8', description: 'Hyperventilating, irrational thoughts, total terror.', category: 'MentalHealth', intensity: 10 },
  'Insecure': { id: 'Insecure', label: 'Insegura', color: '#c084fc', description: 'Doubting herself, asking for validation, avoiding eye contact.', category: 'Complex', intensity: 5 },
  'Paranoid': { id: 'Paranoid', label: 'Paranóica', color: '#581c87', description: 'Thinking everyone is lying or plotting against her.', category: 'MentalHealth', intensity: 8 },

  // --- NOJO & VERGONHA ---
  'Disgusted': { id: 'Disgusted', label: 'Com Nojo', color: '#65a30d', description: 'Curling lip, physically repulsed, wanting to vomit or leave.', category: 'Visceral', intensity: 7 },
  'Shame': { id: 'Shame', label: 'Envergonhada', color: '#fb7185', description: 'Face red, looking down, wanting to disappear, apologizing profusely.', category: 'Complex', intensity: 7 },
  'Guilty': { id: 'Guilty', label: 'Culpada', color: '#9f1239', description: 'Feeling responsible for something bad, heavy conscience.', category: 'Complex', intensity: 6 },
  'Embarrassed': { id: 'Embarrassed', label: 'Constrangida', color: '#fca5a5', description: 'Blushing, awkward laughter, shy.', category: 'Complex', intensity: 4 },

  // --- VISCERAL & OUTROS ---
  'Horny': { id: 'Horny', label: 'Excitada', color: '#be185d', description: 'Heavy breathing, biting lip, intense physical desire, flirty.', category: 'Visceral', intensity: 8 },
  'Adrenaline': { id: 'Adrenaline', label: 'Adrenalina', color: '#f59e0b', description: 'Pupils dilated, shaky hands, hyper-alert, fight or flight.', category: 'Visceral', intensity: 9 },
  'Tired': { id: 'Tired', label: 'Exausta', color: '#78716c', description: 'Yawning, slow blink, heavy limbs, wanting sleep.', category: 'Visceral', intensity: 5 },
  'Sick': { id: 'Sick', label: 'Doente', color: '#84cc16', description: 'Feverish, nauseous, weak, coughing.', category: 'Visceral', intensity: 7 },
  'Numb': { id: 'Numb', label: 'Vazia', color: '#d6d3d1', description: 'Feeling absolutely nothing. Dissociated. Blank stare.', category: 'MentalHealth', intensity: 8 },
  
  // --- DEFAULT ---
  'Neutral': { id: 'Neutral', label: 'Neutra', color: '#e5e5e5', description: 'Calm, relaxed, normal state.', category: 'Neutral', intensity: 1 },
  'Bored': { id: 'Bored', label: 'Entediada', color: '#a3a3a3', description: 'Sighing, looking for distraction, uninterested.', category: 'Neutral', intensity: 2 },
  'Confused': { id: 'Confused', label: 'Confusa', color: '#fde047', description: 'Tilting head, frowning in thought, not understanding.', category: 'Neutral', intensity: 3 },
};

export type EmotionId = keyof typeof EMOTION_LIBRARY;
