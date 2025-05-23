import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChatResponseService {

  constructor() { }

  private normalize(text: string): string {
    return text
      .toLowerCase()
      .normalize('NFD')                    // Separar letras de acentos
      .replace(/[\u0300-\u036f]/g, '')     // Eliminar los acentos
      .replace(/[¿?¡!.,]/g, '')            // Eliminar signos de puntuación
      .trim();
  }

  private responses: { keywords: string[], answer: string }[] = [
    {
      keywords: ['hola', 'buenos dias', 'buenas'],
      answer: '¡Hola! Bienvenido a Pollo Pitero, el mejor sabor en pollo frito de Guate. ¿En qué puedo ayudarte?'
    },
    {
      keywords: ['horario', 'hora', 'abren', 'cierran'],
      answer: 'Abrimos de martes a domingo de 11:00 a.m. a 10:00 p.m.'
    },
    {
      keywords: ['ubicados', 'direccion', 'donde', 'ubicacion'],
      answer: 'Estamos ubicados en Av. Las Américas 6-69 Z.14 C.C. Parque Las Américas, Cdad. de Guatemala, Guatemala.'
    },
    {
      keywords: ['menu', 'platos', 'comida'],
      answer: `Claro, tenemos las siguientes opciones:\n1. Pollo al ajillo a la leña\n2. Pollo adobado a la leña\n3. El tradicional pollo rostizado a la leña.`
    },
    {
      keywords: ['precios', 'cuanto', 'cuestan', 'vale', 'costo', 'precio'],
      answer: `1. Combo Personal Q40\n2. Combo Familiar Q115\n3. Combo Pitero Feliz Q30`
    },
    {
      keywords: ['vegetarianas', 'vegetariano', 'vegano'],
      answer: 'Lo siento. Por el momento no tenemos opciones vegetarianas.'
    },
    {
      keywords: ['domicilio', 'delivery', 'envio', 'pedir', 'entrega'],
      answer: '¡Sí! Puedes hacer tu pedido por Uber Eats y PedidosYa.'
    },
    {
      keywords: ['reserva', 'reservar', 'mesa'],
      answer: 'Lo siento. No ofrecemos el servicio de reservas. ¡Pero te esperamos en nuestro restaurante!'
    },
    {
      keywords: ['tarjetas', 'pago', 'efectivo', 'visa', 'mastercard', 'formas de pago'],
      answer: 'Aceptamos todas las tarjetas de crédito y débito, Visa y MasterCard, además de pagos en efectivo y QR.'
    },
    {
      keywords: ['promocion', 'descuento', 'promo', 'oferta'],
      answer: 'Todos los viernes tenemos 2x1 en combos medianos. Consulta más promos en nuestras redes sociales.'
    },
    {
      keywords: ['estacionamiento', 'parqueo'],
      answer: 'Sí, contamos con estacionamiento gratuito para nuestros clientes.'
    },
    {
      keywords: ['ninos', 'infantil', 'menu infantil', 'pitero feliz'],
      answer: '¡Por supuesto! Tenemos el combo “Pitero Feliz” para los más pequeños, con juguetes incluidos.'
    },
    {
      keywords: ['gracias', 'muy amable'],
      answer: '¡Con gusto! Siempre es un placer ayudarte. ¿Algo más?'
    },
    {
      keywords: ['adios', 'hasta luego', 'nos vemos'],
      answer: '¡Gracias por visitar Pollo Pitero! Esperamos verte pronto. ¡Buen provecho!'
    }
  ];

  getResponse(question: string): string {
    const cleaned = this.normalize(question);

    for (const entry of this.responses) {
      for (const keyword of entry.keywords) {
        if (cleaned.includes(keyword)) {
          return entry.answer;
        }
      }
    }

    return 'Lo siento, no entendí tu pregunta. ¿Puedes intentarlo de otra forma?';
  }
}
