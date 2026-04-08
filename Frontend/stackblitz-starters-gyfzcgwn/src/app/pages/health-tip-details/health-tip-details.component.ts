import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';

@Component({
  selector: 'app-health-tip-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './health-tip-details.component.html',
  styleUrls: ['./health-tip-details.component.css']
})
export class HealthTipDetailsComponent {

  tipId!: number;
  tip: any;

  constructor(
    private route: ActivatedRoute,
    private location: Location
  ) {
    this.tipId = Number(this.route.snapshot.paramMap.get('id'));
    this.loadTip();
  }

  goBack() {
    this.location.back();
  }

  loadTip() {

    const tips = [
      {
        id: 1,
        title: 'Healthy Diet Tips',
        icon: '🥗',
        content: 'Eat a balanced diet including fruits, vegetables,and healthy fats.',

        benefits: [
          'Improve immunity',
          'Maintain healthy weight',
          'Boost energy',
          'Improve heart health'
        ]
      },

      {
        id: 2,
        title: 'Daily Exercise Reminder',
        icon: '🚶',
        content: 'Exercise at least 30 minutes daily.',

        benefits: [
          'Improve heart health',
          'Increase strength',
          'Reduce stress',
          'Improve mental health'
        ]
      },

      {
        id: 3,
        title: 'Seasonal Health Alert',
        icon: '☀️',
        content: 'Protect yourself from seasonal diseases.',

        benefits: [
          'Stay hydrated',
          'Eat immunity foods',
          'Wear proper clothes',
          'Avoid sudden temperature change'
        ]
      },

      {
        id: 4,
        title: 'Stay Hydrated',
        icon: '💧',
        content: 'Drink 8–10 glasses of water daily.',

        benefits: [
          'Improve digestion',
          'Maintain body temperature',
          'Improve skin health',
          'Boost energy'
        ]
      }
    ];

    this.tip = tips.find(t => t.id === this.tipId);
  }
}
