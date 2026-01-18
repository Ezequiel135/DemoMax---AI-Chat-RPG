
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class IndexedDbService {
  private dbName = 'DemoMaxDB';
  private dbVersion = 1;
  private db: IDBDatabase | null = null;

  // Define Stores (Tables)
  private readonly STORES = [
    'characters_v1',
    'visual_novels_v1',
    'web_novels_v1',
    'dm_chats_v1',
    'dm_messages', 
    'user_data',   
    'system_cache' 
  ];

  /**
   * Opens the database connection.
   */
  async init(): Promise<void> {
    if (this.db) return;

    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error('IndexedDB error:', event);
        reject('Failed to open database');
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve();
      };

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        
        this.STORES.forEach(storeName => {
          if (!db.objectStoreNames.contains(storeName)) {
            // Create store with 'id' as keyPath
            db.createObjectStore(storeName, { keyPath: 'id' });
          }
        });
      };
    });
  }

  async getAll<T>(storeName: string): Promise<T[]> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB Closed');
      
      const transaction = this.db.transaction([storeName], 'readonly');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async get<T>(storeName: string, id: string): Promise<T | null> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB Closed');

      const transaction = this.db.transaction([storeName], 'readonly');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.get(id);

      request.onsuccess = () => resolve(request.result || null);
      request.onerror = () => reject(request.error);
    });
  }

  async put<T>(storeName: string, item: T): Promise<T> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB Closed');

      const transaction = this.db.transaction([storeName], 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.put(item);

      request.onsuccess = () => resolve(item);
      request.onerror = () => reject(request.error);
    });
  }

  async putAll<T>(storeName: string, items: T[]): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB Closed');

      const transaction = this.db.transaction([storeName], 'readwrite');
      const objectStore = transaction.objectStore(storeName);

      transaction.oncomplete = () => resolve();
      transaction.onerror = () => reject(transaction.error);

      items.forEach(item => objectStore.put(item));
    });
  }

  async delete(storeName: string, id: string): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB Closed');

      const transaction = this.db.transaction([storeName], 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.delete(id);

      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  async clear(storeName: string): Promise<void> {
    await this.ensureInit();
    return new Promise((resolve, reject) => {
      if (!this.db) return reject('DB Closed');
      const transaction = this.db.transaction([storeName], 'readwrite');
      const objectStore = transaction.objectStore(storeName);
      const request = objectStore.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  private async ensureInit() {
    if (!this.db) await this.init();
  }
}
