import { Component, ViewChild, ElementRef } from '@angular/core';
import { ChatOrderStep, Order } from '../../data/order.model';
import { ChatResponseService } from '../../services/chat-response.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule ],
  templateUrl: './chatbot.component.html',
  styleUrl: './chatbot.component.scss'
})
export class ChatComponent {
  isOpen = false;
  userInput = '';
  messages: { from: 'user' | 'bot', text: string }[] = [];
  isTyping = false;

  order: Partial<Order> = { combos: [] };
  currentStep: ChatOrderStep = { step: 'menu' };

  @ViewChild('chatBody') chatBody!: ElementRef<HTMLDivElement>;

  constructor(private chatService: ChatResponseService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;

    if (this.isOpen && this.messages.length === 0) {
      this.addBotMessage('¡Hola! Bienvenido a Pollo Pitero. ¿Qué combo deseas pedir?');
    }
  }

  async sendMessage() {
    const input = this.userInput.trim();
    if (!input) return;

    this.addUserMessage(input);
    this.userInput = '';

    this.showTyping();

    setTimeout(() => {
      const { nextStep, message } = this.chatService.getHybridFlowStepWithInput(
        this.order,
        this.currentStep,
        input
      );

      // Actualizar orden y paso
      this.order = nextStep.data || this.order;
      this.currentStep = nextStep;

      this.addBotMessage(message);
    }, 800); // Simula una pequeña espera del bot
  }

  private addUserMessage(text: string) {
    this.messages.push({ from: 'user', text });
    this.scrollToBottom();
  }

  private addBotMessage(text: string) {
    this.isTyping = false;
    this.messages.push({ from: 'bot', text });
    this.scrollToBottom();
  }

  private showTyping() {
    this.isTyping = true;
    this.scrollToBottom();
  }

  private scrollToBottom() {
    setTimeout(() => {
      if (this.chatBody) {
        const element = this.chatBody.nativeElement;
        element.scrollTop = element.scrollHeight;
      }
    }, 100);
  }
}
