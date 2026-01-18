
import { Character } from '../../../models/character.model';
import { DailyState } from '../../../services/simulation/mood.service';
import { GhostingReactionLogic } from '../../chat/reactions/ghosting-reaction.logic';

export function generateTimeContext(
  hoursSinceLastMessage: number, 
  dailyState: DailyState, 
  character: Character,
  ghostingReason?: string 
): string {
  
  // 1. PRIORITY: GHOSTING DETECTED (Saiu sem tchau + Tempo passou)
  if (ghostingReason) {
    return GhostingReactionLogic.getAbandonmentContext(hoursSinceLastMessage, character);
  }

  // 2. NORMAL GAP (> 4 Hours) - Mas COM tchau (Natural)
  if (hoursSinceLastMessage > 4) {
    return `
    [TIME GAP - HEALTHY]
    It has been ${Math.floor(hoursSinceLastMessage)} hours since last contact.
    The user said goodbye previously, so you are NOT angry.
    Current Activity: You were ${dailyState.recentActivity}.
    Greeting: Warm and welcoming.
    `;
  }

  // 3. CONTINUOUS FLOW
  return `[TIME FLOW] Continuous conversation. No significant gap. Respond directly to the last message.`;
}
