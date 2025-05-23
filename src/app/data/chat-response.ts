export interface ChatEntry {
  id: string;
  tags: string[];
  answer: string;
  keywords?: string;
}

export const CHAT_DATA: ChatEntry[] = [
  {
    id: 'saludo',
    tags: ['hola', 'buenos dias', 'buenas'],
    answer: '¡Hola! Bienvenido a Pollo Pitero, el mejor sabor en pollo frito de Guate. ¿En qué puedo ayudarte?',
    keywords: 'Saludo inicial del usuario'
  },
  {
    id: 'horario',
    tags: ['horario', 'hora', 'abren', 'cierran'],
    answer: 'Abrimos de martes a domingo de 11:00 a.m. a 10:00 p.m.',
    keywords: '¿Cuál es el horario de atención?'
  },
  {
    id: 'ubicacion',
    tags: ['ubicados', 'direccion', 'donde', 'ubicacion'],
    answer: 'Estamos ubicados en Av. Las Américas 6-69 Z.14 C.C. Parque Las Américas, Cdad. de Guatemala, Guatemala.',
    keywords: '¿Dónde están ubicados?'
  },
  {
    id: 'menu',
    tags: ['menu', 'platos', 'comida'],
    answer: `Claro, tenemos las siguientes opciones:\n1. Pollo al ajillo a la leña\n2. Pollo adobado a la leña\n3. El tradicional pollo rostizado a la leña.`,
    keywords: '¿Qué opciones hay en el menú?'
  },
  {
    id: 'precios',
    tags: ['precios', 'cuanto', 'cuestan', 'vale', 'costo', 'precio'],
    answer: `1. Combo Personal Q40\n2. Combo Familiar Q115\n3. Combo Pitero Feliz Q30`,
    keywords: '¿Cuáles son los precios?'
  },
  {
    id: 'vegetariano',
    tags: ['vegetarianas', 'vegetariano', 'vegano'],
    answer: 'Lo siento. Por el momento no tenemos opciones vegetarianas.',
    keywords: '¿Tienen opciones vegetarianas o veganas?'
  },
  {
    id: 'domicilio',
    tags: ['domicilio', 'delivery', 'envio', 'pedir', 'entrega'],
    answer: '¡Sí! Puedes hacer tu pedido por Uber Eats y PedidosYa.',
    keywords: '¿Tienen servicio a domicilio o entrega?'
  },
  {
    id: 'reserva',
    tags: ['reserva', 'reservar', 'mesa'],
    answer: 'Lo siento. No ofrecemos el servicio de reservas. ¡Pero te esperamos en nuestro restaurante!',
    keywords: '¿Puedo reservar una mesa?'
  },
  {
    id: 'pago',
    tags: ['tarjetas', 'pago', 'efectivo', 'visa', 'mastercard', 'formas de pago'],
    answer: 'Aceptamos todas las tarjetas de crédito y débito, Visa y MasterCard, además de pagos en efectivo y QR.',
    keywords: '¿Qué formas de pago aceptan?'
  },
  {
    id: 'promociones',
    tags: ['promocion', 'descuento', 'promo', 'oferta'],
    answer: 'Todos los viernes tenemos 2x1 en combos medianos. Consulta más promos en nuestras redes sociales.',
    keywords: '¿Tienen promociones o descuentos?'
  },
  {
    id: 'parqueo',
    tags: ['estacionamiento', 'parqueo'],
    answer: 'Sí, contamos con estacionamiento gratuito para nuestros clientes.',
    keywords: '¿Cuentan con estacionamiento?'
  },
  {
    id: 'infantil',
    tags: ['ninos', 'infantil', 'menu infantil', 'pitero feliz'],
    answer: '¡Por supuesto! Tenemos el combo “Pitero Feliz” para los más pequeños, con juguetes incluidos.',
    keywords: '¿Tienen menú infantil o combo para niños?'
  },
  {
    id: 'agradecimiento',
    tags: ['gracias', 'muy amable'],
    answer: '¡Con gusto! Siempre es un placer ayudarte. ¿Algo más?',
    keywords: 'Respuesta a un agradecimiento'
  },
  {
    id: 'despedida',
    tags: ['adios', 'hasta luego', 'nos vemos'],
    answer: '¡Gracias por visitar Pollo Pitero! Esperamos verte pronto. ¡Buen provecho!',
    keywords: 'Despedida del usuario'
  },
  {
    id: 'default',
    tags: [],
    answer: 'Lo siento, no entendí tu pregunta. ¿Puedes intentarlo de otra forma?',
    keywords: 'Respuesta por defecto a preguntas no reconocidas'
  }
];
