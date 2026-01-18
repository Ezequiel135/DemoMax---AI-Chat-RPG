
import { Character } from '../../../models/character.model';

export class ActivityGeneratorLogic {
  private static readonly ACTIVITIES = [
    'reading a book', 'scrolling on social media', 'taking a long shower',
    'eating a snack', 'taking a nap', 'listening to music', 'cleaning the room',
    'watching anime', 'staring at the ceiling', 'writing in a diary'
  ];

  static getOffScreenActivity(character: Character): string {
    const traits = (character.tags.join(' ') + ' ' + character.tagline).toLowerCase();
    
    if (traits.includes('gamer')) return 'playing video games';
    if (traits.includes('student')) return 'studying for exams';
    if (traits.includes('maid')) return 'doing household chores';
    if (traits.includes('guerreira')) return 'polishing weapons';
    if (traits.includes('idol')) return 'practicing a dance routine';

    const idx = Math.floor(Math.random() * this.ACTIVITIES.length);
    return this.ACTIVITIES[idx];
  }
}
