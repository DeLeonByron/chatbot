import { Injectable } from '@angular/core';
import { CHAT_DATA, ChatEntry } from '../data/chat-response';
import Fuse, { IFuseOptions } from 'fuse.js';
import { ChatOrderStep, Order } from '../data/order.model';

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

  getHybridFlowStep(order: Partial<Order>, currentStep: ChatOrderStep): { nextStep: ChatOrderStep, message: string } {
    switch (currentStep.step) {
      case 'menu':
        return {
          nextStep: { step: 'quantity', data: { combo: order.combo } },
          message: `Has elegido el combo "${order.combo}". ¿Cuántos deseas ordenar?`
        };
      case 'quantity':
        return {
          nextStep: { step: 'address', data: { ...order } },
          message: `¿Cuál es la dirección de entrega?`
        };
      case 'address':
        return {
          nextStep: { step: 'payment', data: { ...order } },
          message: `¿Cómo deseas pagar? Opciones: tarjeta, efectivo, qr`
        };
      case 'payment':
        return {
          nextStep: { step: 'confirmation', data: { ...order } },
          message: `Perfecto. ¿Deseas confirmar el pedido con estos datos?\nCombo: ${order.combo}\nCantidad: ${order.quantity}\nDirección: ${order.address}\nPago: ${order.paymentMethod}`
        };
      default:
        return {
          nextStep: { step: 'menu' },
          message: '¿Qué combo deseas pedir? (ej: Combo Personal, Combo Familiar, Combo Pitero Feliz)'
        };
    }
  }


  
}
