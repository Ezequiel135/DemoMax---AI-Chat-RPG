
import { Character } from '../models/character.model';
import { LANGUAGE_PROTOCOL } from './protocols/language.protocol';
import { IMMERSION_PROTOCOL } from './protocols/immersion.protocol';
import { FREEDOM_PROTOCOL } from './protocols/freedom.protocol';
import { FORMAT_PROTOCOL } from './protocols/format.protocol';
import { LORE_PROTOCOL } from './protocols/lore.protocol';
import { DailyState } from '../services/simulation/mood.service';
import { generateLifeStatusContext } from './prompt/generators/life-state.generator';
import { generateTimeContext } from './prompt/generators/ghosting-state.generator';
import { SharedHistoryGenerator } from './prompt/generators/shared-history.generator';

function replacePlaceholders(text: string, charName: string, userName: string): string {
  if (!text) return '';
  return text
    .replace(/{{char}}/gi, charName)
    .replace(/{char}/gi, charName)
    .replace(/{{user}}/gi, userName)
    .replace(/{user}/gi, userName);
}

export function buildSystemPrompt(
  character: Character, 
  userName: string, 
  memory: string, 
  dailyState: DailyState,
  hoursSinceLastMessage: number,
  ghostingContext?: string,
  personaContext?: string // Novo argumento
): string {
  
  const affinity = character.affinity;
  let relationshipStatus = 'Stranger';
  
  if (personaContext) {
     relationshipStatus = 'DEFINED BY PERSONA CONTEXT';
  } else {
     if (affinity >= 2000) relationshipStatus = 'SPOUSE / LIFE PARTNER';
     else if (affinity >= 500) relationshipStatus = 'LOVER';
     else if (affinity >= 100) relationshipStatus = 'BEST FRIEND';
     else if (affinity >= 10) relationshipStatus = 'FRIEND';
     else if (affinity < -50) relationshipStatus = 'ENEMY';
     else if (affinity < 0) relationshipStatus = 'DISLIKED';
  }

  // Gera histórico com contexto da persona
  const historyContext = SharedHistoryGenerator.generate(character, userName, personaContext);
  
  const lifeContext = generateLifeStatusContext(character.lifeStatus);
  const processedSystemInstruction = replacePlaceholders(character.systemInstruction, character.name, userName);

  const characterIdentity = `
    [CHARACTER DEFINITION]
    Name: ${character.name}
    Role: ${character.tagline}
    Personality: ${processedSystemInstruction}
    
    [RELATIONSHIP DATA]
    User Name: ${userName}
    Current Status: ${relationshipStatus}
    Affinity Level: ${affinity}
    
    ${historyContext}
  `;

  const timeContext = generateTimeContext(hoursSinceLastMessage, dailyState, character, ghostingContext);

  const conditionInstruction = `
    [CURRENT MOOD]
    Mood: ${dailyState.mood}
    Flavor: ${dailyState.flavorText}
  `;

  let memoryContext = '';
  if (ghostingContext) {
     memoryContext = `
     [ARCHIVED MEMORY]
     ${memory || "None."}
     [⚠️ CRITICAL: RESET] User abandoned chat. Respond to RETURN, not old context.
     `;
  } else {
     memoryContext = memory ? `[LONG TERM MEMORY] ${memory}` : `[MEMORY] Use Shared History context.`;
  }

  return [
    characterIdentity,
    lifeContext,
    ghostingContext ? '' : conditionInstruction, 
    timeContext, 
    `[USER] ${userName}`,
    LANGUAGE_PROTOCOL,
    IMMERSION_PROTOCOL,
    LORE_PROTOCOL,
    FREEDOM_PROTOCOL,
    FORMAT_PROTOCOL,
    memoryContext
  ].join('\n\n');
}
