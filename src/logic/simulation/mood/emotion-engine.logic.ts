
import { Character } from '../../../models/character.model';
import { EMOTION_LIBRARY, EmotionDef } from '../../../data/emotions.data';
import { BioState } from '../biology/biological-cycle.logic';
import { ArchetypeAdapterLogic } from './archetype-adapter.logic';

export class EmotionEngineLogic {

  /**
   * Calcula a emoção atual baseada em todos os fatores e PERSONALIZA para o arquétipo.
   */
  static calculateState(character: Character, bioState: BioState): EmotionDef {
    
    let baseEmotion: EmotionDef = EMOTION_LIBRARY['Neutral'];

    // 1. BIOLOGY OVERRIDE (Prioridade Máxima)
    if (bioState.isActive && bioState.intensity > 0.7) {
       if (bioState.phaseName === 'PMS') baseEmotion = this.pickOne(['Irritated', 'Sad', 'Hormonal', 'Angry']);
       else if (bioState.phaseName === 'High Testosterone') baseEmotion = EMOTION_LIBRARY['Horny'];
       else if (bioState.moodOverride === 'Sick') baseEmotion = EMOTION_LIBRARY['Sick'];
       else if (bioState.moodOverride) {
          // Tenta encontrar a emoção sugerida pelo ciclo biológico
          const suggest = Object.values(EMOTION_LIBRARY).find(e => e.id === bioState.moodOverride);
          if (suggest) baseEmotion = suggest;
       }
    }
    // 2. HEALTH STATUS (Terminal/Sick)
    else if (character.lifeStatus?.healthCondition === 'Terminal') {
       baseEmotion = Math.random() > 0.5 ? EMOTION_LIBRARY['Tired'] : EMOTION_LIBRARY['Depressed'];
    }
    // 3. TRAIT ANALYSIS (Peso por traços)
    else {
        const traits = (character.tags.join(' ') + ' ' + character.tagline).toLowerCase();
        const weights: Record<string, number> = {};
        Object.keys(EMOTION_LIBRARY).forEach(k => weights[k] = 1);

        // Pesos de Personalidade
        if (traits.includes('yandere')) { weights['Jealous'] += 15; weights['Love'] += 10; weights['Obsessed'] = 20; }
        if (traits.includes('tsundere')) { weights['Irritated'] += 10; weights['Embarrassed'] += 8; weights['Angry'] += 5; }
        if (traits.includes('shy') || traits.includes('timida') || traits.includes('dandere')) { weights['Shame'] += 10; weights['Anxious'] += 8; weights['Fear'] += 5; }
        if (traits.includes('depressed') || traits.includes('sad')) { weights['Depressed'] += 15; weights['Numb'] += 10; weights['Lonely'] += 8; }
        if (traits.includes('genki') || traits.includes('energetic')) { weights['Ecstatic'] += 12; weights['Happy'] += 8; }
        if (traits.includes('kuudere') || traits.includes('stoic') || traits.includes('fria')) { weights['Neutral'] += 25; weights['Bored'] += 5; }

        // Seleção Ponderada + Caos
        const todaySeed = new Date().getDate() + character.id.length;
        const chaos = Math.sin(todaySeed) * 1000; 
        
        const candidates = Object.keys(weights).filter(k => weights[k] > 1 || Math.random() > 0.96); // 4% chance de emoção aleatória pura
        const chosenId = candidates[Math.floor(Math.abs(chaos) % candidates.length)];
        
        baseEmotion = EMOTION_LIBRARY[chosenId] || EMOTION_LIBRARY['Neutral'];
    }

    // 4. PERSONALIZE (Use the new separated logic file)
    return ArchetypeAdapterLogic.apply(baseEmotion, character);
  }

  private static pickOne(opts: string[]): EmotionDef {
     const id = opts[Math.floor(Math.random() * opts.length)];
     return EMOTION_LIBRARY[id] || EMOTION_LIBRARY['Neutral'];
  }
}
