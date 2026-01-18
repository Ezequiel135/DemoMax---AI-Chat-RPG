
import { Injectable, inject } from '@angular/core';
import { AiConfigService } from './ai-config.service';
import { ChatHistoryService } from '../chat-history.service';
import { Character } from '../../models/character.model';
import { PhoneData } from '../../models/phone-content.model';
import { BankGeneratorLogic } from '../../logic/phone/generators/bank-generator.logic';
import { MapGeneratorLogic } from '../../logic/phone/generators/map-generator.logic';
import { LanguageDetectorUtils } from '../../logic/phone/utils/language-detector.utils';

@Injectable({
  providedIn: 'root'
})
export class PhoneGeneratorService {
  private config = inject(AiConfigService);
  private historyService = inject(ChatHistoryService);

  async hackPhone(character: Character, financialContext: string = ''): Promise<PhoneData | null> {
    
    // 1. Coleta dados de contexto
    const chatData = this.historyService.getChatData(character.id);
    const targetLang = LanguageDetectorUtils.detectTargetLanguage(chatData.messages);
    
    // 2. Gera dados determinísticos (Banco, Mapa)
    const bankData = BankGeneratorLogic.generate(character);
    const location = MapGeneratorLogic.generate(character);
    const battery = Math.floor(Math.random() * 80) + 20;

    // 3. Monta Prompt para dados criativos (Contatos, Notas, Galeria)
    const prompt = `
      [TASK] Generate realistic smartphone content for character "${character.name}".
      [CONTEXT]
      Role: ${character.tagline}
      Personality: ${character.systemInstruction}
      Language: ${targetLang}
      
      [REQUIREMENTS]
      Generate a JSON object with:
      1. 'contacts': Array of 5 people (friends/family/rivals). Fields: 'name', 'lastMessage' (short realistic text), 'unreadCount' (0-5), 'avatarSeed' (short string for id), 'isSensitive' (boolean).
      2. 'notes': Array of 3 recent notes. Fields: 'title', 'content', 'date'. Can include secrets or daily tasks.
      3. 'gallery': Array of 4 photo descriptions. Fields: 'description' (short), 'visualPrompt' (for AI generation), 'timestamp'.
      4. 'browserHistory': Array of 3 recent URLs or Search Terms relevant to their personality.
      
      [FORMAT]
      Return ONLY valid JSON. No markdown blocks.
    `;

    try {
      const response = await this.config.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: { responseMimeType: 'application/json' }
      });

      const aiData = JSON.parse(response.text || '{}');

      // 4. Mescla dados reais da IA com dados lógicos
      return {
        ownerName: character.name,
        modelType: 'SmartDevice OS',
        currentLocation: location,
        batteryLevel: battery,
        bankAccount: bankData, 
        contacts: aiData.contacts || [],
        notes: aiData.notes || [],
        gallery: aiData.gallery || [],
        browserHistory: aiData.browserHistory || []
      };

    } catch (e) {
      console.error("Phone Hack Failed", e);
      // Fallback básico se a IA falhar
      return {
        ownerName: character.name,
        modelType: 'ErrorPhone 404',
        currentLocation: 'Unknown',
        batteryLevel: 10,
        bankAccount: bankData,
        contacts: [{ name: 'Mãe', lastMessage: 'Me liga?', avatarSeed: 'mom', history: [] }],
        notes: [],
        gallery: [],
        browserHistory: []
      };
    }
  }
}
