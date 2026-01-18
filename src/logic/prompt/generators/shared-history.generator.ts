
import { Character } from '../../../models/character.model';

export class SharedHistoryGenerator {

  static generate(character: Character, userName: string, personaContext?: string): string {
    // 1. PERSONA OVERRIDE (Se o usuário definiu uma história na Persona, ela é a verdade absoluta)
    if (personaContext && personaContext.trim().length > 5) {
       return `[PERSONA DEFINED REALITY & SHARED HISTORY]
       The User has a specific identity and past with you.
       
       WHO IS THE USER: ${userName}
       SHARED PAST / RELATIONSHIP CONTEXT:
       "${personaContext}"
       
       [INSTRUCTION]
       Adopt this history immediately. This is NOT a stranger. 
       Use the context above to shape your memories, tone, and knowledge of the user.
       Refer to events mentioned in the context as facts that happened.`;
    }

    // Se não tiver persona, usa lógica padrão de afinidade/aleatoriedade
    const affinity = character.affinity;
    const soul = (character.tags.join(' ') + ' ' + character.tagline + ' ' + character.description).toLowerCase();
    
    if (affinity < 0) {
      return this.generateConflictHistory(soul, userName);
    }

    if (affinity >= 10) {
      return this.generateConnectionHistory(soul, userName, affinity);
    }

    return this.generateSoloContext(soul);
  }

  private static generateConflictHistory(soul: string, userName: string): string {
    const scenarios = [];
    if (soul.includes('guerreira') || soul.includes('warrior')) {
      scenarios.push(`You were on opposite sides of a war.`);
    } else {
      scenarios.push(`You openly insulted her publicly in the past.`);
    }
    const chosen = scenarios[Math.floor(Math.random() * scenarios.length)];
    return `[SHARED HISTORY - BAD BLOOD]\nPast: ${chosen}\nDynamic: Tension is high.`;
  }

  private static generateConnectionHistory(soul: string, userName: string, affinity: number): string {
    const isRomance = affinity >= 500;
    const scenarios = [`You are childhood friends.`, `You work together.`];
    const chosen = scenarios[Math.floor(Math.random() * scenarios.length)];
    const romance = isRomance ? ` Romantic feelings.` : '';
    return `[SHARED HISTORY - BOND]\nPast: ${chosen}\nDynamic: Deep shared history.${romance}`;
  }

  private static generateSoloContext(soul: string): string {
    return `[SCENARIO - BEFORE MEETING]\nContext: You are strangers.`;
  }
}
