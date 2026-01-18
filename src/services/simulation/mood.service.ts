
import { Injectable } from '@angular/core';
import { Character } from '../../models/character.model';
import { BiologicalCycleLogic } from '../../logic/simulation/biology/biological-cycle.logic';
import { EmotionEngineLogic } from '../../logic/simulation/mood/emotion-engine.logic';
import { InitialMoodLogic } from '../../logic/simulation/mood/initial-mood.logic';
import { EMOTION_LIBRARY, EmotionDef } from '../../data/emotions.data';

export interface DailyState {
  mood: string;
  emotionData: EmotionDef;
  physical: string; 
  modifier: number; 
  flavorText: string;
  recentActivity: string;
}

@Injectable({
  providedIn: 'root'
})
export class MoodService {

  getInitialState(character: Character): DailyState {
    return InitialMoodLogic.determine(character);
  }

  getCharacterState(character: Character): DailyState {
    const bioState = BiologicalCycleLogic.getcurrentState(character);
    const emotion = EmotionEngineLogic.calculateState(character, bioState);

    let physical = bioState.physicalDescription || 'Normal';
    let flavor = bioState.flavorText || emotion.description;

    if (emotion.category === 'Visceral' || emotion.intensity > 8) {
       physical = `Physically affected by ${emotion.label} (${emotion.intensity}/10)`;
    }

    return {
      mood: emotion.id,
      emotionData: emotion,
      physical: physical,
      modifier: 1.0,
      flavorText: flavor,
      recentActivity: 'existing in this state'
    };
  }
}
