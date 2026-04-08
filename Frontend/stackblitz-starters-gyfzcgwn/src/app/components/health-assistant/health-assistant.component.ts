import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // ✅ ADD THIS

@Component({
  selector: 'app-health-assistant',
  standalone: true,
  imports: [CommonModule, RouterModule], // ✅ ADD RouterModule HERE
  templateUrl: './health-assistant.component.html',
  styleUrls: ['./health-assistant.component.css'],
})
export class HealthAssistantComponent {}
