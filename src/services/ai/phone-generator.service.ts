
import { Injectable, inject } from '@angular/core';
import { AiConfigService } from './ai-config.service';
import { Character } from '../../models/character.model';
import { PhoneData } from '../../models/phone-content.model';

@Injectable({
  providedIn: 'root'
})
export class PhoneGeneratorService {
  private config = inject(AiConfigService);

  async hackPhone(character: Character): Promise<PhoneData | null> {
    const prompt = `
      [TASK]
      Generate a realistic JSON dump of a smartphone belonging to the character below. 
      The content must be immersive, strictly following their personality, lore, and universe.
      
      [CHARACTER]
      Name: ${character.name}
      Role: ${character.tagline}
      Personality: ${character.systemInstruction}
      
      [REQUIREMENTS]
      1. CONTACTS: Create 3-4 chat threads with OTHER characters from their universe (e.g., Mom, Boss, Rival, Secret Lover). Include realistic message history for each.
      2. BROWSER: 5 realistic search history items based on their recent thoughts/worries.
      3. BANK: Current balance and 4-5 recent transactions (spending habits).
      4. NOTES: 2-3 personal notes (diary, to-do list, or secret code).
      5. GALLERY: 4 descriptions of photos they recently took.
      6. LOCATION: A cool name for their current location in their universe.
      
      [OUTPUT FORMAT]
      Return ONLY valid JSON matching this schema. Do not include markdown formatting like \`\`\`json.
      {
        "ownerName": "string",
        "modelType": "string",
        "currentLocation": "string",
        "batteryLevel": number (1-100),
        "contacts": [
          { "name": "string", "avatarSeed": "string (short random string)", "lastMessage": "string", "history": [{ "sender": "me"|"other", "text": "string", "time": "string" }] }
        ],
        "browserHistory": ["string"],
        "bankAccount": {
          "balance": "string",
          "transactions": [{ "merchant": "string", "amount": "string", "date": "string", "type": "debit"|"credit" }]
        },
        "notes": [{ "title": "string", "content": "string", "date": "string" }],
        "gallery": [{ "description": "string", "visualPrompt": "string", "timestamp": "string" }]
      }
    `;

    try {
      const response = await this.config.client.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      });

      const text = response.text;
      if (!text) return null;

      // CLEANUP: Remove potential markdown code blocks if the model ignores the instruction
      const cleanedText = text.replace(/```json/g, '').replace(/```/g, '').trim();

      return JSON.parse(cleanedText) as PhoneData;
    } catch (e) {
      console.error("Phone Hack Failed", e);
      return null;
    }
  }
}
