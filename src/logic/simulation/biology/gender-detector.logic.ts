
import { Character } from '../../../models/character.model';

export type Gender = 'Female' | 'Male' | 'Unknown';

export class GenderDetectorLogic {
  
  private static readonly MALE_TAGS = [
    'male', 'man', 'boy', 'husband', 'bf', 'namorado', 'marido', 'homem', 'garoto', 'trap', 'femboy',
    'pai', 'tio', 'irmão', 'brother', 'father'
  ];
  
  private static readonly FEMALE_TAGS = [
    'female', 'woman', 'girl', 'waifu', 'wife', 'gf', 'namorada', 'esposa', 'mulher', 'garota', 'milf', 'loli',
    'mãe', 'tia', 'irmã', 'sister', 'mother', 'maid', 'nurse', 'enfermeira'
  ];

  static detect(character: Character): Gender {
    const combinedText = (character.tags.join(' ') + ' ' + character.description + ' ' + character.tagline).toLowerCase();

    // 1. Check Explicit Tags First (Weight: High)
    const hasMaleTag = character.tags.some(t => this.MALE_TAGS.includes(t.toLowerCase()));
    const hasFemaleTag = character.tags.some(t => this.FEMALE_TAGS.includes(t.toLowerCase()));

    if (hasMaleTag && !hasFemaleTag) return 'Male';
    if (hasFemaleTag && !hasMaleTag) return 'Female';

    // 2. Analyze Description Context (PT-BR + EN)
    // Male pronouns/articles
    if (/\b(he|him|his|ele|dele|o|um)\b/.test(combinedText)) return 'Male';
    // Female pronouns/articles
    if (/\b(she|her|hers|ela|dela|a|uma)\b/.test(combinedText)) return 'Female';

    // 3. Default fallback (Anime app bias usually leans Female, but let's stick to Unknown if unsure)
    // Actually, forcing 'Female' is safer for general "Waifu" apps if ambiguous.
    return 'Female'; 
  }
}
