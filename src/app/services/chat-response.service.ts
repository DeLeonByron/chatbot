// chat-response.service.ts

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
      keys: ['tags', 'keywords'],
      threshold: 0.35,
      ignoreLocation: true,
      minMatchCharLength: 3
    };
    this.fuse = new Fuse(CHAT_DATA, options);
  }

  getResponse(question: string): string {
    const normalized = question.trim().toLowerCase();

    // Exact match
    const exactMatch = CHAT_DATA.find(entry =>
      entry.keywords?.toLowerCase() === normalized
    );
    if (exactMatch) return exactMatch.answer;

    // Fuzzy
    const results = this.fuse.search(normalized);
    if (results.length > 0) return results[0].item.answer;

    // Default
    const defaultEntry = CHAT_DATA.find(entry => entry.id === 'default');
    return defaultEntry?.answer || 'No encontré una respuesta adecuada.';
  }

  // Mapa de frases por paso
  private STEP_KEYWORDS = {
    menu: [
      { phrase: 'combo familiar', data: { id: 1, name: 'Combo Familiar' } },
      { phrase: 'combo personal', data: { id: 2, name: 'Combo Personal' } },
      { phrase: 'combo pitero', data: { id: 3, name: 'Combo Pitero Feliz' } }
    ],
    payment: [
      { phrase: 'tarjeta', data: 'tarjeta' },
      { phrase: 'efectivo', data: 'efectivo' },
      { phrase: 'qr', data: 'qr' }
    ],
    confirmation: [
      { phrase: 'sí', data: true },
      { phrase: 'no', data: false }
    ]
  };

  getHybridFlowStepWithInput(
    order: Partial<Order>,
    currentStep: ChatOrderStep,
    userInput: string
  ): { nextStep: ChatOrderStep, message: string } {

    const input = userInput.trim().toLowerCase();

    switch (currentStep.step) {
      case 'menu': {
        const fuse = new Fuse(this.STEP_KEYWORDS.menu, { keys: ['phrase'], threshold: 0.4 });
        const result = fuse.search(input);
        const combo = result[0]?.item?.data;

        if (combo) {
          const updatedCombos = [...(order.combos || []), { ...combo, quantity: 1 }];
          return {
            nextStep: { step: 'quantity', data: { combos: updatedCombos } },
            message: `Has elegido el combo "${combo.name}". ¿Cuántos deseas ordenar?`
          };
        }

        return {
          nextStep: currentStep,
          message: 'No entendí qué combo deseas. Intenta decir "Combo Familiar", "Combo Personal", etc.'
        };
      }

      case 'quantity': {
        const quantity = parseInt(input, 10);
        if (!isNaN(quantity) && quantity > 0) {
          const updatedCombos = [...(order.combos || [])];
          updatedCombos[updatedCombos.length - 1].quantity = quantity;

          return {
            nextStep: { step: 'address', data: { ...order, combos: updatedCombos } },
            message: '¿Cuál es la dirección de entrega?'
          };
        }

        return {
          nextStep: currentStep,
          message: 'Por favor, indica un número válido de combos.'
        };
      }

      case 'address': {
        return {
          nextStep: { step: 'payment', data: { ...order, address: input } },
          message: '¿Cómo deseas pagar? Opciones: tarjeta, efectivo, qr'
        };
      }

      case 'payment': {
        const fuse = new Fuse(this.STEP_KEYWORDS.payment, { keys: ['phrase'], threshold: 0.4 });
        const result = fuse.search(input);
        const method = result[0]?.item?.data;

        if (method) {
          return {
            nextStep: {
              step: 'confirmation',
              data: { ...order, paymentMethod: method }
            },
            message: `Perfecto. ¿Deseas confirmar el pedido?\nDirección: ${order.address}\nPago: ${method}`
          };
        }

        return {
          nextStep: currentStep,
          message: 'Método de pago no reconocido. Prueba con: tarjeta, efectivo o qr.'
        };
      }

      case 'confirmation': {
        const fuse = new Fuse(this.STEP_KEYWORDS.confirmation, { keys: ['phrase'], threshold: 0.4 });
        const result = fuse.search(input);
        const confirm = result[0]?.item?.data;

        if (confirm === true) {
          return {
            nextStep: { step: 'addMore', data: { ...order } },
            message: '¡Pedido confirmado! ¿Quieres agregar más combos? (sí/no)'
          };
        } else if (confirm === false) {
          return {
            nextStep: { step: 'menu', data: { combos: [] } },
            message: 'Pedido cancelado. Empecemos de nuevo. ¿Qué combo deseas pedir?'
          };
        }

        return {
          nextStep: currentStep,
          message: '¿Puedes confirmar con "sí" o "no"?'
        };
      }

      case 'addMore': {
        const fuse = new Fuse(this.STEP_KEYWORDS.confirmation, { keys: ['phrase'], threshold: 0.4 });
        const result = fuse.search(input);
        const addMore = result[0]?.item?.data;

        if (addMore === true) {
          return {
            nextStep: { step: 'menu', data: { ...order } },
            message: '¿Qué combo deseas pedir ahora?'
          };
        }

        return {
          nextStep: { step: 'done' },
          message: 'Gracias por tu pedido. ¡Buen provecho!'
        };
      }

      default:
        return {
          nextStep: { step: 'menu' },
          message: '¿Qué combo deseas pedir?'
        };
    }
  }

  // Tu función FSM anterior permanece igual si deseas mantenerla también
  getHybridFlowStep(order: Partial<Order>, currentStep: ChatOrderStep): { nextStep: ChatOrderStep, message: string } {
    switch (currentStep.step) {
      case 'menu':
        const lastCombo = order.combos && order.combos.length > 0 ? order.combos[order.combos.length - 1] : null;
        return {
          nextStep: { step: 'quantity', data: { combos: order.combos } },
          message: lastCombo
            ? `Has elegido el combo "${lastCombo.name}". ¿Cuántos deseas ordenar?`
            : `¿Qué combo deseas pedir?`
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
        const combosList = order.combos
          ? order.combos.map(c => `${c.quantity} x ${c.name}`).join(', ')
          : '';
        return {
          nextStep: { step: 'confirmation', data: { ...order } },
          message: `Perfecto. ¿Deseas confirmar el pedido con estos datos?\nCombos: ${combosList}\nDirección: ${order.address}\nPago: ${order.paymentMethod}`
        };

      case 'confirmation':
        return {
          nextStep: { step: 'addMore' },
          message: '¿Quieres agregar más combos a tu pedido? (sí/no)'
        };

      case 'addMore':
        return {
          nextStep: { step: 'menu' },
          message: '¿Qué combo deseas pedir ahora?'
        };

      default:
        return {
          nextStep: { step: 'menu' },
          message: '¿Qué combo deseas pedir?'
        };
    }
  }

}
