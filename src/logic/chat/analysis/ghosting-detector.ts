
import { Message } from '../../../models/message.model';

export interface GhostingResult {
  isGhosting: boolean;
  hoursSinceLast: number;
  reason?: string;
}

export class GhostingDetector {
  // Regex para detectar despedidas em PT/EN
  private static readonly GOODBYE_PATTERNS = /\b(tchau|bye|adeus|até mais|fui|tenho que ir|boa noite|cya|later|falou|até logo|te vejo depois|gn|good night)\b/i;

  static analyze(messages: Message[]): GhostingResult {
    if (messages.length === 0) {
      return { isGhosting: false, hoursSinceLast: 0 };
    }

    const lastMsg = messages[messages.length - 1];
    const now = Date.now();
    const hoursSinceLast = (now - lastMsg.timestamp) / (1000 * 60 * 60);

    // Se passou menos de 1 hora, não consideramos Ghosting ainda
    if (hoursSinceLast < 1) {
      return { isGhosting: false, hoursSinceLast };
    }

    // Verificar se o usuário se despediu nas últimas mensagens
    // Olhamos as últimas 3 mensagens do usuário para garantir contexto
    const recentUserMessages = messages.slice(-10).filter(m => m.role === 'user').slice(-3);
    const lastUserMsg = recentUserMessages[recentUserMessages.length - 1];

    if (!lastUserMsg) {
       return { isGhosting: false, hoursSinceLast };
    }

    const saidGoodbye = this.GOODBYE_PATTERNS.test(lastUserMsg.text);

    if (saidGoodbye) {
      // Se ele deu tchau, está tudo bem demorar.
      return { isGhosting: false, hoursSinceLast };
    }

    // SE CHEGOU AQUI: O usuário saiu (>1h) SEM dar tchau.
    return {
      isGhosting: true,
      hoursSinceLast,
      reason: 'User left without saying goodbye'
    };
  }
}
