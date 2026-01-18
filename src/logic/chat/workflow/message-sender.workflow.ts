
import { Character } from '../../../models/character.model';
import { Message } from '../../../models/message.model';
import { CharacterService } from '../../../services/character.service';
import { EconomyService } from '../../../services/economy.service';
import { ActivityService } from '../../../services/activity.service';
import { GeminiService } from '../../../services/gemini.service';
import { ChatHistoryService } from '../../../services/chat-history.service';
import { AiMemoryService } from '../../../services/ai/ai-memory.service';
import { BiologicalCycleLogic } from '../../../logic/simulation/biology/biological-cycle.logic';
import { InteractionReactorLogic } from '../../../logic/social/interaction-reactor.logic';
import { DailyState } from '../../../services/simulation/mood.service';
import { generateUUID } from '../../core/uuid.logic';
import { replaceChatPlaceholders } from '../formatting/placeholder.logic';
import { buildSystemPrompt } from '../../prompt-builder.logic';
import { PersonaService } from '../../../services/persona.service';
import { GhostingDetector } from '../analysis/ghosting-detector';
import { ChatSettingsService } from '../../../services/chat-settings.service';
import { RepetitionGuardLogic } from '../safety/repetition-guard.logic';
import { MessageSanitizerLogic } from '../formatting/message-sanitizer.logic';
import { AuthService } from '../../../services/auth.service';

export interface SendMessageResult {
  userMessage: Message;
  aiMessage: Message | null;
  updatedDailyState: DailyState | null;
  feedback?: { message: string, type: 'success' | 'error' | 'info' };
}

export class MessageSenderWorkflow {
  
  static async execute(
    text: string,
    character: Character,
    currentDailyState: DailyState | null,
    services: {
      character: CharacterService,
      economy: EconomyService,
      activity: ActivityService,
      gemini: GeminiService,
      history: ChatHistoryService,
      memory: AiMemoryService,
      persona: PersonaService,
      settings: ChatSettingsService,
      auth?: AuthService
    }
  ): Promise<SendMessageResult> {
    
    const userMsg: Message = {
      id: generateUUID(),
      role: 'user',
      text: text,
      timestamp: Date.now()
    };

    const bioState = BiologicalCycleLogic.getcurrentState(character);
    const reaction = InteractionReactorLogic.calculateImpact(character, text, bioState);
    
    services.character.updateAffinity(character.id, character.affinity + reaction.affinityDelta);
    services.character.incrementMessageCount(character.id);
    services.economy.addXp(5 + (reaction.reactionType === 'Positive' ? 5 : 0));
    services.activity.trackChat(character);

    let newDailyState = currentDailyState;
    if (reaction.newMood && currentDailyState) {
       newDailyState = { ...currentDailyState, mood: reaction.newMood };
    }

    let feedback;
    if (reaction.feedback) {
       const type = reaction.affinityDelta >= 0 ? 'success' : 'error';
       feedback = { message: reaction.feedback, type: type as any };
    }

    let aiMsg: Message | null = null;
    try {
        const chatData = services.history.getChatData(character.id);
        const previousHistory = chatData.messages; 
        
        const repetitionWarning = RepetitionGuardLogic.analyze(previousHistory);
        const ghosting = GhostingDetector.analyze(previousHistory);
        
        // --- PERSONA RESOLUTION ---
        const activePersona = services.persona.activePersona(); 
        
        let userName = 'User';
        let personaContext = undefined;

        if (activePersona) {
           userName = activePersona.name;
           personaContext = activePersona.description; 
        } else if (services.auth && services.auth.currentUser()) {
           userName = services.auth.currentUser()!.username;
        }
        
        let prompt = buildSystemPrompt(
            character, 
            userName, 
            chatData.summary, 
            newDailyState!, 
            ghosting.hoursSinceLast, 
            ghosting.reason,
            personaContext // INJECTED
        );

        if (repetitionWarning) prompt += `\n\n${repetitionWarning}`;
        
        const mode = services.settings.currentSettings().chatMode;
        
        const session = await services.gemini.createChatSession(character.id, prompt, mode, previousHistory);
        let responseText = await services.gemini.sendMessage(session, text);
        
        responseText = replaceChatPlaceholders(responseText, character, userName);
        responseText = MessageSanitizerLogic.sanitize(responseText);

        aiMsg = {
            id: generateUUID(),
            role: 'model',
            text: responseText,
            timestamp: Date.now()
        };

        const allMessagesIncludingNew = [...previousHistory, userMsg, aiMsg];
        const MAX_HISTORY = 30;
        
        if (allMessagesIncludingNew.length > MAX_HISTORY) {
           const messagesToSummarize = allMessagesIncludingNew.slice(0, 10);
           const chunkText = messagesToSummarize.map(m => `${m.role}: ${m.text}`).join('\n');
           const newSummary = await services.memory.compactHistory(chatData.summary, chunkText);
           services.history.updateSummary(character.id, newSummary);
        }

    } catch (error) {
        console.error("Workflow AI Error", error);
        aiMsg = {
           id: generateUUID(),
           role: 'model',
           text: "*Looks confused* ... I felt a connection glitch. Can you say that again?",
           timestamp: Date.now()
        };
    }

    return {
        userMessage: userMsg,
        aiMessage: aiMsg,
        updatedDailyState: newDailyState,
        feedback
    };
  }
}
