
import { Character } from '../../../models/character.model';

export function replaceChatPlaceholders(text: string, character: Character | undefined, userName: string): string {
    if (!text || !character) return text;
    
    return text
      .replace(/{{char}}/gi, character.name)
      .replace(/{char}/gi, character.name)
      .replace(/{{user}}/gi, userName)
      .replace(/{user}/gi, userName);
}
