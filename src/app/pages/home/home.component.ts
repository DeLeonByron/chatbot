import { Component } from '@angular/core';
import { ChatComponent } from '../../components/chatbot/chatbot.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

}
