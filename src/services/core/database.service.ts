
import { Injectable, inject } from '@angular/core';
import { IndexedDbService } from './indexed-db.service';

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {
  private db = inject(IndexedDbService);

  async getAll<T>(collection: string): Promise<T[]> {
    try {
      return await this.db.getAll<T>(collection);
    } catch (e) {
      console.warn(`[Database] Error fetching ${collection}`, e);
      return [];
    }
  }

  async getById<T>(collection: string, id: string): Promise<T | null> {
    try {
      return await this.db.get<T>(collection, id);
    } catch (e) {
      return null;
    }
  }

  async save<T extends { id: string }>(collection: string, item: T): Promise<T> {
    return await this.db.put<T>(collection, item);
  }

  async saveAll<T>(collection: string, items: T[]): Promise<T[]> {
     await this.db.putAll(collection, items);
     return items;
  }

  async delete(collection: string, id: string): Promise<boolean> {
    await this.db.delete(collection, id);
    return true;
  }
  
  async clearCollection(collection: string): Promise<void> {
    await this.db.clear(collection);
  }
}
