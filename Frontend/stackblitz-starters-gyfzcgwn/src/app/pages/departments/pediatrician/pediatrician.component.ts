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
  selector: 'app-pediatrician',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pediatrician.component.html',
  styleUrls: ['./pediatrician.component.css']
})
export class PediatricianComponent implements OnInit, AfterViewInit {
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
        name: 'Dr. Neha Sharma',
        degree: 'MBBS, MD Pediatrics',
        hospital: 'Apollo Hospital, Delhi',
        experience: 12,
        specialization: 'Child Specialist',
        image: 'https://randomuser.me/api/portraits/women/12.jpg',
      },

      {
        id: 2,
        name: 'Dr. Rahul Patel',
        degree: 'MBBS, DCH',
        hospital: 'Sterling Hospital, Ahmedabad',
        experience: 10,
        specialization: 'Newborn Specialist',
        image: 'https://randomuser.me/api/portraits/men/22.jpg',
      },

      {
        id: 3,
        name: 'Dr. Priya Verma',
        degree: 'MBBS, MD Pediatrics',
        hospital: 'Fortis Hospital, Mumbai',
        experience: 14,
        specialization: 'Child Care Specialist',
        image: 'https://randomuser.me/api/portraits/women/32.jpg',
      },

      {
        id: 4,
        name: 'Dr. Amit Singh',
        degree: 'MBBS, DNB Pediatrics',
        hospital: 'Max Hospital, Delhi',
        experience: 9,
        specialization: 'Child Nutrition Specialist',
        image: 'https://randomuser.me/api/portraits/men/42.jpg',
      },

      {
        id: 5,
        name: 'Dr. Sneha Desai',
        degree: 'MBBS, MD Pediatrics',
        hospital: 'Zydus Hospital, Ahmedabad',
        experience: 11,
        specialization: 'Infant Specialist',
        image: 'https://randomuser.me/api/portraits/women/52.jpg',
      },

      {
        id: 6,
        name: 'Dr. Karan Mehta',
        degree: 'MBBS, DCH',
        hospital: 'Nanavati Hospital, Mumbai',
        experience: 8,
        specialization: 'Child Disease Specialist',
        image: 'https://randomuser.me/api/portraits/men/62.jpg',
      },

      {
        id: 7,
        name: 'Dr. Riya Kapoor',
        degree: 'MBBS, MD Pediatrics',
        hospital: 'Apollo Hospital, Chennai',
        experience: 13,
        specialization: 'Child Health Specialist',
        image: 'https://randomuser.me/api/portraits/women/72.jpg',
      },

      {
        id: 8,
        name: 'Dr. Vikram Joshi',
        degree: 'MBBS, DNB Pediatrics',
        hospital: 'AIIMS, Delhi',
        experience: 15,
        specialization: 'Senior Pediatrician',
        image: 'https://randomuser.me/api/portraits/men/82.jpg',
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

    this.observer = new IntersectionObserver(entries => {

      entries.forEach(entry => {

        if (entry.isIntersecting) {

          if (!this.alreadyAnimated.has(entry.target)) {
            entry.target.classList.add('show');
            this.alreadyAnimated.add(entry.target);
          }

          this.observer.unobserve(entry.target);
        }

      });

    }, {
      threshold: 0.1,
      rootMargin: '50px'
    });

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
