import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NavbarComponent } from '../navbar/navbar.component';
import { HeroComponent } from '../hero/hero.component';
import { ServicesComponent } from '../services/services.component';
import { DepartmentsComponent } from '../departments/departments.component';
import { HospitalsComponent } from '../hospitals/hospitals.component';
import { HealthTipsComponent } from '../health-tips/health-tips.component';
import { HealthAssistantComponent } from '../health-assistant/health-assistant.component';
import { FooterComponent } from '../footer/footer.component';
import { RouterModule } from '@angular/router';
import { ChatbotComponent } from '../../pages/chatbot1/chatbot1.component';
import { ChangeDetectorRef } from '@angular/core';



@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    CommonModule,
    NavbarComponent,
    HeroComponent,
    ServicesComponent,
    DepartmentsComponent,
    HospitalsComponent,
    HealthTipsComponent,
    HealthAssistantComponent,
    FooterComponent,
    RouterModule,
    ChatbotComponent
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent {
  isChatbotOpen = false;

  constructor(private cdr: ChangeDetectorRef) { }

  // ✅ OPEN CHATBOT
  openChatbot() {
    this.isChatbotOpen = true;

    // force UI refresh
    this.cdr.detectChanges();

    // add open animation class after render
    setTimeout(() => {
      const modal = document.querySelector('.chatbot-modal');
      modal?.classList.add('open');
    }, 10);
  }

  // ✅ CLOSE CHATBOT (SMOOTH ANIMATION)
  closeChatbot() {
    const modal = document.querySelector('.chatbot-modal');

    if (modal) {
      modal.classList.remove('open');

      setTimeout(() => {
        this.isChatbotOpen = false;

        // ✅ Force Angular + DOM repaint
        this.cdr.detectChanges();

        // ✅ Force browser reflow (VERY IMPORTANT FIX)
        document.body.offsetHeight;

      }, 300);
    }
  }

}

