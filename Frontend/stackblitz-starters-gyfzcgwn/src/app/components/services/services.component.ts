import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

interface Service {
  icon: string;
  title: string;
  description: string;
  route: string;
}

@Component({
  selector: 'app-services',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './services.component.html',
  styleUrls: ['./services.component.css'],
})
export class ServicesComponent {
  services: Service[] = [
    {
      icon: '👤',
      title: 'Personal Health Profile',
      description: 'Manage your complete health records in one place',
      route: '/health-profile',
    },
    {
      icon: '📍',
      title: 'Nearby Hospitals',
      description: 'Find hospitals and clinics near your location',
      route: '/nearby-hospitals',
    },
    {
      icon: '👨‍⚕️',
      title: 'Find Doctors',
      description: 'Search and book appointments with specialists',
      route: '/find-doctors',
    },
    {
      icon: '🧠',
      title: 'Symptom Checker',
      description: 'AI-powered symptom analysis and guidance',
      route: '/symptom-checker',
    },
    {
      icon: '🚑',
      title: 'Emergency Services',
      description: 'Quick access to emergency medical help',
      route: '/emergencies',
    },
    {
      icon: '🌍',
      title: 'Multi-language Support',
      description: 'Available in English, Hindi, and Gujarati',
      route: '/multi-language',
    },
  ];
}
