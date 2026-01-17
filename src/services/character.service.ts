
import { Injectable, signal, computed, inject } from '@angular/core';
import { Character } from '../models/character.model';
import { AuthService } from './auth.service';
import { MOCK_CHARACTERS } from '../data/mock-characters.data';
import { DatabaseService } from './core/database.service';
import { ToastService } from './toast.service';

@Injectable({
  providedIn: 'root'
})
export class CharacterService {
  private db = inject(DatabaseService);
  private auth = inject(AuthService);
  private toast = inject(ToastService);
  
  private readonly DB_COLLECTION = 'characters_v1';
  
  // Estado local reativo (Signals)
  private _characters = signal<Character[]>([]);
  readonly allCharacters = this._characters.asReadonly();

  // Cache temporário
  private _activeCharacterId: string | null = null;

  constructor() {
    this.initialize();
  }

  /**
   * Carrega dados do Banco de Dados (API)
   */
  private async initialize() {
    try {
      const savedChars = await this.db.getAll<Character>(this.DB_COLLECTION);
      
      // Fusão de dados: Mocks (Sistema) + Salvos (Customizados)
      // Em uma API real, os mocks viriam do servidor também.
      const merged = [
        ...savedChars, 
        ...MOCK_CHARACTERS.filter(m => !savedChars.find(s => s.id === m.id))
      ];
      
      this._characters.set(merged);
    } catch (error) {
      console.error("Falha ao carregar personagens:", error);
      this._characters.set(MOCK_CHARACTERS);
    }
  }

  search(query: string): Character[] {
    const q = query.toLowerCase().trim();
    if (!q) return [];
    
    return this.filterContent(this._characters()).filter(c => 
      c.name.toLowerCase().includes(q) || 
      c.tagline.toLowerCase().includes(q) ||
      c.tags.some(t => t.toLowerCase().includes(q)) ||
      c.creator.toLowerCase().includes(q)
    );
  }

  toggleLike(character: Character) {
    // Futuro: Chamar API de like
    this.toast.show(`Você curtiu ${character.name}! ❤️`, 'success');
  }

  canEdit(char: Character): boolean {
    const user = this.auth.currentUser();
    if (!user) return false;
    if (this.auth.isMaster()) return true;
    if (char.creatorId) return char.creatorId === user.id;
    return char.creator === '@' + user.username;
  }

  private filterContent(chars: Character[]): Character[] {
    const user = this.auth.currentUser();
    if (this.auth.isMaster()) return chars;
    const showNSFW = user?.showNSFW ?? false;
    return showNSFW ? chars : chars.filter(c => !c.isNSFW);
  }

  readonly trending = computed(() => this.filterContent(this._characters().filter(c => c.isTrending)));
  readonly newArrivals = computed(() => this.filterContent(this._characters().filter(c => c.isNew)));
  readonly recommended = computed(() => this.filterContent(this._characters()));

  getCharacterById(id: string): Character | undefined {
    this._activeCharacterId = id;
    
    const char = this._characters().find(c => c.id === id);
    if (!char) return undefined;
    
    if (this.auth.isMaster()) return char;
    const user = this.auth.currentUser();
    const showNSFW = user?.showNSFW ?? false;
    
    if (char.isNSFW && !showNSFW) return undefined;

    return char;
  }

  async addCharacter(char: Character) {
    const user = this.auth.currentUser();
    if (user && !char.creatorId) char.creatorId = user.id;

    // Atualiza UI instantaneamente (Otimistic Update)
    this._characters.update(current => [char, ...current.filter(c => c.id !== char.id)]);

    // Salva na API/DB apenas os customizados
    const currentCustoms = await this.db.getAll<Character>(this.DB_COLLECTION);
    const updatedCustoms = [char, ...currentCustoms.filter(c => c.id !== char.id)];
    await this.db.saveAll(this.DB_COLLECTION, updatedCustoms);
  }

  async deleteCharacter(id: string) {
    const char = this._characters().find(c => c.id === id);
    if (!char) return;

    if (!this.canEdit(char)) {
        this.toast.show("Permissão negada.", "error");
        return;
    }

    // Atualiza UI
    this._characters.update(current => current.filter(c => c.id !== id));
    
    // Atualiza DB
    const currentCustoms = await this.db.getAll<Character>(this.DB_COLLECTION);
    const updatedCustoms = currentCustoms.filter(c => c.id !== id);
    await this.db.saveAll(this.DB_COLLECTION, updatedCustoms);

    this.toast.show("Personagem excluído.", "info");
  }

  refreshFeed() {
    this._characters.update(current => [...current].sort(() => Math.random() - 0.5));
  }

  releaseActiveMemory() {
    this._activeCharacterId = null;
  }
}
