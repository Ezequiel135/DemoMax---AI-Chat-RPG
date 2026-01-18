
import { Message } from '../../../models/message.model';

export class RepetitionGuardLogic {
  
  /**
   * Analisa as últimas mensagens da IA para detectar padrões repetitivos.
   * Retorna um prompt de correção se necessário.
   */
  static analyze(history: Message[]): string | null {
    // Filtra apenas mensagens da IA
    const aiMessages = history.filter(m => m.role === 'model').slice(-5);
    
    if (aiMessages.length < 2) return null;

    const lastMsg = aiMessages[aiMessages.length - 1].text.trim();
    const penultMsg = aiMessages[aiMessages.length - 2].text.trim();

    // 1. Repetição Exata (Loop Crítico)
    if (lastMsg === penultMsg) {
      return `[SYSTEM ALERT: REPETITION DETECTED]
      You just repeated yourself exactly. STOP.
      Do NOT repeat the last sentence.
      Change the topic slightly or perform a new action.`;
    }

    // 2. Repetição de Frase de Início (Ex: "Sorri e diz...")
    // Pega os primeiros 20 caracteres
    const startLast = lastMsg.substring(0, 20);
    const startPenult = penultMsg.substring(0, 20);
    
    if (startLast.length > 10 && startLast === startPenult) {
       return `[SYSTEM INSTRUCTION]
       Variation required. Do not start the sentence with "${startLast}".
       Use a different sentence structure.`;
    }

    // 3. Verificação de "Loop de 3" (A -> B -> A -> B)
    if (aiMessages.length >= 4) {
       const msgA = aiMessages[aiMessages.length - 3].text;
       if (lastMsg === msgA) {
          return `[SYSTEM ALERT: LOOP DETECTED]
          You are circling back to previous dialogue.
          Advance the plot. Introduce a new element or question.`;
       }
    }

    return null;
  }
}
