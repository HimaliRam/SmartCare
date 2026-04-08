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
  selector: 'app-general-physician',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './general-physician.component.html',
  styleUrls: ['./general-physician.component.css']
})
export class GeneralPhysicianComponent implements OnInit, AfterViewInit {

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
        degree: 'MBBS, MD General Medicine',
        hospital: 'Apollo Hospital, Delhi',
        experience: 15,
        specialization: 'Primary Care Specialist',
        image: 'https://randomuser.me/api/portraits/men/11.jpg'
      },

      {
        id: 2,
        name: 'Dr. Meena Verma',
        degree: 'MBBS, MD Internal Medicine',
        hospital: 'Fortis Hospital, Mumbai',
        experience: 12,
        specialization: 'Chronic Disease Specialist',
        image: 'https://randomuser.me/api/portraits/women/21.jpg'
      },

      {
        id: 3,
        name: 'Dr. Amit Patel',
        degree: 'MBBS, DNB Medicine',
        hospital: 'Max Hospital, Delhi',
        experience: 10,
        specialization: 'Diabetes Specialist',
        image: 'https://randomuser.me/api/portraits/men/31.jpg'
      },

      {
        id: 4,
        name: 'Dr. Sneha Kapoor',
        degree: 'MBBS, MD',
        hospital: 'AIIMS, Delhi',
        experience: 18,
        specialization: 'Senior Consultant',
        image: 'https://randomuser.me/api/portraits/women/41.jpg'
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
