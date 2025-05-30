import { Injectable } from '@angular/core';
import Fuse, { IFuseOptions } from 'fuse.js';
import { CHAT_DATA, ChatEntry } from '../data/chat-response';
import { ChatOrderStep, Order } from '../data/order.model';

interface MenuItem {
  id: number;
  name: string;
  isCombo: boolean;
}

const MENU_ITEMS: MenuItem[] = [
  { id: 1, name: 'Combo Familiar', isCombo: true },
  { id: 2, name: 'Combo Personal', isCombo: true },
  { id: 3, name: 'Combo Pitero Feliz', isCombo: true },
  { id: 4, name: 'Pizza Margarita', isCombo: false },
  { id: 5, name: 'Hamburguesa', isCombo: false },
  { id: 6, name: 'Papas Fritas', isCombo: false }
];

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

    // Fuzzy search
    const results = this.fuse.search(normalized);
    if (results.length > 0) return results[0].item.answer;

    // Default fallback
    const defaultEntry = CHAT_DATA.find(entry => entry.id === 'default');
    return defaultEntry?.answer || 'No encontré una respuesta adecuada.';
  }

  // Mapa de frases por paso para reconocimiento
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
      { phrase: 'si', data: true },  // sin tilde
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

      case 'start': {
        const fuse = new Fuse(this.STEP_KEYWORDS.confirmation, { keys: ['phrase'], threshold: 0.4 });
        const result = fuse.search(input);
        const answer = result[0]?.item?.data;

        if (answer === true) {
          return {
            nextStep: { step: 'menu', data: { combos: [] } },
            message: '¡Perfecto! Aquí está nuestro menú: Combo Familiar, Combo Personal, Combo Pitero Feliz. ¿Qué combo deseas pedir?'
          };
        } else if (answer === false) {
          return {
            nextStep: { step: 'end' },
            message: 'Está bien, si necesitas algo más aquí estaré. ¡Que tengas un buen día!'
          };
        } else {
          return {
            nextStep: currentStep,
            message: '¿Quieres ver el menú? Por favor responde "sí" o "no".'
          };
        }
      }

      case 'menu': {
        // Buscar por número
        const num = parseInt(input, 10);
        let item: MenuItem | null = null;
        if (!isNaN(num)) {
          item = MENU_ITEMS.find(m => m.id === num) || null;
        }

        // Si no se encontró por número, buscar por nombre fuzzy con Fuse
        if (!item) {
          const fuse = new Fuse(MENU_ITEMS, { keys: ['name'], threshold: 0.3 });
          const result = fuse.search(input);
          if (result.length > 0) item = result[0].item;
        }

        if (!item) {
          return {
            nextStep: currentStep,
            message: 'No encontré ese producto. Por favor, elige un número o nombre válido del menú.'
          };
        }

        return {
          nextStep: { step: 'askCombo', data: { selectedItem: item, combos: order.combos || [] } },
          message: item.isCombo
            ? `Has elegido "${item.name}". ¿Quieres que lo preparemos en combo? (sí/no)`
            : `Has elegido "${item.name}". ¿Cuántos deseas ordenar?`
        };
      }

      case 'askCombo': {
        const fuse = new Fuse(this.STEP_KEYWORDS.confirmation, { keys: ['phrase'], threshold: 0.4 });
        const result = fuse.search(input);
        const answer = result[0]?.item?.data;

        if (answer === undefined) {
          return {
            nextStep: currentStep,
            message: 'Por favor responde "sí" o "no". ¿Quieres el producto en combo?'
          };
        }

        const item = currentStep.data.selectedItem;
        let combos = [...(currentStep.data.combos || [])];

        combos.push({
          ...item,
          quantity: 0,
          isCombo: answer === true
        });

        return {
          nextStep: { step: 'quantity', data: { combos } },
          message: '¿Cuántos deseas ordenar?'
        };
      }

      case 'quantity': {
        const quantity = parseInt(input, 10);
        if (!quantity || quantity <= 0) {
          return {
            nextStep: currentStep,
            message: 'Por favor, indica un número válido para la cantidad.'
          };
        }

        let combos = [...(currentStep.data.combos || [])];
        combos[combos.length - 1].quantity = quantity;

        // Preguntar si quiere agregar más productos antes de pedir dirección
        return {
          nextStep: { step: 'addMore', data: { combos } },
          message: '¡Pedido confirmado! ¿Quieres agregar más productos? (sí/no)'
        };
      }

      case 'addMore': {
        const fuse = new Fuse(this.STEP_KEYWORDS.confirmation, { keys: ['phrase'], threshold: 0.4 });
        const result = fuse.search(input);
        const addMore = result[0]?.item?.data;

        if (addMore === undefined) {
          return {
            nextStep: currentStep,
            message: 'Por favor responde "sí" o "no". ¿Quieres agregar más productos?'
          };
        }

        if (addMore) {
          return {
            nextStep: { step: 'menu', data: currentStep.data },
            message: 'Perfecto. ¿Qué producto deseas agregar?'
          };
        } else {
          return {
            nextStep: { step: 'address', data: currentStep.data },
            message: '¿Cuál es la dirección de entrega?'
          };
        }
      }

      case 'address': {
        return {
          nextStep: { step: 'payment', data: { ...order, address: userInput.trim() } },
          message: '¿Cómo deseas pagar? Opciones: tarjeta, efectivo, qr'
        };
      }

      case 'payment': {
        const fuse = new Fuse(this.STEP_KEYWORDS.payment, { keys: ['phrase'], threshold: 0.4 });
        const result = fuse.search(input);
        const method = result[0]?.item?.data;

        if (!method) {
          return {
            nextStep: currentStep,
            message: 'Método de pago no reconocido. Por favor usa: tarjeta, efectivo o qr.'
          };
        }

        return {
          nextStep: { step: 'confirmation', data: { ...order, paymentMethod: method } },
          message: `Perfecto. Aquí está el resumen:\nProductos:\n${order.combos
            ?.map(c => `${c.quantity} x ${c.name} ${c.isCombo ? '(combo)' : ''}`).join('\n')}\nDirección: ${order.address}\nPago: ${method}\n¿Confirmas el pedido? (sí/no)`
        };
      }

      case 'confirmation': {
        const fuse = new Fuse(this.STEP_KEYWORDS.confirmation, { keys: ['phrase'], threshold: 0.4 });
        const result = fuse.search(input);
        const confirm = result[0]?.item?.data;

        if (confirm === undefined) {
          return {
            nextStep: currentStep,
            message: 'Por favor responde "sí" o "no". ¿Confirmas el pedido?'
          };
        }

        if (confirm) {
          return {
            nextStep: { step: 'end' },
            message: 'Gracias por tu pedido. ¡Será entregado pronto!'
          };
        } else {
          return {
            nextStep: { step: 'start' },
            message: 'Pedido cancelado. ¿Quieres comenzar de nuevo? (sí/no)'
          };
        }
      }

      case 'end': {
        return {
          nextStep: currentStep,
          message: 'Gracias por usar nuestro servicio. ¡Hasta luego!'
        };
      }

      default:
        return {
          nextStep: { step: 'start' },
          message: 'Hola, ¿quieres hacer un pedido? (sí/no)'
        };
    }
  }
}
