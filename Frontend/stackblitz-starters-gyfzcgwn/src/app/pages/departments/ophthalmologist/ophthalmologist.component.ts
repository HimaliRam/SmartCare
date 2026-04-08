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
  selector: 'app-ophthalmologist',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './ophthalmologist.component.html',
  styleUrls: ['./ophthalmologist.component.css']
})
export class OphthalmologistComponent implements OnInit, AfterViewInit {

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
        name: 'Dr. Meera Sharma',
        degree: 'MBBS, MS Ophthalmology',
        hospital: 'Apollo Hospital, Delhi',
        experience: 14,
        specialization: 'Cataract Specialist',
        image: 'https://randomuser.me/api/portraits/women/15.jpg'
      },

      {
        id: 2,
        name: 'Dr. Rahul Mehta',
        degree: 'MBBS, DO',
        hospital: 'Fortis Hospital, Mumbai',
        experience: 10,
        specialization: 'Retina Specialist',
        image: 'https://randomuser.me/api/portraits/men/25.jpg'
      },

      {
        id: 3,
        name: 'Dr. Priya Kapoor',
        degree: 'MBBS, MS Ophthalmology',
        hospital: 'Max Hospital, Delhi',
        experience: 12,
        specialization: 'Glaucoma Specialist',
        image: 'https://randomuser.me/api/portraits/women/35.jpg'
      },

      {
        id: 4,
        name: 'Dr. Amit Desai',
        degree: 'MBBS, DNB Ophthalmology',
        hospital: 'Sterling Hospital, Ahmedabad',
        experience: 9,
        specialization: 'LASIK Surgeon',
        image: 'https://randomuser.me/api/portraits/men/45.jpg'
      },

      {
        id: 5,
        name: 'Dr. Sneha Verma',
        degree: 'MBBS, MS Ophthalmology',
        hospital: 'AIIMS, Delhi',
        experience: 16,
        specialization: 'Senior Eye Specialist',
        image: 'https://randomuser.me/api/portraits/women/55.jpg'
      },

      {
        id: 6,
        name: 'Dr. Karan Joshi',
        degree: 'MBBS, DO',
        hospital: 'Nanavati Hospital, Mumbai',
        experience: 8,
        specialization: 'Pediatric Eye Specialist',
        image: 'https://randomuser.me/api/portraits/men/65.jpg'
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
