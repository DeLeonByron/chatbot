export interface ChatOrderStep {
  step: 'menu' | 'quantity' | 'address' | 'payment' | 'confirmation' | 'addMore' | 'done';
  data?: any;
}

export interface Combo {
  id: string;        // Opcional, puede ser el identificador único del combo
  name: string;      // Nombre del combo (ej: "Combo Familiar")
  quantity: number;  // Cantidad específica para ese combo
}


export interface Order {
  combos?: Combo[];
  address?: string;
  paymentMethod?: 'tarjeta' | 'efectivo' | 'qr';
}


export interface Message {
  text: string;
  from: 'user' | 'bot';
}

