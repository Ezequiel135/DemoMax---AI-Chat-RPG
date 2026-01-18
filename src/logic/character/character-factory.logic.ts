
import { Character } from '../../models/character.model';
import { generateUUID } from '../core/uuid.logic';

export function createNewCharacter(
  data: Partial<Character>,
  creatorId: string,
  creatorHandle: string
): Character {
  return {
    id: `char_${generateUUID()}`,
    name: data.name || 'Sem Nome',
    tagline: data.tagline || '',
    description: data.description || '',
    avatarUrl: data.avatarUrl || '',
    coverUrl: data.coverUrl || '',
    systemInstruction: data.systemInstruction || '',
    gender: data.gender || 'Female',
    rarity: data.rarity || 'Common',
    affinity: data.initialAffinity || 0,
    initialAffinity: data.initialAffinity || 0,
    tags: data.tags || ['User Created'],
    creator: creatorHandle.startsWith('@') ? creatorHandle : '@' + creatorHandle,
    creatorId: creatorId,
    messageCount: '0',
    favoriteCount: '0',
    isNew: true,
    pixKey: data.pixKey,
    isNSFW: data.isNSFW || false,
    modelConfig: data.modelConfig || 'Standard',
    firstMessage: data.firstMessage,
    lifeStatus: {
        isAlive: true,
        healthCondition: 'Healthy',
        isPregnant: false,
        pregnancyWeeks: 0,
        childrenCount: 0
    }
  };
}
