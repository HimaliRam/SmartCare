import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {

  userInput = '';

  messages = [
    {
      type: 'assistant',
      text: 'Hello 👋 I am your AI Health Assistant. How can I help you today?'
    }
  ];

  sendMessage() {

    if (!this.userInput.trim()) return;

    // add user message
    this.messages.push({
      type: 'user',
      text: this.userInput
    });

    const input = this.userInput.toLowerCase();

    this.userInput = '';

    // fake AI response
    setTimeout(() => {

      let reply = 'Please consult a doctor for proper diagnosis.';

      if (input.includes('headache')) {
        reply = 'You may have migraine. Please consult Neurologist.';
      }
      else if (input.includes('fever')) {
        reply = 'You may have infection. Please consult General Physician.';
      }
      else if (input.includes('chest pain')) {
        reply = 'Please consult Cardiologist immediately.';
      }

      this.messages.push({
        type: 'assistant',
        text: reply
      });

    }, 800);

  }

}
