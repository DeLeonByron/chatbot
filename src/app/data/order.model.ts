export interface ChatOrderStep {
  step: 'menu' | 'quantity' | 'address' | 'payment' | 'confirmation';
  data?: any;
}

export interface Order {
  combo: string;
  quantity: number;
  address: string;
  paymentMethod: 'tarjeta' | 'efectivo' | 'qr';
}
