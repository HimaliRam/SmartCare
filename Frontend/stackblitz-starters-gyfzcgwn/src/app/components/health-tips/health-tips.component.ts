import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface HealthTip {
  id: number;
  icon: string;
  title: string;
  description: string;
  color: string;
}

@Component({
  selector: 'app-health-tips',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './health-tips.component.html',
  styleUrls: ['./health-tips.component.css']
})
export class HealthTipsComponent {

  healthTips: HealthTip[] = [

    {
      id: 1,
      icon: '🥗',
      title: 'Healthy Diet Tips',
      description: 'Eat balanced meals with plenty of fruits and vegetables for better health',
      color: '#10b981'
    },

    {
      id: 2,
      icon: '🚶',
      title: 'Daily Exercise Reminder',
      description: 'Get at least 30 minutes of physical activity every day',
      color: '#3b82f6'
    },

    {
      id: 3,
      icon: '☀️',
      title: 'Seasonal Health Alert',
      description: 'Stay hydrated and protect yourself from extreme weather conditions',
      color: '#f59e0b'
    },

    {
      id: 4,
      icon: '💧',
      title: 'Stay Hydrated',
      description: 'Drink 8-10 glasses of water daily for optimal body function',
      color: '#06b6d4'
    }

  ];

}
