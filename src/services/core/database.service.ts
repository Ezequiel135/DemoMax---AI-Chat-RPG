
import { Injectable, inject } from '@angular/core';
import { StorageService } from '../storage.service';

/**
 * DATABASE API LAYER
 * 
 * Este serviço atua como uma interface para o Banco de Dados.
 * 
 * MODO ATUAL: Simulação Local (Offline-first usando StorageService).
 * MODO FUTURO: Substitua os métodos abaixo por chamadas HTTP reais.
 * 
 * Exemplo de migração futura:
 * return this.http.get<T[]>(`https://api.meuapp.com/${collection}`);
 */

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private storage = inject(StorageService);

  // Simula um delay de rede para testar comportamento assíncrono (0ms para produção local)
  private readonly LATENCY_MS = 0; 

  /**
   * [GET] Lista todos os itens de uma coleção
   */
  async getAll<T>(collection: string): Promise<T[]> {
    // [API_ENDPOINT]: Substituir por GET /collection
    return new Promise((resolve) => {
      setTimeout(() => {
        const data = this.storage.getItem<T[]>(collection) || [];
        resolve(data);
      }, this.LATENCY_MS);
    });
  }

  /**
   * [GET] Busca um item específico pelo ID
   */
  async getById<T>(collection: string, id: string): Promise<T | null> {
    // [API_ENDPOINT]: Substituir por GET /collection/:id
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = this.storage.getItem<any[]>(collection) || [];
        const item = list.find(i => i.id === id) || null;
        resolve(item);
      }, this.LATENCY_MS);
    });
  }

  /**
   * [POST/PUT] Cria ou Atualiza um item
   */
  async save<T extends { id: string }>(collection: string, item: T): Promise<T> {
    // [API_ENDPOINT]: Substituir por POST/PUT /collection
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = this.storage.getItem<T[]>(collection) || [];
        const index = list.findIndex(i => i.id === item.id);
        
        let updatedList;
        if (index >= 0) {
          updatedList = [...list];
          updatedList[index] = item;
        } else {
          updatedList = [item, ...list];
        }
        
        this.storage.setItem(collection, updatedList);
        resolve(item);
      }, this.LATENCY_MS);
    });
  }

  /**
   * [POST] Salva uma lista inteira (Bulk Update)
   */
  async saveAll<T>(collection: string, items: T[]): Promise<T[]> {
     return new Promise((resolve) => {
        this.storage.setItem(collection, items);
        resolve(items);
     });
  }

  /**
   * [DELETE] Remove um item
   */
  async delete(collection: string, id: string): Promise<boolean> {
    // [API_ENDPOINT]: Substituir por DELETE /collection/:id
    return new Promise((resolve) => {
      setTimeout(() => {
        const list = this.storage.getItem<any[]>(collection) || [];
        const filtered = list.filter(i => i.id !== id);
        this.storage.setItem(collection, filtered);
        resolve(true);
      }, this.LATENCY_MS);
    });
  }
}
