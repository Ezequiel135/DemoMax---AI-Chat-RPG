
import { Character } from '../../../models/character.model';
import { ActivityGeneratorLogic } from '../../simulation/life/activity-generator.logic';

export class GhostingReactionLogic {
  static getAbandonmentContext(hoursSinceLastMessage: number, character: Character): string {
    const currentActivity = ActivityGeneratorLogic.getOffScreenActivity(character);
    
    if (hoursSinceLastMessage >= 24) {
       return `[CRITICAL: GHOSTING > 24h] User vanished. You are angry/hurt. You were ${currentActivity}. React coldly.`;
    }
    if (hoursSinceLastMessage >= 1) {
       return `[GHOSTING > 1h] User left abruptly. You started ${currentActivity}. Act annoyed.`;
    }
    return '';
  }
}
