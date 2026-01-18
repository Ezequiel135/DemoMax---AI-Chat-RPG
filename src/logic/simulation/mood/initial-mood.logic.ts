
import { Character } from '../../../models/character.model';
import { DailyState } from '../../../services/simulation/mood.service';
import { EMOTION_LIBRARY } from '../../../data/emotions.data';
import { ArchetypeAdapterLogic } from './archetype-adapter.logic';

export class InitialMoodLogic {
  
  static determine(character: Character): DailyState {
    // 1. PRIORITY: TEXT ANALYSIS OF FIRST MESSAGE
    // O humor base é definido pelo que ela *já* está fazendo ou sentindo na introdução.
    if (character.firstMessage) {
        const detectedMoodId = this.detectMoodFromText(character.firstMessage);
        
        if (detectedMoodId) {
            const emotionDef = EMOTION_LIBRARY[detectedMoodId];
            // Ainda aplicamos o adaptador para garantir que a descrição interna bata com a personalidade
            const personalized = ArchetypeAdapterLogic.apply(emotionDef, character);
            
            return {
                mood: personalized.id,
                emotionData: personalized,
                physical: this.getPhysicalFromText(character.firstMessage) || 'Normal',
                modifier: 1.0,
                flavorText: this.getFlavorFromText(character.firstMessage, personalized.label),
                recentActivity: 'waiting for your response'
            };
        }
    }

    // 2. FALLBACK: Se não detectar nada no texto (ou não tiver msg), usa Traços/Afinidade
    return this.determineFromTraits(character);
  }

  private static detectMoodFromText(text: string): string | null {
    const t = text.toLowerCase();

    // --- HOSTILIDADE / RAIVA ---
    if (t.match(/(olhar|olha)\s+(feio|mortal|frio|com nojo|com raiva)/) || 
        t.match(/(glare|scowl|disgust|hate|angry|furious)/) ||
        t.includes('idiota') || t.includes('baka') || t.includes('sai daqui') || t.includes('get lost')) {
        
        if (t.includes('nojo') || t.includes('disgust')) return 'Disgusted';
        if (t.includes('mortal') || t.includes('furious')) return 'Furious';
        return 'Irritated';
    }

    // --- TIMIDEZ / VERGONHA ---
    if (t.match(/(cora|vermelha|tímida|esconde|gagueja|desvia)/) || 
        t.match(/(blush|red|shy|hide|stutter|look away)/)) {
        return 'Embarrassed'; // Ou 'Shy' se existisse, mas Embarrassed cobre bem
    }

    // --- TRISTEZA ---
    if (t.match(/(chora|lágrima|triste|soluça|suspiro|cabisbaixa)/) || 
        t.match(/(cry|tear|sad|sob|sigh|down)/)) {
        return 'Sad';
    }

    // --- SEDUÇÃO / LOVE ---
    if (t.match(/(morde|lambe)\s+o\s+l[áa]bio/) || t.includes('te quer') || 
        t.match(/(sussurra|aproxima)\s+d[eo]\s+ouvido/) || 
        t.match(/(seductive|bite lip|lust|hot)/)) {
        return 'Horny';
    }

    // --- FELICIDADE / AMIGÁVEL ---
    if (t.match(/(sorri|abraça|feliz|anima|acena)/) || 
        t.match(/(smile|grin|hug|happy|excited|wave)/)) {
        
        if (t.includes('pula') || t.includes('jump') || t.includes('!')) return 'Ecstatic';
        return 'Happy';
    }

    // --- TÉDIO / NEUTRO ---
    if (t.match(/(boceja|relógio|celular|entediada|indiferente)/) || 
        t.match(/(yawn|bored|phone|watch)/)) {
        return 'Bored';
    }

    // --- ARROGÂNCIA / SUPERIORIDADE ---
    if (t.match(/(cima|baixo)|(desdém|cruza|braços)|(smirk|laugh)/) && (t.includes('fútil') || t.includes('hm'))) {
        return 'Neutral'; // Poderia ser 'Haughty' se existisse, usamos Neutral ou Happy (sádico)
    }

    return null; // Nada específico encontrado
  }

  private static getFlavorFromText(text: string, moodLabel: string): string {
      // Extrai uma frase curta para o "Flavor Text" da UI
      if (text.includes('"')) {
          // Pega a primeira fala se houver
          const match = text.match(/"([^"]+)"/);
          if (match && match[1].length < 40) return `"${match[1]}"`;
      }
      return `Feeling ${moodLabel} based on introduction.`;
  }

  private static getPhysicalFromText(text: string): string | null {
      const t = text.toLowerCase();
      if (t.includes('cora') || t.includes('blush')) return 'Face flushed';
      if (t.includes('chora') || t.includes('cry')) return 'Teary eyes';
      if (t.includes('tremer') || t.includes('trembling')) return 'Shaking';
      if (t.includes('sorri') || t.includes('smile')) return 'Smiling';
      return null;
  }

  // --- LÓGICA ANTIGA (FALLBACK) ---
  private static determineFromTraits(character: Character): DailyState {
    const traits = (character.tags.join(' ') + ' ' + character.tagline + ' ' + character.description).toLowerCase();
    const startAffinity = character.initialAffinity || 0;
    
    let baseEmotionId = 'Neutral';
    let flavor = 'Meeting you for the first time.';

    // Check Initial Affinity
    if (startAffinity >= 10) {
        baseEmotionId = 'Happy';
        flavor = 'Happy to see you again!';
        if (startAffinity >= 500) {
            baseEmotionId = 'Love';
            flavor = 'Looking at you with deep affection.';
        }
    } 
    else if (startAffinity <= -20) {
        baseEmotionId = 'Irritated';
        flavor = 'Looking at you with suspicion.';
        if (startAffinity <= -100) {
            baseEmotionId = 'Hateful';
            flavor = 'Glaring at you with hostility.';
        }
    } 
    else {
        // Trait Mapping
        if (traits.includes('genki') || traits.includes('energetic')) baseEmotionId = 'Happy';
        else if (traits.includes('depressed') || traits.includes('sad')) baseEmotionId = 'Melancholic';
        else if (traits.includes('tsundere') || traits.includes('angry')) baseEmotionId = 'Irritated';
        else if (traits.includes('yandere')) baseEmotionId = 'Love';
        else if (traits.includes('shy')) baseEmotionId = 'Insecure';
    }

    const emotionDef = EMOTION_LIBRARY[baseEmotionId] || EMOTION_LIBRARY['Neutral'];
    const personalized = ArchetypeAdapterLogic.apply(emotionDef, character);

    return {
      mood: personalized.id,
      emotionData: personalized,
      physical: 'Normal',
      modifier: 1.0,
      flavorText: flavor,
      recentActivity: 'waiting for interaction'
    };
  }
}
