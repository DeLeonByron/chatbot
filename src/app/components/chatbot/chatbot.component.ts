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
