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
        keys: ['tags'],
        threshold: 0.4,
        ignoreLocation: true,
        minMatchCharLength: 2
      };

      this.fuse = new Fuse(CHAT_DATA, options);
    }

    getResponse(question: string): string {
      const normalized = question.trim().toLowerCase();
      const results = this.fuse.search(normalized);

      if (results.length > 0) {
        return results[0].item.answer;
      }

      const defaultEntry = CHAT_DATA.find(entry => entry.id === 'default');
      return defaultEntry?.answer || 'No encontré una respuesta adecuada.';
    }

}