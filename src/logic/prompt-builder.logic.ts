
import { Character } from '../models/character.model';
import { LANGUAGE_PROTOCOL } from './protocols/language.protocol';
import { IMMERSION_PROTOCOL } from './protocols/immersion.protocol';
import { FREEDOM_PROTOCOL } from './protocols/freedom.protocol';
import { FORMAT_PROTOCOL } from './protocols/format.protocol';

/**
 * MASTER PROMPT BUILDER
 * Orchestrates atomic logic modules to create the final system instruction.
 */
export function buildSystemPrompt(character: Character, userName: string, memory: string): string {
  
  const characterIdentity = `
    [CHARACTER DEFINITION]
    Name: ${character.name}
    Role: ${character.tagline}
    Personality & Instructions: ${character.systemInstruction}
  `;

  const userContext = `
    [USER CONTEXT]
    User Name: ${userName}
  `;

  const memoryContext = memory ? `
    [LONG TERM MEMORY]
    Summary of past events:
    ${memory}
  ` : '';

  // Assemble the neural stack
  return [
    characterIdentity,
    userContext,
    LANGUAGE_PROTOCOL,
    IMMERSION_PROTOCOL,
    FREEDOM_PROTOCOL,
    FORMAT_PROTOCOL, // Enforces the 500 char limit
    memoryContext
  ].join('\n\n');
}
