import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren,
} from '@angular/core';

import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Doctor } from '../../../components/models/doctor.model';

@Component({
  selector: 'app-pulmonologist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pulmonologist.component.html',
  styleUrls: ['./pulmonologist.component.css'],
})
export class PulmonologistComponent implements OnInit, AfterViewInit {
  doctors: Doctor[] = [];
  filteredDoctors: Doctor[] = [];
  searchText = '';

  observer!: IntersectionObserver;
  alreadyAnimated = new Set<Element>();

  @ViewChildren('doctorCard', { read: ElementRef })
  cards!: QueryList<ElementRef>;

  constructor(private viewportScroller: ViewportScroller) {}

  ngOnInit(): void {
    this.viewportScroller.scrollToPosition([0, 0]);

    this.doctors = [
      {
        id: 1,
        name: 'Dr. Ankit Sharma',
        degree: 'MBBS, MD Pulmonology',
        hospital: 'Apollo Hospital, Delhi',
        experience: 14,
        specialization: 'Asthma Specialist',
        image: 'https://randomuser.me/api/portraits/men/13.jpg',
      },

      {
        id: 2,
        name: 'Dr. Meera Patel',
        degree: 'MBBS, DNB Pulmonology',
        hospital: 'Fortis Hospital, Mumbai',
        experience: 11,
        specialization: 'Lung Infection Specialist',
        image: 'https://randomuser.me/api/portraits/women/23.jpg',
      },

      {
        id: 3,
        name: 'Dr. Rahul Desai',
        degree: 'MBBS, MD Respiratory Medicine',
        hospital: 'Sterling Hospital, Ahmedabad',
        experience: 9,
        specialization: 'COPD Specialist',
        image: 'https://randomuser.me/api/portraits/men/33.jpg',
      },

      {
        id: 4,
        name: 'Dr. Sneha Kapoor',
        degree: 'MBBS, MD Pulmonology',
        hospital: 'Max Hospital, Delhi',
        experience: 12,
        specialization: 'Critical Care Specialist',
        image: 'https://randomuser.me/api/portraits/women/43.jpg',
      },

      {
        id: 5,
        name: 'Dr. Vikram Singh',
        degree: 'MBBS, DNB Pulmonology',
        hospital: 'AIIMS, Delhi',
        experience: 16,
        specialization: 'Senior Lung Specialist',
        image: 'https://randomuser.me/api/portraits/men/53.jpg',
      },

      {
        id: 6,
        name: 'Dr. Riya Mehta',
        degree: 'MBBS, MD Respiratory Medicine',
        hospital: 'Nanavati Hospital, Mumbai',
        experience: 8,
        specialization: 'Sleep Disorder Specialist',
        image: 'https://randomuser.me/api/portraits/women/63.jpg',
      },
    ];

    this.filteredDoctors = [...this.doctors];
  }

  onSearch(): void {
    const value = this.searchText.toLowerCase();

    this.filteredDoctors = this.doctors.filter(
      (d) =>
        d.name.toLowerCase().includes(value) ||
        d.degree.toLowerCase().includes(value) ||
        d.hospital.toLowerCase().includes(value) ||
        d.specialization.toLowerCase().includes(value)
    );

    setTimeout(() => this.observeCards(), 50);
  }

  ngAfterViewInit(): void {
    this.createObserver();
    this.cards.changes.subscribe(() => this.observeCards());
    this.observeCards();
  }

  createObserver(): void {
    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            if (!this.alreadyAnimated.has(entry.target)) {
              entry.target.classList.add('show');
              this.alreadyAnimated.add(entry.target);
            }

            this.observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
      }
    );
  }

  observeCards(): void {
    this.cards.forEach((card, index) => {
      const element = card.nativeElement;

      element.classList.remove('left', 'right');

      if (index % 2 === 0) {
        element.classList.add('left');
      } else {
        element.classList.add('right');
      }

      if (!this.alreadyAnimated.has(element)) {
        this.observer.observe(element);
      }
    });
  }
}
