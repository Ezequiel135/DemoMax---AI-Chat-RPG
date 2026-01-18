
import { Injectable, inject, signal, computed } from '@angular/core';
import { StorageService } from './storage.service';
import { createNewPersona } from '../logic/persona/persona-factory.logic';

export interface Persona {
  id: string;
  name: string;
  gender: 'Masculino' | 'Feminino' | 'Não binário';
  description: string;
  avatarUrl?: string; 
  isDefault?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PersonaService {
  private storage = inject(StorageService);
  private readonly KEY = 'demomax_personas_v2';
  private readonly ACTIVE_KEY = 'demomax_active_persona_id';

  // State Signals
  personas = signal<Persona[]>([]);
  activePersonaId = signal<string | null>(null);

  // Computed: Retorna o objeto da persona ativa ou undefined (se estiver usando perfil original)
  activePersona = computed(() => 
    this.personas().find(p => p.id === this.activePersonaId())
  );

  constructor() {
    this.load();
  }

  private load() {
    const savedList = this.storage.getItem<Persona[]>(this.KEY);
    if (savedList) {
      this.personas.set(savedList);
    }

    const savedActiveId = this.storage.getItem<string>(this.ACTIVE_KEY);
    if (savedActiveId && this.personas().some(p => p.id === savedActiveId)) {
      this.activePersonaId.set(savedActiveId);
    } else {
      this.activePersonaId.set(null);
    }
  }

  createPersona(data: Partial<Persona>, setAsActive: boolean = true) {
    const newPersona = createNewPersona(data);

    this.personas.update(list => {
      const updated = [...list, newPersona];
      this.saveList(updated);
      return updated;
    });

    if (setAsActive) {
      this.setActive(newPersona.id);
    }
  }

  updatePersona(id: string, data: Partial<Persona>) {
    this.personas.update(list => {
      const updated = list.map(p => {
        if (p.id !== id) return p;
        return { ...p, ...data };
      });
      this.saveList(updated);
      return updated;
    });
  }

  deletePersona(id: string) {
    if (this.activePersonaId() === id) {
      this.deactivatePersona();
    }

    this.personas.update(list => {
      const updated = list.filter(p => p.id !== id);
      this.saveList(updated);
      return updated;
    });
  }

  setActive(id: string) {
    this.activePersonaId.set(id);
    this.storage.setItem(this.ACTIVE_KEY, id);
  }

  deactivatePersona() {
    this.activePersonaId.set(null);
    this.storage.removeItem(this.ACTIVE_KEY);
  }

  private saveList(list: Persona[]) {
    this.storage.setItem(this.KEY, list);
  }
}
