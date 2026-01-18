
import { Character } from '../../../models/character.model';

export class MapGeneratorLogic {
  
  static generate(character: Character): string {
    // Tenta extrair localização da biografia ou usar defaults baseados em tags
    const lowerDesc = character.description.toLowerCase();
    
    if (lowerDesc.includes('school') || lowerDesc.includes('escola')) return 'Tokyo High School';
    if (lowerDesc.includes('fantasy') || lowerDesc.includes('isekai')) return 'Royal Capital';
    if (lowerDesc.includes('cyberpunk')) return 'Night City - Sector 4';
    
    const locations = [
      'Centro da Cidade', 
      'Casa', 
      'Shopping Center', 
      'Cafeteria Central', 
      'Parque Municipal',
      'Academia'
    ];
    
    return locations[Math.floor(Math.random() * locations.length)];
  }
}
