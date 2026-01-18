
import { Character } from '../../models/character.model';
import { UserProfile } from '../../services/auth.service';

export function filterCharacterContent(chars: Character[], user: UserProfile | null): Character[] {
  const showNSFW = user ? user.showNSFW : false;
  return showNSFW ? chars : chars.filter(c => !c.isNSFW);
}

export function searchCharacters(chars: Character[], query: string, user: UserProfile | null): Character[] {
  const q = query.toLowerCase().trim();
  if (!q) return [];
  
  const filtered = filterCharacterContent(chars, user);
  
  return filtered.filter(c => 
    c.name.toLowerCase().includes(q) || 
    c.tagline.toLowerCase().includes(q) ||
    c.tags.some(t => t.toLowerCase().includes(q)) ||
    c.creator.toLowerCase().includes(q)
  );
}
