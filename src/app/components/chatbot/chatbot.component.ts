import { Component } from '@angular/core';
import { ChatResponseService } from '../../services/chat-response.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatOrderStep, Order } from '../../data/order.model';


@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatbotComponent {

  isOpen = false;
  userInput = '';
  isTyping = false;

  messages: { text: string; from: 'user' | 'bot' }[] = [];

  orderState: Partial<Order> = {};
  currentStep: ChatOrderStep | null = null;
  inOrderFlow = false;

  constructor(private chatService: ChatResponseService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;

    // Solo mostrar mensaje de saludo si se abre el chat y aún no fue mostrado en esta sesión
    if (this.isOpen && !sessionStorage.getItem('chatSaludoMostrado')) {
      this.isTyping = true;

      setTimeout(() => {
        this.messages.push({
          text: '¡Hola! Bienvenido a Pollo Pitero, el mejor sabor en pollo frito de Guate. ¿En qué puedo ayudarte?',
          from: 'bot'
        });
        this.isTyping = false;
        sessionStorage.setItem('chatSaludoMostrado', 'true'); // Marcar como mostrado
        this.scrollToBottom();
      }, 800); // Simulamos que el bot está escribiendo
    }
  }

  sendMessage() {
    const input = this.userInput.trim();
    if (!input) return;

    this.messages.push({ text: input, from: 'user' });
    this.userInput = '';
    this.isTyping = true;

    setTimeout(() => {
      // 🚀 Flujo híbrido activo
      if (this.inOrderFlow) {
        this.handleOrderFlow(input.toLowerCase());
      } else {
        const response = this.chatService.getResponse(input);

        // ⏳ Activar flujo híbrido si detectamos una intención de compra
        if (input.toLowerCase().includes('quiero pedir') || input.toLowerCase().includes('ordenar')) {
          this.inOrderFlow = true;
          this.currentStep = { step: 'menu' };
          this.botRespond('¿Qué combo deseas pedir? (Combo Personal, Combo Familiar, Combo Pitero Feliz)');
        } else {
          this.botRespond(response);
        }
      }
    }, 800);
  }

  botRespond(message: string) {
    this.isTyping = false;
    this.messages.push({ text: message, from: 'bot' });
    setTimeout(() => this.scrollToBottom(), 50);
  }

  handleOrderFlow(input: string) {
    switch (this.currentStep?.step) {
      case 'menu':
        this.orderState.combo = input;
        break;
      case 'quantity':
        this.orderState.quantity = parseInt(input, 10);
        break;
      case 'address':
        this.orderState.address = input;
        break;
      case 'payment':
        this.orderState.paymentMethod = input as Order['paymentMethod'];
        break;
      case 'confirmation':
        if (input.includes('sí') || input.includes('confirmar')) {
          this.completeOrder();
          return;
        } else if (input.includes('no')) {
          this.inOrderFlow = false;
          this.orderState = {};
          this.currentStep = null;
          this.botRespond('Orden cancelada. ¿Deseas hacer otra consulta?');
          return;
        }
        break;
    }

    // siguiente paso
    const next = this.chatService.getHybridFlowStep(this.orderState, this.currentStep!);
    this.currentStep = next.nextStep;
    this.botRespond(next.message);
  }

  completeOrder() {
    this.botRespond('¡Gracias! Tu pedido ha sido recibido y está en camino 🍗. ¿Te puedo ayudar con algo más?');
    this.inOrderFlow = false;
    this.orderState = {};
    this.currentStep = null;
  }

  scrollToBottom() {
    const chatBody = document.querySelector('.chat-body');
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  }

}
