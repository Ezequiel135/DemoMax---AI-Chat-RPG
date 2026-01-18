
import { Message } from '../../../models/message.model';

export class LanguageDetectorUtils {
  
  static detectTargetLanguage(recentMessages: Message[]): string {
    // Default fallback
    if (!recentMessages || recentMessages.length === 0) return 'Português (Brasil)';

    // Analyze last user messages
    const text = recentMessages
      .filter(m => m.role === 'user')
      .slice(-5)
      .map(m => m.text)
      .join(' ')
      .toLowerCase();

    // Simple heuristic
    if (/\b(the|is|and|you|what)\b/.test(text)) return 'English';
    if (/\b(o|é|e|você|que)\b/.test(text)) return 'Português (Brasil)';
    if (/\b(el|la|que|y|tu)\b/.test(text)) return 'Español';

    return 'Português (Brasil)';
  }
}
