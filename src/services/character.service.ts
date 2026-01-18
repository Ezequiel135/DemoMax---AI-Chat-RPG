
import { Injectable, signal, computed, inject } from '@angular/core';
import { Character } from '../models/character.model';
import { AuthService } from './auth.service';
import { MOCK_CHARACTERS } from '../data/mock-characters.data';
import { DatabaseService } from './core/database.service';
import { ToastService } from './toast.service';
import { filterCharacterContent, searchCharacters } from '../logic/character/character-filter.logic';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private db = inject(DatabaseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  
  private readonly DB_COLLECTION = 'characters_v1';
  
  // Single Source of Truth
  private _characters = signal<Character[]>([]);
  readonly allCharacters = this._characters.asReadonly();

  private _initialized = false;

  async initializeData() {
    if (this._initialized) return;
    
    try {
      const savedChars = await this.db.getAll<Character>(this.DB_COLLECTION);
      // Merge ensuring Mocks are always present for demo but not duplicated if already saved
      // Priority to DB version to keep affinity changes
      const merged = [...savedChars];
      
      MOCK_CHARACTERS.forEach(mock => {
         if (!merged.find(s => s.id === mock.id)) {
            merged.push(mock);
         }
      });

      this._characters.set(merged);
      this._initialized = true;
    } catch (error) {
      console.error('Failed to init characters', error);
      this._characters.set(MOCK_CHARACTERS);
    }
  }

  // Reactive Getter: Returns a Signal that updates when the list updates
  getCharacterSignal(id: string) {
    return computed(() => this._characters().find(c => c.id === id));
  }

  incrementMessageCount(id: string) {
    this.updateCharacterLocal(id, char => {
        const current = parseInt(char.messageCount.replace(/[^0-9]/g, '')) || 0;
        return { messageCount: (current + 1).toString() };
    });
  }

  async updateAffinity(id: string, newAffinity: number) {
    await this.updateCharacterLocal(id, () => ({ affinity: newAffinity }));
  }

  // Generic update helper
  private async updateCharacterLocal(id: string, updater: (c: Character) => Partial<Character>) {
    let updatedChar: Character | undefined;

    this._characters.update(chars => chars.map(c => {
        if (c.id !== id) return c;
        const changes = updater(c);
        updatedChar = { ...c, ...changes };
        return updatedChar;
    }));

    if (updatedChar) {
        // Fire and forget save to DB
        this.db.save(this.DB_COLLECTION, updatedChar);
    }
  }

  readonly trending = computed(() => 
    filterCharacterContent(this._characters().filter(c => c.isTrending), this.auth.currentUser())
  );
  
  readonly newArrivals = computed(() => 
    filterCharacterContent(this._characters().filter(c => c.isNew), this.auth.currentUser())
  );
  
  readonly recommended = computed(() => 
    filterCharacterContent(this._characters(), this.auth.currentUser())
  );

  search(query: string): Character[] {
    return searchCharacters(this._characters(), query, this.auth.currentUser());
  }

  // Direct getter (non-reactive snapshot)
  getCharacterById(id: string): Character | undefined {
    let char = this._characters().find(c => c.id === id);
    if (!char) return undefined;
    
    const user = this.auth.currentUser();
    const showNSFW = user ? user.showNSFW : false;
    
    if (char.isNSFW && !showNSFW) return undefined;

    return char;
  }

  toggleLike(character: Character) {
    this.toast.show(`Você curtiu ${character.name}! ❤️`, 'success');
    this.updateCharacterLocal(character.id, c => {
        const current = parseInt(c.favoriteCount.replace(/[^0-9]/g, '')) || 0;
        return { favoriteCount: (current + 1).toString() };
    });
  }

  canEdit(char: Character): boolean {
    const user = this.auth.currentUser();
    if (!user) return false;
    if (this.auth.isMaster()) return true;
    return char.creatorId === user.id;
  }

  async addCharacter(char: Character) {
    await this.db.save(this.DB_COLLECTION, char);
    
    this._characters.update(current => {
        const filtered = current.filter(c => c.id !== char.id);
        return [char, ...filtered];
    });
  }

  async deleteCharacter(id: string) {
    this._characters.update(current => current.filter(c => c.id !== id));
    await this.db.delete(this.DB_COLLECTION, id);
  }

  refreshFeed() {
    this._characters.update(current => [...current].sort(() => Math.random() - 0.5));
  }

  releaseActiveMemory() {
    // Optional cleanup
  }
}
