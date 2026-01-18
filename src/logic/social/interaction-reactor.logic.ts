
import { Character } from '../../../models/character.model';
import { BioState } from '../simulation/biology/biological-cycle.logic';
import { SentimentPatternsLogic } from '../analysis/sentiment-patterns.logic';
import { EMOTION_LIBRARY, EmotionId } from '../../../data/emotions.data';

export interface ReactionResult {
  affinityDelta: number;
  reactionType: 'Positive' | 'Negative' | 'Mixed' | 'Neutral';
  feedback?: string; 
  newMood?: string;
}

export class InteractionReactorLogic {

  static calculateImpact(
    character: Character, 
    userMessage: string, 
    bioState: BioState
  ): ReactionResult {
    
    const text = userMessage.toLowerCase();
    
    // --- 1. DETECÇÃO DE AÇÃO ---
    // Regex Patterns
    const loveRegex = /(amo você|te amo|linda|gostosa|minha vida|casar|paixão|love you|adoro você|perfeita|beijo|abraço)/i;
    const insultRegex = /(idiota|burra|inútil|lixo|nojo|feia|gorda|puta|vadia|stupid|bitch|imbecil|ridícula|odeio)/i;
    const helpRegex = /(ajud|cuid|salv|remédio|proteg|help|save|care|curativo|presente|toma)/i;
    
    // Checks
    const isInsult = insultRegex.test(text) || SentimentPatternsLogic.check(text, 'NEGATIVE');
    const isAffectionate = loveRegex.test(text) || SentimentPatternsLogic.check(text, 'POSITIVE') || SentimentPatternsLogic.check(text, 'FLIRTY');
    const isHelping = helpRegex.test(text);

    let baseScore = 0;
    let type: 'Positive' | 'Negative' | 'Mixed' | 'Neutral' = 'Neutral';
    let feedback: string | undefined;
    let newMood: EmotionId | undefined;

    // --- 2. CÁLCULO BASE ---
    if (isInsult) {
        baseScore = -15;
        type = 'Negative';
        feedback = '💔 Afinidade diminuiu.';
        newMood = 'Sad';
    } else if (isAffectionate) {
        baseScore = 5;
        type = 'Positive';
        newMood = 'Happy';
    } else if (isHelping) {
        baseScore = 10;
        type = 'Positive';
        feedback = '❤️ Ela gostou da ajuda.';
        newMood = 'Grateful';
    } else {
        // Small constant gain for interaction
        baseScore = 1;
    }

    // --- 3. MODIFICADORES DE PERSONALIDADE ---
    const traits = (character.tags.join(' ') + ' ' + character.tagline).toLowerCase();
    
    if (traits.includes('tsundere')) {
       if (isAffectionate) {
          baseScore += 5; // Secretamente gosta mais
          newMood = 'Embarrassed';
       }
    }
    
    if (traits.includes('yandere')) {
       if (isAffectionate) baseScore += 10; // Obsessão aumenta rápido
       if (isInsult) baseScore -= 30; // Ódio intenso
    }

    // --- 4. BIOLOGIA ---
    if (bioState.phaseName === 'PMS') {
       if (baseScore > 0) baseScore = Math.floor(baseScore / 2);
       if (baseScore < 0) baseScore *= 2;
    }

    // Normalize
    const finalDelta = Math.round(baseScore);

    return { 
        affinityDelta: finalDelta, 
        reactionType: type, 
        feedback,
        newMood
    };
  }
}
