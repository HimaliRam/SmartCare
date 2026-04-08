import { Component, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatService } from '../../services/chat.service';
import { Input, HostBinding } from '@angular/core';

@Component({
    selector: 'app-chatbot',
    standalone: true,
    imports: [CommonModule, FormsModule],
    templateUrl: './chatbot1.component.html',
    styleUrls: ['./chatbot1.component.css'],
})

export class ChatbotComponent {
    @Input() isModal: boolean = false;

    @HostBinding('class.modal-mode') get modalClass() {
        return this.isModal;
    }

    @ViewChild('chatBody') chatBody!: ElementRef;
    @ViewChild('userInputTextarea') userInputTextarea!: ElementRef<HTMLTextAreaElement>;


    userInput = '';
    loading = false;

    messages: any[] = [
        {
            type: 'assistant',
            text: '👋 Hello! I am your SmartCare AI Health Assistant. How can I help you today?'
        }
    ];

    constructor(
        private chatService: ChatService,
        private cdr: ChangeDetectorRef
    ) { }

    // Handle any keydown in textarea


    sendMessage() {
        const message = this.userInput.trim();
        if (!message) return;

        // Push user message
        this.messages.push({ type: 'user', text: message });

        // Reset textarea height
        if (this.userInputTextarea?.nativeElement) {
            this.userInputTextarea.nativeElement.style.height = '42px';
        }

        this.userInput = '';
        this.loading = true;
        this.scrollDown();

        // ✅ FIX HERE (convert string → array)
        const apiMessages = [
            { role: 'user', content: message }
        ];

        this.chatService.sendMessage(apiMessages).subscribe({
            next: (res: any) => {
                const reply =
                    res?.choices?.[0]?.message?.content ||
                    "⚠️ Sorry, I couldn't understand.";

                setTimeout(() => {
                    this.loading = false;
                    this.messages.push({ type: 'assistant', text: reply });
                    this.cdr.detectChanges();
                    this.scrollDown();
                }, 1000);
            },
            error: () => {
                setTimeout(() => {
                    this.loading = false;
                    this.messages.push({
                        type: 'assistant',
                        text: "⚠️ AI server error. Please try again."
                    });
                    this.cdr.detectChanges();
                    this.scrollDown();
                }, 1000);
            }
        });
    }

    autoGrowTextArea(event: Event) {
        const textarea = event.target as HTMLTextAreaElement;
        textarea.style.height = 'auto';
        textarea.style.height = Math.max(textarea.scrollHeight, 42) + 'px';
    }

    scrollDown() {
        setTimeout(() => {
            if (this.chatBody) {
                this.chatBody.nativeElement.scrollTop = this.chatBody.nativeElement.scrollHeight;
            }
        }, 50);
    }
    scrollToBottom() {
        setTimeout(() => {
            this.chatBody.nativeElement.scrollTop =
                this.chatBody.nativeElement.scrollHeight;
        }, 100);
    }
    handleKeyDown(event: KeyboardEvent) {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            this.sendMessage();
        }
    }
}











