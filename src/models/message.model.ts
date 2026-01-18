
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isThinking?: boolean;
  attachmentUrl?: string; // URL da imagem (base64 ou link)
}
