
import { Character } from '../../../models/character.model';
import { Message } from '../../../models/message.model';
import { DailyState } from '../../../services/simulation/mood.service';

export type AccessStatus = 'GRANTED' | 'DENIED' | 'CAUGHT' | 'STEALTH_SUCCESS';

export interface AccessCheckResult {
  status: AccessStatus;
  systemPrompt?: string; // Prompt para a IA gerar a reação
}

export class ChatInterruptionLogic {
  
  /**
   * Analisa a conversa recente para ver se a IA deu permissão explicita.
   * Ex: "Pode ver meu celular", "Take a look", "Senha é 1234".
   */
  static hasExplicitConsent(text: string): boolean {
    const textLower = text.toLowerCase();
    
    const permissions = [
      'toma', 'pega', 'pode ver', 'pode ler', 'aqui está', 'here', 'take it', 
      'olha', 'look', 'desbloque', 'senha é', 'password is', 'sure', 'claro',
      'pode olhar', 'veja', 'read it', 'check my phone', 'show you'
    ];
    
    // Verifica se tem permissão E não tem negação na mesma frase ("claro que não")
    const hasPerm = permissions.some(p => textLower.includes(p));
    const hasNegation = textLower.includes('não pode') || textLower.includes("don't") || textLower.includes('never');

    return hasPerm && !hasNegation;
  }

  /**
   * Verifica permissão e gera o prompt de reação se necessário.
   */
  static checkAccess(
    character: Character, 
    toolType: 'phone' | 'diary', 
    recentMessages: Message[], 
    dailyState: DailyState | null
  ): AccessCheckResult {
    
    const item = toolType === 'phone' ? 'Celular/Phone' : 'Diário/Diary';
    const mood = dailyState ? `${dailyState.mood} (${dailyState.physical})` : 'Neutral';

    // Obter as últimas mensagens para contexto
    const lastAiMsg = recentMessages.filter(m => m.role === 'model').pop()?.text.toLowerCase() || '';
    const lastUserMsg = recentMessages.filter(m => m.role === 'user').pop()?.text.toLowerCase() || '';

    // 1. CHECAGEM DE CONSENTIMENTO EXPLÍCITO (A IA já deixou?)
    // Usa o método estático agora público
    if (this.hasExplicitConsent(lastAiMsg)) {
       return { status: 'GRANTED' };
    }

    // 2. CHECAGEM DE CONTEXTO FÍSICO (Ela está perto/capaz de impedir?)
    if (this.isCharacterUnavailable(lastAiMsg)) {
       return { status: 'STEALTH_SUCCESS' };
    }

    // 3. CHECAGEM DE PEDIDO DO USUÁRIO
    const askedPermission = (lastUserMsg.includes('posso') || lastUserMsg.includes('deixa') || lastUserMsg.includes('me dá') || lastUserMsg.includes('mostra')) &&
                            (lastUserMsg.includes('ver') || lastUserMsg.includes('olhar') || lastUserMsg.includes('senha') || lastUserMsg.includes('celular') || lastUserMsg.includes('diario'));

    if (askedPermission) {
       const allows = this.decideIfAllows(character);
       if (allows) {
          return { status: 'GRANTED' };
       } else {
          // ELA NEGA O PEDIDO.
          const prompt = `
          [SYSTEM COMMAND: DENY REQUEST]
          The User asked to see your ${item}. You DO NOT want to show it.
          
          [INSTRUCTION]
          Reply immediately refusing the request.
          Use actions (*shaking head*, *hiding device*) and dialogue.
          Current Mood: ${mood}.
          `;
          return { status: 'DENIED', systemPrompt: prompt };
       }
    }

    // 4. TENTATIVA DE FURTO (Stealth)
    
    let detectionChance = 0.7; // 70% base de ser pego

    if (lastAiMsg.includes('não') || lastAiMsg.includes('no') || lastAiMsg.includes('sai') || lastAiMsg.includes('stop')) {
       detectionChance = 0.95; 
    }

    if (character.affinity > 100) detectionChance -= 0.3; 
    if (character.affinity < -20) detectionChance += 0.2; 
    
    const tags = (character.tags || []).join(' ').toLowerCase();
    if (tags.includes('ninja') || tags.includes('spy') || tags.includes('paranoid')) detectionChance = 0.95; 
    if (tags.includes('airhead') || tags.includes('clumsy') || tags.includes('sleepy')) detectionChance = 0.3; 

    const isCaught = Math.random() < detectionChance;

    if (isCaught) {
       const prompt = `
       [SYSTEM COMMAND: STOP THE USER!]
       The User just tried to grab your ${item} without asking. You saw them reaching for it!
       
       [INSTRUCTION]
       React INSTANTLY. Stop them physically (*slap hand*, *pull away*, *grab wrist*).
       Scold them for being rude/snooping.
       Do NOT let them have it.
       Tone: ${mood}.
       `;
       return { status: 'CAUGHT', systemPrompt: prompt };
    } else {
       return { status: 'STEALTH_SUCCESS' };
    }
  }

  private static isCharacterUnavailable(text: string): boolean {
    const distractions = [
      'dormindo', 'sleeping', 'sleep', 'sono', 
      'banho', 'shower', 'bath', 
      'cozinha', 'kitchen', 'saiu', 'left the room', 'foi embora', 
      'longe', 'away', 'esqueceu', 'forgot', 'deixou', 'left it'
    ];
    return distractions.some(d => text.includes(d));
  }

  private static decideIfAllows(character: Character): boolean {
    let threshold = 20; 
    const traits = (character.tagline + ' ' + character.tags.join(' ')).toLowerCase();
    
    if (traits.includes('tsundere')) threshold = 60; 
    if (traits.includes('shy') || traits.includes('tímida')) threshold = 50; 
    if (traits.includes('yandere')) threshold = 10; 
    if (traits.includes('secretive') || traits.includes('misteriosa')) threshold = 100; 

    return character.affinity >= threshold;
  }
  
  static buildEmbarrassingCaughtPrompt(character: Character, itemType: string): string {
     return `
     [SYSTEM COMMAND: EMERGENCY INTERACTION]
     The User was secretly reading your ${itemType} (Privacy Breach!).
     You just realized it. 
     
     [INSTRUCTION]
     1. SNATCH the device back immediately using an action (*...*).
     2. React with extreme emotion (Embarrassment, Anger, or Shock).
     3. Scold the user for spying on you.
     DO NOT IGNORE THIS. MAKE A SCENE.
     `;
  }
}
