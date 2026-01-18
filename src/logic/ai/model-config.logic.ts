
import { HarmCategory, HarmBlockThreshold } from '@google/genai';
import { ChatMode } from '../../services/chat-settings.service';

export function getChatConfig(mode: ChatMode, systemInstruction: string) {
    // Temperaturas ajustadas para evitar determinismo excessivo (causa de loops)
    let temperature = 1.15; // Levemente acima de 1.0 para criatividade
    let topP = 0.95;
    let topK = 40;
    let presencePenaltyPrompt = '';

    switch (mode) {
      case 'pro':
        temperature = 0.9; 
        topK = 64;
        presencePenaltyPrompt = '\n[MODE: PRO] Focus on logical consistency. Avoid repeating phrases verbatim.';
        break;
      case 'prime':
        temperature = 1.3; // Mais criativo = menos repetição
        topP = 0.99;
        presencePenaltyPrompt = '\n[MODE: PRIME] Be creative. Never reuse the same sentence structure twice in a row.';
        break;
      case 'lite':
        temperature = 0.8;
        presencePenaltyPrompt = '\n[MODE: LITE] Keep it short.';
        break;
      case 'flash':
      default:
        temperature = 1.1;
        break;
    }

    // Injeção de instrução de sistema negativa para repetição (Hard constraint)
    const antiRepetitionSystem = `
    [ANTI-REPETITION PROTOCOL]
    1. NEVER repeat the user's message back to them.
    2. NEVER repeat your own previous greeting or action exactly.
    3. If the conversation stalls, ask a question or change the subject.
    4. Do not start every message with the same action (e.g. *smiles*).
    ${presencePenaltyPrompt}
    `;

    return {
      systemInstruction: systemInstruction + antiRepetitionSystem,
      temperature, 
      topK,
      topP,
      // Gemini Flash responde bem a configurações de segurança relaxadas para RPG
      safetySettings: [
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
      ]
    };
}
