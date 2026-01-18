
import { Persona } from '../../services/persona.service';
import { generateUUID } from '../core/uuid.logic';

export function createNewPersona(data: Partial<Persona>): Persona {
    return {
      id: `p_${generateUUID()}`,
      name: data.name || 'Nova Persona',
      gender: data.gender || 'Masculino',
      description: data.description || '',
      avatarUrl: data.avatarUrl // Opcional
    };
}
