import {
  Component,
  OnInit,
  AfterViewInit,
  ElementRef,
  QueryList,
  ViewChildren
} from '@angular/core';

import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Doctor } from '../../../components/models/doctor.model';

@Component({
  selector: 'app-cardiologist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './cardiologist.component.html',
  styleUrls: ['./cardiologist.component.css']
})
export class CardiologistComponent implements OnInit, AfterViewInit {

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
        name: 'Dr. Rajesh Sharma',
        degree: 'MBBS, DM Cardiology',
        hospital: 'Apollo Hospital, Delhi',
        experience: 15,
        specialization: 'Interventional Cardiologist',
        image: 'https://randomuser.me/api/portraits/men/11.jpg'
      },

      {
        id: 2,
        name: 'Dr. Priya Mehta',
        degree: 'MBBS, MD Cardiology',
        hospital: 'Fortis Hospital, Mumbai',
        experience: 12,
        specialization: 'Heart Surgeon',
        image: 'https://randomuser.me/api/portraits/women/21.jpg'
      },

      {
        id: 3,
        name: 'Dr. Amit Patel',
        degree: 'MBBS, DM Cardiology',
        hospital: 'Sterling Hospital, Ahmedabad',
        experience: 10,
        specialization: 'Heart Failure Specialist',
        image: 'https://randomuser.me/api/portraits/men/31.jpg'
      },

      {
        id: 4,
        name: 'Dr. Neha Kapoor',
        degree: 'MBBS, MD Cardiology',
        hospital: 'Max Hospital, Delhi',
        experience: 9,
        specialization: 'Cardiac Electrophysiologist',
        image: 'https://randomuser.me/api/portraits/women/41.jpg'
      },

      {
        id: 5,
        name: 'Dr. Vikram Singh',
        degree: 'MBBS, DM Cardiology',
        hospital: 'AIIMS, Delhi',
        experience: 18,
        specialization: 'Senior Cardiologist',
        image: 'https://randomuser.me/api/portraits/men/51.jpg'
      },

      {
        id: 6,
        name: 'Dr. Anjali Desai',
        degree: 'MBBS, MD Cardiology',
        hospital: 'Nanavati Hospital, Mumbai',
        experience: 11,
        specialization: 'Heart Rhythm Specialist',
        image: 'https://randomuser.me/api/portraits/women/61.jpg'
      },

      {
        id: 7,
        name: 'Dr. Karan Patel',
        degree: 'MBBS, DM Cardiology',
        hospital: 'Zydus Hospital, Ahmedabad',
        experience: 8,
        specialization: 'Preventive Cardiologist',
        image: 'https://randomuser.me/api/portraits/men/71.jpg'
      },

      {
        id: 8,
        name: 'Dr. Sneha Verma',
        degree: 'MBBS, MD Cardiology',
        hospital: 'Apollo Hospital, Chennai',
        experience: 13,
        specialization: 'Heart Specialist',
        image: 'https://randomuser.me/api/portraits/women/81.jpg'
      }

    ];

    this.filteredDoctors = [...this.doctors];
  }

  onSearch(): void {

    const value = this.searchText.toLowerCase();

    this.filteredDoctors = this.doctors.filter(d =>
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
        threshold: 0.15
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
