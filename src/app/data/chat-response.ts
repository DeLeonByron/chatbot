export interface ChatEntry {
  id: string;
  tags: string[];
  answer: string;
}


export const CHAT_DATA: ChatEntry[] = [
 {
    id: 'saludo',
    tags: ['hola', 'buenas', 'hey', 'holi'],
    answer: '¡Hola! Bienvenido a Pollo Pitero, el mejor sabor en pollo frito de Guate ¿En qué puedo ayudarte?'
  },
  {
    id: 'horario',
    tags: ['horario', 'a qué hora abren', 'cuándo están abiertos', 'horas de atención'],
    answer: 'Abrimos de martes a domingo de 11:00 a.m. a 10:00 p.m.'
  },
  {
    id: 'ubicacion',
    tags: ['ubicación', 'dónde están', 'dirección', 'cómo llegar'],
    answer: 'Estamos ubicados en Av. Las Americas 6-69 Z.14 C.C. Parque las Americas, Cdad. de Guatemala.'
  },
  {
    id: 'menu',
    tags: ['menú', 'menu', 'carta', 'opciones de comida', 'platillos'],
    answer: `Claro, tenemos las siguientes opciones:\n1. Pollo al ajillo a la leña\n2. Pollo adobado a la leña\n3. Pollo rostizado a la leña`
  },
  {
    id: 'menu_infantil',
    tags: ['menú infantil', 'comida para niños', 'menu para niños', 'pitero feliz'],
    answer: '¡Por supuesto! Tenemos el combo “Pitero Feliz” para los más pequeños, con juguetes incluidos.'
  },
  {
    id: 'menu_vegetariano',
    tags: ['menú vegetariano', 'comida sin carne', 'opciones vegetarianas', 'vegetariano'],
    answer: 'Lo siento. Por el momento no tenemos opciones vegetarianas.'
  },
  {
    id: 'despedida',
    tags: ['adiós', 'gracias', 'hasta luego'],
    answer: '¡Gracias por visitar Pollo Pitero! Esperamos verte pronto. ¡Buen provecho!'
  },
  {
    id: 'pago',
    tags: ['tarjetas', 'formas de pago', 'aceptan visa', 'pago con qr'],
    answer: 'Aceptamos tarjetas Visa, MasterCard, pagos en efectivo y QR.'
  },
  {
    id: 'domicilio',
    tags: ['domicilio', 'envío', 'pedidos', 'delivery'],
    answer: '¡Sí! Puedes hacer tu pedido por Uber Eats y PedidosYa.'
  },
  {
    id: 'default',
    tags: [],
    answer: 'Lo siento, no entendí tu pregunta. ¿Puedes intentarlo de otra forma?'
  }
]