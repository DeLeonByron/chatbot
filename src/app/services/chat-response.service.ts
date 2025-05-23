import { Injectable } from '@angular/core';
import { CHAT_DATA, ChatEntry } from '../data/chat-response';
import Fuse, { IFuseOptions } from 'fuse.js';

@Injectable({
  providedIn: 'root'
})
export class ChatResponseService {

  private fuse: Fuse<ChatEntry>;

  constructor() {
    const options: IFuseOptions<ChatEntry> = {
      keys: ['tags', 'keywords'], // ← ahora busca en ambos
      threshold: 0.35,            // ← ligeramente más estricto
      ignoreLocation: true,
      minMatchCharLength: 3
    };

    this.fuse = new Fuse(CHAT_DATA, options);
  }

  getResponse(question: string): string {
    const normalized = question.trim().toLowerCase();

    // 1. Coincidencia exacta por keywords
    const exactMatch = CHAT_DATA.find(entry =>
      entry.keywords?.toLowerCase() === normalized
    );
    if (exactMatch) {
      return exactMatch.answer;
    }

    // 2. Búsqueda difusa
    const results = this.fuse.search(normalized);
    if (results.length > 0) {
      return results[0].item.answer;
    }

    // 3. Respuesta por defecto
    const defaultEntry = CHAT_DATA.find(entry => entry.id === 'default');
    return defaultEntry?.answer || 'No encontré una respuesta adecuada.';
  }
}
