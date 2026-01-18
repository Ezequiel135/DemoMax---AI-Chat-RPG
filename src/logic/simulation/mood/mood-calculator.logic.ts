
export interface MoodResult {
  mood: 'Happy' | 'Neutral' | 'Sad' | 'Irritated' | 'Excited' | 'Sick' | 'Hormonal';
  physical: string;
  modifier: number;
  flavorText: string;
}

export class MoodCalculatorLogic {
  static calculateDailyMood(characterId: string): MoodResult {
    const today = new Date();
    const seed = today.getDate() + today.getMonth() + today.getFullYear() + characterId.length;
    const rand = (Math.sin(seed) * 10000) - Math.floor(Math.sin(seed) * 10000); 

    if (rand < 0.05) return { mood: 'Sick', physical: 'Fever', modifier: 0.5, flavorText: 'Sick today.' };
    if (rand < 0.15) return { mood: 'Irritated', physical: 'Tension', modifier: -2.0, flavorText: 'Bad day.' };
    if (rand < 0.25) return { mood: 'Sad', physical: 'Low energy', modifier: 0.8, flavorText: 'Melancholic.' };
    
    return { mood: 'Neutral', physical: 'Normal', modifier: 1.0, flavorText: 'Feeling calm.' };
  }
}
