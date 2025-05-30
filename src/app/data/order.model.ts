export interface ChatOrderStep {
  step: 'menu' | 'quantity' | 'address' | 'payment' | 'confirmation' | 'addMore' | 'done' | 'start' | 'end' | 'askCombo';
  data?: any;
}

export interface Combo {
  id: string;
  name: string;
  quantity: number;
  isCombo?: boolean;  // <-- agregar esta propiedad opcional
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

