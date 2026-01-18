
import { ChatSettings } from '../../services/chat-settings.service';

export function getDefaultChatSettings(): ChatSettings {
    return {
      wallpaperId: 'default',
      decorationId: 'default',
      autoVoice: false,
      chatMode: 'flash'
    };
}
