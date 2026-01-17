
import { Injectable } from '@angular/core';
import { GoogleGenAI } from '@google/genai';

@Injectable({
  providedIn: 'root'
})
export class AiConfigService {
  private _client: GoogleGenAI;

  constructor() {
    this._client = new GoogleGenAI({ apiKey: process.env['API_KEY'] || '' });
  }

  get client(): GoogleGenAI {
    return this._client;
  }
}
