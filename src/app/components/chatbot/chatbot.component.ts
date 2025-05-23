import { Component } from '@angular/core';
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
export class ChatbotComponent {

  isOpen = false;
  userInput = '';
  isTyping = false;

  messages: { text: string; from: 'user' | 'bot' }[] = [];

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
      const response = this.chatService.getResponse(input);
      this.isTyping = false;
      this.messages.push({ text: response, from: 'bot' });
      setTimeout(() => this.scrollToBottom(), 50);
    }, 800); // simulamos 1 segundo de "escribiendo..."
  }

  scrollToBottom() {
    const chatBody = document.querySelector('.chat-body');
    if (chatBody) chatBody.scrollTop = chatBody.scrollHeight;
  }

}
