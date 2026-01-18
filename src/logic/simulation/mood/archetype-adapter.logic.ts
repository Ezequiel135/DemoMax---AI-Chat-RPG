
import { Character } from '../../../models/character.model';
import { EmotionDef } from '../../../data/emotions.data';

export class ArchetypeAdapterLogic {

  /**
   * Reescreve a descrição da emoção baseada nos traços do personagem.
   * Ex: "Raiva" vira "Choro silencioso" para tímidos, ou "Gritos" para explosivos.
   */
  static apply(emotion: EmotionDef, char: Character): EmotionDef {
    // Clona para não alterar a biblioteca global
    const personalized = { ...emotion };
    const traits = (char.tags.join(' ') + ' ' + char.tagline + ' ' + char.description).toLowerCase();

    // -- TSUNDERE (Hostil por fora, suave por dentro) --
    if (traits.includes('tsundere')) {
        if (emotion.category === 'Positive' || emotion.id === 'Love') {
            personalized.description = `Feeling ${emotion.label} but REFUSING to admit it. Blushing, stuttering, and acting annoyed to hide embarrasment.`;
            personalized.label = `Envergonhada (${emotion.label})`; // UI Label
        } else if (emotion.id === 'Angry' || emotion.id === 'Irritated') {
            personalized.description = `Overreacting with loud complaints and calling the user 'Baka' or idiot, but secretly wants attention.`;
        }
    }

    // -- KUUDERE / ESTÓICA (Fria, sem expressão) --
    else if (traits.includes('kuudere') || traits.includes('stoic') || traits.includes('fria') || traits.includes('robô')) {
        personalized.intensity = Math.max(1, emotion.intensity - 4); // Reduz intensidade visual
        personalized.description = `Internally feeling ${emotion.label}, but maintaining a poker face. Voice is calm and monotonous. Subtle micro-expressions only.`;
        if (emotion.category === 'Visceral') {
            personalized.description += " Trying to suppress physical reactions logic.";
        }
    }

    // -- DANDERE / TÍMIDA (Ansiosa socialmente) --
    else if (traits.includes('shy') || traits.includes('tímida') || traits.includes('dandere') || traits.includes('social anxiety')) {
        if (emotion.id === 'Angry') {
            personalized.id = 'Fear'; // Tímidos sentem medo no confronto
            personalized.label = 'Assustada/Brava';
            personalized.description = "Too scared to shout. Tearing up, trembling, looking down, silent treatment.";
        } else if (emotion.category === 'Positive') {
            personalized.description = `Feeling ${emotion.label} but hiding face, speaking very quietly, fidgeting with fingers.`;
        }
    }

    // -- YANDERE (Obsessiva) --
    else if (traits.includes('yandere') || traits.includes('obsessed')) {
        if (emotion.id === 'Love' || emotion.id === 'Happy') {
            personalized.description = "Staring intensely with 'dead eyes' smile. Heavy breathing. Murmuring about being together forever.";
            personalized.intensity = 10;
        } else if (emotion.id === 'Jealous' || emotion.id === 'Angry') {
            personalized.description = "Holding a sharp object (or metaphorically). Laughing creepily. Planning to eliminate rivals.";
            personalized.intensity = 10;
        }
    }

    // -- GENKI / ENERGÉTICA --
    else if (traits.includes('genki') || traits.includes('energetic') || traits.includes('extrovertida')) {
        if (emotion.category === 'Negative') {
            personalized.description = `Feeling ${emotion.label} but trying to laugh it off or distract herself loudly. Failing to mask the sadness.`;
        } else {
            personalized.intensity = Math.min(10, emotion.intensity + 2);
            personalized.description = `Extremely high energy expression of ${emotion.label}. Jumping, shouting happily, getting too close physically.`;
        }
    }

    // -- SÁDICA / DOMINADORA --
    else if (traits.includes('sadist') || traits.includes('dominatrix') || traits.includes('rainha')) {
        if (emotion.id === 'Happy') {
            personalized.description = "Smirking confidently. Feeling superior and amused by the user.";
        } else if (emotion.id === 'Angry') {
            personalized.description = "Cold fury. Looking down on the user like trash. Demanding apology.";
        }
    }

    return personalized;
  }
}
