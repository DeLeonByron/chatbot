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
  messages: { from: 'user' | 'bot'; text: string }[] = [];
  userInput = '';

  constructor(private chatService: ChatResponseService) {}

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.userInput.trim()) return;
    const userText = this.userInput.trim();
    this.messages.push({ from: 'user', text: userText });
    const botResponse = this.chatService.getResponse(userText);
    this.messages.push({ from: 'bot', text: botResponse });
    this.userInput = '';
  }

}
